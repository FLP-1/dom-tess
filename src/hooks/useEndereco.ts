import { useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { CEPService } from '@/services/cepService';

export interface Endereco {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  pais?: string;
}

interface UseEnderecoProps {
  enderecoInicial?: Partial<Endereco>;
  onEnderecoChange?: (endereco: Partial<Endereco>) => void;
}

interface UseEnderecoReturn {
  endereco: Partial<Endereco>;
  errors: Record<string, string>;
  loading: boolean;
  handleChange: (field: keyof Endereco, value: string) => void;
  buscarCEP: (cep: string) => Promise<void>;
  validateEndereco: () => boolean;
}

export function useEndereco({ enderecoInicial = {}, onEnderecoChange }: UseEnderecoProps = {}): UseEnderecoReturn {
  const [endereco, setEndereco] = useState<Partial<Endereco>>({
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    pais: 'Brasil',
    ...enderecoInicial,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleChange = useCallback((field: keyof Endereco, value: string) => {
    const novoEndereco = {
      ...endereco,
      [field]: value,
    };
    
    setEndereco(novoEndereco);
    onEnderecoChange?.(novoEndereco);

    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [endereco, errors, onEnderecoChange]);

  const buscarCEP = useCallback(async (cep: string) => {
    const cepFormatado = CEPService.formatarCEP(cep);
    handleChange('cep', cepFormatado);

    if (cepFormatado.length === 9) { // 00000-000
      try {
        setLoading(true);
        const enderecoViaCEP = await CEPService.buscarEnderecoComRetry(cepFormatado);
        
        const novoEndereco = {
          ...endereco,
          cep: cepFormatado,
          logradouro: enderecoViaCEP.logradouro,
          bairro: enderecoViaCEP.bairro,
          cidade: enderecoViaCEP.localidade,
          uf: enderecoViaCEP.uf,
          complemento: enderecoViaCEP.complemento || endereco.complemento,
        };

        setEndereco(novoEndereco);
        onEnderecoChange?.(novoEndereco);

        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.logradouro;
          delete newErrors.bairro;
          delete newErrors.cidade;
          delete newErrors.uf;
          return newErrors;
        });

        toast({
          title: 'Endereço encontrado',
          description: 'Os dados foram preenchidos automaticamente',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Tente novamente mais tarde';
        
        toast({
          title: 'Erro ao buscar CEP',
          description: errorMessage,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });

        setErrors(prev => ({
          ...prev,
          cep: errorMessage,
        }));
      } finally {
        setLoading(false);
      }
    }
  }, [endereco, handleChange, onEnderecoChange, toast]);

  const validateEndereco = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!endereco.cep) {
      newErrors.cep = 'CEP é obrigatório';
    } else if (!CEPService.validarFormatoCEP(endereco.cep)) {
      newErrors.cep = 'Formato de CEP inválido';
    }

    if (!endereco.logradouro) {
      newErrors.logradouro = 'Logradouro é obrigatório';
    }

    if (!endereco.numero) {
      newErrors.numero = 'Número é obrigatório';
    }

    if (!endereco.bairro) {
      newErrors.bairro = 'Bairro é obrigatório';
    }

    if (!endereco.cidade) {
      newErrors.cidade = 'Cidade é obrigatória';
    }

    if (!endereco.uf) {
      newErrors.uf = 'UF é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [endereco]);

  return {
    endereco,
    errors,
    loading,
    handleChange,
    buscarCEP,
    validateEndereco,
  };
} 