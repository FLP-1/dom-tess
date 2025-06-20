// frontend/src/pages/Register.jsx
import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [cpf, setCpf] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState(null);
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('register');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/register', { cpf, name, email, password });
      alert('Registro realizado. Verifique o seu OTP.');
      setUserId(res.data.userId);
      setStep('verify');
    } catch (err) {
      alert('Erro no registro: ' + err.response.data.message);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/verify', { userId, otp });
      alert('Usuário verificado com sucesso!');
      setStep('login');
    } catch (err) {
      alert('Erro na verificação do OTP: ' + err.response.data.message);
    }
  };

  return (
    <div>
      {step === 'register' && (
        <form onSubmit={handleRegister}>
          <h2>Registro</h2>
          <input type="text" placeholder="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} required />
          <input type="text" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Registrar</button>
        </form>
      )}
      {step === 'verify' && (
        <form onSubmit={handleVerify}>
          <h2>Verificar OTP</h2>
          <input type="text" placeholder="Digite seu OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
          <button type="submit">Verificar</button>
        </form>
      )}
    </div>
  );
};

export default Register;
