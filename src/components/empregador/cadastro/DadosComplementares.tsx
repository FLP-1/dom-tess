import { Box, VStack, Button, HStack } from '@chakra-ui/react';
import { IEmpregador } from '@/types/empregador';
import { Input } from '@/components/common/Input';
import { MaskedInput } from '@/components/common/MaskedInput';
import { SelectField } from '@/components/common/SelectField';

interface DadosComplementaresProps {
  empregador: IEmpregador;
  onChange: (field: keyof IEmpregador, value: any) => void;
  onBack: () => void;
  onSave: () => void;
}

export function DadosComplementares({ 
  empregador, 
  onChange, 
  onBack, 
  onSave 
}: DadosComplementaresProps) {
  const buscarEnderecoPorCEP = async (cep: string) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        onChange('endereco', {
          ...empregador.endereco,
          logradouro: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf
        });
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <Box>
        <MaskedInput
          label="CEP"
          value={empregador.endereco.cep}
          onChange={(value) => onChange('endereco', {
            ...empregador.endereco,
            cep: value
          })}
          onBlur={() => buscarEnderecoPorCEP(empregador.endereco.cep)}
          mask="zipcode"
        />
      </Box>

      <Input
        label="Logradouro"
        value={empregador.endereco.logradouro}
        onChange={(e) => onChange('endereco', {
          ...empregador.endereco,
          logradouro: e.target.value
        })}
      />

      <Input
        label="Número"
        value={empregador.endereco.numero}
        onChange={(e) => onChange('endereco', {
          ...empregador.endereco,
          numero: e.target.value
        })}
      />

      <Input
        label="Complemento"
        value={empregador.endereco.complemento}
        onChange={(e) => onChange('endereco', {
          ...empregador.endereco,
          complemento: e.target.value
        })}
      />

      <Input
        label="Bairro"
        value={empregador.endereco.bairro}
        onChange={(e) => onChange('endereco', {
          ...empregador.endereco,
          bairro: e.target.value
        })}
      />

      <Input
        label="Cidade"
        value={empregador.endereco.cidade}
        onChange={(e) => onChange('endereco', {
          ...empregador.endereco,
          cidade: e.target.value
        })}
      />

      <Input
        label="Estado"
        value={empregador.endereco.estado}
        onChange={(e) => onChange('endereco', {
          ...empregador.endereco,
          estado: e.target.value
        })}
      />

      <HStack spacing={4}>
        <Button onClick={onBack}>
          Voltar
        </Button>
        <Button onClick={onSave}>
          Salvar
        </Button>
      </HStack>
    </VStack>
  );
} 