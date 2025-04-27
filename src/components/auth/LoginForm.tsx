'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  HStack,
  Divider,
  Heading,
  Tooltip,
  Link
} from '@chakra-ui/react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { FaFingerprint } from 'react-icons/fa';
import { TbFaceId } from 'react-icons/tb';
import { formatCPF, validateCPF, removeCPFFormatting } from '@/utils/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import NextLink from 'next/link';
import { DoubleBorderCard } from '@/components/DoubleBorderCard';

export function LoginForm() {
  const [cpf, setCpf] = useState('');
  const [cpfError, setCpfError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const toast = useToast();
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
    toast({
      title: 'Biometria',
      description: 'Funcionalidade em desenvolvimento.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleFacialLogin = () => {
    toast({
      title: 'Reconhecimento Facial',
      description: 'Funcionalidade em desenvolvimento.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('handleSubmit chamado');
    e.preventDefault();
    setLoading(true);

    try {
      if (!cpf || !password) {
        toast({
          title: 'Campos obrigatórios',
          description: 'Por favor, preencha todos os campos.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }

      if (!validateCPF(cpf)) {
        toast({
          title: 'CPF inválido',
          description: 'Por favor, insira um CPF válido.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }

      const cpfNumerico = removeCPFFormatting(cpf);
      console.log('Tentando login com CPF:', cpfNumerico);

      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('cpf', '==', cpfNumerico));
      const querySnapshot = await getDocs(q);

      console.log('querySnapshot.empty:', querySnapshot.empty, 'size:', querySnapshot.size);

      if (querySnapshot.empty) {
        console.log('Nenhum usuário encontrado com o CPF:', cpfNumerico);
        toast({
          title: 'Usuário não encontrado',
          description: 'CPF não cadastrado no sistema.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      if (!userData.email || typeof userData.email !== 'string' || userData.email.trim() === '') {
        toast({
          title: 'Erro no cadastro',
          description: 'Usuário sem email cadastrado.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }

      console.log('Tentando autenticar com email:', userData.email);

      try {
        await signIn(userData.email, password);
        toast({
          title: 'Login realizado com sucesso',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        router.push('/dashboard');
      } catch (error: any) {
        console.error('Erro durante o signIn:', error);
        let errorMessage = 'Verifique suas credenciais e tente novamente.';
        if (error.message === 'Senha incorreta') {
          errorMessage = 'Senha incorreta.';
        } else if (error.message === 'Muitas tentativas. Tente novamente mais tarde') {
          errorMessage = 'Muitas tentativas. Tente novamente mais tarde.';
        }
        toast({
          title: 'Erro ao fazer login',
          description: errorMessage,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }
    } catch (error: any) {
      console.error('Erro geral:', error);
      toast({
        title: 'Erro ao fazer login',
        description: 'Ocorreu um erro ao tentar fazer login. Tente novamente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center" minH="100vh" bg="gray.50">
      <DoubleBorderCard>
        <form onSubmit={handleSubmit} autoComplete="off">
          <VStack spacing={4}>
            <Heading as="h1" size="2xl" color="brand.blue" mb={2} textAlign="center">
              DOM
            </Heading>
            <Text fontSize="lg" color="gray.600" textAlign="center">
              Faça login para acessar o sistema
            </Text>
            <HStack spacing={8} justify="center" pt={2}>
              <Tooltip label="Login com digital" hasArrow>
                <span><FaFingerprint size={28} style={{ cursor: 'pointer', opacity: 0.7 }} onClick={handleBiometricLogin} /></span>
              </Tooltip>
              <Tooltip label="Login com reconhecimento facial" hasArrow>
                <span><TbFaceId size={28} style={{ cursor: 'pointer', opacity: 0.7 }} onClick={handleFacialLogin} /></span>
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
                    icon={showPassword ? <FiEyeOff /> : <FiEye />}
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
              width="100%"
              isLoading={loading}
            >
              Entrar
            </Button>
            <Divider />
            <Text fontSize="sm" color="gray.500" textAlign="center">
              Não tem uma conta?{' '}
              <Button
                variant="link"
                color="blue.500"
                onClick={() => router.push('/register')}
              >
                Cadastre-se
              </Button>
            </Text>
            <Button
              variant="link"
              color="blue.500"
              size="sm"
              onClick={() => router.push('/forgot-password')}
            >
              Esqueceu sua senha?
            </Button>
            <Text fontSize="xs" color="gray.400" textAlign="center" mt={2}>
              Entrando você aceita nossos{' '}
              <Link as={NextLink} href="/termos-de-uso" color="blue.500" textDecor="underline" fontSize="xs">
                Termos de uso
              </Link>{' '}e nossa{' '}
              <Link as={NextLink} href="/politica-privacidade" color="blue.500" textDecor="underline" fontSize="xs">
                Política de Privacidade
              </Link>
            </Text>
          </VStack>
        </form>
      </DoubleBorderCard>
    </Box>
  );
} 