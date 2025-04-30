'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useAppNotifications } from '@/hooks/useAppNotifications';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  IconButton,
  Divider,
  Text,
  HStack,
  Link
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash, FaFingerprint, FaCamera } from 'react-icons/fa';
import { formatCPF, removeCPFFormatting, validateCPF } from '@/utils/cpf';
import { FiUser } from 'react-icons/fi';
import { AuthLayout } from '@/components/layout/AuthLayout';
import NextLink from 'next/link';

export function LoginForm() {
  const [cpf, setCpf] = useState('');
  const [cpfError, setCpfError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const notifications = useAppNotifications();
  const router = useRouter();

  const handleCPFChange = (value: string) => {
    const formattedCPF = formatCPF(value);
    setCpf(formattedCPF);
    setCpfError(null);
  };

  const handleCPFBlur = () => {
    const cpfNumerico = removeCPFFormatting(cpf);
    if (!validateCPF(cpfNumerico)) {
      setCpfError('CPF inválido');
    } else {
      setCpfError(null);
    }
  };

  const handleBiometricLogin = () => {
    notifications.showInfo(
      'Biometria',
      'Funcionalidade em desenvolvimento.',
      { persistent: false }
    );
  };

  const handleFacialLogin = () => {
    notifications.showInfo(
      'Reconhecimento Facial',
      'Funcionalidade em desenvolvimento.',
      { persistent: false }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cpfNumerico = removeCPFFormatting(cpf);

    if (!validateCPF(cpfNumerico)) {
      setCpfError('CPF inválido');
      notifications.showError(
        'CPF inválido',
        'Por favor, insira um CPF válido.',
        { persistent: false }
      );
      return;
    }

    if (!cpf || !password) {
      notifications.showError(
        'Campos obrigatórios',
        'Por favor, preencha todos os campos.',
        { persistent: false }
      );
      return;
    }

    setLoading(true);

    try {
      await signIn(cpfNumerico, password);
      notifications.showSuccess(
        'Login realizado com sucesso',
        undefined,
        { persistent: false }
      );
      router.push('/dashboard');
    } catch (error: any) {
      let errorMessage = 'Verifique suas credenciais e tente novamente.';
      if (error.message === 'Senha incorreta') {
        errorMessage = 'Senha incorreta.';
      } else if (error.message === 'Muitas tentativas. Tente novamente mais tarde') {
        errorMessage = 'Muitas tentativas. Tente novamente mais tarde.';
      }
      notifications.showError(
        'Erro ao fazer login',
        errorMessage,
        { persistent: true }
      );
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Faça login para acessar o sistema">
      <form onSubmit={handleSubmit} autoComplete="off">
        <VStack spacing={4}>
          <HStack spacing={8} justify="center" pt={2}>
            <Tooltip label="Login com digital" hasArrow>
              <span><FaFingerprint size={28} style={{ cursor: 'pointer', opacity: 0.7 }} onClick={handleBiometricLogin} /></span>
            </Tooltip>
            <Tooltip label="Login com reconhecimento facial" hasArrow>
              <span><FaCamera size={28} style={{ cursor: 'pointer', opacity: 0.7 }} onClick={handleFacialLogin} /></span>
            </Tooltip>
          </HStack>

          <FormControl isRequired isInvalid={!!cpfError}>
            <FormLabel>CPF</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiUser color="gray.300" />
              </InputLeftElement>
              <Input
                type="text"
                value={cpf}
                onChange={(e) => handleCPFChange(e.target.value)}
                onBlur={handleCPFBlur}
                placeholder="000.000.000-00"
                maxLength={14}
                autoComplete="off"
                name="cpf-login"
              />
            </InputGroup>
            {cpfError && <Text color="red.500" fontSize="sm">{cpfError}</Text>}
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Senha</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                autoComplete="off"
                name="senha-login"
              />
              <InputRightElement>
                <IconButton
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                  variant="ghost"
                  onClick={() => setShowPassword(!showPassword)}
                  size="sm"
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            isLoading={loading}
            loadingText="Entrando..."
          >
            Entrar
          </Button>

          <HStack spacing={2} justify="center">
            <Text>Não tem uma conta?</Text>
            <Link as={NextLink} href="/register" color="blue.500">
              Cadastre-se
            </Link>
          </HStack>

          <Link as={NextLink} href="/forgot-password" color="blue.500">
            Esqueceu sua senha?
          </Link>
        </VStack>
      </form>
    </AuthLayout>
  );
} 