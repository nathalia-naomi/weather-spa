const express = require('express');
const jwt = require('jsonwebtoken');
const { query, body, validationResult } = require('express-validator');
const Weather = require('../models/Weather');
const Favorite = require('../models/Favorite');
const cache = require('../config/cache');

const router = express.Router();
const axios = require('axios');
const logger = require('../config/logger');

function authMiddleware(req, res, next) {
	const auth = req.headers.authorization;
	if (!auth) return res.status(401).json({ error: 'Token ausente' });

	const token = auth.split(' ')[1];
	try {
		req.user = jwt.verify(token, process.env.JWT_SECRET);
		next();
	} catch (e) {
		res.status(401).json({ error: 'Token inválido' });
	}
}

router.get('/weather/search', authMiddleware, query('city').notEmpty(), async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

	const { city } = req.query;
	const cacheKey = `weather:${city.toLowerCase()}`;
	const cachedData = cache.get(cacheKey);
	if (cachedData) {
		return res.json(cachedData);
	}
	try {
		const response = await axios.get('http://api.weatherstack.com/current', {
			params: {
				access_key: process.env.WEATHER_API_KEY,
				query: city,
			},
		});

		const data = response.data;

		if (data.error) {
			logger.warn(`Busca falhou - cidade não encontrada: ${city} (user_id=${req.user.id})`);
			return res.status(404).json({ error: { info: data.error.info } });
		}

		// Log da busca no banco
		await Weather.logSearch({
			city: data.location.name,
			temperature: data.current.temperature,
			condition: data.current.weather_descriptions[0],
			created_at: new Date(),
			user_id: req.user.id,
		});

		cache.set(cacheKey, data);
		logger.info(`Busca realizada: ${city} por user_id=${req.user.id}`);
		res.json(data);
	} catch (err) {
		logger.error(`Erro na busca de clima: ${err.message}`);
		res.status(500).json({ error: 'Erro ao buscar dados da API' });
	}
});

router.get('/weather/history', authMiddleware, async (req, res) => {
	try {
		const logs = await Weather.getAllLogsByUser(req.user.id);
		res.json(logs);
	} catch (err) {
		res.status(500).json({ error: 'Erro ao carregar histórico' });
	}
});

router.post(
	'/weather/favorite',
	authMiddleware,
	body('city').notEmpty(),
	body('temperature').isNumeric(),
	body('condition').notEmpty(),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

		const { city, temperature, condition } = req.body;
		await Favorite.add(req.user.id, city, temperature, condition);
		logger.info(`Favorito salvo: ${city} por user_id=${req.user.id}`);
		res.status(201).json({ success: true });
	},
);

// Listar favoritos
router.get('/weather/favorite', authMiddleware, async (req, res) => {
	const favorites = await Favorite.getByUser(req.user.id);
	res.json(favorites);
});

// Remover favorito
router.delete('/weather/favorite/:city', authMiddleware, async (req, res) => {
	const city = decodeURIComponent(req.params.city);
	await Favorite.remove(req.user.id, city);
	res.json({ success: true });
});

router.put('/weather/favorite/:city', authMiddleware, async (req, res) => {
	const city = decodeURIComponent(req.params.city);
	try {
		const { temperature, condition } = req.body;
		await Favorite.update(req.user.id, city, temperature, condition);
		res.json({ success: true });
	} catch (err) {
		logger.error(`Erro ao atualizar favorito: ${err.message}`);
		res.status(500).json({ error: 'Erro ao atualizar favorito' });
	}
});

router.put('/weather/favorite/:city/refresh', authMiddleware, async (req, res) => {
	const city = decodeURIComponent(req.params.city);

	try {
		const response = await axios.get('http://api.weatherstack.com/current', {
			params: {
				access_key: process.env.WEATHER_API_KEY,
				query: city,
			},
		});

		const data = response.data;

		if (data.error) {
			return res.status(400).json({ error: data.error.info });
		}

		const temperature = data.current.temperature;
		const condition = data.current.weather_descriptions[0];

		await Favorite.update(req.user.id, city, temperature, condition);

		res.json({ city, temperature, condition, updated_at: new Date() });
	} catch (err) {
		console.error(`Erro ao atualizar favorito via API: ${err.message}`);
		res.status(500).json({ error: 'Erro ao atualizar favorito' });
	}
});

module.exports = router;
