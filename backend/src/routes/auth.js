const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const logger = require('../config/logger');

const router = express.Router();

router.post('/login', body('username').notEmpty(), body('password').notEmpty(), async (req, res) => {
	console.log('Login payload:', req.body);

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { username, password } = req.body;
	const user = await User.findByUsername(username);
	if (!user) {
		logger.warn(`Login falhou para usuário inexistente: ${username}`);
		return res.status(401).json({ error: 'Usuário não encontrado' });
	}

	const valid = await bcrypt.compare(password, user.password);
	if (!valid) {
		logger.warn(`Senha inválida para usuário: ${username}`);
		return res.status(400).json({ error: 'Credenciais inválidas' });
	}

  logger.info(`Login bem-sucedido: ${username}`);

	const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
	res.json({ token, username: user.username });
});

module.exports = router;
