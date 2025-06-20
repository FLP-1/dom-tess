// User.js
const pool = require('../config/database');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

class User {
  static async create({ cpf, name, email, phone, password, role }) {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await pool.query(
      `INSERT INTO users (cpf, name, email, phone, password_hash, role)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, cpf, name, email, phone, role, created_at`,
      [cpf, name, email, phone, hash, role]
    );
    return result.rows[0];
  }

  static async findByEmail(email) {
    const res = await pool.query(
      `SELECT * FROM users WHERE email = $1`, [email]
    );
    return res.rows[0];
  }

  static async findById(id) {
    const res = await pool.query(
      `SELECT id, cpf, name, email, phone, role FROM users WHERE id = $1`, [id]
    );
    return res.rows[0];
  }

  static async validatePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }
}

module.exports = User;

