"use client";

import { Box, Heading, FormControl, FormLabel, Input, Button, VStack, useToast, FormErrorMessage } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { familyService } from '@/services/familyService';
import { employeeService, Employee } from '@/services/employeeService';
import { Select } from '@/components/Select';

export default function RegisterFamily() {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    dataNascimento: '',
    parentesco: '',
    empregadoId: '',
    tipoDocumento: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await employeeService.getEmployees();
        setEmployees(data);
      } catch (error) {
        toast({
          title: 'Erro',
          description: 'Erro ao carregar lista de empregados',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    loadEmployees();
  }, [toast]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.cpf) {
      newErrors.cpf = 'CPF é obrigatório';
    }

    if (!formData.dataNascimento) {
      newErrors.dataNascimento = 'Data de nascimento é obrigatória';
    }

    if (!formData.parentesco) {
      newErrors.parentesco = 'Parentesco é obrigatório';
    }

    if (!formData.empregadoId) {
      newErrors.empregadoId = 'Empregado é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      await familyService.createFamilyMember({
        ...formData,
        parentesco: formData.parentesco as 'CONJUGE' | 'FILHO' | 'PAI' | 'MAE' | 'OUTRO',
      });
      
      toast({
        title: 'Sucesso',
        description: 'Familiar cadastrado com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      router.push('/dashboard');
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao cadastrar familiar',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const parentescoOptions = [
    { value: 'pai', label: 'Pai' },
    { value: 'mae', label: 'Mãe' },
    { value: 'filho', label: 'Filho(a)' },
    { value: 'conjuge', label: 'Cônjuge' },
    { value: 'outro', label: 'Outro' }
  ];

  const tipoDocumentoOptions = [
    { value: 'cpf', label: 'CPF' },
    { value: 'rg', label: 'RG' },
    { value: 'certidao', label: 'Certidão de Nascimento' }
  ];

  return (
    <Box p={8}>
      <Heading mb={8}>Cadastrar Familiar</Heading>
      
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

          <FormControl isRequired isInvalid={!!errors.dataNascimento}>
            <FormLabel>Data de Nascimento</FormLabel>
            <Input
              name="dataNascimento"
              type="date"
              value={formData.dataNascimento}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.dataNascimento}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired>
            <FormLabel htmlFor="parentesco">Parentesco</FormLabel>
            <Select
              id="parentesco"
              name="parentesco"
              value={formData.parentesco}
              onChange={handleChange}
              options={parentescoOptions}
              label="Selecione o parentesco"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel htmlFor="tipoDocumento">Tipo de Documento</FormLabel>
            <Select
              id="tipoDocumento"
              name="tipoDocumento"
              value={formData.tipoDocumento}
              onChange={handleChange}
              options={tipoDocumentoOptions}
              label="Selecione o tipo de documento"
            />
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.empregadoId}>
            <FormLabel>Empregado</FormLabel>
            <Select
              name="empregadoId"
              value={formData.empregadoId}
              onChange={handleChange}
              placeholder="Selecione o empregado"
            >
              {employees.map(employee => (
                <option key={employee.id} value={employee.id}>
                  {employee.nome}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.empregadoId}</FormErrorMessage>
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