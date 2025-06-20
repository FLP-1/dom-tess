// backend/src/routes/auth.ts
import { Router } from 'express';
import pool from '../config/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const router = Router();

// configura transporter SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Registro de usuário
router.post('/register', async (req, res) => {
  const { cpf, name, email, phone, password, role } = req.body;
  try {
    // TODO: validar CPF (dígito verificador) e formato de email/telefone
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users(cpf,name,email,phone,password,role)
       VALUES($1,$2,$3,$4,$5,$6) RETURNING id`,
      [cpf, name, email, phone, hashed, role]
    );
    res.status(201).json({ userId: result.rows[0].id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Login e geração de JWT
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { rows, rowCount } = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    if (!rowCount) return res.status(400).json({ error: 'Usuário não encontrado' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Credenciais inválidas' });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRATION }
    );
    res.json({ token });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Envio de OTP (para verificação de email/telefone)
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Seu código de verificação DOM',
      text: `Seu código OTP é: ${otp}`,
    });
    // TODO: armazenar OTP em banco ou cache para validação posterior
    res.json({ message: 'OTP enviado com sucesso' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
