// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes  = require('./src/routes/auth');
const pointRoutes = require('./src/routes/points');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth',  authRoutes);
app.use('/api/points', pointRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
