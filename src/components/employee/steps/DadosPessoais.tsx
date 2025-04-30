import {
  FormControl,
  FormLabel,
  Input,
  VStack,
  Select,
  FormErrorMessage,
} from '@chakra-ui/react';
import { DadosEmpregado } from '@/types/esocial';
import { formatCPF, validateCPF } from '@/utils/cpf';
import { useState } from 'react';

interface DadosPessoaisProps {
  data: DadosEmpregado;
  onChange: (data: Partial<DadosEmpregado>) => void;
}

export function DadosPessoais({ data, onChange }: DadosPessoaisProps) {
  const [errors, setErrors] = useState({
    cpf: '',
    nome: '',
    dataNascimento: '',
  });

  const handleCPFChange = (value: string) => {
    const formattedCPF = formatCPF(value);
    onChange({ cpf: formattedCPF });

    if (!validateCPF(formattedCPF.replace(/\D/g, ''))) {
      setErrors(prev => ({ ...prev, cpf: 'CPF inválido' }));
    } else {
      setErrors(prev => ({ ...prev, cpf: '' }));
    }
  };

  const handleNomeChange = (value: string) => {
    onChange({ nome: value });
    
    if (value.trim().length < 3) {
      setErrors(prev => ({ ...prev, nome: 'Nome deve ter pelo menos 3 caracteres' }));
    } else {
      setErrors(prev => ({ ...prev, nome: '' }));
    }
  };

  const handleDataNascimentoChange = (value: string) => {
    const date = new Date(value);
    onChange({ dataNascimento: date });

    if (date > new Date()) {
      setErrors(prev => ({ ...prev, dataNascimento: 'Data não pode ser futura' }));
    } else {
      setErrors(prev => ({ ...prev, dataNascimento: '' }));
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <FormControl isRequired isInvalid={!!errors.nome}>
        <FormLabel>Nome Completo</FormLabel>
        <Input
          value={data.nome}
          onChange={(e) => handleNomeChange(e.target.value)}
          placeholder="Nome completo do empregado"
        />
        <FormErrorMessage>{errors.nome}</FormErrorMessage>
      </FormControl>

      <FormControl isRequired isInvalid={!!errors.cpf}>
        <FormLabel>CPF</FormLabel>
        <Input
          value={data.cpf}
          onChange={(e) => handleCPFChange(e.target.value)}
          placeholder="000.000.000-00"
          maxLength={14}
        />
        <FormErrorMessage>{errors.cpf}</FormErrorMessage>
      </FormControl>

      <FormControl isRequired isInvalid={!!errors.dataNascimento}>
        <FormLabel>Data de Nascimento</FormLabel>
        <Input
          type="date"
          value={data.dataNascimento.toISOString().split('T')[0]}
          onChange={(e) => handleDataNascimentoChange(e.target.value)}
        />
        <FormErrorMessage>{errors.dataNascimento}</FormErrorMessage>
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Nacionalidade</FormLabel>
        <Select
          value={data.nacionalidade}
          onChange={(e) => onChange({ nacionalidade: e.target.value })}
          aria-label="Selecione a nacionalidade"
        >
          <option value="Brasileira">Brasileira</option>
          <option value="Estrangeira">Estrangeira</option>
        </Select>
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Estado Civil</FormLabel>
        <Select
          value={data.estadoCivil}
          onChange={(e) => onChange({ estadoCivil: e.target.value })}
          aria-label="Selecione o estado civil"
        >
          <option value="">Selecione...</option>
          <option value="Solteiro(a)">Solteiro(a)</option>
          <option value="Casado(a)">Casado(a)</option>
          <option value="Divorciado(a)">Divorciado(a)</option>
          <option value="Viúvo(a)">Viúvo(a)</option>
          <option value="União Estável">União Estável</option>
        </Select>
      </FormControl>
    </VStack>
  );
} 