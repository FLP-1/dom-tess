// frontend/src/pages/Register.tsx
import { useState } from 'react';
import {
  Box, Card, Typography,
  TextField, Button
} from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';

const RegisterPage = () => {
  const [step, setStep] = useState<1|2>(1);
  const [form, setForm] = useState({
    cpf: '', name: '', email: '', phone: '', password: ''
  });
  const [otp, setOtp] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/send-otp`, { email: form.email });
    setStep(2);
  };

  const finalize = async () => {
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, form);
    router.push('/auth/login');
  };

  return (
    <Box
      display="flex" justifyContent="center" alignItems="center"
      minHeight="100vh" bgcolor="#f5f5f5"
    >
      <Card sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" mb={2}>Cadastro DOM</Typography>

        {step === 1 && (
          <>
            <TextField
              name="cpf" label="CPF" fullWidth margin="normal"
              onChange={handleChange}
            />
            <TextField
              name="name" label="Nome completo" fullWidth margin="normal"
              onChange={handleChange}
            />
            <TextField
              name="email" label="E-mail" fullWidth margin="normal"
              onChange={handleChange}
            />
            <TextField
              name="phone" label="Telefone" fullWidth margin="normal"
              onChange={handleChange}
            />
            <TextField
              name="password" label="Senha" type="password"
              fullWidth margin="normal" onChange={handleChange}
            />
            <Button
              variant="contained" color="primary" fullWidth
              sx={{ mt: 2 }}
              onClick={sendOtp}
            >
              Enviar OTP
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <TextField
              name="otp" label="Código OTP" fullWidth margin="normal"
              onChange={e => setOtp(e.target.value)}
            />
            <Button
              variant="contained" color="primary" fullWidth
              sx={{ mt: 2 }}
              onClick={finalize}
            >
              Concluir Cadastro
            </Button>
          </>
        )}
      </Card>
    </Box>
  );
};

export default RegisterPage;
