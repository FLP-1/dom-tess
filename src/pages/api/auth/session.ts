import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@/lib/firebase-admin';
import Cookies from 'js-cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('--- [API] /api/auth/session chamada ---');
  if (req.method !== 'POST') {
    console.log('Método não permitido:', req.method);
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    console.log('Iniciando configuração de sessão');
    const { token } = req.body;
    console.log('Token recebido:', token ? '[OK]' : '[FALTA TOKEN]');

    if (!token) {
      console.error('Token não fornecido');
      return res.status(400).json({ error: 'Token não fornecido' });
    }

    console.log('Verificando token com Firebase Admin...');
    // Verifica o token com o Firebase Admin
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(token);
      console.log('Token verificado com sucesso:', decodedToken.uid);
    } catch (err) {
      console.error('Erro ao verificar token:', err);
      return res.status(401).json({ error: 'Token inválido', details: String(err) });
    }

    // Define o cookie no cliente
    try {
      res.setHeader('Set-Cookie', `session=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${60 * 60 * 24 * 5}`);
      console.log('Cookie de sessão configurado com sucesso');
    } catch (err) {
      console.error('Erro ao configurar cookie:', err);
      return res.status(500).json({ error: 'Erro ao configurar cookie', details: String(err) });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erro inesperado ao configurar sessão:', error);
    return res.status(500).json({ error: 'Erro inesperado ao configurar sessão', details: String(error) });
  }
} 