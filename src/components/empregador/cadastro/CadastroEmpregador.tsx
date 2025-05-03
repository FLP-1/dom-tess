import { useState } from 'react';
import { Box, VStack, Button, Text } from '@chakra-ui/react';
import { IEmpregador } from '@/types/empregador';
import { DadosBasicos } from './DadosBasicos';
import { DadosComplementares } from './DadosComplementares';

export function CadastroEmpregador() {
  const [step, setStep] = useState(1);
  const [empregador, setEmpregador] = useState<IEmpregador>({
    nome: '',
    tipo: 'PF',
    cpf: '',
    cnpj: '',
    email: '',
    telefone: '',
    validacoes: {
      email: false,
      telefone: false,
      documento: false
    },
    endereco: {
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: ''
    },
    documentos: [],
    contaBancaria: undefined,
    imovel: undefined,
    status: 'INCOMPLETO'
  });

  const handleChange = (field: keyof IEmpregador, value: any) => {
    setEmpregador(prev => ({
      ...prev,
      [field]: value,
      validacoes: {
        ...prev.validacoes,
        [field]: false
      }
    }));
  };

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Cadastro de Empregador
      </Text>

      {step === 1 && (
        <DadosBasicos
          empregador={empregador}
          onChange={handleChange}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <DadosComplementares
          empregador={empregador}
          onChange={handleChange}
          onBack={() => setStep(1)}
          onSave={() => {
            // Lógica para salvar
            console.log(empregador);
          }}
        />
      )}
    </Box>
  );
} 