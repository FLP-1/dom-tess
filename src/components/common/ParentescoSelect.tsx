'use client';

import React, { useEffect, useState } from 'react';
import {
  FormControl,
  FormLabel,
  Select,
  FormErrorMessage,
  FormHelperText,
  HStack,
  Text,
  Icon,
} from '@chakra-ui/react';
import { Parentesco } from '@/types/esocial';
import { ParentescoService } from '@/services/parentescoService';
import { FaUser, FaUserFriends, FaUserTie, FaUserGraduate } from 'react-icons/fa';

interface ParentescoSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  isRequired?: boolean;
  label?: string;
  helperText?: string;
}

const getIconByCategoria = (categoria: string) => {
  switch (categoria) {
    case 'DIRETO':
      return FaUser;
    case 'CASAMENTO':
      return FaUserTie;
    case 'COLATERAL':
      return FaUserFriends;
    default:
      return FaUserGraduate;
  }
};

export function ParentescoSelect({
  value,
  onChange,
  error,
  isRequired = false,
  label = 'Parentesco',
  helperText,
}: ParentescoSelectProps) {
  const [parentescos, setParentescos] = useState<Parentesco[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarParentescos = async () => {
      try {
        const dados = await ParentescoService.listarParentescos();
        setParentescos(dados);
      } catch (err) {
        console.error('Erro ao carregar parentescos:', err);
      } finally {
        setLoading(false);
      }
    };

    carregarParentescos();
  }, []);

  const parentescosPorCategoria = parentescos.reduce((acc, parentesco) => {
    if (!acc[parentesco.categoria]) {
      acc[parentesco.categoria] = [];
    }
    acc[parentesco.categoria].push(parentesco);
    return acc;
  }, {} as Record<string, Parentesco[]>);

  return (
    <FormControl isInvalid={!!error} isRequired={isRequired}>
      <FormLabel>{label}</FormLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Selecione o parentesco"
        isDisabled={loading}
      >
        {Object.entries(parentescosPorCategoria).map(([categoria, parentescos]) => (
          <optgroup key={categoria} label={categoria}>
            {parentescos.map((parentesco) => (
              <option key={parentesco.id} value={parentesco.codigo}>
                <HStack>
                  <Icon as={getIconByCategoria(parentesco.categoria)} />
                  <Text>{parentesco.descricao}</Text>
                </HStack>
              </option>
            ))}
          </optgroup>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
} 