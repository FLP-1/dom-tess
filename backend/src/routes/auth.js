// auth.js
const express = require('express');
const router = express.Router();

// Importa corretamente
const authController = require('../controllers/authController');

// Health-check para testar no navegador
router.get('/', (_req, res) => res.send('Auth OK'));

// Rota de login (POST)
router.post('/login', authController.login);

module.exports = router;
