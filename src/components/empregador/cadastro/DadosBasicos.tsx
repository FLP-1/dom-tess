import { Box, VStack, Button, HStack, Text } from '@chakra-ui/react';
import { IEmpregador } from '@/types/empregador';
import { Input } from '@/components/common/Input';
import { SelectField } from '@/components/common/SelectField';
import { MaskedInput } from '@/components/common/MaskedInput';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { validarCNPJ, validarCPF, validarEmail, validarTelefone } from '@/utils/validators';

interface DadosBasicosProps {
  empregador: IEmpregador;
  onChange: (field: keyof IEmpregador, value: any) => void;
  onNext: () => void;
}

export function DadosBasicos({ empregador, onChange, onNext }: DadosBasicosProps) {
  const handleChange = (field: keyof IEmpregador, value: any) => {
    onChange(field, value);
    
    // Validações automáticas
    if (field === 'cnpj' && value) {
      const isValid = validarCNPJ(value);
      onChange('validacoes', {
        ...empregador.validacoes,
        documento: isValid
      });
    } else if (field === 'cpf' && value) {
      const isValid = validarCPF(value);
      onChange('validacoes', {
        ...empregador.validacoes,
        documento: isValid
      });
    } else if (field === 'email' && value) {
      const isValid = validarEmail(value);
      onChange('validacoes', {
        ...empregador.validacoes,
        email: isValid
      });
    } else if (field === 'telefone' && value) {
      const isValid = validarTelefone(value);
      onChange('validacoes', {
        ...empregador.validacoes,
        telefone: isValid
      });
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <Input
        label="Nome"
        value={empregador.nome}
        onChange={(e) => handleChange('nome', e.target.value)}
      />

      <SelectField
        label="Tipo"
        value={empregador.tipo}
        onChange={(value) => handleChange('tipo', value)}
        options={[
          { value: 'PF', label: 'Pessoa Física' },
          { value: 'PJ', label: 'Pessoa Jurídica' }
        ]}
      />

      {empregador.tipo === 'PF' ? (
        <Box>
          <MaskedInput
            label="CPF"
            value={empregador.cpf}
            onChange={(value) => handleChange('cpf', value)}
            mask="cpf"
          />
          <HStack mt={2}>
            {empregador.validacoes.documento ? (
              <FaCheck color="green" />
            ) : (
              <FaTimes color="red" />
            )}
            <Text fontSize="sm" color={empregador.validacoes.documento ? "green.500" : "red.500"}>
              {empregador.validacoes.documento ? "CPF válido" : "CPF inválido"}
            </Text>
          </HStack>
        </Box>
      ) : (
        <Box>
          <MaskedInput
            label="CNPJ"
            value={empregador.cnpj}
            onChange={(value) => handleChange('cnpj', value)}
            mask="cnpj"
          />
          <HStack mt={2}>
            {empregador.validacoes.documento ? (
              <FaCheck color="green" />
            ) : (
              <FaTimes color="red" />
            )}
            <Text fontSize="sm" color={empregador.validacoes.documento ? "green.500" : "red.500"}>
              {empregador.validacoes.documento ? "CNPJ válido" : "CNPJ inválido"}
            </Text>
          </HStack>
        </Box>
      )}

      <Box>
        <Input
          label="Email"
          value={empregador.email}
          onChange={(e) => handleChange('email', e.target.value)}
        />
        <HStack mt={2}>
          {empregador.validacoes.email ? (
            <FaCheck color="green" />
          ) : (
            <FaTimes color="red" />
          )}
          <Text fontSize="sm" color={empregador.validacoes.email ? "green.500" : "red.500"}>
            {empregador.validacoes.email ? "Email válido" : "Email inválido"}
          </Text>
        </HStack>
      </Box>

      <Box>
        <MaskedInput
          label="Telefone"
          value={empregador.telefone}
          onChange={(value) => handleChange('telefone', value)}
          mask="phone"
        />
        <HStack mt={2}>
          {empregador.validacoes.telefone ? (
            <FaCheck color="green" />
          ) : (
            <FaTimes color="red" />
          )}
          <Text fontSize="sm" color={empregador.validacoes.telefone ? "green.500" : "red.500"}>
            {empregador.validacoes.telefone ? "Telefone válido" : "Telefone inválido"}
          </Text>
        </HStack>
      </Box>

      <Button onClick={onNext}>
        Próximo
      </Button>
    </VStack>
  );
} 