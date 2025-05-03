import { FormControl, FormLabel } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
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
import { DadosEmpregado } from '@/types/esocial';
import { formatDate } from '@/utils/date';
import { SelectField } from '@/components/common/SelectField';
import { MaskedInput, masks } from '@/components/common/MaskedInput';

interface DadosDocumentosFormProps {
  initialData?: Partial<DadosEmpregado>;
  onSubmit: (data: Partial<DadosEmpregado>) => void;
  onBack?: () => void;
  onSaveDraft?: () => void;
}

export function DadosDocumentosForm({
  initialData,
  onSubmit,
  onBack,
  onSaveDraft,
}: DadosDocumentosFormProps) {
  const [formData, setFormData] = useState<Partial<DadosEmpregado>>({
    rg: {
      numero: initialData?.rg?.numero || '',
      orgaoEmissor: initialData?.rg?.orgaoEmissor || '',
      dataEmissao: initialData?.rg?.dataEmissao || '',
    },
    tituloEleitor: initialData?.tituloEleitor || '',
    tituloEleitorZona: initialData?.tituloEleitorZona || '',
    tituloEleitorSecao: initialData?.tituloEleitorSecao || '',
    pis: initialData?.pis || '',
    ctps: {
      numero: initialData?.ctps?.numero || '',
      serie: initialData?.ctps?.serie || '',
      uf: initialData?.ctps?.uf || '',
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const toast = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.rg?.numero) {
      newErrors['rg.numero'] = 'Número do RG é obrigatório';
    }

    if (!formData.rg?.orgaoEmissor) {
      newErrors['rg.orgaoEmissor'] = 'Órgão emissor do RG é obrigatório';
    }

    if (!formData.rg?.dataEmissao) {
      newErrors['rg.dataEmissao'] = 'Data de emissão do RG é obrigatória';
    }

    if (!formData.pis) {
      newErrors.pis = 'PIS é obrigatório';
    }

    if (!formData.ctps?.numero) {
      newErrors['ctps.numero'] = 'Número da CTPS é obrigatório';
    }

    if (!formData.ctps?.serie) {
      newErrors['ctps.serie'] = 'Série da CTPS é obrigatória';
    }

    if (!formData.ctps?.uf) {
      newErrors['ctps.uf'] = 'UF da CTPS é obrigatória';
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

  const handleRgChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      rg: {
        ...prev.rg,
        [field]: value,
      },
    }));

    if (errors[`rg.${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`rg.${field}`];
        return newErrors;
      });
    }
  };

  const handleCtpsChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      ctps: {
        ...prev.ctps,
        [field]: value,
      },
    }));

    if (errors[`ctps.${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`ctps.${field}`];
        return newErrors;
      });
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <FormControl isInvalid={!!errors['rg.numero']}>
          <FormLabel>Número do RG</FormLabel>
          <Input
            value={formData.rg?.numero}
            onChange={e => handleRgChange('numero', e.target.value)}
            placeholder="Digite o número do RG"
          />
          <FormErrorMessage>{errors['rg.numero']}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors['rg.orgaoEmissor']}>
          <FormLabel>Órgão Emissor do RG</FormLabel>
          <Input
            value={formData.rg?.orgaoEmissor}
            onChange={e => handleRgChange('orgaoEmissor', e.target.value)}
            placeholder="Digite o órgão emissor"
          />
          <FormErrorMessage>{errors['rg.orgaoEmissor']}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors['rg.dataEmissao']}>
          <FormLabel>Data de Emissão do RG</FormLabel>
          <MaskedInput
            mask={masks.date}
            value={formData.rg?.dataEmissao}
            onChange={e => handleRgChange('dataEmissao', e.target.value)}
            placeholder="DD/MM/AAAA"
          />
          <FormErrorMessage>{errors['rg.dataEmissao']}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.pis}>
          <FormLabel>PIS</FormLabel>
          <MaskedInput
            mask={masks.pis}
            value={formData.pis}
            onChange={e => handleChange('pis', e.target.value)}
            placeholder="Digite o PIS"
          />
          <FormErrorMessage>{errors.pis}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors['ctps.numero']}>
          <FormLabel>Número da CTPS</FormLabel>
          <Input
            value={formData.ctps?.numero}
            onChange={e => handleCtpsChange('numero', e.target.value)}
            placeholder="Digite o número da CTPS"
          />
          <FormErrorMessage>{errors['ctps.numero']}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors['ctps.serie']}>
          <FormLabel>Série da CTPS</FormLabel>
          <Input
            value={formData.ctps?.serie}
            onChange={e => handleCtpsChange('serie', e.target.value)}
            placeholder="Digite a série da CTPS"
          />
          <FormErrorMessage>{errors['ctps.serie']}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors['ctps.uf']}>
          <FormLabel>UF da CTPS</FormLabel>
          <SelectField
            value={formData.ctps?.uf}
            onChange={e => handleCtpsChange('uf', e.target.value)}
            options={[
              { value: '', label: 'Selecione a UF' },
              { value: 'AC', label: 'Acre' },
              { value: 'AL', label: 'Alagoas' },
              { value: 'AP', label: 'Amapá' },
              { value: 'AM', label: 'Amazonas' },
              { value: 'BA', label: 'Bahia' },
              { value: 'CE', label: 'Ceará' },
              { value: 'DF', label: 'Distrito Federal' },
              { value: 'ES', label: 'Espírito Santo' },
              { value: 'GO', label: 'Goiás' },
              { value: 'MA', label: 'Maranhão' },
              { value: 'MT', label: 'Mato Grosso' },
              { value: 'MS', label: 'Mato Grosso do Sul' },
              { value: 'MG', label: 'Minas Gerais' },
              { value: 'PA', label: 'Pará' },
              { value: 'PB', label: 'Paraíba' },
              { value: 'PR', label: 'Paraná' },
              { value: 'PE', label: 'Pernambuco' },
              { value: 'PI', label: 'Piauí' },
              { value: 'RJ', label: 'Rio de Janeiro' },
              { value: 'RN', label: 'Rio Grande do Norte' },
              { value: 'RS', label: 'Rio Grande do Sul' },
              { value: 'RO', label: 'Rondônia' },
              { value: 'RR', label: 'Roraima' },
              { value: 'SC', label: 'Santa Catarina' },
              { value: 'SP', label: 'São Paulo' },
              { value: 'SE', label: 'Sergipe' },
              { value: 'TO', label: 'Tocantins' },
            ]}
          />
          <FormErrorMessage>{errors['ctps.uf']}</FormErrorMessage>
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
          <Button type="submit" colorScheme="blue">
            Próximo
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
} 