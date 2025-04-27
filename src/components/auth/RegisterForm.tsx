'use client';

import { useState, useEffect } from 'react';
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
  Center,
  Spinner,
  FormHelperText,
  Switch,
  HStack,
  FormErrorMessage,
  Checkbox,
  Badge,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  PinInput,
  PinInputField
} from '@chakra-ui/react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { FiUser, FiEye, FiEyeOff, FiMail, FiPhone } from 'react-icons/fi';
import { generateEmail, isValidEmail, formatPhone, isValidPhone, formatCPF, validateCPF } from '@/utils/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';
import { EmailVerificationService } from '@/services/EmailVerificationService';
import { SMSVerificationService } from '@/services/SMSVerificationService';
import NextLink from 'next/link';
import { DoubleBorderCard } from '@/components/DoubleBorderCard';

interface RegisterFormData {
  nome: string;
  cpf: string;
  email: string;
  celular: string;
  password: string;
  passwordConfirmation: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
}

export function RegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>({
    nome: '',
    cpf: '',
    email: '',
    celular: '',
    password: '',
    passwordConfirmation: '',
    isEmailVerified: false,
    isPhoneVerified: false
  });
  const [cpfError, setCpfError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordConfirmationError, setPasswordConfirmationError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const { signUp, checkEmployerExists } = useAuth();
  const toast = useToast();
  const router = useRouter();

  // Modal de validação
  const { isOpen: isEmailModalOpen, onOpen: onOpenEmailModal, onClose: onCloseEmailModal } = useDisclosure();
  const { isOpen: isPhoneModalOpen, onOpen: onOpenPhoneModal, onClose: onClosePhoneModal } = useDisclosure();
  const [emailCode, setEmailCode] = useState('');
  const [inputEmailCode, setInputEmailCode] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [inputPhoneCode, setInputPhoneCode] = useState('');

  // Gerar IDs únicos para cada campo
  const [ids] = useState({
    nome: `nome-${uuidv4()}`,
    cpf: `cpf-${uuidv4()}`,
    email: `email-${uuidv4()}`,
    emailCheckbox: `email-checkbox-${uuidv4()}`,
    celular: `celular-${uuidv4()}`,
    celularCheckbox: `celular-checkbox-${uuidv4()}`,
    password: `password-${uuidv4()}`,
    passwordConfirmation: `password-confirmation-${uuidv4()}`,
    terms: `terms-${uuidv4()}`
  });

  useEffect(() => {
    // Resetar o formulário ao abrir a tela de cadastro
    setFormData({
      nome: '',
      cpf: '',
      email: '',
      celular: '',
      password: '',
      passwordConfirmation: '',
      isEmailVerified: false,
      isPhoneVerified: false
    });
    setCpfError(null);
    setPasswordError(null);
    setPasswordConfirmationError(null);
    setAcceptedTerms(false);
    // Não faz mais verificação automática de empregador aqui
  }, []);

  const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, nome: e.target.value }));
  };

  const handleCPFChange = (value: string) => {
    const formattedCPF = formatCPF(value);
    setFormData(prev => ({ ...prev, cpf: formattedCPF }));
    setCpfError(null);
  };

  const handleCPFBlur = () => {
    const cpfNumerico = formData.cpf.replace(/\D/g, '');
    if (!validateCPF(cpfNumerico)) {
      setCpfError('CPF inválido');
    } else {
      setCpfError(null);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, email: e.target.value, isEmailVerified: false }));
  };

  const handleCelularChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, celular: formatPhone(e.target.value), isPhoneVerified: false }));
  };

  const handlePasswordBlur = () => {
    if (formData.password.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres');
    } else {
      setPasswordError(null);
    }
  };

  const handlePasswordConfirmationBlur = () => {
    if (formData.password !== formData.passwordConfirmation) {
      setPasswordConfirmationError('As senhas não coincidem');
    } else {
      setPasswordConfirmationError(null);
    }
  };

  const handlePasswordConfirmationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, passwordConfirmation: value }));
    if (formData.password === value) {
      setPasswordConfirmationError(null);
    }
  };

  // Simula envio de código e abre modal
  const sendEmailCode = async () => {
    try {
      const result = await EmailVerificationService.sendVerificationCode(
        formData.cpf.replace(/\D/g, ''),
        formData.email
      );

      if (!result.success) {
        toast({
          title: 'Erro ao enviar código',
          description: result.message,
          status: 'error',
          duration: 3000,
        });
        return;
      }

      toast({
        title: 'Código enviado',
        description: result.message,
        status: 'success',
        duration: 3000,
      });
      onOpenEmailModal();
    } catch (error: any) {
      toast({
        title: 'Erro ao enviar código',
        description: error.message || 'Ocorreu um erro ao enviar o código. Tente novamente.',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const sendPhoneCode = async () => {
    try {
      const result = await SMSVerificationService.sendVerificationCode(
        formData.cpf.replace(/\D/g, ''),
        formData.celular
      );

      if (!result.success) {
        toast({
          title: 'Erro ao enviar código',
          description: result.message,
          status: 'error',
          duration: 3000,
        });
        return;
      }

      toast({
        title: 'Código enviado',
        description: result.message,
        status: 'success',
        duration: 3000,
      });
      onOpenPhoneModal();
    } catch (error: any) {
      toast({
        title: 'Erro ao enviar código',
        description: error.message || 'Ocorreu um erro ao enviar o código. Tente novamente.',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const confirmEmailCode = async () => {
    try {
      const result = await EmailVerificationService.verifyCode(
        formData.cpf.replace(/\D/g, ''),
        inputEmailCode
      );

      if (!result.success) {
        toast({
          title: 'Erro na verificação',
          description: result.message,
          status: 'error',
          duration: 3000,
        });
        return;
      }

      setFormData(prev => ({ ...prev, isEmailVerified: true }));
      toast({
        title: 'Email validado com sucesso!',
        status: 'success',
        duration: 2000,
      });
      onCloseEmailModal();
    } catch (error: any) {
      toast({
        title: 'Erro na verificação',
        description: error.message || 'Ocorreu um erro ao verificar o código. Tente novamente.',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const confirmPhoneCode = async () => {
    try {
      const result = await SMSVerificationService.verifyCode(
        formData.cpf.replace(/\D/g, ''),
        inputPhoneCode
      );

      if (!result.success) {
        toast({
          title: 'Erro na verificação',
          description: result.message,
          status: 'error',
          duration: 3000,
        });
        return;
      }

      setFormData(prev => ({ ...prev, isPhoneVerified: true }));
      toast({
        title: 'Celular validado com sucesso!',
        status: 'success',
        duration: 2000,
      });
      onClosePhoneModal();
    } catch (error: any) {
      toast({
        title: 'Erro na verificação',
        description: error.message || 'Ocorreu um erro ao verificar o código. Tente novamente.',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cpfNumerico = formData.cpf.replace(/\D/g, '');
    if (!validateCPF(cpfNumerico)) {
      setCpfError('CPF inválido');
      toast({
        title: 'CPF inválido',
        description: 'Por favor, insira um CPF válido.',
        status: 'error',
        duration: 3000,
      });
      return;
    }
    if (!formData.nome || !formData.email || !formData.celular || !formData.password || !formData.passwordConfirmation) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos.',
        status: 'error',
        duration: 3000,
      });
      return;
    }
    if (formData.password.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres');
      toast({
        title: 'Senha inválida',
        description: 'A senha deve ter pelo menos 6 caracteres.',
        status: 'error',
        duration: 3000,
      });
      return;
    }
    if (formData.password !== formData.passwordConfirmation) {
      setPasswordConfirmationError('As senhas não coincidem');
      toast({
        title: 'Confirmação de senha incorreta',
        description: 'As senhas não coincidem.',
        status: 'error',
        duration: 3000,
      });
      return;
    }
    if (!acceptedTerms) {
      toast({
        title: 'Termos não aceitos',
        description: 'Por favor, aceite os termos para continuar.',
        status: 'error',
        duration: 3000,
      });
      return;
    }
    setLoading(true);
    try {
      // Verificar se já existe o mesmo CPF para o mesmo tipo
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('cpf', '==', cpfNumerico), where('role', '==', 'employer'));
      const snapshot = await getDocs(q);
      console.log('Resultado da busca de cpf+role:', snapshot.size, snapshot.docs.map(doc => doc.data()));
      if (!snapshot.empty) {
        toast({
          title: 'Acesso negado',
          description: 'Já existe um cadastro com este CPF para o tipo Empregador.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }
      if (!formData.isEmailVerified) {
        sendEmailCode();
        setLoading(false);
        return;
      }
      if (!formData.isPhoneVerified) {
        sendPhoneCode();
        setLoading(false);
        return;
      }
      await signUp(
        formData.email,
        formData.password,
        formData.nome,
        'employer',
        cpfNumerico,
        formData.celular
      );
      toast({
        title: 'Cadastro realizado',
        description: 'Sua conta foi criada com sucesso!',
        status: 'success',
        duration: 3000,
      });
      // Limpar campos após cadastro
      setFormData({
        nome: '',
        cpf: '',
        email: '',
        celular: '',
        password: '',
        passwordConfirmation: '',
        isEmailVerified: false,
        isPhoneVerified: false
      });
      setCpfError(null);
      setPasswordError(null);
      setPasswordConfirmationError(null);
      setAcceptedTerms(false);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error: any) {
      toast({
        title: 'Erro no cadastro',
        description: error.message || 'Ocorreu um erro ao criar sua conta. Tente novamente.',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DoubleBorderCard>
      <Box as="form" onSubmit={handleSubmit} width="100%" maxW="400px" mx="auto" p={0} borderRadius="lg" boxShadow="none" bg="transparent" borderWidth={0} borderColor="transparent">
        <VStack spacing={4}>
          <Text fontSize="lg" color="gray.600" fontWeight="medium" alignSelf="center">
            Empregador
          </Text>
          <FormControl isRequired isInvalid={!formData.nome}>
            <FormLabel htmlFor={ids.nome}>Nome</FormLabel>
            <Input
              id={ids.nome}
              type="text"
              value={formData.nome}
              onChange={handleNomeChange}
              placeholder="Seu nome completo"
            />
            {!formData.nome && <FormErrorMessage>O nome é obrigatório.</FormErrorMessage>}
          </FormControl>
          <FormControl isRequired isInvalid={!!cpfError}>
            <FormLabel htmlFor={ids.cpf}>CPF</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiUser color="gray.300" />
              </InputLeftElement>
              <Input
                id={ids.cpf}
                type="text"
                value={formData.cpf}
                onChange={(e) => handleCPFChange(e.target.value)}
                onBlur={handleCPFBlur}
                placeholder="000.000.000-00"
                maxLength={14}
              />
            </InputGroup>
            {cpfError && <FormErrorMessage>{cpfError}</FormErrorMessage>}
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor={ids.email}>Email</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiMail color="gray.300" />
              </InputLeftElement>
              <Input
                id={ids.email}
                type="email"
                value={formData.email}
                onChange={handleEmailChange}
                placeholder="seu@email.com"
              />
              <Checkbox
                id={ids.emailCheckbox}
                ml={2}
                colorScheme="green"
                isChecked={formData.isEmailVerified}
                onChange={sendEmailCode}
                isDisabled={formData.isEmailVerified}
              >
                Validar
              </Checkbox>
            </InputGroup>
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor={ids.celular}>Celular</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiPhone color="gray.300" />
              </InputLeftElement>
              <Input
                id={ids.celular}
                type="tel"
                value={formData.celular}
                onChange={handleCelularChange}
                placeholder="(00) 00000-0000"
              />
              <Checkbox
                id={ids.celularCheckbox}
                ml={2}
                colorScheme="green"
                isChecked={formData.isPhoneVerified}
                onChange={sendPhoneCode}
                isDisabled={formData.isPhoneVerified}
              >
                Validar
              </Checkbox>
            </InputGroup>
          </FormControl>
          <FormControl isRequired isInvalid={!!passwordError}>
            <FormLabel htmlFor={ids.password}>Senha</FormLabel>
            <InputGroup>
              <Input
                id={ids.password}
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite sua senha"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                onBlur={handlePasswordBlur}
              />
              <InputRightElement>
                <IconButton
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  icon={showPassword ? <FiEyeOff /> : <FiEye />}
                  onClick={() => setShowPassword(!showPassword)}
                  variant="ghost"
                />
              </InputRightElement>
            </InputGroup>
            <FormHelperText>A senha deve ter pelo menos 6 caracteres</FormHelperText>
            {passwordError && <FormErrorMessage>{passwordError}</FormErrorMessage>}
          </FormControl>
          <FormControl isRequired isInvalid={!!passwordConfirmationError}>
            <FormLabel htmlFor={ids.passwordConfirmation}>Confirme sua senha</FormLabel>
            <InputGroup>
              <Input
                id={ids.passwordConfirmation}
                type={showPasswordConfirmation ? 'text' : 'password'}
                placeholder="Confirme sua senha"
                value={formData.passwordConfirmation}
                onChange={handlePasswordConfirmationChange}
                onBlur={handlePasswordConfirmationBlur}
              />
              <InputRightElement>
                <IconButton
                  aria-label={showPasswordConfirmation ? "Ocultar senha" : "Mostrar senha"}
                  icon={showPasswordConfirmation ? <FiEyeOff /> : <FiEye />}
                  onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                  variant="ghost"
                />
              </InputRightElement>
            </InputGroup>
            {passwordConfirmationError && <FormErrorMessage>{passwordConfirmationError}</FormErrorMessage>}
          </FormControl>
          <FormControl>
            <Checkbox
              id={ids.terms}
              isChecked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
            >
              Li e aceito os{' '}
              <Link as={NextLink} href="/termos-de-uso" color="blue.500" textDecor="underline">
                Termos de uso
              </Link>{' '}e{' '}
              <Link as={NextLink} href="/politica-privacidade" color="blue.500" textDecor="underline">
                Política de Privacidade
              </Link>
            </Checkbox>
          </FormControl>
          <Button
            type="submit"
            colorScheme="blue"
            width="100%"
            isLoading={loading}
            isDisabled={!acceptedTerms}
          >
            Criar conta
          </Button>
          <Text fontSize="sm" color="gray.500">
            Já tem uma conta?{' '}
            <Button
              variant="link"
              color="blue.500"
              onClick={() => router.push('/login')}
            >
              Faça login
            </Button>
          </Text>
        </VStack>
      </Box>

      {/* Modal de validação de email */}
      <Modal isOpen={isEmailModalOpen} onClose={onCloseEmailModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Validação de Email</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={2}>Digite o código enviado para seu email:</Text>
            <HStack justify="center">
              <PinInput
                value={inputEmailCode}
                onChange={setInputEmailCode}
                type="number"
                size="lg"
              >
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
              </PinInput>
            </HStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={confirmEmailCode}>
              Confirmar
            </Button>
            <Button variant="ghost" onClick={onCloseEmailModal}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal de validação de celular */}
      <Modal isOpen={isPhoneModalOpen} onClose={onClosePhoneModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Validação de Celular</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={2}>Digite o código enviado para seu celular:</Text>
            <HStack justify="center">
              <PinInput
                value={inputPhoneCode}
                onChange={setInputPhoneCode}
                type="number"
                size="lg"
              >
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
              </PinInput>
            </HStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={confirmPhoneCode}>
              Confirmar
            </Button>
            <Button variant="ghost" onClick={onClosePhoneModal}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </DoubleBorderCard>
  );
} 