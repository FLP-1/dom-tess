//src/routes/points.js
const express = require('express');
const router = express.Router();

// Importa via caminho relativo
const pointController = require('../controllers/pointController');
const auth = require('../middleware/auth');

router.get('/', (req, res) => res.send('Points OK'));
router.post('/register', auth, pointController.register);
router.get('/my-history', auth, pointController.history);

module.exports = router;
