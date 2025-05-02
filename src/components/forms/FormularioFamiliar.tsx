'use client';

import React from 'react';
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
import { MaskedInput, masks } from '@/components/common/MaskedInput';
import { formatCPF, removeCPFFormatting, validateCPF } from '@/utils/cpf';
import { useRouter } from 'next/navigation';
import { FaUser, FaUserFriends, FaUserTie, FaUserGraduate } from 'react-icons/fa';
import { ParentescoSelect } from '@/components/common/ParentescoSelect';

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
];

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
};

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
};

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
  const [formData, setFormData] = React.useState<Partial<Familiar>>({
    empregadorId,
    nome: dadosIniciais?.nome || '',
    parentesco: dadosIniciais?.parentesco || '',
    dataNascimento: dadosIniciais?.dataNascimento || new Date(),
    cpf: dadosIniciais?.cpf || '',
    telefone: dadosIniciais?.telefone || '',
    email: dadosIniciais?.email || '',
    status: dadosIniciais?.status || 'ativo',
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const toast = useToast();
  const router = useRouter();

  const validateDate = (date: Date | undefined) => {
    if (!date) return 0;
    const today = new Date();
    const birthDate = new Date(date);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.length < 3) {
      newErrors.nome = 'Nome deve ter pelo menos 3 caracteres';
    }

    if (!formData.parentesco) {
      newErrors.parentesco = 'Parentesco é obrigatório';
    } else {
      const age = validateDate(formData.dataNascimento);
      const limites = PARENTESCO_LIMITES[formData.parentesco as keyof typeof PARENTESCO_LIMITES];
      
      if (limites.min !== null && age < limites.min) {
        newErrors.dataNascimento = `Idade mínima para ${formData.parentesco.toLowerCase()} é ${limites.min} anos`;
      }
      
      if (limites.max !== null && age > limites.max) {
        newErrors.dataNascimento = `Idade máxima para ${formData.parentesco.toLowerCase()} é ${limites.max} anos`;
      }
    }

    if (!formData.dataNascimento) {
      newErrors.dataNascimento = 'Data de nascimento é obrigatória';
    } else {
      const birthDate = new Date(formData.dataNascimento);
      const today = new Date();
      
      if (birthDate > today) {
        newErrors.dataNascimento = 'Data de nascimento não pode ser futura';
      }
    }

    if (!formData.cpf) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!validateCPF(removeCPFFormatting(formData.cpf))) {
      newErrors.cpf = 'CPF inválido';
    }

    if (!formData.telefone) {
      newErrors.telefone = 'Telefone é obrigatório';
    } else {
      const phone = formData.telefone.replace(/\D/g, '');
      if (phone.length < 10 || phone.length > 11) {
        newErrors.telefone = 'Telefone inválido';
      }
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    } else {
      toast({
        title: 'Erro de validação',
        description: 'Por favor, corrija os campos destacados em vermelho',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
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

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <Text fontSize="lg" fontWeight="bold">Dados do Familiar</Text>

        <FormControl isInvalid={!!errors.nome}>
          <FormLabel>Nome Completo</FormLabel>
          <Tooltip label="Digite o nome completo do familiar">
            <MaskedInput
              value={formData.nome}
              onChange={e => handleChange('nome', e.target.value)}
              placeholder="Digite o nome completo"
              aria-label="Nome Completo"
              aria-describedby="nome-helper"
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
            helperText={formData.parentesco ? `Selecione o grau de parentesco com o empregador` : undefined}
          />
        </FormControl>

        <FormControl isInvalid={!!errors.dataNascimento}>
          <FormLabel>Data de Nascimento</FormLabel>
          <Tooltip label="Selecione a data de nascimento do familiar">
            <Input
              type="date"
              value={formData.dataNascimento?.toISOString().split('T')[0] || ''}
              onChange={e => handleChange('dataNascimento', e.target.value)}
              aria-label="Data de Nascimento"
              aria-describedby="data-nascimento-help"
            />
          </Tooltip>
          <FormHelperText id="data-nascimento-help">
            Data de nascimento do familiar
          </FormHelperText>
          <FormErrorMessage>{errors.dataNascimento}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.cpf}>
          <FormLabel>CPF</FormLabel>
          <Tooltip label="Digite o CPF do familiar">
            <MaskedInput
              value={formData.cpf}
              onChange={e => handleChange('cpf', e.target.value)}
              placeholder="000.000.000-00"
              aria-label="CPF"
              aria-describedby="cpf-help"
              mask={masks.cpf}
            />
          </Tooltip>
          <FormHelperText id="cpf-help">CPF do familiar</FormHelperText>
          <FormErrorMessage>{errors.cpf}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.telefone}>
          <FormLabel>Telefone</FormLabel>
          <Tooltip label="Digite o telefone do familiar">
            <MaskedInput
              value={formData.telefone}
              onChange={e => handleChange('telefone', e.target.value)}
              placeholder="(00) 00000-0000"
              aria-label="Telefone"
              aria-describedby="telefone-help"
              mask={masks.phone}
            />
          </Tooltip>
          <FormHelperText id="telefone-help">
            Telefone para contato do familiar
          </FormHelperText>
          <FormErrorMessage>{errors.telefone}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.email}>
          <FormLabel>E-mail</FormLabel>
          <Tooltip label="Digite o e-mail do familiar">
            <Input
              value={formData.email}
              onChange={e => handleChange('email', e.target.value)}
              placeholder="seu@email.com"
              type="email"
              aria-label="E-mail"
              aria-describedby="email-help"
            />
          </Tooltip>
          <FormHelperText id="email-help">
            E-mail para contato do familiar
          </FormHelperText>
          <FormErrorMessage>{errors.email}</FormErrorMessage>
        </FormControl>

        <HStack justify="space-between" mt={4}>
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            isDisabled={!onBack || isLoading}
          >
            Voltar
          </Button>

          <HStack>
            {onSaveDraft && (
              <Button
                type="button"
                variant="outline"
                onClick={onSaveDraft}
                isDisabled={isLoading}
              >
                Salvar Rascunho
              </Button>
            )}

            <Button 
              type="submit" 
              colorScheme="blue"
              isLoading={isLoading}
              loadingText="Salvando..."
              leftIcon={isLoading ? <Spinner size="sm" /> : undefined}
            >
              {familiarId ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </HStack>
        </HStack>
      </VStack>
    </Box>
  );
} 