// backend/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Registro de usuário
exports.register = async (req, res) => {
  try {
    const { cpf, name, email, password } = req.body;
    if (!cpf || !name || !email || !password) {
      return res.status(400).json({ message: 'Campos obrigatórios faltando' });
    }
    if (!validateCPF(cpf)) {
      return res.status(400).json({ message: 'CPF inválido' });
    }
    const existingUser = await User.findByCPF(cpf);
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já registrado' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const newUser = await User.create({ cpf, name, email, password: hashedPassword, otp });
    // Aqui você integraria um serviço de envio (e-mail/SMS). Por enquanto, apenas logamos:
    console.log(`OTP para ${email}: ${otp}`);
    return res.status(201).json({ message: 'Usuário registrado. Verifique seu OTP.', userId: newUser.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};

// Verificação do OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'OTP inválido.' });
    }
    user.otp = null;
    user.isVerified = true;
    await user.save();
    return res.json({ message: 'Usuário verificado com sucesso!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro no servidor.' });
  }
};

// Login do usuário
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }
    if (!user.isVerified) {
      return res.status(401).json({ message: 'Usuário não verificado. Confirme seu OTP.' });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-fallback-secret',
      { expiresIn: '15m' }
    );
    return res.json({ accessToken: token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro no servidor.' });
  }
};

// Função simples para validação de CPF (placeholder, ajuste conforme necessário)
function validateCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');
  return cpf.length === 11;
}
