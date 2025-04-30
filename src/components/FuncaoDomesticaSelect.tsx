'use client';

import { Select, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FuncaoDomestica } from '@/types/esocial';
import { FuncaoDomesticaService } from '@/services/funcaoDomesticaService';
import { useAppNotifications } from '@/hooks/useAppNotifications';

interface FuncaoDomesticaSelectProps {
  value?: string;
  onChange: (value: string) => void;
  isInvalid?: boolean;
  errorMessage?: string;
  placeholder?: string;
}

export function FuncaoDomesticaSelect({
  value,
  onChange,
  isInvalid,
  errorMessage,
  placeholder = 'Selecione uma função'
}: FuncaoDomesticaSelectProps) {
  const [funcoes, setFuncoes] = useState<FuncaoDomestica[]>([]);
  const [loading, setLoading] = useState(true);
  const notifications = useAppNotifications();

  useEffect(() => {
    async function carregarFuncoes() {
      try {
        const funcoesData = await FuncaoDomesticaService.listarFuncoes();
        setFuncoes(funcoesData);
      } catch (error) {
        notifications.showError(
          'Erro ao carregar funções',
          'Não foi possível carregar a lista de funções domésticas. Tente novamente mais tarde.',
          { persistent: true } // Salva no histórico de notificações
        );
      } finally {
        setLoading(false);
      }
    }

    carregarFuncoes();
  }, [notifications]);

  return (
    <FormControl isInvalid={isInvalid}>
      <FormLabel>Função Doméstica</FormLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        isDisabled={loading}
        aria-label="Selecione uma função doméstica"
      >
        {funcoes.map((funcao) => (
          <option key={funcao.id} value={funcao.id}>
            {funcao.nome} - {funcao.codigo}
          </option>
        ))}
      </Select>
      {errorMessage && <FormErrorMessage>{errorMessage}</FormErrorMessage>}
    </FormControl>
  );
} 