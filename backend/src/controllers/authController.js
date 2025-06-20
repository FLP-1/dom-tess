// authController.js
// backend/src/controllers/authController.js (corrigido)
const User = require('../models/User');  // Caminho relativo simples

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findByEmail(email);
  if (!user) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  // Compara senha em texto puro contra o hash no DB
  const valid = await User.validatePassword(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  // Se chegou aqui, login OK
  res.json({ accessToken: 'token_aqui' });
};
