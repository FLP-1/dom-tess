'use client';

import { LoginForm } from '@/components/auth/LoginForm';
import { AuthLayout } from '@/components/layout/AuthLayout';

export default function LoginPage() {
  return (
    <AuthLayout 
      title="Faça login para acessar o sistema"
      subtitle="Entre com suas credenciais para continuar"
    >
      <LoginForm />
    </AuthLayout>
  );
} 