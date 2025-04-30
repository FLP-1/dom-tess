'use client';

import { useState } from 'react';
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
} from '@chakra-ui/react';
import { DadosEmpregador } from '@/types/esocial';
import { MaskedInput, masks } from '@/components/common/MaskedInput';
import { SelectField } from '@/components/common/SelectField';
import { EnderecoForm } from '@/components/common/EnderecoForm';
import { formatCPF, removeCPFFormatting, validateCPF } from '@/utils/cpf';
import { formatCNPJ, removeCNPJFormatting, validateCNPJ } from '@/utils/cnpj';

interface FormularioEmpregadorProps {
  initialData?: Partial<DadosEmpregador>;
  onSubmit: (data: Partial<DadosEmpregador>) => void;
  onBack?: () => void;
  onSaveDraft?: () => void;
}

const TIPO_EMPREGADOR_OPTIONS = [
  { value: 'PF', label: 'Pessoa Física' },
  { value: 'PJ', label: 'Pessoa Jurídica' },
];

export function FormularioEmpregador({
  initialData,
  onSubmit,
  onBack,
  onSaveDraft,
}: FormularioEmpregadorProps) {
  const [formData, setFormData] = useState<Partial<DadosEmpregador>>({
    tipoEmpregador: initialData?.tipoEmpregador || '',
    nome: initialData?.nome || '',
    cpf: initialData?.cpf || '',
    cnpj: initialData?.cnpj || '',
    razaoSocial: initialData?.razaoSocial || '',
    email: initialData?.email || '',
    telefone: initialData?.telefone || '',
    celular: initialData?.celular || '',
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

    if (!formData.tipoEmpregador) {
      newErrors.tipoEmpregador = 'Tipo de empregador é obrigatório';
    }

    if (formData.tipoEmpregador === 'PF') {
      if (!formData.nome) {
        newErrors.nome = 'Nome é obrigatório';
      }

      if (!formData.cpf) {
        newErrors.cpf = 'CPF é obrigatório';
      } else if (!validateCPF(removeCPFFormatting(formData.cpf))) {
        newErrors.cpf = 'CPF inválido';
      }
    } else if (formData.tipoEmpregador === 'PJ') {
      if (!formData.razaoSocial) {
        newErrors.razaoSocial = 'Razão social é obrigatória';
      }

      if (!formData.cnpj) {
        newErrors.cnpj = 'CNPJ é obrigatório';
      } else if (!validateCNPJ(removeCNPJFormatting(formData.cnpj))) {
        newErrors.cnpj = 'CNPJ inválido';
      }
    }

    if (!formData.email) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.telefone && !formData.celular) {
      newErrors.telefone = 'Pelo menos um telefone é obrigatório';
      newErrors.celular = 'Pelo menos um telefone é obrigatório';
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

  const handleEnderecoChange = (endereco: Partial<DadosEmpregador['endereco']>) => {
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
        <Text fontSize="lg" fontWeight="bold">Dados do Empregador</Text>

        <SelectField
          label="Tipo de Empregador"
          name="tipoEmpregador"
          value={formData.tipoEmpregador || ''}
          onChange={(value) => handleChange('tipoEmpregador', value)}
          options={TIPO_EMPREGADOR_OPTIONS}
          placeholder="Selecione o tipo de empregador"
          error={errors.tipoEmpregador}
          isRequired
          aria-label="Tipo de Empregador"
        />

        {formData.tipoEmpregador === 'PF' && (
          <>
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
                mask={masks.cpf}
                aria-label="CPF"
              />
              <FormErrorMessage>{errors.cpf}</FormErrorMessage>
            </FormControl>
          </>
        )}

        {formData.tipoEmpregador === 'PJ' && (
          <>
            <FormControl isInvalid={!!errors.razaoSocial}>
              <FormLabel>Razão Social</FormLabel>
              <MaskedInput
                value={formData.razaoSocial}
                onChange={e => handleChange('razaoSocial', e.target.value)}
                placeholder="Digite a razão social"
                aria-label="Razão Social"
              />
              <FormErrorMessage>{errors.razaoSocial}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.cnpj}>
              <FormLabel>CNPJ</FormLabel>
              <MaskedInput
                value={formData.cnpj}
                onChange={e => handleChange('cnpj', e.target.value)}
                placeholder="00.000.000/0000-00"
                mask={masks.cnpj}
                aria-label="CNPJ"
              />
              <FormErrorMessage>{errors.cnpj}</FormErrorMessage>
            </FormControl>
          </>
        )}

        <FormControl isInvalid={!!errors.email}>
          <FormLabel>E-mail</FormLabel>
          <MaskedInput
            value={formData.email}
            onChange={e => handleChange('email', e.target.value)}
            placeholder="Digite o e-mail"
            type="email"
            aria-label="E-mail"
          />
          <FormErrorMessage>{errors.email}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.telefone}>
          <FormLabel>Telefone Fixo</FormLabel>
          <MaskedInput
            value={formData.telefone}
            onChange={e => handleChange('telefone', e.target.value)}
            placeholder="(00) 0000-0000"
            mask={masks.phone}
            aria-label="Telefone Fixo"
          />
          <FormErrorMessage>{errors.telefone}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.celular}>
          <FormLabel>Celular</FormLabel>
          <MaskedInput
            value={formData.celular}
            onChange={e => handleChange('celular', e.target.value)}
            placeholder="(00) 00000-0000"
            mask={masks.cellphone}
            aria-label="Celular"
          />
          <FormErrorMessage>{errors.celular}</FormErrorMessage>
        </FormControl>

        <Divider my={4} />
        <Text fontSize="lg" fontWeight="bold">Endereço</Text>

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