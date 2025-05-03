import { FormControl, FormLabel, FormErrorMessage, FormHelperText } from '@chakra-ui/react';
'use client';

import React, { useEffect, useState } from 'react';
import { Parentesco } from '@/types/esocial';
import { ParentescoService } from '@/services/parentescoService';
import { SelectCustom } from './SelectCustom';

interface ParentescoSelectProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  isRequired?: boolean;
  label?: string;
  helperText?: string;
  isInvalid?: boolean;
}

export function ParentescoSelect({
  value,
  onChange,
  error,
  isRequired = false,
  label = 'Parentesco',
  helperText,
  isInvalid
}: ParentescoSelectProps) {
  const [parentescos, setParentescos] = useState<Parentesco[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadParentescos() {
      try {
        setLoading(true);
        const response = await ParentescoService.getAll();
        setParentescos(response);
      } catch (error) {
        console.error('Erro ao carregar parentescos:', error);
      } finally {
        setLoading(false);
      }
    }

    loadParentescos();
  }, []);

  const parentescosPorCategoria = parentescos.reduce<Record<string, Parentesco[]>>((acc, parentesco) => {
    if (!acc[parentesco.categoria]) {
      acc[parentesco.categoria] = [];
    }
    acc[parentesco.categoria].push(parentesco);
    return acc;
  }, {});

  const options = Object.entries(parentescosPorCategoria).flatMap(([categoria, parentescos]) => [
    ...parentescos.map(parentesco => ({
      value: parentesco.codigo,
      label: parentesco.descricao,
      group: categoria
    }))
  ]);

  return (
    <FormControl isInvalid={isInvalid}>
      <FormLabel>{label}</FormLabel>
      <SelectCustom
        value={value}
        onChange={onChange}
        options={options}
        isRequired={isRequired}
        isDisabled={loading}
        isInvalid={isInvalid}
        placeholder="Selecione o parentesco"
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
} 