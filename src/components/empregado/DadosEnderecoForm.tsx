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
import { CEPService } from '@/services/cepService';

interface DadosEnderecoFormProps {
  initialData?: Partial<DadosEmpregado>;
  onSubmit: (data: Partial<DadosEmpregado>) => void;
  onBack?: () => void;
  onSaveDraft?: () => void;
}

const ESTADOS = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' }
];

export function DadosEnderecoForm({
  initialData,
  onSubmit,
  onBack,
  onSaveDraft,
}: DadosEnderecoFormProps) {
  const [formData, setFormData] = useState<Partial<DadosEmpregado>>({
    cep: initialData?.cep || '',
    logradouro: initialData?.logradouro || '',
    numero: initialData?.numero || '',
    complemento: initialData?.complemento || '',
    bairro: initialData?.bairro || '',
    cidade: initialData?.cidade || '',
    uf: initialData?.uf || '',
    pais: initialData?.pais || 'Brasil',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cep) {
      newErrors.cep = 'CEP é obrigatório';
    }

    if (!formData.logradouro) {
      newErrors.logradouro = 'Logradouro é obrigatório';
    }

    if (!formData.numero) {
      newErrors.numero = 'Número é obrigatório';
    }

    if (!formData.bairro) {
      newErrors.bairro = 'Bairro é obrigatório';
    }

    if (!formData.cidade) {
      newErrors.cidade = 'Cidade é obrigatória';
    }

    if (!formData.uf) {
      newErrors.uf = 'UF é obrigatória';
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

    // Limpa o erro do campo quando ele é alterado
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const buscarCEP = async (cep: string) => {
    const cepFormatado = CEPService.formatarCEP(cep);
    handleChange('cep', cepFormatado);

    if (cepFormatado.length === 9) { // 00000-000
      try {
        setLoading(true);
        const endereco = await CEPService.buscarEndereco(cepFormatado);
        
        setFormData(prev => ({
          ...prev,
          cep: cepFormatado,
          logradouro: endereco.logradouro,
          bairro: endereco.bairro,
          cidade: endereco.localidade,
          uf: endereco.uf,
          complemento: endereco.complemento || prev.complemento,
        }));

        // Limpa os erros dos campos preenchidos automaticamente
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.logradouro;
          delete newErrors.bairro;
          delete newErrors.cidade;
          delete newErrors.uf;
          return newErrors;
        });

      } catch (error) {
        toast({
          title: 'Erro ao buscar CEP',
          description: error instanceof Error ? error.message : 'Tente novamente mais tarde',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <FormControl isInvalid={!!errors.cep}>
          <FormLabel>CEP</FormLabel>
          <Input
            value={formData.cep}
            onChange={e => buscarCEP(e.target.value)}
            placeholder="00000-000"
            maxLength={9}
            isDisabled={loading}
          />
          <FormErrorMessage>{errors.cep}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.logradouro}>
          <FormLabel>Logradouro</FormLabel>
          <Input
            value={formData.logradouro}
            onChange={e => handleChange('logradouro', e.target.value)}
            placeholder="Digite o logradouro"
            isDisabled={loading}
          />
          <FormErrorMessage>{errors.logradouro}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.numero}>
          <FormLabel>Número</FormLabel>
          <Input
            value={formData.numero}
            onChange={e => handleChange('numero', e.target.value)}
            placeholder="Digite o número"
          />
          <FormErrorMessage>{errors.numero}</FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel>Complemento</FormLabel>
          <Input
            value={formData.complemento}
            onChange={e => handleChange('complemento', e.target.value)}
            placeholder="Digite o complemento"
          />
        </FormControl>

        <FormControl isInvalid={!!errors.bairro}>
          <FormLabel>Bairro</FormLabel>
          <Input
            value={formData.bairro}
            onChange={e => handleChange('bairro', e.target.value)}
            placeholder="Digite o bairro"
            isDisabled={loading}
          />
          <FormErrorMessage>{errors.bairro}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.cidade}>
          <FormLabel>Cidade</FormLabel>
          <Input
            value={formData.cidade}
            onChange={e => handleChange('cidade', e.target.value)}
            placeholder="Digite a cidade"
            isDisabled={loading}
          />
          <FormErrorMessage>{errors.cidade}</FormErrorMessage>
        </FormControl>

        <SelectField
          label="UF"
          name="uf"
          value={formData.uf || ''}
          onChange={(value) => handleChange('uf', value)}
          options={ESTADOS}
          placeholder="Selecione o estado"
          error={errors.uf}
          isRequired
          isDisabled={loading}
        />

        <FormControl>
          <FormLabel>País</FormLabel>
          <Input
            value={formData.pais}
            onChange={e => handleChange('pais', e.target.value)}
            placeholder="Digite o país"
          />
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