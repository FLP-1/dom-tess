'use client';

import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FuncaoDomestica } from '@/types/esocial';
import { FuncaoDomesticaService } from '@/services/funcaoDomesticaService';
import { useAppNotifications } from '@/hooks/useAppNotifications';
import { SelectCustom } from './common/SelectCustom';

interface FuncaoDomesticaSelectProps {
  value?: string;
  onChange: (value: string) => void;
  isInvalid?: boolean;
  errorMessage?: string;
  placeholder?: string;
  label?: string;
}

export function FuncaoDomesticaSelect({
  value,
  onChange,
  isInvalid,
  errorMessage,
  placeholder = 'Selecione a função',
  label = 'Função Doméstica'
}: FuncaoDomesticaSelectProps) {
  const [funcoes, setFuncoes] = useState<FuncaoDomestica[]>([]);
  const [loading, setLoading] = useState(false);
  const { showError } = useAppNotifications();

  useEffect(() => {
    async function loadFuncoes() {
      try {
        setLoading(true);
        const response = await FuncaoDomesticaService.getAll();
        setFuncoes(response);
      } catch (error) {
        showError('Erro ao carregar funções domésticas');
      } finally {
        setLoading(false);
      }
    }

    loadFuncoes();
  }, [showError]);

  const options = funcoes.map(funcao => ({
    value: funcao.codigo,
    label: funcao.descricao
  }));

  return (
    <FormControl isInvalid={isInvalid}>
      <FormLabel>{label}</FormLabel>
      <SelectCustom
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        isDisabled={loading}
        isInvalid={isInvalid}
      />
      {errorMessage && <FormErrorMessage>{errorMessage}</FormErrorMessage>}
    </FormControl>
  );
} 