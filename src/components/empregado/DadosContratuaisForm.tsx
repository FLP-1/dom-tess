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
import { SelectField } from '@/components/common/SelectField';
import { MaskedInput, masks } from '@/components/common/MaskedInput';
import { formatCurrency } from '@/utils/currency';

interface DadosContratuaisFormProps {
  initialData?: Partial<DadosEmpregado>;
  onSubmit: (data: Partial<DadosEmpregado>) => void;
  onBack?: () => void;
  onSaveDraft?: () => void;
}

const TIPO_CONTRATO_OPTIONS = [
  { value: 'INDETERMINADO', label: 'Indeterminado' },
  { value: 'DETERMINADO', label: 'Determinado' },
  { value: 'EXPERIENCIA', label: 'Experiência' },
];

const CARGO_OPTIONS = [
  { value: 'EMPREGADO_DOMESTICO', label: 'Empregado Doméstico' },
  { value: 'CUIDADOR_IDOSOS', label: 'Cuidador de Idosos' },
  { value: 'BABA', label: 'Babá' },
  { value: 'COZINHEIRO', label: 'Cozinheiro(a)' },
  { value: 'FAXINEIRO', label: 'Faxineiro(a)' },
  { value: 'MOTORISTA', label: 'Motorista' },
  { value: 'JARDINEIRO', label: 'Jardineiro(a)' },
];

const JORNADA_OPTIONS = [
  { value: 'INTEGRAL', label: 'Integral (44h semanais)' },
  { value: 'PARCIAL', label: 'Parcial (até 25h semanais)' },
];

export function DadosContratuaisForm({
  initialData,
  onSubmit,
  onBack,
  onSaveDraft,
}: DadosContratuaisFormProps) {
  const [formData, setFormData] = useState<Partial<DadosEmpregado>>({
    tipoContrato: initialData?.tipoContrato || '',
    dataAdmissao: initialData?.dataAdmissao || '',
    dataTermino: initialData?.dataTermino || '',
    cargo: initialData?.cargo || '',
    salarioBase: initialData?.salarioBase || '',
    tipoJornada: initialData?.tipoJornada || '',
    horaEntrada: initialData?.horaEntrada || '',
    horaSaida: initialData?.horaSaida || '',
    intervaloInicio: initialData?.intervaloInicio || '',
    intervaloFim: initialData?.intervaloFim || '',
    folgas: initialData?.folgas || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const toast = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.tipoContrato) {
      newErrors.tipoContrato = 'Tipo de contrato é obrigatório';
    }

    if (!formData.dataAdmissao) {
      newErrors.dataAdmissao = 'Data de admissão é obrigatória';
    }

    if (formData.tipoContrato !== 'INDETERMINADO' && !formData.dataTermino) {
      newErrors.dataTermino = 'Data de término é obrigatória para este tipo de contrato';
    }

    if (!formData.cargo) {
      newErrors.cargo = 'Cargo é obrigatório';
    }

    if (!formData.salarioBase) {
      newErrors.salarioBase = 'Salário base é obrigatório';
    } else {
      const salarioNumerico = parseFloat(formData.salarioBase.replace(/[^\d,]/g, '').replace(',', '.'));
      if (isNaN(salarioNumerico) || salarioNumerico < 0) {
        newErrors.salarioBase = 'Salário base inválido';
      }
    }

    if (!formData.tipoJornada) {
      newErrors.tipoJornada = 'Tipo de jornada é obrigatório';
    }

    if (!formData.horaEntrada) {
      newErrors.horaEntrada = 'Hora de entrada é obrigatória';
    }

    if (!formData.horaSaida) {
      newErrors.horaSaida = 'Hora de saída é obrigatória';
    }

    if (!formData.intervaloInicio) {
      newErrors.intervaloInicio = 'Início do intervalo é obrigatório';
    }

    if (!formData.intervaloFim) {
      newErrors.intervaloFim = 'Fim do intervalo é obrigatório';
    }

    if (!formData.folgas || formData.folgas.length === 0) {
      newErrors.folgas = 'Pelo menos um dia de folga é obrigatório';
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

  const handleChange = (field: string, value: string | string[]) => {
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

  const handleSalarioChange = (value: string) => {
    const formattedValue = formatCurrency(value);
    handleChange('salarioBase', formattedValue);
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <SelectField
          label="Tipo de Contrato"
          name="tipoContrato"
          value={formData.tipoContrato || ''}
          onChange={(value) => handleChange('tipoContrato', value)}
          options={TIPO_CONTRATO_OPTIONS}
          placeholder="Selecione o tipo de contrato"
          error={errors.tipoContrato}
          isRequired
          aria-label="Tipo de Contrato"
        />

        <FormControl isInvalid={!!errors.dataAdmissao}>
          <FormLabel>Data de Admissão</FormLabel>
          <Input
            type="date"
            value={formData.dataAdmissao}
            onChange={e => handleChange('dataAdmissao', e.target.value)}
            aria-label="Data de Admissão"
          />
          <FormErrorMessage>{errors.dataAdmissao}</FormErrorMessage>
        </FormControl>

        {formData.tipoContrato !== 'INDETERMINADO' && (
          <FormControl isInvalid={!!errors.dataTermino}>
            <FormLabel>Data de Término</FormLabel>
            <Input
              type="date"
              value={formData.dataTermino}
              onChange={e => handleChange('dataTermino', e.target.value)}
              aria-label="Data de Término"
            />
            <FormErrorMessage>{errors.dataTermino}</FormErrorMessage>
          </FormControl>
        )}

        <SelectField
          label="Cargo"
          name="cargo"
          value={formData.cargo || ''}
          onChange={(value) => handleChange('cargo', value)}
          options={CARGO_OPTIONS}
          placeholder="Selecione o cargo"
          error={errors.cargo}
          isRequired
          aria-label="Cargo"
        />

        <FormControl isInvalid={!!errors.salarioBase}>
          <FormLabel>Salário Base</FormLabel>
          <MaskedInput
            value={formData.salarioBase}
            onChange={e => handleSalarioChange(e.target.value)}
            placeholder="R$ 0,00"
            mask={masks.currency}
            aria-label="Salário Base"
          />
          <FormErrorMessage>{errors.salarioBase}</FormErrorMessage>
        </FormControl>

        <SelectField
          label="Tipo de Jornada"
          name="tipoJornada"
          value={formData.tipoJornada || ''}
          onChange={(value) => handleChange('tipoJornada', value)}
          options={JORNADA_OPTIONS}
          placeholder="Selecione o tipo de jornada"
          error={errors.tipoJornada}
          isRequired
          aria-label="Tipo de Jornada"
        />

        <FormControl isInvalid={!!errors.horaEntrada}>
          <FormLabel>Hora de Entrada</FormLabel>
          <Input
            type="time"
            value={formData.horaEntrada}
            onChange={e => handleChange('horaEntrada', e.target.value)}
            aria-label="Hora de Entrada"
          />
          <FormErrorMessage>{errors.horaEntrada}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.horaSaida}>
          <FormLabel>Hora de Saída</FormLabel>
          <Input
            type="time"
            value={formData.horaSaida}
            onChange={e => handleChange('horaSaida', e.target.value)}
            aria-label="Hora de Saída"
          />
          <FormErrorMessage>{errors.horaSaida}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.intervaloInicio}>
          <FormLabel>Início do Intervalo</FormLabel>
          <Input
            type="time"
            value={formData.intervaloInicio}
            onChange={e => handleChange('intervaloInicio', e.target.value)}
            aria-label="Início do Intervalo"
          />
          <FormErrorMessage>{errors.intervaloInicio}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.intervaloFim}>
          <FormLabel>Fim do Intervalo</FormLabel>
          <Input
            type="time"
            value={formData.intervaloFim}
            onChange={e => handleChange('intervaloFim', e.target.value)}
            aria-label="Fim do Intervalo"
          />
          <FormErrorMessage>{errors.intervaloFim}</FormErrorMessage>
        </FormControl>

        <SelectField
          label="Dias de Folga"
          name="folgas"
          value={formData.folgas || []}
          onChange={(value) => handleChange('folgas', value.split(','))}
          options={[
            { value: 'DOMINGO', label: 'Domingo' },
            { value: 'SEGUNDA', label: 'Segunda-feira' },
            { value: 'TERCA', label: 'Terça-feira' },
            { value: 'QUARTA', label: 'Quarta-feira' },
            { value: 'QUINTA', label: 'Quinta-feira' },
            { value: 'SEXTA', label: 'Sexta-feira' },
            { value: 'SABADO', label: 'Sábado' },
          ]}
          placeholder="Selecione os dias de folga"
          error={errors.folgas}
          isRequired
          isMulti
          aria-label="Dias de Folga"
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