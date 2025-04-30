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
  dataNascimento: string;
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
    dataNascimento: initialData?.dataNascimento || '',
    nacionalidade: initialData?.nacionalidade || '',
    estadoCivil: initialData?.estadoCivil || '',
    rg: {
      numero: initialData?.rg?.numero || '',
      orgaoEmissor: initialData?.rg?.orgaoEmissor || '',
      dataEmissao: initialData?.rg?.dataEmissao || '',
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
      tipoConta: initialData?.dadosBancarios?.tipoConta || '',
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
      dataNascimento: d.dataNascimento || '',
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
    if (!formData.contato?.email) {
      newErrors['contato.email'] = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.contato.email)) {
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
        { nome: '', cpf: '', dataNascimento: '', parentesco: '' },
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

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleNestedChange = (parent: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));

    if (errors[`${parent}.${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${parent}.${field}`];
        return newErrors;
      });
    }
  };

  const handleEnderecoChange = (endereco: Partial<DadosEmpregado['endereco']>) => {
    setFormData(prev => ({
      ...prev,
      endereco: {
        ...prev.endereco,
        ...endereco,
      },
    }));
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <Text fontSize="lg" fontWeight="bold">Dados Pessoais</Text>

        <FormControl isInvalid={!!errors.nome}>
          <FormLabel>Nome Completo</FormLabel>
          <MaskedInput
            value={formData.nome}
            onChange={e => handleChange('nome', e.target.value)}
            placeholder="Digite o nome completo"
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
            mask={masks.cpf}
            aria-label="CPF"
          />
          <FormErrorMessage>{errors.cpf}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.dataNascimento}>
          <FormLabel>Data de Nascimento</FormLabel>
          <Input
            type="date"
            value={formData.dataNascimento}
            onChange={e => handleChange('dataNascimento', e.target.value)}
            aria-label="Data de Nascimento"
          />
          <FormErrorMessage>{errors.dataNascimento}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.nacionalidade}>
          <FormLabel>Nacionalidade</FormLabel>
          <MaskedInput
            value={formData.nacionalidade}
            onChange={e => handleChange('nacionalidade', e.target.value)}
            placeholder="Digite a nacionalidade"
            aria-label="Nacionalidade"
          />
          <FormErrorMessage>{errors.nacionalidade}</FormErrorMessage>
        </FormControl>

        <SelectField
          label="Estado Civil"
          name="estadoCivil"
          value={formData.estadoCivil || ''}
          onChange={(value) => handleChange('estadoCivil', value)}
          options={ESTADO_CIVIL_OPTIONS}
          placeholder="Selecione o estado civil"
          error={errors.estadoCivil}
          isRequired
          aria-label="Estado Civil"
        />

        <Divider my={4} />
        <Text fontSize="lg" fontWeight="bold">Documentos</Text>

        <FormControl isInvalid={!!errors['rg.numero']}>
          <FormLabel>Número do RG</FormLabel>
          <MaskedInput
            value={formData.rg?.numero}
            onChange={e => handleNestedChange('rg', 'numero', e.target.value)}
            placeholder="Digite o número do RG"
            aria-label="Número do RG"
          />
          <FormErrorMessage>{errors['rg.numero']}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors['rg.orgaoEmissor']}>
          <FormLabel>Órgão Emissor</FormLabel>
          <MaskedInput
            value={formData.rg?.orgaoEmissor}
            onChange={e => handleNestedChange('rg', 'orgaoEmissor', e.target.value)}
            placeholder="Digite o órgão emissor"
            aria-label="Órgão Emissor"
          />
          <FormErrorMessage>{errors['rg.orgaoEmissor']}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors['rg.dataEmissao']}>
          <FormLabel>Data de Emissão</FormLabel>
          <Input
            type="date"
            value={formData.rg?.dataEmissao}
            onChange={e => handleNestedChange('rg', 'dataEmissao', e.target.value)}
            aria-label="Data de Emissão"
          />
          <FormErrorMessage>{errors['rg.dataEmissao']}</FormErrorMessage>
        </FormControl>

        <Divider my={4} />
        <Text fontSize="lg" fontWeight="bold">Endereço</Text>

        <EnderecoForm
          enderecoInicial={formData.endereco}
          onChange={handleEnderecoChange}
        />

        <Divider my={4} />
        <Text fontSize="lg" fontWeight="bold">Contato</Text>

        <FormControl isInvalid={!!errors['contato.email']}>
          <FormLabel>E-mail</FormLabel>
          <MaskedInput
            value={formData.contato?.email}
            onChange={e => handleNestedChange('contato', 'email', e.target.value)}
            placeholder="Digite o e-mail"
            type="email"
            aria-label="E-mail"
          />
          <FormErrorMessage>{errors['contato.email']}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors['contato.telefone']}>
          <FormLabel>Telefone</FormLabel>
          <MaskedInput
            value={formData.contato?.telefone}
            onChange={e => handleNestedChange('contato', 'telefone', e.target.value)}
            placeholder="(00) 00000-0000"
            mask={masks.cellphone}
            aria-label="Telefone"
          />
          <FormErrorMessage>{errors['contato.telefone']}</FormErrorMessage>
        </FormControl>

        <Divider my={4} />
        <Text fontSize="lg" fontWeight="bold">Dados Bancários</Text>

        <FormControl isInvalid={!!errors['dadosBancarios.banco']}>
          <FormLabel>Banco</FormLabel>
          <MaskedInput
            value={formData.dadosBancarios?.banco}
            onChange={e => handleNestedChange('dadosBancarios', 'banco', e.target.value)}
            placeholder="Digite o banco"
            aria-label="Banco"
          />
          <FormErrorMessage>{errors['dadosBancarios.banco']}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors['dadosBancarios.agencia']}>
          <FormLabel>Agência</FormLabel>
          <MaskedInput
            value={formData.dadosBancarios?.agencia}
            onChange={e => handleNestedChange('dadosBancarios', 'agencia', e.target.value)}
            placeholder="Digite a agência"
            aria-label="Agência"
          />
          <FormErrorMessage>{errors['dadosBancarios.agencia']}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors['dadosBancarios.conta']}>
          <FormLabel>Conta</FormLabel>
          <MaskedInput
            value={formData.dadosBancarios?.conta}
            onChange={e => handleNestedChange('dadosBancarios', 'conta', e.target.value)}
            placeholder="Digite a conta"
            aria-label="Conta"
          />
          <FormErrorMessage>{errors['dadosBancarios.conta']}</FormErrorMessage>
        </FormControl>

        <SelectField
          label="Tipo de Conta"
          name="dadosBancarios.tipoConta"
          value={formData.dadosBancarios?.tipoConta || ''}
          onChange={(value) => handleNestedChange('dadosBancarios', 'tipoConta', value)}
          options={TIPO_CONTA_OPTIONS}
          placeholder="Selecione o tipo de conta"
          error={errors['dadosBancarios.tipoConta']}
          isRequired
          aria-label="Tipo de Conta"
        />

        <Divider my={4} />
        <Text fontSize="lg" fontWeight="bold">Dados Familiares</Text>

        <FormControl isInvalid={!!errors['dadosFamiliares.nomeMae']}>
          <FormLabel>Nome da Mãe</FormLabel>
          <MaskedInput
            value={formData.dadosFamiliares?.nomeMae}
            onChange={e => handleNestedChange('dadosFamiliares', 'nomeMae', e.target.value)}
            placeholder="Digite o nome da mãe"
            aria-label="Nome da Mãe"
          />
          <FormErrorMessage>{errors['dadosFamiliares.nomeMae']}</FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel>Nome do Pai</FormLabel>
          <MaskedInput
            value={formData.dadosFamiliares?.nomePai}
            onChange={e => handleNestedChange('dadosFamiliares', 'nomePai', e.target.value)}
            placeholder="Digite o nome do pai"
            aria-label="Nome do Pai"
          />
        </FormControl>

        <Divider my={4} />
        <Text fontSize="lg" fontWeight="bold">Dados Complementares</Text>

        <SelectField
          label="Grau de Instrução"
          name="grauInstrucao"
          value={formData.grauInstrucao || ''}
          onChange={(value) => handleChange('grauInstrucao', value)}
          options={GRAU_INSTRUCAO_OPTIONS}
          placeholder="Selecione o grau de instrução"
          error={errors.grauInstrucao}
          aria-label="Grau de Instrução"
        />

        <FormControl>
          <FormLabel>Número de Dependentes</FormLabel>
          <Input
            type="number"
            value={dependentes.length}
            isReadOnly
            aria-label="Número de Dependentes"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Informações de Saúde</FormLabel>
          <MaskedInput
            value={formData.informacoesSaude}
            onChange={e => handleChange('informacoesSaude', e.target.value)}
            placeholder="Digite informações relevantes sobre saúde"
            aria-label="Informações de Saúde"
          />
        </FormControl>

        <Divider my={4} />
        <Text fontSize="lg" fontWeight="bold">Dependentes</Text>

        {dependentes.map((dependente, index) => (
          <Box key={index} p={4} borderWidth="1px" borderRadius="lg">
            <HStack justify="space-between" mb={4}>
              <Text fontWeight="bold">Dependente {index + 1}</Text>
              <IconButton
                aria-label="Remover dependente"
                icon={<FaTrash />}
                onClick={() => handleRemoveDependente(index)}
                colorScheme="red"
                variant="ghost"
              />
            </HStack>
            <VStack spacing={4} align="stretch">
              <FormControl isInvalid={!!errors[`dependentes.${index}.nome`]}>
                <FormLabel>Nome Completo</FormLabel>
                <MaskedInput
                  value={dependente.nome}
                  onChange={(e) => handleDependenteChange(index, 'nome', e.target.value)}
                  placeholder="Digite o nome completo"
                  aria-label="Nome Completo"
                />
                <FormErrorMessage>{errors[`dependentes.${index}.nome`]}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors[`dependentes.${index}.cpf`]}>
                <FormLabel>CPF</FormLabel>
                <MaskedInput
                  value={dependente.cpf}
                  onChange={(e) => handleDependenteChange(index, 'cpf', e.target.value)}
                  placeholder="000.000.000-00"
                  mask={masks.cpf}
                  aria-label="CPF"
                />
                <FormErrorMessage>{errors[`dependentes.${index}.cpf`]}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors[`dependentes.${index}.dataNascimento`]}>
                <FormLabel>Data de Nascimento</FormLabel>
                <Input
                  type="date"
                  value={dependente.dataNascimento}
                  onChange={(e) => handleDependenteChange(index, 'dataNascimento', e.target.value)}
                  aria-label="Data de Nascimento"
                />
                <FormErrorMessage>{errors[`dependentes.${index}.dataNascimento`]}</FormErrorMessage>
              </FormControl>
              <ParentescoSelect
                value={dependente.parentesco}
                onChange={(value) => handleDependenteChange(index, 'parentesco', value)}
                error={errors[`dependentes.${index}.parentesco`]}
                isRequired
                label="Parentesco"
                helperText="Selecione o grau de parentesco com o empregado"
              />
            </VStack>
          </Box>
        ))}

        <Button
          leftIcon={<FaPlus />}
          onClick={handleAddDependente}
          variant="outline"
          colorScheme="blue"
        >
          Adicionar Dependente
        </Button>

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