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
  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <FormControl isInvalid={!!errors.rg}>
          <FormLabel>RG</FormLabel>
          <Input
            value={formData.rg}
            onChange={e => handleChange('rg', e.target.value)}
            placeholder="Digite o RG"
          />
          <FormErrorMessage>{errors.rg}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.rgOrgaoEmissor}>
          <FormLabel>Órgão Emissor do RG</FormLabel>
          <Input
            value={formData.rgOrgaoEmissor}
            onChange={e => handleChange('rgOrgaoEmissor', e.target.value)}
            placeholder="Digite o órgão emissor do RG"
          />
          <FormErrorMessage>{errors.rgOrgaoEmissor}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.rgDataEmissao}>
          <FormLabel>Data de Emissão do RG</FormLabel>
          <Input
            type="date"
            value={formData.rgDataEmissao}
            onChange={e => handleChange('rgDataEmissao', e.target.value)}
          />
          <FormErrorMessage>{errors.rgDataEmissao}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.rgUfEmissao}>
          <FormLabel>UF de Emissão do RG</FormLabel>
          <Input
            value={formData.rgUfEmissao}
            onChange={e => handleChange('rgUfEmissao', e.target.value)}
            placeholder="Digite a UF de emissão do RG"
          />
          <FormErrorMessage>{errors.rgUfEmissao}</FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel>Título de Eleitor</FormLabel>
          <Input
            value={formData.tituloEleitor}
            onChange={e => handleChange('tituloEleitor', e.target.value)}
            placeholder="Digite o título de eleitor"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Zona Eleitoral</FormLabel>
          <Input
            value={formData.tituloEleitorZona}
            onChange={e => handleChange('tituloEleitorZona', e.target.value)}
            placeholder="Digite a zona eleitoral"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Seção Eleitoral</FormLabel>
          <Input
            value={formData.tituloEleitorSecao}
            onChange={e => handleChange('tituloEleitorSecao', e.target.value)}
            placeholder="Digite a seção eleitoral"
          />
        </FormControl>

        <FormControl isInvalid={!!errors.pis}>
          <FormLabel>PIS</FormLabel>
          <Input
            value={formData.pis}
            onChange={e => handleChange('pis', e.target.value)}
            placeholder="Digite o PIS"
          />
          <FormErrorMessage>{errors.pis}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.ctps}>
          <FormLabel>CTPS</FormLabel>
          <Input
            value={formData.ctps}
            onChange={e => handleChange('ctps', e.target.value)}
            placeholder="Digite o número da CTPS"
          />
          <FormErrorMessage>{errors.ctps}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.ctpsSerie}>
          <FormLabel>Série da CTPS</FormLabel>
          <Input
            value={formData.ctpsSerie}
            onChange={e => handleChange('ctpsSerie', e.target.value)}
            placeholder="Digite a série da CTPS"
          />
          <FormErrorMessage>{errors.ctpsSerie}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.ctpsUf}>
          <FormLabel>UF da CTPS</FormLabel>
          <Input
            value={formData.ctpsUf}
            onChange={e => handleChange('ctpsUf', e.target.value)}
            placeholder="Digite a UF da CTPS"
          />
          <FormErrorMessage>{errors.ctpsUf}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.ctpsDataEmissao}>
          <FormLabel>Data de Emissão da CTPS</FormLabel>
          <Input
            type="date"
            value={formData.ctpsDataEmissao}
            onChange={e => handleChange('ctpsDataEmissao', e.target.value)}
          />
          <FormErrorMessage>{errors.ctpsDataEmissao}</FormErrorMessage>
        </FormControl>

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