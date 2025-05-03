import { FormControl, FormLabel } from '@chakra-ui/react';
'use client';

import { HStack, Icon, FormControl, FormLabel } from '@chakra-ui/react';
import { SelectCustom } from './SelectCustom';
import { FaFilter } from 'react-icons/fa';

interface FiltrosRegistroProps {
  periodo: string;
  tipo: string;
  onPeriodoChange: (value: string) => void;
  onTipoChange: (value: string) => void;
}

export function FiltrosRegistro({ periodo, tipo, onPeriodoChange, onTipoChange }: FiltrosRegistroProps) {
  const periodos = [
    { value: 'hoje', label: 'Hoje' },
    { value: 'semana', label: 'Esta Semana' },
    { value: 'mes', label: 'Este Mês' },
    { value: 'todos', label: 'Todos' }
  ];

  const tipos = [
    { value: 'todos', label: 'Todos' },
    { value: 'entrada', label: 'Entrada' },
    { value: 'saida', label: 'Saída' },
    { value: 'intervalo', label: 'Intervalo' }
  ];

  return (
    <HStack spacing={4} align="center">
      <Icon as={FaFilter} />
      <FormControl>
        <FormLabel htmlFor="periodo">Período</FormLabel>
        <SelectCustom
          value={periodo}
          onChange={(e) => onPeriodoChange(e.target.value)}
          options={periodos}
          placeholder="Selecione o período"
          width="200px"
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="tipo">Tipo</FormLabel>
        <SelectCustom
          value={tipo}
          onChange={(e) => onTipoChange(e.target.value)}
          options={tipos}
          placeholder="Selecione o tipo de registro"
          width="200px"
        />
      </FormControl>
    </HStack>
  );
} 