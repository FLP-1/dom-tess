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
  FormErrorMessage,
  Heading,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  HStack,
  PinInput,
  PinInputField,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { FiUser, FiMail, FiPhone } from 'react-icons/fi';
import { formatCPF, validateCPF } from '@/utils/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { sendPasswordResetEmail, updatePassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { VerificationService } from '@/services/verificationService';
import { EmailVerificationService } from '@/services/EmailVerificationService';
import { SMSVerificationService } from '@/services/SMSVerificationService';
import { DoubleBorderCard } from '@/components/DoubleBorderCard';

export function ForgotPasswordForm() {
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cpfError, setCpfError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<'email' | 'phone'>('email');
  const [verificationCode, setVerificationCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [step, setStep] = useState<'input' | 'verify' | 'reset'>('input');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const router = useRouter();
  const [error, setError] = useState('');

  const handleCPFChange = (value: string) => {
    const formattedCPF = formatCPF(value);
    setCpf(formattedCPF);
    setCpfError(null);
  };

  const handleCPFBlur = () => {
    const cpfNumerico = cpf.replace(/\D/g, '');
    if (!validateCPF(cpfNumerico)) {
      setCpfError('CPF inválido');
    } else {
      setCpfError(null);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    setPasswordError(null);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setPasswordError(null);
  };

  const validatePasswords = () => {
    if (newPassword.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('As senhas não coincidem');
      return false;
    }
    return true;
  };

  const sendVerificationCode = async () => {
    try {
      const service = verificationMethod === 'email' ? EmailVerificationService : SMSVerificationService;
      const result = await service.sendVerificationCode(
        cpf.replace(/\D/g, ''),
        verificationMethod === 'email' ? email : phone
      );

      if (!result.success) {
        toast({
          title: 'Erro ao enviar código',
          description: result.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      toast({
        title: 'Código enviado',
        description: result.message,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      setStep('verify');
    } catch (error: any) {
      toast({
        title: 'Erro ao enviar código',
        description: error.message || 'Ocorreu um erro ao enviar o código. Tente novamente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const verifyCode = async () => {
    try {
      const service = verificationMethod === 'email' ? EmailVerificationService : SMSVerificationService;
      const result = await service.verifyCode(
        cpf.replace(/\D/g, ''),
        inputCode
      );

      if (!result.success) {
        toast({
          title: 'Erro na verificação',
          description: 'Ocorreu um erro ao verificar o código. Por favor, tente novamente ou solicite um novo código.',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
        return;
      }

      toast({
        title: 'Código verificado',
        description: result.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setStep('reset');
    } catch (error: any) {
      toast({
        title: 'Erro na verificação',
        description: 'Ocorreu um erro ao verificar o código. Por favor, tente novamente ou solicite um novo código.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleResendCode = async () => {
    try {
      const service = verificationMethod === 'email' ? EmailVerificationService : SMSVerificationService;
      const result = await service.resendCode(
        cpf.replace(/\D/g, ''),
        verificationMethod === 'email' ? email : phone
      );

      if (!result.success) {
        toast({
          title: 'Erro ao reenviar código',
          description: result.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      toast({
        title: 'Código reenviado',
        description: result.message,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao reenviar código',
        description: error.message || 'Ocorreu um erro ao reenviar o código. Tente novamente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const resetPassword = async () => {
    if (!validatePasswords()) return;

    try {
      const user = auth.currentUser;
      if (user) {
        await updatePassword(user, newPassword);
        toast({
          title: 'Senha alterada',
          description: 'Sua senha foi alterada com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        router.push('/login');
      }
    } catch (error: any) {
      toast({
        title: 'Erro ao alterar senha',
        description: error.message || 'Ocorreu um erro ao alterar sua senha. Tente novamente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!cpf || (!email && !phone)) {
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

      // Verifica se o usuário existe no Firestore
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('cpf', '==', cpf.replace(/\D/g, '')));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
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

      // Verifica se o email/celular corresponde ao usuário
      if (verificationMethod === 'email' && userData.email !== email) {
        toast({
          title: 'Email incorreto',
          description: 'O email informado não corresponde ao cadastrado.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }

      if (verificationMethod === 'phone' && userData.phone !== phone) {
        toast({
          title: 'Celular incorreto',
          description: 'O celular informado não corresponde ao cadastrado.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }

      await sendVerificationCode();
    } catch (error: any) {
      toast({
        title: 'Erro ao verificar dados',
        description: error.message || 'Ocorreu um erro ao verificar seus dados. Tente novamente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DoubleBorderCard>
      <Box as="form" onSubmit={handleSubmit} width="100%" maxW="400px" mx="auto" p={0} borderRadius="lg" boxShadow="none" bg="transparent" borderWidth={0} borderColor="transparent">
        <VStack spacing={4}>
          <Heading as="h1" size="2xl" color="brand.blue" mb={2} textAlign="center">
            DOM
          </Heading>
          <Text fontSize="large" color="brand.blue" textAlign="center" mb={2}>
            Recuperação de Senha
          </Text>
          <Text fontSize="md" color="brand.blue" textAlign="center" mb={2}>
            Digite seu CPF e email para receber o link de recuperação
          </Text>

          {step === 'input' && (
            <>
              <FormControl isRequired isInvalid={!!cpfError}>
                <FormLabel>CPF</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiUser} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    type="text"
                    value={cpf}
                    onChange={(e) => handleCPFChange(e.target.value)}
                    onBlur={handleCPFBlur}
                    placeholder="000.000.000-00"
                    maxLength={14}
                  />
                </InputGroup>
                {cpfError && <FormErrorMessage>{cpfError}</FormErrorMessage>}
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Método de Verificação</FormLabel>
                <HStack spacing={4}>
                  <Button
                    variant={verificationMethod === 'email' ? 'solid' : 'outline'}
                    colorScheme="blue"
                    onClick={() => setVerificationMethod('email')}
                    flex={1}
                  >
                    Email
                  </Button>
                  <Button
                    variant={verificationMethod === 'phone' ? 'solid' : 'outline'}
                    colorScheme="blue"
                    onClick={() => setVerificationMethod('phone')}
                    flex={1}
                  >
                    Celular
                  </Button>
                </HStack>
              </FormControl>

              {verificationMethod === 'email' ? (
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiMail} color="gray.300" />
                    </InputLeftElement>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                    />
                  </InputGroup>
                </FormControl>
              ) : (
                <FormControl isRequired>
                  <FormLabel>Celular</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiPhone} color="gray.300" />
                    </InputLeftElement>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(00) 00000-0000"
                    />
                  </InputGroup>
                </FormControl>
              )}

              <Button
                type="submit"
                colorScheme="blue"
                width="100%"
                isLoading={loading}
              >
                Enviar Código de Verificação
              </Button>
            </>
          )}

          {step === 'verify' && (
            <>
              <Text fontSize="md" color="gray.600" textAlign="center">
                Digite o código enviado para {verificationMethod === 'email' ? 'seu email' : 'seu celular'}
              </Text>
              <HStack justify="center">
                <PinInput
                  value={inputCode}
                  onChange={setInputCode}
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
              <Button
                colorScheme="blue"
                width="100%"
                onClick={verifyCode}
                isDisabled={inputCode.length !== 6}
              >
                Verificar Código
              </Button>
              <Button
                variant="link"
                color="blue.500"
                onClick={handleResendCode}
              >
                Reenviar código
              </Button>
            </>
          )}

          {step === 'reset' && (
            <>
              <FormControl isRequired isInvalid={!!passwordError}>
                <FormLabel>Nova Senha</FormLabel>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Digite sua nova senha"
                />
              </FormControl>
              <FormControl isRequired isInvalid={!!passwordError}>
                <FormLabel>Confirmar Nova Senha</FormLabel>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="Confirme sua nova senha"
                />
                {passwordError && <FormErrorMessage>{passwordError}</FormErrorMessage>}
              </FormControl>
              <Button
                colorScheme="blue"
                width="100%"
                onClick={resetPassword}
              >
                Alterar Senha
              </Button>
            </>
          )}

          <Text fontSize="sm" color="gray.500" textAlign="center">
            Lembrou sua senha?{' '}
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
      {/* Modal de verificação */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Verificação de Email</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={2}>Digite o código enviado para seu email:</Text>
            <HStack justify="center">
              <PinInput
                value={verificationCode}
                onChange={setVerificationCode}
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
            <Button colorScheme="blue" mr={3} onClick={verifyCode}>
              Verificar
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </DoubleBorderCard>
  );
} 