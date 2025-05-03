import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

interface Cidade {
  nome: string;
  uf: string;
}

export function useCidades(uf: string) {
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    const buscarCidades = async () => {
      if (!uf) {
        setCidades([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
        
        if (!response.ok) {
          throw new Error('Erro ao buscar cidades');
        }

        const data = await response.json();
        const cidadesFormatadas = data.map((cidade: any) => ({
          nome: cidade.nome,
          uf: cidade.microrregiao.mesorregiao.UF.sigla
        }));

        setCidades(cidadesFormatadas);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar cidades';
        setError(errorMessage);
        toast({
          title: 'Erro',
          description: errorMessage,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    buscarCidades();
  }, [uf, toast, setCidades, setLoading, setError]);

  const filtrarCidades = (termo: string) => {
    if (!termo) return cidades;
    return cidades.filter(cidade => 
      cidade.nome.toLowerCase().includes(termo.toLowerCase())
    );
  };

  return {
    cidades,
    loading,
    error,
    filtrarCidades
  };
} 