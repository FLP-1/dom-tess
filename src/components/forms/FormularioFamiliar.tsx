'use client';

import React, { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  VStack,
  HStack,
  FormErrorMessage,
  useToast,
  Text,
  Divider,
  Button,
  Tooltip,
  FormHelperText,
  Spinner,
  Select,
  Icon,
  Input,
} from '@chakra-ui/react';
import { Familiar } from '@/types/esocial';
import { MaskedInput } from '@/components/common/MaskedInput';
import { formatCPF, removeCPFFormatting, validateCPF } from '@/utils/cpf';
import { useRouter } from 'next/navigation';
import { FaUser, FaUserFriends, FaUserTie, FaUserGraduate } from 'react-icons/fa';
import { ParentescoSelect } from '@/components/common/ParentescoSelect';
import { MaskType } from '@/utils/maskTypes';

const PARENTESCO_OPTIONS = [
  {
    label: 'Parentes Diretos',
    options: [
      { value: 'PAI', label: 'Pai', icon: FaUser },
      { value: 'MAE', label: 'Mãe', icon: FaUser },
      { value: 'FILHO', label: 'Filho(a)', icon: FaUser },
    ],
  },
  {
    label: 'Parentes por Casamento',
    options: [
      { value: 'CONJUGE', label: 'Cônjuge', icon: FaUserFriends },
      { value: 'SOGRO', label: 'Sogro(a)', icon: FaUserTie },
      { value: 'GENRO', label: 'Genro', icon: FaUserTie },
      { value: 'NORA', label: 'Nora', icon: FaUserTie },
    ],
  },
  {
    label: 'Parentes Colaterais',
    options: [
      { value: 'IRMAO', label: 'Irmão(ã)', icon: FaUserFriends },
      { value: 'AVO', label: 'Avô(ó)', icon: FaUserGraduate },
      { value: 'NETO', label: 'Neto(a)', icon: FaUserGraduate },
    ],
  },
] as const;

const PARENTESCO_DESCRICOES = {
  CONJUGE: 'Cônjuge ou companheiro(a) do empregador',
  FILHO: 'Filho(a) biológico(a) ou adotivo(a) do empregador',
  PAI: 'Pai biológico ou adotivo do empregador',
  MAE: 'Mãe biológica ou adotiva do empregador',
  IRMAO: 'Irmão(ã) biológico(a) ou adotivo(a) do empregador',
  AVO: 'Avô(ó) do empregador',
  NETO: 'Neto(a) do empregador',
  SOGRO: 'Sogro(a) do empregador',
  GENRO: 'Genro do empregador',
  NORA: 'Nora do empregador',
} as const;

const PARENTESCO_LIMITES = {
  CONJUGE: { min: 18, max: null },
  FILHO: { min: 0, max: 18 },
  PAI: { min: 18, max: null },
  MAE: { min: 18, max: null },
  IRMAO: { min: 0, max: null },
  AVO: { min: 40, max: null },
  NETO: { min: 0, max: 18 },
  SOGRO: { min: 40, max: null },
  GENRO: { min: 18, max: null },
  NORA: { min: 18, max: null },
} as const;

const masks = {
  cpf: 'cpf' as MaskType,
  phone: 'phone' as MaskType,
} as const;

interface FormularioFamiliarProps {
  dadosIniciais?: Partial<Familiar>;
  empregadorId: string;
  familiarId?: string;
  onSubmit: (data: Partial<Familiar>) => void;
  onBack?: () => void;
  onSaveDraft?: () => void;
  isLoading?: boolean;
}

export function FormularioFamiliar({
  dadosIniciais = {},
  empregadorId,
  familiarId,
  onSubmit,
  onBack,
  onSaveDraft,
  isLoading = false,
}: FormularioFamiliarProps) {
  const [formData, setFormData] = useState<Partial<Familiar>>(dadosIniciais);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const toast = useToast();
  const router = useRouter();

  const handleChange = (field: keyof Familiar, value: string | Date) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateDate = (date: Date | undefined) => {
    if (!date) return false;
    const today = new Date();
    return date <= today;
  };

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

    if (!formData.parentesco) {
      newErrors.parentesco = 'Parentesco é obrigatório';
    }

    if (!formData.dataNascimento) {
      newErrors.dataNascimento = 'Data de nascimento é obrigatória';
    } else if (!validateDate(formData.dataNascimento)) {
      newErrors.dataNascimento = 'Data de nascimento inválida';
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

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <Text fontSize="lg" fontWeight="bold">Dados do Familiar</Text>

        <FormControl isInvalid={!!errors.nome}>
          <FormLabel>Nome Completo</FormLabel>
          <Tooltip label="Digite o nome completo do familiar">
            <MaskedInput
              value={formData.nome}
              onChange={value => handleChange('nome', value)}
              _placeholder="Digite o nome completo"
              aria-label="Nome completo"
              aria-describedby="nome-error"
            />
          </Tooltip>
          <FormHelperText id="nome-helper">Nome completo do familiar</FormHelperText>
          <FormErrorMessage>{errors.nome}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.parentesco}>
          <ParentescoSelect
            value={formData.parentesco || ''}
            onChange={(value) => handleChange('parentesco', value)}
            error={errors.parentesco}
            isRequired
            label="Parentesco"
          />
          <FormErrorMessage>{errors.parentesco}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.dataNascimento}>
          <FormLabel>Data de Nascimento</FormLabel>
          <Input
            type="date"
            value={formData.dataNascimento ? new Date(formData.dataNascimento).toISOString().split('T')[0] : ''}
            onChange={e => handleChange('dataNascimento', new Date(e.target.value))}
            aria-label="Data de nascimento"
            aria-describedby="dataNascimento-error"
          />
          <FormErrorMessage>{errors.dataNascimento}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.cpf}>
          <FormLabel>CPF</FormLabel>
          <MaskedInput
            value={formData.cpf}
            onChange={value => handleChange('cpf', value)}
            mask={masks.cpf}
            _placeholder="000.000.000-00"
            aria-label="CPF"
            aria-describedby="cpf-error"
          />
          <FormErrorMessage>{errors.cpf}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.telefone}>
          <FormLabel>Telefone</FormLabel>
          <MaskedInput
            value={formData.telefone}
            onChange={value => handleChange('telefone', value)}
            mask={masks.phone}
            _placeholder="(00) 00000-0000"
            aria-label="Telefone"
            aria-describedby="telefone-error"
          />
          <FormErrorMessage>{errors.telefone}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.email}>
          <FormLabel>E-mail</FormLabel>
          <Input
            type="email"
            value={formData.email}
            onChange={e => handleChange('email', e.target.value)}
            placeholder="Digite o e-mail"
            aria-label="E-mail"
            aria-describedby="email-error"
          />
          <FormErrorMessage>{errors.email}</FormErrorMessage>
        </FormControl>

        <HStack spacing={4} justify="flex-end">
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              Voltar
            </Button>
          )}
          {onSaveDraft && (
            <Button variant="outline" onClick={onSaveDraft}>
              Salvar Rascunho
            </Button>
          )}
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isLoading}
          >
            {familiarId ? 'Atualizar' : 'Cadastrar'}
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
} 