'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Container,
  Box,
  Heading,
  Text,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  InputGroup,
  InputRightElement,
  IconButton,
  useToast,
  FormErrorMessage
} from '@chakra-ui/react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { validatePassword } from '@/utils/auth';
import { AuthService } from '@/services/AuthService';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const cpf = searchParams.get('cpf');

  useEffect(() => {
    if (!cpf) {
      router.push('/forgot-password');
    }
  }, [cpf, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validação da senha
      if (!validatePassword(formData.password)) {
        setError('A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais');
        setLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('As senhas não coincidem');
        setLoading(false);
        return;
      }

      // Chama o serviço para redefinir a senha
      const result = await AuthService.resetPassword(cpf!, formData.password);

      if (!result.success) {
        toast({
          title: 'Erro ao redefinir senha',
          description: result.message,
          status: 'error',
          duration: 3000,
        });
        setLoading(false);
        return;
      }

      toast({
        title: 'Senha redefinida com sucesso',
        description: 'Você já pode fazer login com sua nova senha',
        status: 'success',
        duration: 3000,
      });

      // Redireciona para a página de login
      router.push('/login');
    } catch (error: any) {
      setError(error.message || 'Ocorreu um erro ao redefinir a senha. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.sm" py={10}>
      <Box
        p={8}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        bg="white"
      >
        <VStack spacing={6} align="stretch">
          <Heading as="h1" size="lg" textAlign="center">
            Redefinição de Senha
          </Heading>
          <Text textAlign="center" color="gray.600">
            Digite sua nova senha abaixo
          </Text>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isInvalid={!!error}>
                <FormLabel>Nova Senha</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Digite sua nova senha"
                    required
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      icon={showPassword ? <FiEyeOff /> : <FiEye />}
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl isInvalid={!!error}>
                <FormLabel>Confirmar Nova Senha</FormLabel>
                <InputGroup>
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirme sua nova senha"
                    required
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      icon={showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                      variant="ghost"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{error}</FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                isLoading={loading}
                loadingText="Redefinindo senha..."
              >
                Redefinir Senha
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Container>
  );
} 