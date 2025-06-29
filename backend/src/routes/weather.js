const express = require('express');
const jwt = require('jsonwebtoken');
const { query, body, validationResult } = require('express-validator');
const Weather = require('../models/Weather');

const router = express.Router();
const axios = require('axios');

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

  try {
    const response = await axios.get('http://api.weatherstack.com/current', {
      params: {
        access_key: process.env.WEATHER_API_KEY,
        query: city
      }
    });

    const data = response.data;

    if (data.error) {
      return res.status(404).json({ error: { info: data.error.info } });
    }

    // Log da busca no banco
    await Weather.logSearch({
      city: data.location.name,
      temperature: data.current.temperature,
      condition: data.current.weather_descriptions[0],
      created_at: new Date(),
      user_id: req.user.id
    });

    res.json(data);
  } catch (err) {
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

module.exports = router;
