'use client';

import { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  VStack,
  HStack,
  FormErrorMessage,
  useToast,
  Text,
  Divider,
  Button,
  IconButton,
  Input,
} from '@chakra-ui/react';
import { DadosEmpregado } from '@/types/esocial';
import { MaskedInput, masks } from '@/components/common/MaskedInput';
import { SelectField } from '@/components/common/SelectField';
import { EnderecoForm } from '@/components/common/EnderecoForm';
import { ParentescoSelect } from '@/components/common/ParentescoSelect';
import { formatCPF, removeCPFFormatting, validateCPF } from '@/utils/cpf';
import { formatCurrency } from '@/utils/currency';
import { useRouter } from 'next/navigation';
import { FaPlus, FaTrash } from 'react-icons/fa';

interface FormularioEmpregadoProps {
  initialData?: Partial<DadosEmpregado>;
  onSubmit: (data: Partial<DadosEmpregado>) => void;
  onBack?: () => void;
  onSaveDraft?: () => void;
}

const ESTADO_CIVIL_OPTIONS = [
  { value: 'SOLTEIRO', label: 'Solteiro(a)' },
  { value: 'CASADO', label: 'Casado(a)' },
  { value: 'DIVORCIADO', label: 'Divorciado(a)' },
  { value: 'VIUVO', label: 'Viúvo(a)' },
  { value: 'UNIAO_ESTAVEL', label: 'União Estável' },
];

const GRAU_INSTRUCAO_OPTIONS = [
  { value: 'FUNDAMENTAL_INCOMPLETO', label: 'Fundamental Incompleto' },
  { value: 'FUNDAMENTAL_COMPLETO', label: 'Fundamental Completo' },
  { value: 'MEDIO_INCOMPLETO', label: 'Médio Incompleto' },
  { value: 'MEDIO_COMPLETO', label: 'Médio Completo' },
  { value: 'SUPERIOR_INCOMPLETO', label: 'Superior Incompleto' },
  { value: 'SUPERIOR_COMPLETO', label: 'Superior Completo' },
  { value: 'POS_GRADUACAO', label: 'Pós-graduação' },
];

const TIPO_CONTA_OPTIONS = [
  { value: 'CORRENTE', label: 'Conta Corrente' },
  { value: 'POUPANCA', label: 'Conta Poupança' },
];

interface Dependente {
  nome: string;
  cpf: string;
  dataNascimento: Date;
  parentesco: string;
}

export function FormularioEmpregado({
  initialData,
  onSubmit,
  onBack,
  onSaveDraft,
}: FormularioEmpregadoProps) {
  const [formData, setFormData] = useState<Partial<DadosEmpregado>>({
    nome: initialData?.nome || '',
    cpf: initialData?.cpf || '',
    dataNascimento: initialData?.dataNascimento || new Date(),
    nacionalidade: initialData?.nacionalidade || '',
    estadoCivil: initialData?.estadoCivil || '',
    rg: {
      numero: initialData?.rg?.numero || '',
      orgaoEmissor: initialData?.rg?.orgaoEmissor || '',
      dataEmissao: initialData?.rg?.dataEmissao || new Date(),
    },
    endereco: {
      logradouro: initialData?.endereco?.logradouro || '',
      numero: initialData?.endereco?.numero || '',
      complemento: initialData?.endereco?.complemento || '',
      bairro: initialData?.endereco?.bairro || '',
      cidade: initialData?.endereco?.cidade || '',
      estado: initialData?.endereco?.estado || '',
      cep: initialData?.endereco?.cep || '',
    },
    contato: {
      telefone: initialData?.contato?.telefone || '',
      email: initialData?.contato?.email || '',
    },
    dadosBancarios: {
      banco: initialData?.dadosBancarios?.banco || '',
      agencia: initialData?.dadosBancarios?.agencia || '',
      conta: initialData?.dadosBancarios?.conta || '',
      tipoConta: initialData?.dadosBancarios?.tipoConta || 'corrente',
    },
    dadosFamiliares: {
      nomeMae: initialData?.dadosFamiliares?.nomeMae || '',
      nomePai: initialData?.dadosFamiliares?.nomePai || '',
    },
    grauInstrucao: initialData?.grauInstrucao || '',
    numeroDependentes: initialData?.numeroDependentes || 0,
    informacoesSaude: initialData?.informacoesSaude || '',
    dependentes: initialData?.dependentes || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dependentes, setDependentes] = useState<Dependente[]>(
    initialData?.dependentes?.map(d => ({
      nome: d.nome || '',
      cpf: d.cpf || '',
      dataNascimento: d.dataNascimento || new Date(),
      parentesco: d.parentesco || '',
    })) || []
  );
  const toast = useToast();
  const router = useRouter();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Dados Pessoais
    if (!formData.nome) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.cpf) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!validateCPF(removeCPFFormatting(formData.cpf))) {
      newErrors.cpf = 'CPF inválido';
    }

    if (!formData.dataNascimento) {
      newErrors.dataNascimento = 'Data de nascimento é obrigatória';
    }

    if (!formData.nacionalidade) {
      newErrors.nacionalidade = 'Nacionalidade é obrigatória';
    }

    if (!formData.estadoCivil) {
      newErrors.estadoCivil = 'Estado civil é obrigatório';
    }

    // RG
    if (!formData.rg?.numero) {
      newErrors['rg.numero'] = 'Número do RG é obrigatório';
    }

    if (!formData.rg?.orgaoEmissor) {
      newErrors['rg.orgaoEmissor'] = 'Órgão emissor é obrigatório';
    }

    if (!formData.rg?.dataEmissao) {
      newErrors['rg.dataEmissao'] = 'Data de emissão é obrigatória';
    }

    // Contato
    if (formData.contato?.email && !/\S+@\S+\.\S+/.test(formData.contato.email)) {
      newErrors['contato.email'] = 'E-mail inválido';
    }

    if (!formData.contato?.telefone) {
      newErrors['contato.telefone'] = 'Telefone é obrigatório';
    }

    // Dados Bancários
    if (!formData.dadosBancarios?.banco) {
      newErrors['dadosBancarios.banco'] = 'Banco é obrigatório';
    }

    if (!formData.dadosBancarios?.agencia) {
      newErrors['dadosBancarios.agencia'] = 'Agência é obrigatória';
    }

    if (!formData.dadosBancarios?.conta) {
      newErrors['dadosBancarios.conta'] = 'Conta é obrigatória';
    }

    if (!formData.dadosBancarios?.tipoConta) {
      newErrors['dadosBancarios.tipoConta'] = 'Tipo de conta é obrigatório';
    }

    // Dados Familiares
    if (!formData.dadosFamiliares?.nomeMae) {
      newErrors['dadosFamiliares.nomeMae'] = 'Nome da mãe é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddDependente = () => {
    setDependentes(prev => {
      const novos = [
        ...prev,
        { nome: '', cpf: '', dataNascimento: new Date(), parentesco: '' },
      ];
      toast({
        title: 'Dependente adicionado',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      return novos;
    });
  };

  const handleRemoveDependente = (index: number) => {
    setDependentes(prev => {
      const novos = prev.filter((_, i) => i !== index);
      toast({
        title: 'Dependente removido',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
      return novos;
    });
  };

  const handleDependenteChange = (index: number, field: keyof Dependente, value: string) => {
    setDependentes(prev => {
      const newDependentes = [...prev];
      newDependentes[index] = {
        ...newDependentes[index],
        [field]: value,
      };
      return newDependentes;
    });
    // Limpa erro do campo alterado
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`dependentes.${index}.${field}`];
      return newErrors;
    });
  };

  const validateDependentes = () => {
    const newErrors: Record<string, string> = {};
    const cpfs = dependentes.map(d => removeCPFFormatting(d.cpf));
    dependentes.forEach((dependente, index) => {
      if (!dependente.nome) {
        newErrors[`dependentes.${index}.nome`] = 'Nome é obrigatório';
      }
      if (!dependente.cpf) {
        newErrors[`dependentes.${index}.cpf`] = 'CPF é obrigatório';
      } else if (!validateCPF(removeCPFFormatting(dependente.cpf))) {
        newErrors[`dependentes.${index}.cpf`] = 'CPF inválido';
      } else if (cpfs.filter(c => c === removeCPFFormatting(dependente.cpf)).length > 1) {
        newErrors[`dependentes.${index}.cpf`] = 'CPF duplicado entre dependentes';
      }
      if (!dependente.dataNascimento) {
        newErrors[`dependentes.${index}.dataNascimento`] = 'Data de nascimento é obrigatória';
      }
      if (!dependente.parentesco) {
        newErrors[`dependentes.${index}.parentesco`] = 'Parentesco é obrigatório';
      }
    });
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dependentesErrors = validateDependentes();
    if (Object.keys(dependentesErrors).length > 0) {
      setErrors(dependentesErrors);
      return;
    }
    onSubmit({
      ...formData,
      dependentes,
      numeroDependentes: dependentes.length,
    });
  };

  const handleChange = (field: keyof DadosEmpregado, value: string | number | Date) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (parent: keyof DadosEmpregado, field: string, value: string | number | Date) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleEnderecoChange = (endereco: Partial<DadosEmpregado['endereco']>) => {
    setFormData(prev => ({
      ...prev,
      endereco: {
        ...prev.endereco,
        ...endereco
      }
    }));
  };

  return (
    <Box>
      <VStack spacing={4}>
        <FormControl isInvalid={!!errors.nome}>
          <FormLabel>Nome Completo</FormLabel>
          <Input
            value={formData.nome}
            onChange={e => handleChange('nome', e.target.value)}
            placeholder="Nome Completo"
            aria-label="Nome Completo"
          />
          <FormErrorMessage>{errors.nome}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.cpf}>
          <FormLabel>CPF</FormLabel>
          <MaskedInput
            value={formData.cpf}
            onChange={e => handleChange('cpf', e.target.value)}
            placeholder="000.000.000-00"
            aria-label="CPF"
            mask="999.999.999-99"
          />
          <FormErrorMessage>{errors.cpf}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.dataNascimento}>
          <FormLabel>Data de Nascimento</FormLabel>
          <Input
            type="date"
            value={formData.dataNascimento?.toISOString().split('T')[0] || ''}
            onChange={e => handleChange('dataNascimento', new Date(e.target.value))}
            aria-label="Data de Nascimento"
          />
          <FormErrorMessage>{errors.dataNascimento}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.nacionalidade}>
          <FormLabel>Nacionalidade</FormLabel>
          <Input
            value={formData.nacionalidade}
            onChange={e => handleChange('nacionalidade', e.target.value)}
            placeholder="Nacionalidade"
            aria-label="Nacionalidade"
          />
          <FormErrorMessage>{errors.nacionalidade}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.estadoCivil}>
          <FormLabel>Estado Civil</FormLabel>
          <SelectField
            value={formData.estadoCivil}
            onChange={value => handleChange('estadoCivil', value)}
            options={ESTADO_CIVIL_OPTIONS}
            placeholder="Selecione o estado civil"
          />
          <FormErrorMessage>{errors.estadoCivil}</FormErrorMessage>
        </FormControl>

        <Divider />

        <FormControl isInvalid={!!errors['rg.numero']}>
          <FormLabel>RG</FormLabel>
          <MaskedInput
            value={formData.rg?.numero}
            onChange={e => handleNestedChange('rg', 'numero', e.target.value)}
            placeholder="Número do RG"
            aria-label="Número do RG"
            mask="99.999.999-9"
          />
          <FormErrorMessage>{errors['rg.numero']}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors['rg.orgaoEmissor']}>
          <FormLabel>Órgão Emissor</FormLabel>
          <Input
            value={formData.rg?.orgaoEmissor}
            onChange={e => handleNestedChange('rg', 'orgaoEmissor', e.target.value)}
            placeholder="Órgão Emissor"
            aria-label="Órgão Emissor"
          />
          <FormErrorMessage>{errors['rg.orgaoEmissor']}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors['rg.dataEmissao']}>
          <FormLabel>Data de Emissão</FormLabel>
          <Input
            type="date"
            value={formData.rg?.dataEmissao?.toISOString().split('T')[0] || ''}
            onChange={e => handleNestedChange('rg', 'dataEmissao', new Date(e.target.value))}
            aria-label="Data de Emissão"
          />
          <FormErrorMessage>{errors['rg.dataEmissao']}</FormErrorMessage>
        </FormControl>

        <Divider />

        <EnderecoForm
          endereco={formData.endereco}
          onChange={handleEnderecoChange}
          errors={errors}
        />

        <Divider />

        <FormControl isInvalid={!!errors['contato.telefone']}>
          <FormLabel>Telefone</FormLabel>
          <MaskedInput
            value={formData.contato?.telefone}
            onChange={e => handleNestedChange('contato', 'telefone', e.target.value)}
            placeholder="(00) 00000-0000"
            aria-label="Telefone"
            mask="(99) 99999-9999"
          />
          <FormErrorMessage>{errors['contato.telefone']}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors['contato.email']}>
          <FormLabel>E-mail</FormLabel>
          <Input
            type="email"
            value={formData.contato?.email}
            onChange={e => handleNestedChange('contato', 'email', e.target.value)}
            placeholder="E-mail"
            aria-label="E-mail"
          />
          <FormErrorMessage>{errors['contato.email']}</FormErrorMessage>
        </FormControl>

        <Divider />

        <FormControl isInvalid={!!errors['dadosBancarios.banco']}>
          <FormLabel>Banco</FormLabel>
          <Input
            value={formData.dadosBancarios?.banco}
            onChange={e => handleNestedChange('dadosBancarios', 'banco', e.target.value)}
            placeholder="Banco"
            aria-label="Banco"
          />
          <FormErrorMessage>{errors['dadosBancarios.banco']}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors['dadosBancarios.agencia']}>
          <FormLabel>Agência</FormLabel>
          <MaskedInput
            value={formData.dadosBancarios?.agencia}
            onChange={e => handleNestedChange('dadosBancarios', 'agencia', e.target.value)}
            placeholder="Agência"
            aria-label="Agência"
            mask="9999-9"
          />
          <FormErrorMessage>{errors['dadosBancarios.agencia']}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors['dadosBancarios.conta']}>
          <FormLabel>Conta</FormLabel>
          <MaskedInput
            value={formData.dadosBancarios?.conta}
            onChange={e => handleNestedChange('dadosBancarios', 'conta', e.target.value)}
            placeholder="Conta"
            aria-label="Conta"
            mask="999999-9"
          />
          <FormErrorMessage>{errors['dadosBancarios.conta']}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors['dadosBancarios.tipoConta']}>
          <FormLabel>Tipo de Conta</FormLabel>
          <SelectField
            value={formData.dadosBancarios?.tipoConta}
            onChange={value => handleNestedChange('dadosBancarios', 'tipoConta', value)}
            options={TIPO_CONTA_OPTIONS}
            placeholder="Selecione o tipo de conta"
          />
          <FormErrorMessage>{errors['dadosBancarios.tipoConta']}</FormErrorMessage>
        </FormControl>

        <Divider />

        <FormControl isInvalid={!!errors['dadosFamiliares.nomeMae']}>
          <FormLabel>Nome da Mãe</FormLabel>
          <Input
            value={formData.dadosFamiliares?.nomeMae}
            onChange={e => handleNestedChange('dadosFamiliares', 'nomeMae', e.target.value)}
            placeholder="Nome da Mãe"
            aria-label="Nome da Mãe"
          />
          <FormErrorMessage>{errors['dadosFamiliares.nomeMae']}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors['dadosFamiliares.nomePai']}>
          <FormLabel>Nome do Pai</FormLabel>
          <Input
            value={formData.dadosFamiliares?.nomePai}
            onChange={e => handleNestedChange('dadosFamiliares', 'nomePai', e.target.value)}
            placeholder="Nome do Pai"
            aria-label="Nome do Pai"
          />
          <FormErrorMessage>{errors['dadosFamiliares.nomePai']}</FormErrorMessage>
        </FormControl>

        <Divider />

        <FormControl>
          <FormLabel>Grau de Instrução</FormLabel>
          <SelectField
            value={formData.grauInstrucao}
            onChange={value => handleChange('grauInstrucao', value)}
            options={GRAU_INSTRUCAO_OPTIONS}
            placeholder="Selecione o grau de instrução"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Número de Dependentes</FormLabel>
          <Input
            type="number"
            value={formData.numeroDependentes}
            onChange={e => handleChange('numeroDependentes', parseInt(e.target.value))}
            placeholder="Número de Dependentes"
            aria-label="Número de Dependentes"
            min={0}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Informações de Saúde</FormLabel>
          <Input
            value={formData.informacoesSaude}
            onChange={e => handleChange('informacoesSaude', e.target.value)}
            placeholder="Informações de Saúde"
            aria-label="Informações de Saúde"
          />
        </FormControl>

        <Divider />

        <Box width="100%">
          <HStack justify="space-between" mb={4}>
            <Text fontSize="lg" fontWeight="bold">Dependentes</Text>
            <IconButton
              aria-label="Adicionar dependente"
              icon={<FaPlus />}
              onClick={handleAddDependente}
            />
          </HStack>

          {dependentes.map((dependente, index) => (
            <Box key={index} p={4} borderWidth={1} borderRadius="md" mb={4}>
              <HStack justify="space-between" mb={4}>
                <Text fontWeight="bold">Dependente {index + 1}</Text>
                <IconButton
                  aria-label="Remover dependente"
                  icon={<FaTrash />}
                  onClick={() => handleRemoveDependente(index)}
                />
              </HStack>

              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Nome</FormLabel>
                  <Input
                    value={dependente.nome}
                    onChange={e => handleDependenteChange(index, 'nome', e.target.value)}
                    placeholder="Nome do Dependente"
                    aria-label="Nome do Dependente"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>CPF</FormLabel>
                  <MaskedInput
                    value={dependente.cpf}
                    onChange={e => handleDependenteChange(index, 'cpf', e.target.value)}
                    placeholder="000.000.000-00"
                    aria-label="CPF do Dependente"
                    mask="999.999.999-99"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Data de Nascimento</FormLabel>
                  <Input
                    type="date"
                    value={dependente.dataNascimento.toISOString().split('T')[0]}
                    onChange={e => handleDependenteChange(index, 'dataNascimento', new Date(e.target.value))}
                    aria-label="Data de Nascimento do Dependente"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Parentesco</FormLabel>
                  <ParentescoSelect
                    value={dependente.parentesco}
                    onChange={value => handleDependenteChange(index, 'parentesco', value)}
                  />
                </FormControl>
              </VStack>
            </Box>
          ))}
        </Box>

        <HStack spacing={4} width="100%" justify="flex-end">
          {onBack && (
            <Button onClick={onBack} variant="outline">
              Voltar
            </Button>
          )}
          {onSaveDraft && (
            <Button onClick={onSaveDraft} variant="outline">
              Salvar Rascunho
            </Button>
          )}
          <Button onClick={handleSubmit} colorScheme="blue">
            Salvar
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
} 