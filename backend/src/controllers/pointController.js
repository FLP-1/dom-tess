//src/controllers/pointController.js

const pool = require('../config/database');

// Tipos válidos para registro de ponto
const VALID_EVENTS = [
  'entry', 'break_start', 'break_end', 'exit', 'ot_start', 'ot_end'
];

exports.register = async (req, res) => {
  try {
    const { event, latitude, longitude, wifi_ssid, note } = req.body;
    const userId = req.user.id;

    if (!VALID_EVENTS.includes(event)) {
      return res.status(400).json({ message: 'Tipo de evento inválido' });
    }

    // Data/hora do servidor, não do cliente!
    const now = new Date();

    await pool.query(
      `INSERT INTO points 
        (user_id, event, timestamp, latitude, longitude, wifi_ssid, status, created_at, updated_at)
       VALUES
        ($1, $2, $3, $4, $5, $6, 'pending', $3, $3)`,
      [userId, event, now, latitude, longitude, wifi_ssid]
    );
    res.json({ ok: true, timestamp: now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao registrar ponto' });
  }
};

exports.history = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date } = req.query;
    const where = date ? `AND DATE(timestamp) = $2` : '';
    const params = date ? [userId, date] : [userId];
    const query = `
      SELECT event, timestamp, latitude, longitude, wifi_ssid, status 
      FROM points WHERE user_id = $1 ${where}
      ORDER BY timestamp DESC LIMIT 100
    `;
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao consultar pontos' });
  }
};
