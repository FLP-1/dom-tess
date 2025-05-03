import { FormControl, FormLabel } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
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
  Switch,
  Text,
  Divider,
} from '@chakra-ui/react';
import { DadosEmpregado } from '@/types/esocial';
import { MaskedInput, masks } from '@/components/common/MaskedInput';
import { formatCurrency } from '@/utils/currency';

interface DadosRemuneracaoFormProps {
  initialData?: Partial<DadosEmpregado>;
  onSubmit: (data: Partial<DadosEmpregado>) => void;
  onBack?: () => void;
  onSaveDraft?: () => void;
}

export function DadosRemuneracaoForm({
  initialData,
  onSubmit,
  onBack,
  onSaveDraft,
}: DadosRemuneracaoFormProps) {
  const [formData, setFormData] = useState<Partial<DadosEmpregado>>({
    salarioBase: initialData?.salarioBase || '',
    adicionalNoturno: initialData?.adicionalNoturno || '',
    adicionalPericulosidade: initialData?.adicionalPericulosidade || '',
    adicionalInsalubridade: initialData?.adicionalInsalubridade || '',
    valeTransporte: {
      ativo: initialData?.valeTransporte?.ativo || false,
      valor: initialData?.valeTransporte?.valor || '',
    },
    valeAlimentacao: {
      ativo: initialData?.valeAlimentacao?.ativo || false,
      valor: initialData?.valeAlimentacao?.valor || '',
    },
    valeRefeicao: {
      ativo: initialData?.valeRefeicao?.ativo || false,
      valor: initialData?.valeRefeicao?.valor || '',
    },
    planoSaude: {
      ativo: initialData?.planoSaude?.ativo || false,
      valor: initialData?.planoSaude?.valor || '',
    },
    planoOdontologico: {
      ativo: initialData?.planoOdontologico?.ativo || false,
      valor: initialData?.planoOdontologico?.valor || '',
    },
    outrosBeneficios: initialData?.outrosBeneficios || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const toast = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.salarioBase) {
      newErrors.salarioBase = 'Salário base é obrigatório';
    } else {
      const salarioNumerico = parseFloat(formData.salarioBase.replace(/[^\d,]/g, '').replace(',', '.'));
      if (isNaN(salarioNumerico) || salarioNumerico < 0) {
        newErrors.salarioBase = 'Salário base inválido';
      }
    }

    // Validação dos adicionais quando preenchidos
    if (formData.adicionalNoturno) {
      const valorNoturno = parseFloat(formData.adicionalNoturno.replace(/[^\d,]/g, '').replace(',', '.'));
      if (isNaN(valorNoturno) || valorNoturno < 0) {
        newErrors.adicionalNoturno = 'Valor do adicional noturno inválido';
      }
    }

    if (formData.adicionalPericulosidade) {
      const valorPericulosidade = parseFloat(formData.adicionalPericulosidade.replace(/[^\d,]/g, '').replace(',', '.'));
      if (isNaN(valorPericulosidade) || valorPericulosidade < 0) {
        newErrors.adicionalPericulosidade = 'Valor do adicional de periculosidade inválido';
      }
    }

    if (formData.adicionalInsalubridade) {
      const valorInsalubridade = parseFloat(formData.adicionalInsalubridade.replace(/[^\d,]/g, '').replace(',', '.'));
      if (isNaN(valorInsalubridade) || valorInsalubridade < 0) {
        newErrors.adicionalInsalubridade = 'Valor do adicional de insalubridade inválido';
      }
    }

    // Validação dos benefícios ativos
    if (formData.valeTransporte?.ativo && !formData.valeTransporte?.valor) {
      newErrors['valeTransporte.valor'] = 'Valor do vale transporte é obrigatório quando ativo';
    }

    if (formData.valeAlimentacao?.ativo && !formData.valeAlimentacao?.valor) {
      newErrors['valeAlimentacao.valor'] = 'Valor do vale alimentação é obrigatório quando ativo';
    }

    if (formData.valeRefeicao?.ativo && !formData.valeRefeicao?.valor) {
      newErrors['valeRefeicao.valor'] = 'Valor do vale refeição é obrigatório quando ativo';
    }

    if (formData.planoSaude?.ativo && !formData.planoSaude?.valor) {
      newErrors['planoSaude.valor'] = 'Valor do plano de saúde é obrigatório quando ativo';
    }

    if (formData.planoOdontologico?.ativo && !formData.planoOdontologico?.valor) {
      newErrors['planoOdontologico.valor'] = 'Valor do plano odontológico é obrigatório quando ativo';
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

  const handleBeneficioChange = (beneficio: string, campo: 'ativo' | 'valor', value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [beneficio]: {
        ...prev[beneficio],
        [campo]: value,
      },
    }));

    if (errors[`${beneficio}.${campo}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${beneficio}.${campo}`];
        return newErrors;
      });
    }
  };

  const handleValorChange = (value: string) => {
    const formattedValue = formatCurrency(value);
    return formattedValue;
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <Text fontSize="lg" fontWeight="bold">Remuneração Base</Text>
        
        <FormControl isInvalid={!!errors.salarioBase}>
          <FormLabel>Salário Base</FormLabel>
          <MaskedInput
            value={formData.salarioBase}
            onChange={e => handleChange('salarioBase', handleValorChange(e.target.value))}
            placeholder="R$ 0,00"
            mask={masks.currency}
            aria-label="Salário Base"
          />
          <FormErrorMessage>{errors.salarioBase}</FormErrorMessage>
        </FormControl>

        <Divider my={4} />
        <Text fontSize="lg" fontWeight="bold">Adicionais</Text>

        <FormControl isInvalid={!!errors.adicionalNoturno}>
          <FormLabel>Adicional Noturno</FormLabel>
          <MaskedInput
            value={formData.adicionalNoturno}
            onChange={e => handleChange('adicionalNoturno', handleValorChange(e.target.value))}
            placeholder="R$ 0,00"
            mask={masks.currency}
            aria-label="Adicional Noturno"
          />
          <FormErrorMessage>{errors.adicionalNoturno}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.adicionalPericulosidade}>
          <FormLabel>Adicional de Periculosidade</FormLabel>
          <MaskedInput
            value={formData.adicionalPericulosidade}
            onChange={e => handleChange('adicionalPericulosidade', handleValorChange(e.target.value))}
            placeholder="R$ 0,00"
            mask={masks.currency}
            aria-label="Adicional de Periculosidade"
          />
          <FormErrorMessage>{errors.adicionalPericulosidade}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.adicionalInsalubridade}>
          <FormLabel>Adicional de Insalubridade</FormLabel>
          <MaskedInput
            value={formData.adicionalInsalubridade}
            onChange={e => handleChange('adicionalInsalubridade', handleValorChange(e.target.value))}
            placeholder="R$ 0,00"
            mask={masks.currency}
            aria-label="Adicional de Insalubridade"
          />
          <FormErrorMessage>{errors.adicionalInsalubridade}</FormErrorMessage>
        </FormControl>

        <Divider my={4} />
        <Text fontSize="lg" fontWeight="bold">Benefícios</Text>

        <VStack spacing={4} align="stretch">
          <FormControl>
            <HStack justify="space-between" align="center">
              <FormLabel mb={0}>Vale Transporte</FormLabel>
              <Switch
                isChecked={formData.valeTransporte?.ativo}
                onChange={e => handleBeneficioChange('valeTransporte', 'ativo', e.target.checked)}
                aria-label="Ativar Vale Transporte"
              />
            </HStack>
            {formData.valeTransporte?.ativo && (
              <Box mt={2}>
                <MaskedInput
                  value={formData.valeTransporte?.valor}
                  onChange={e => handleBeneficioChange('valeTransporte', 'valor', handleValorChange(e.target.value))}
                  placeholder="R$ 0,00"
                  mask={masks.currency}
                  aria-label="Valor do Vale Transporte"
                  isInvalid={!!errors['valeTransporte.valor']}
                />
                <FormErrorMessage>{errors['valeTransporte.valor']}</FormErrorMessage>
              </Box>
            )}
          </FormControl>

          <FormControl>
            <HStack justify="space-between" align="center">
              <FormLabel mb={0}>Vale Alimentação</FormLabel>
              <Switch
                isChecked={formData.valeAlimentacao?.ativo}
                onChange={e => handleBeneficioChange('valeAlimentacao', 'ativo', e.target.checked)}
                aria-label="Ativar Vale Alimentação"
              />
            </HStack>
            {formData.valeAlimentacao?.ativo && (
              <Box mt={2}>
                <MaskedInput
                  value={formData.valeAlimentacao?.valor}
                  onChange={e => handleBeneficioChange('valeAlimentacao', 'valor', handleValorChange(e.target.value))}
                  placeholder="R$ 0,00"
                  mask={masks.currency}
                  aria-label="Valor do Vale Alimentação"
                  isInvalid={!!errors['valeAlimentacao.valor']}
                />
                <FormErrorMessage>{errors['valeAlimentacao.valor']}</FormErrorMessage>
              </Box>
            )}
          </FormControl>

          <FormControl>
            <HStack justify="space-between" align="center">
              <FormLabel mb={0}>Vale Refeição</FormLabel>
              <Switch
                isChecked={formData.valeRefeicao?.ativo}
                onChange={e => handleBeneficioChange('valeRefeicao', 'ativo', e.target.checked)}
                aria-label="Ativar Vale Refeição"
              />
            </HStack>
            {formData.valeRefeicao?.ativo && (
              <Box mt={2}>
                <MaskedInput
                  value={formData.valeRefeicao?.valor}
                  onChange={e => handleBeneficioChange('valeRefeicao', 'valor', handleValorChange(e.target.value))}
                  placeholder="R$ 0,00"
                  mask={masks.currency}
                  aria-label="Valor do Vale Refeição"
                  isInvalid={!!errors['valeRefeicao.valor']}
                />
                <FormErrorMessage>{errors['valeRefeicao.valor']}</FormErrorMessage>
              </Box>
            )}
          </FormControl>

          <FormControl>
            <HStack justify="space-between" align="center">
              <FormLabel mb={0}>Plano de Saúde</FormLabel>
              <Switch
                isChecked={formData.planoSaude?.ativo}
                onChange={e => handleBeneficioChange('planoSaude', 'ativo', e.target.checked)}
                aria-label="Ativar Plano de Saúde"
              />
            </HStack>
            {formData.planoSaude?.ativo && (
              <Box mt={2}>
                <MaskedInput
                  value={formData.planoSaude?.valor}
                  onChange={e => handleBeneficioChange('planoSaude', 'valor', handleValorChange(e.target.value))}
                  placeholder="R$ 0,00"
                  mask={masks.currency}
                  aria-label="Valor do Plano de Saúde"
                  isInvalid={!!errors['planoSaude.valor']}
                />
                <FormErrorMessage>{errors['planoSaude.valor']}</FormErrorMessage>
              </Box>
            )}
          </FormControl>

          <FormControl>
            <HStack justify="space-between" align="center">
              <FormLabel mb={0}>Plano Odontológico</FormLabel>
              <Switch
                isChecked={formData.planoOdontologico?.ativo}
                onChange={e => handleBeneficioChange('planoOdontologico', 'ativo', e.target.checked)}
                aria-label="Ativar Plano Odontológico"
              />
            </HStack>
            {formData.planoOdontologico?.ativo && (
              <Box mt={2}>
                <MaskedInput
                  value={formData.planoOdontologico?.valor}
                  onChange={e => handleBeneficioChange('planoOdontologico', 'valor', handleValorChange(e.target.value))}
                  placeholder="R$ 0,00"
                  mask={masks.currency}
                  aria-label="Valor do Plano Odontológico"
                  isInvalid={!!errors['planoOdontologico.valor']}
                />
                <FormErrorMessage>{errors['planoOdontologico.valor']}</FormErrorMessage>
              </Box>
            )}
          </FormControl>
        </VStack>

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