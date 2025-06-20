// de src/models/User.js
// Exemplo simplificado usando pool do PostgreSQL
//const pool = require('../../database/your-pool-file'); // ajuste o caminho 
//const pool = require('../../database');
//conforme sua estrutura
// ✔️ Agora aponta para E:\git-dom\backend\src\config\database.js
const pool = require('../config/database');


class User {
  constructor({ id, cpf, name, email, password, otp, isVerified }) {
    this.id = id;
    this.cpf = cpf;
    this.name = name;
    this.email = email;
    this.password = password;
    this.otp = otp;
    this.isVerified = isVerified;
  }
  
  static async findByCPF(cpf) {
    const result = await pool.query('SELECT * FROM users WHERE cpf = $1', [cpf]);
    return result.rows[0] ? new User(result.rows[0]) : null;
  }
  
  static async findByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] ? new User(result.rows[0]) : null;
  }
  
  static async findById(id) {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] ? new User(result.rows[0]) : null;
  }
  
  static async create({ cpf, name, email, password, otp }) {
    const result = await pool.query(
      'INSERT INTO users (cpf, name, email, password, otp, isVerified) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [cpf, name, email, password, otp, false]
    );
    return new User(result.rows[0]);
  }
  
  async save() {
    const result = await pool.query(
      'UPDATE users SET otp = $1, isVerified = $2 WHERE id = $3 RETURNING *',
      [this.otp, this.isVerified, this.id]
    );
    Object.assign(this, result.rows[0]);
    return this;
  }
}

module.exports = User;
