'use client';

import { useState, useEffect, useRef } from 'react';
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
  FormErrorMessage,
  HStack,
  Icon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  IconButton,
  Heading,
  Tooltip,
  Image,
  Link,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { FaUser, FaLock, FaFingerprint } from 'react-icons/fa';
import { BsPersonBoundingBox } from 'react-icons/bs';
import { formatAndValidateCPF } from '@/utils/cpf';
import { isBiometricAvailable, authenticateWithBiometric } from '@/utils/biometric';
import { FormContainer } from '@/components/form/FormContainer';
import NextLink from 'next/link';

export function ClientLoginForm() {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [cpfError, setCpfError] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);
  const cpfInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    checkBiometricAvailability();
    // Limpa o campo de CPF ao montar o componente
    if (cpfInputRef.current) {
      cpfInputRef.current.value = '';
    }
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const available = await isBiometricAvailable();
      setBiometricAvailable(available);
    } catch (error) {
      console.error('Erro ao verificar disponibilidade biométrica:', error);
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { formattedCPF, isValid } = formatAndValidateCPF(e.target.value);
    setCpf(formattedCPF);
    setCpfError(formattedCPF.length === 14 && !isValid);
  };

  const handleBiometricAuth = async () => {
    setBiometricLoading(true);
    try {
      await authenticateWithBiometric();
      toast({
        title: 'Autenticação biométrica realizada com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      router.push('/dashboard');
    } catch (error) {
      toast({
        title: 'Erro na autenticação biométrica',
        description: 'Por favor, tente novamente ou use CPF e senha.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setBiometricLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Valida o CPF antes de prosseguir
    const { isValid } = formatAndValidateCPF(cpf);
    if (!isValid) {
      setCpfError(true);
      toast({
        title: 'CPF inválido',
        description: 'Por favor, insira um CPF válido.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      // Aqui vamos implementar a lógica de autenticação com CPF
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: 'Login realizado com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      router.push('/dashboard');
    } catch (error) {
      toast({
        title: 'Erro ao fazer login',
        description: 'Verifique suas credenciais e tente novamente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FormContainer onSubmit={handleSubmit}>
        <VStack spacing={6} mb={8} alignItems="center">
          <Heading color="brand.blue" size="2xl" fontWeight="bold">
            DOM
          </Heading>
          <Text fontSize="lg" color="brand.gray" textAlign="center">
            Faça login para acessar o sistema
          </Text>
        </VStack>

        {biometricAvailable && (
          <Box mb="sm">
            <HStack spacing="md" width="100%" justify="center">
              <Tooltip label="Login com digital" hasArrow>
                <IconButton
                  aria-label="Login com digital"
                  icon={<Icon as={FaFingerprint} boxSize={6} color="brand.blue" />}
                  color="brand.blue"
                  variant="ghost"
                  onClick={handleBiometricAuth}
                  isLoading={biometricLoading}
                  size="lg"
                  _hover={{ bg: "transparent", color: "brand.blue", opacity: 0.8 }}
                />
              </Tooltip>
              <Tooltip label="Login com reconhecimento facial" hasArrow>
                <IconButton
                  aria-label="Login com reconhecimento facial"
                  icon={<Icon as={BsPersonBoundingBox} boxSize={6} color="brand.blue" />}
                  color="brand.blue"
                  variant="ghost"
                  onClick={onOpen}
                  size="lg"
                  _hover={{ bg: "transparent", color: "brand.blue", opacity: 0.8 }}
                />
              </Tooltip>
            </HStack>
          </Box>
        )}

        <FormControl isRequired isInvalid={cpfError}>
          <FormLabel color="brand.gray">CPF</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FaUser} color="brand.gray" />
            </InputLeftElement>
            <Input
              ref={cpfInputRef}
              type="text"
              value={cpf}
              onChange={handleCPFChange}
              placeholder="000.000.000-00"
              maxLength={14}
              autoComplete="off"
              name="cpf-input"
              color="brand.gray"
              borderColor="gray.300"
              _placeholder={{ color: "gray.400" }}
              _hover={{ borderColor: "brand.blue" }}
              _focus={{ borderColor: "brand.blue", boxShadow: "0 0 0 1px brand.blue" }}
            />
          </InputGroup>
          {cpfError && (
            <FormErrorMessage color="red.500">
              CPF inválido. Por favor, verifique os números digitados.
            </FormErrorMessage>
          )}
        </FormControl>

        <FormControl isRequired>
          <FormLabel color="brand.gray">Senha</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FaLock} color="brand.gray" />
            </InputLeftElement>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              autoComplete="new-password"
              name="password-input"
              color="brand.gray"
              borderColor="gray.300"
              _placeholder={{ color: "gray.400" }}
              _hover={{ borderColor: "brand.blue" }}
              _focus={{ borderColor: "brand.blue", boxShadow: "0 0 0 1px brand.blue" }}
            />
          </InputGroup>
        </FormControl>

        <Button
          type="submit"
          width="100%"
          isLoading={loading}
          isDisabled={cpfError}
          size="lg"
          mt="sm"
          bg="brand.blue"
          color="white"
          _hover={{ bg: "brand.blue", opacity: 0.8 }}
        >
          Entrar
        </Button>

        <Text fontSize="sm" color="brand.gray" textAlign="center">
          Não tem uma conta?{' '}
          <Button
            variant="link"
            color="brand.blue"
            textDecoration="underline"
            _hover={{ opacity: 0.8 }}
            onClick={() => router.push('/register')}
          >
            Cadastre-se
          </Button>
        </Text>

        <Text fontSize="sm" color="brand.gray" textAlign="center">
          Entrando você aceita nossos{' '}
          <Link as={NextLink} href="/termos-de-uso" color="brand.blue" textDecoration="underline" _hover={{ opacity: 0.8 }} fontSize="sm">
            Termos de uso
          </Link>{' '}e nossa{' '}
          <Link as={NextLink} href="/politica-privacidade" color="brand.blue" textDecoration="underline" _hover={{ opacity: 0.8 }} fontSize="sm">
            Política de Privacidade
          </Link>
        </Text>
      </FormContainer>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
        <ModalOverlay backdropFilter="blur(2px)" />
        <ModalContent bg="brand.background">
          <ModalHeader textAlign="center" color="brand.blue">
            Reconhecimento Facial
          </ModalHeader>
          <ModalCloseButton color="brand.blue" />
          <ModalBody p={6}>
            <VStack spacing="md">
              <Box
                width="100%"
                height="300px"
                borderRadius="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
                border="2px dashed"
                borderColor="whiteAlpha.300"
              >
                <Icon as={BsPersonBoundingBox} boxSize={12} color="brand.blue" />
              </Box>
              <Text textAlign="center" color="brand.gray">
                Posicione seu rosto no centro da câmera
              </Text>
              <Button
                width="100%"
                onClick={handleBiometricAuth}
                isLoading={biometricLoading}
                size="lg"
                colorScheme="whiteAlpha"
              >
                Iniciar Reconhecimento
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
} 