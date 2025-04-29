import { Box, Heading, FormControl, FormLabel, Input, Button, VStack, useToast, FormErrorMessage } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { employeeService } from '@/services/employeeService';
import { formatPhone, validateEmail } from '@/utils/formatting';

export default function RegisterEmployee() {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    cargo: '',
    dataAdmissao: '',
    salario: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.cpf) {
      newErrors.cpf = 'CPF é obrigatório';
    }

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.telefone) {
      newErrors.telefone = 'Telefone é obrigatório';
    }

    if (!formData.cargo) {
      newErrors.cargo = 'Cargo é obrigatório';
    }

    if (!formData.dataAdmissao) {
      newErrors.dataAdmissao = 'Data de admissão é obrigatória';
    }

    if (!formData.salario) {
      newErrors.salario = 'Salário é obrigatório';
    } else if (isNaN(Number(formData.salario)) || Number(formData.salario) <= 0) {
      newErrors.salario = 'Salário deve ser um valor positivo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await employeeService.createEmployee({
        ...formData,
        salario: Number(formData.salario),
        telefone: formatPhone(formData.telefone),
      });
      
      toast({
        title: 'Sucesso',
        description: 'Empregado cadastrado com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      router.push('/dashboard');
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao cadastrar empregado',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={8}>
      <Heading mb={8}>Cadastrar Empregado</Heading>
      
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired isInvalid={!!errors.nome}>
            <FormLabel>Nome Completo</FormLabel>
            <Input
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Digite o nome completo"
            />
            <FormErrorMessage>{errors.nome}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.cpf}>
            <FormLabel>CPF</FormLabel>
            <Input
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              placeholder="Digite o CPF"
            />
            <FormErrorMessage>{errors.cpf}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Digite o email"
            />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.telefone}>
            <FormLabel>Telefone</FormLabel>
            <Input
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="Digite o telefone"
            />
            <FormErrorMessage>{errors.telefone}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.cargo}>
            <FormLabel>Cargo</FormLabel>
            <Input
              name="cargo"
              value={formData.cargo}
              onChange={handleChange}
              placeholder="Digite o cargo"
            />
            <FormErrorMessage>{errors.cargo}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.dataAdmissao}>
            <FormLabel>Data de Admissão</FormLabel>
            <Input
              name="dataAdmissao"
              type="date"
              value={formData.dataAdmissao}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.dataAdmissao}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.salario}>
            <FormLabel>Salário</FormLabel>
            <Input
              name="salario"
              type="number"
              value={formData.salario}
              onChange={handleChange}
              placeholder="Digite o salário"
            />
            <FormErrorMessage>{errors.salario}</FormErrorMessage>
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            isLoading={loading}
            loadingText="Cadastrando..."
          >
            Cadastrar
          </Button>
        </VStack>
      </form>
    </Box>
  );
} 