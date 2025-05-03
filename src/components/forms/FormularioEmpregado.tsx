'use client';

import { useState, useCallback } from 'react';
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
  Grid,
  GridItem,
  Stack,
} from '@chakra-ui/react';
import { DadosEmpregado } from '@/types/esocial';
import { MaskedInput } from '@/components/common/MaskedInput';
import { MaskType } from '@/utils/maskTypes';
import { SelectCustom } from '../common/SelectCustom';
import { EnderecoForm } from '@/components/common/EnderecoForm';
import { ParentescoSelect } from '@/components/common/ParentescoSelect';
import { formatCPF, removeCPFFormatting, validateCPF } from '@/utils/cpf';
import { formatCurrency } from '@/utils/currency';
import { useRouter } from 'next/navigation';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { FormInput } from '../common/FormInput';
import { SelectField } from '../common/SelectField';
import { useForm } from '@/hooks/useForm';
import { validacoes } from '@/utils/validacoes/empregado';

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
] as const;

const GRAU_INSTRUCAO_OPTIONS = [
  { value: 'FUNDAMENTAL_INCOMPLETO', label: 'Fundamental Incompleto' },
  { value: 'FUNDAMENTAL_COMPLETO', label: 'Fundamental Completo' },
  { value: 'MEDIO_INCOMPLETO', label: 'Médio Incompleto' },
  { value: 'MEDIO_COMPLETO', label: 'Médio Completo' },
  { value: 'SUPERIOR_INCOMPLETO', label: 'Superior Incompleto' },
  { value: 'SUPERIOR_COMPLETO', label: 'Superior Completo' },
  { value: 'POS_GRADUACAO', label: 'Pós-graduação' },
] as const;

const TIPO_CONTA_OPTIONS = [
  { value: 'CORRENTE', label: 'Conta Corrente' },
  { value: 'POUPANCA', label: 'Conta Poupança' },
] as const;

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
  const [formData, setFormData] = useState<Partial<DadosEmpregado>>(initialData || {});
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

  const handleDependenteChange = (index: number, field: keyof Dependente, value: string | Date) => {
    setDependentes(prev => {
      const newDependentes = [...prev];
      newDependentes[index] = {
        ...newDependentes[index],
        [field]: value
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
      } else if (cpfs.filter(cpf => cpf === removeCPFFormatting(dependente.cpf)).length > 1) {
        newErrors[`dependentes.${index}.cpf`] = 'CPF já cadastrado para outro dependente';
      }
      if (!dependente.dataNascimento) {
        newErrors[`dependentes.${index}.dataNascimento`] = 'Data de nascimento é obrigatória';
      }
      if (!dependente.parentesco) {
        newErrors[`dependentes.${index}.parentesco`] = 'Parentesco é obrigatório';
      }
    });
    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && validateDependentes()) {
      onSubmit({
        ...formData,
        dependentes: dependentes.map(d => ({
          ...d,
          dataNascimento: d.dataNascimento,
        })),
      });
    }
  };

  const handleChange = (field: keyof DadosEmpregado, value: string | Date) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = useCallback((parent: keyof DadosEmpregado, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  }, []);

  const handleEnderecoChange = (endereco: Partial<DadosEmpregado['endereco']>) => {
    setFormData(prev => ({
      ...prev,
      endereco: {
        ...prev.endereco,
        ...endereco
      }
    }));
  };

  const handleSelectChange = (field: keyof DadosEmpregado, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const handleNestedSelectChange = (parent: keyof DadosEmpregado, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`${parent}.${field}`];
      return newErrors;
    });
  };

  return (
    <Box as="form" onSubmit={handleSubmit} width="100%">
      <Stack spacing={6}>
        {/* Dados Pessoais */}
        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            Dados Pessoais
          </Text>
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <GridItem>
              <FormInput
                label="Nome Completo"
                value={formData.nome}
                onChange={(value) => handleChange('nome', value)}
                isRequired
                _placeholder="Digite o nome completo"
              />
            </GridItem>
            <GridItem>
              <FormInput
                label="CPF"
                value={formData.cpf}
                onChange={(value) => handleChange('cpf', value)}
                mask="cpf"
                isRequired
                _placeholder="Digite o CPF"
              />
            </GridItem>
            <GridItem>
              <FormInput
                label="RG"
                value={formData.rg?.numero}
                onChange={(value) => handleNestedChange('rg', 'numero', value)}
                mask="rg"
                isRequired
                _placeholder="Digite o RG"
              />
            </GridItem>
            <GridItem>
              <FormInput
                label="Órgão Emissor"
                value={formData.rg?.orgaoEmissor}
                onChange={(value) => handleNestedChange('rg', 'orgaoEmissor', value)}
                isRequired
                _placeholder="Digite o órgão emissor"
              />
            </GridItem>
            <GridItem>
              <FormInput
                label="Data de Nascimento"
                value={formData.dataNascimento?.toISOString().split('T')[0]}
                onChange={(value) => handleChange('dataNascimento', new Date(value))}
                type="date"
                isRequired
              />
            </GridItem>
            <GridItem>
              <SelectField
                label="Estado Civil"
                value={formData.estadoCivil}
                onChange={(value) => handleChange('estadoCivil', value)}
                options={[
                  { value: 'SOLTEIRO', label: 'Solteiro(a)' },
                  { value: 'CASADO', label: 'Casado(a)' },
                  { value: 'DIVORCIADO', label: 'Divorciado(a)' },
                  { value: 'VIUVO', label: 'Viúvo(a)' },
                  { value: 'UNIAO_ESTAVEL', label: 'União Estável' },
                ]}
                isRequired
                _placeholder="Selecione o estado civil"
              />
            </GridItem>
          </Grid>
        </Box>

        {/* Endereço */}
        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            Endereço
          </Text>
          <EnderecoForm
            endereco={formData.endereco || {}}
            onChange={handleEnderecoChange}
            errors={errors}
          />
        </Box>

        {/* Contato */}
        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            Contato
          </Text>
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <GridItem>
              <FormInput
                label="Telefone"
                value={formData.contato?.telefone}
                onChange={(value) => handleNestedChange('contato', 'telefone', value)}
                mask="phone"
                isRequired
                _placeholder="Digite o telefone"
              />
            </GridItem>
            <GridItem>
              <FormInput
                label="Email"
                value={formData.contato?.email}
                onChange={(value) => handleNestedChange('contato', 'email', value)}
                type="email"
                isRequired
                _placeholder="Digite o email"
              />
            </GridItem>
          </Grid>
        </Box>

        {/* Dados Bancários */}
        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            Dados Bancários
          </Text>
          <Grid templateColumns="repeat(3, 1fr)" gap={4}>
            <GridItem>
              <FormInput
                label="Banco"
                value={formData.dadosBancarios?.banco}
                onChange={(value) => handleNestedChange('dadosBancarios', 'banco', value)}
                isRequired
                _placeholder="Digite o nome do banco"
              />
            </GridItem>
            <GridItem>
              <FormInput
                label="Agência"
                value={formData.dadosBancarios?.agencia}
                onChange={(value) => handleNestedChange('dadosBancarios', 'agencia', value)}
                mask="numbers"
                isRequired
                _placeholder="Digite a agência"
              />
            </GridItem>
            <GridItem>
              <FormInput
                label="Conta"
                value={formData.dadosBancarios?.conta}
                onChange={(value) => handleNestedChange('dadosBancarios', 'conta', value)}
                mask="numbers"
                isRequired
                _placeholder="Digite a conta"
              />
            </GridItem>
          </Grid>
        </Box>

        {/* Dados Familiares */}
        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            Dados Familiares
          </Text>
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <GridItem>
              <FormInput
                label="Nome da Mãe"
                value={formData.dadosFamiliares?.nomeMae}
                onChange={(value) => handleNestedChange('dadosFamiliares', 'nomeMae', value)}
                isRequired
                _placeholder="Digite o nome da mãe"
              />
            </GridItem>
            <GridItem>
              <FormInput
                label="Nome do Pai"
                value={formData.dadosFamiliares?.nomePai}
                onChange={(value) => handleNestedChange('dadosFamiliares', 'nomePai', value)}
                _placeholder="Digite o nome do pai"
              />
            </GridItem>
          </Grid>
        </Box>

        {/* Dependentes */}
        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            Dependentes
          </Text>
          {formData.dependentes?.map((dependente, index) => (
            <Box key={index} p={4} borderWidth={1} borderRadius="md" mb={4}>
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <GridItem>
                  <FormInput
                    label="Nome do Dependente"
                    value={dependente.nome}
                    onChange={(value) => handleDependenteChange(index, 'nome', value)}
                    isRequired
                    _placeholder="Digite o nome do dependente"
                  />
                </GridItem>
                <GridItem>
                  <FormInput
                    label="CPF do Dependente"
                    value={dependente.cpf}
                    onChange={(value) => handleDependenteChange(index, 'cpf', value)}
                    mask="cpf"
                    isRequired
                    _placeholder="Digite o CPF do dependente"
                  />
                </GridItem>
                <GridItem>
                  <SelectField
                    label="Parentesco"
                    value={dependente.parentesco}
                    onChange={(value) => handleDependenteChange(index, 'parentesco', value)}
                    options={[
                      { value: 'FILHO', label: 'Filho(a)' },
                      { value: 'CONJUGE', label: 'Cônjuge' },
                      { value: 'PAI', label: 'Pai' },
                      { value: 'MAE', label: 'Mãe' },
                      { value: 'OUTRO', label: 'Outro' }
                    ]}
                    isRequired
                    _placeholder="Selecione o parentesco"
                  />
                </GridItem>
                <GridItem>
                  <FormInput
                    label="Data de Nascimento"
                    value={dependente.dataNascimento?.toISOString().split('T')[0]}
                    onChange={(value) => handleDependenteChange(index, 'dataNascimento', new Date(value))}
                    type="date"
                    isRequired
                  />
                </GridItem>
              </Grid>
              <Button
                mt={2}
                colorScheme="red"
                size="sm"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    dependentes: prev.dependentes?.filter((_, i) => i !== index)
                  }));
                }}
              >
                Remover Dependente
              </Button>
            </Box>
          ))}
          <Button
            colorScheme="blue"
            onClick={() => {
              setFormData(prev => ({
                ...prev,
                dependentes: [
                  ...(prev.dependentes || []),
                  {
                    nome: '',
                    cpf: '',
                    parentesco: '',
                    dataNascimento: new Date()
                  }
                ]
              }));
            }}
          >
            Adicionar Dependente
          </Button>
        </Box>

        {/* Botões de Ação */}
        <HStack spacing={4} justify="flex-end">
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              Voltar
            </Button>
          )}
          {onSaveDraft && (
            <Button variant="outline" onClick={onSaveDraft}>
              Salvar Rascunho
            </Button>
          )}
          <Button type="submit" colorScheme="green" size="lg">
            Salvar
          </Button>
        </HStack>
      </Stack>
    </Box>
  );
} 