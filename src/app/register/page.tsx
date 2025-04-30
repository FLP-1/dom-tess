'use client';

import { RegisterForm } from '@/components/auth/RegisterForm';
import { AuthLayout } from '@/components/layout/AuthLayout';

export default function RegisterPage() {
  return (
    <AuthLayout 
      title="Criar uma nova conta"
      subtitle="Preencha os dados abaixo para se cadastrar"
    >
      <RegisterForm />
    </AuthLayout>
  );
} 