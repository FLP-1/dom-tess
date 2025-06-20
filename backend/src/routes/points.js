//src/routes/points.js
const express = require('express');
const router = express.Router();

// Rota POST para registrar um ponto
router.post('/', async (req, res) => {
  try {
    // Lógica para registrar o ponto (exemplo)
    console.log('Rota POST /points chamada');
    res.status(201).json({ message: 'Ponto registrado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao registrar ponto' });
  }
});

module.exports = router;
