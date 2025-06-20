// src/components/auth/Login.tsx
import React, { useState } from 'react';
import Button from '@/common/Button';

interface Props {}

const Login: React.FC<Props> = () => { // Tipar componente
  const [email, setEmail] = useState<string>(''); // Tipar state
  const [password, setPassword] = useState<string>(''); // Tipar state
  const [msg, setMsg] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => { // Tipar evento
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('accessToken', data.accessToken);
        setMsg('Login bem-sucedido!');
      } else {
        setMsg(data.message || 'Erro no login');
      }
    } catch (err: any) { // Tipar erro
      setMsg('Erro de rede');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: 'auto' }}>
      <h2>Login</h2>
      <input
        type="email" placeholder="Email"
        value={email} onChange={e => setEmail(e.target.value)}
        required style={{ width: '100%', marginBottom: 8 }}
      />
      <input
        type="password" placeholder="Senha"
        value={password} onChange={e => setPassword(e.target.value)}
        required style={{ width: '100%', marginBottom: 16 }}
      />
      <Button type="submit">Entrar</Button>
      <p>{msg}</p>
    </form>
  );
};

export default Login;
