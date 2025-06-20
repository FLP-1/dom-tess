import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';

dotenv.config();
const app = express();
app.use(express.json());

// Rotas de autenticação
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🔥 Backend rodando na porta ${PORT}`);
});
