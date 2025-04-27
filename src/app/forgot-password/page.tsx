'use client';

import { Container, Box, Heading, Text } from '@chakra-ui/react';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function ForgotPasswordPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Se já estiver autenticado, redireciona para o dashboard
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <Container maxW="container.xl" py={10}>
      <Box textAlign="center" mb={8}>
        <Heading as="h1" size="2xl" color="brand.blue" mb={4}>
          Recuperação de Senha
        </Heading>
        <Text fontSize="xl" color="brand.gray">
          Digite seu CPF e email para receber o link de recuperação
        </Text>
      </Box>

      <Box 
        display="flex" 
        justifyContent="center"
        p={6}
        bg="white"
        boxShadow="md"
        borderRadius="lg"
      >
        <ForgotPasswordForm />
      </Box>
    </Container>
  );
} 