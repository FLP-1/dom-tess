'use client';

import { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  HStack,
  FormErrorMessage,
  useToast,
} from '@chakra-ui/react';
import { formatCPF, removeCPFFormatting, validateCPF } from '@/utils/cpf';
import { formatPhone } from '@/utils/phone';
import { DadosEmpregado } from '@/types/esocial';
import { SelectField } from '@/components/common/SelectField';
import { MaskedInput, masks } from '@/components/common/MaskedInput';
import { EnderecoForm } from '@/components/common/EnderecoForm';

interface DadosPessoaisFormProps {
  initialData?: Partial<DadosEmpregado>;
  onSubmit: (data: Partial<DadosEmpregado>) => void;
  onBack?: () => void;
  onSaveDraft?: () => void;
}

const SEXO_OPTIONS = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Feminino' }
];

export function DadosPessoaisForm({
  initialData,
  onSubmit,
  onBack,
  onSaveDraft,
}: DadosPessoaisFormProps) {
  const [formData, setFormData] = useState<Partial<DadosEmpregado>>({
    nome: initialData?.nome || '',
    cpf: initialData?.cpf || '',
    dataNascimento: initialData?.dataNascimento || '',
    sexo: initialData?.sexo || '',
    email: initialData?.email || '',
    telefone: initialData?.telefone || '',
    endereco: {
      logradouro: initialData?.endereco?.logradouro || '',
      numero: initialData?.endereco?.numero || '',
      complemento: initialData?.endereco?.complemento || '',
      bairro: initialData?.endereco?.bairro || '',
      cidade: initialData?.endereco?.cidade || '',
      estado: initialData?.endereco?.estado || '',
      cep: initialData?.endereco?.cep || '',
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const toast = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.cpf) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!validateCPF(removeCPFFormatting(formData.cpf))) {
      newErrors.cpf = 'CPF inválido';
    }

    if (!formData.dataNascimento) {
      newErrors.dataNascimento = 'Data de nascimento é obrigatória';
    }

    if (!formData.sexo) {
      newErrors.sexo = 'Sexo é obrigatório';
    }

    if (!formData.email) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.telefone) {
      newErrors.telefone = 'Telefone é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleEnderecoChange = (endereco: Partial<DadosEmpregado['endereco']>) => {
    setFormData(prev => ({
      ...prev,
      endereco: {
        ...prev.endereco,
        ...endereco,
      },
    }));
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <FormControl isInvalid={!!errors.nome}>
          <FormLabel>Nome Completo</FormLabel>
          <MaskedInput
            value={formData.nome}
            onChange={e => handleChange('nome', e.target.value)}
            placeholder="Digite o nome completo"
            aria-label="Nome Completo"
          />
          <FormErrorMessage>{errors.nome}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.cpf}>
          <FormLabel>CPF</FormLabel>
          <MaskedInput
            value={formData.cpf}
            onChange={e => handleChange('cpf', e.target.value)}
            placeholder="000.000.000-00"
            maxLength={14}
            mask={masks.cpf}
            aria-label="CPF"
          />
          <FormErrorMessage>{errors.cpf}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.dataNascimento}>
          <FormLabel>Data de Nascimento</FormLabel>
          <Input
            type="date"
            value={formData.dataNascimento}
            onChange={e => handleChange('dataNascimento', e.target.value)}
            aria-label="Data de Nascimento"
          />
          <FormErrorMessage>{errors.dataNascimento}</FormErrorMessage>
        </FormControl>

        <SelectField
          label="Sexo"
          name="sexo"
          value={formData.sexo || ''}
          onChange={(value) => handleChange('sexo', value)}
          options={SEXO_OPTIONS}
          placeholder="Selecione o sexo"
          error={errors.sexo}
          isRequired
          aria-label="Sexo"
        />

        <FormControl isInvalid={!!errors.email}>
          <FormLabel>E-mail</FormLabel>
          <Input
            type="email"
            value={formData.email}
            onChange={e => handleChange('email', e.target.value)}
            placeholder="Digite o e-mail"
            aria-label="E-mail"
          />
          <FormErrorMessage>{errors.email}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.telefone}>
          <FormLabel>Telefone</FormLabel>
          <MaskedInput
            value={formData.telefone}
            onChange={e => handleChange('telefone', e.target.value)}
            placeholder="(00) 00000-0000"
            maxLength={15}
            mask={masks.phone}
            aria-label="Telefone"
          />
          <FormErrorMessage>{errors.telefone}</FormErrorMessage>
        </FormControl>

        <EnderecoForm
          enderecoInicial={formData.endereco}
          onChange={handleEnderecoChange}
        />

        <HStack justify="space-between" mt={4}>
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            isDisabled={!onBack}
          >
            Voltar
          </Button>

          <HStack>
            {onSaveDraft && (
              <Button
                type="button"
                variant="outline"
                onClick={onSaveDraft}
              >
                Salvar Rascunho
              </Button>
            )}

            <Button type="submit" colorScheme="blue">
              Próximo
            </Button>
          </HStack>
        </HStack>
      </VStack>
    </Box>
  );
} 