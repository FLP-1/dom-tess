// jwt.js
module.exports = {
  secret: process.env.JWT_SECRET || 'your-fallback-secret',
  accessExpiration: '15m',      // acesso token válido por 15 minutos
  refreshExpiration: '7d'       // refresh token válido por 7 dias
};

