'use client';

import React from 'react';
import { FormikProps } from 'formik';
import { Grid, TextField, MenuItem, FormControl, InputLabel, Select, Typography } from '@mui/material';
import { DadosEmpregador } from '@/types/esocial';
import { FormularioBase } from './FormularioBase';
import { EsocialService } from '@/services/esocialService';
import { useRouter } from 'next/navigation';
import { DatePicker } from '@mui/x-date-pickers';
import { CertificadoDigitalUpload } from '../CertificadoDigitalUpload';
import { toast } from 'react-toastify';
import { Input } from '@chakra-ui/react';
import { formatCPF, removeCPFFormatting } from '@/utils/cpf';
import { formatPhone } from '@/utils/phone';
import { formatCEP } from '@/utils/cep';
import { formatRG } from '@/utils/rg';
import { Box, Button, VStack, Text, useToast } from '@chakra-ui/react';
import { useForm } from '../../hooks/useForm';
import { FormInput } from '../common/FormInput';
import { empregadorValidationRules } from '../../utils/empregadorValidations';
import { logger } from '../../utils/logger';

const initialValues: DadosEmpregador = {
  tipoEmpregador: 'PF',
  nome: '',
  cpf: '',
  razaoSocial: '',
  cnpj: '',
  email: '',
  telefone: '',
  celular: '',
  dadosBancarios: {
    banco: '',
    agencia: '',
    conta: '',
    tipoConta: 'corrente'
  },
  dadosImovel: {
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: ''
  },
  dadosFamiliares: {
    estadoCivil: 'solteiro',
    conjuge: {
      nome: '',
      cpf: '',
      rg: ''
    }
  }
};

interface Props {
  dadosIniciais?: Partial<DadosEmpregador>;
  empregadorId?: string;
}

export function FormularioEmpregador({ dadosIniciais, empregadorId }: Props) {
  const router = useRouter();
  const toast = useToast();

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    isValid
  } = useForm<DadosEmpregador>({
    initialValues: { ...initialValues, ...dadosIniciais },
    validationRules: empregadorValidationRules,
    onSubmit: async (data) => {
      try {
        if (empregadorId) {
          await EsocialService.atualizarDadosEmpregador(empregadorId, data);
          toast({
            title: 'Sucesso',
            description: 'Dados do empregador atualizados com sucesso',
            status: 'success',
            duration: 5000,
            isClosable: true
          });
        } else {
          const resultado = await EsocialService.criarDadosEmpregador(data);
          toast({
            title: 'Sucesso',
            description: 'Dados do empregador cadastrados com sucesso',
            status: 'success',
            duration: 5000,
            isClosable: true
          });
          router.push(`/empregador/${resultado.id}`);
        }
      } catch (error) {
        logger.error('Erro ao salvar dados do empregador', error as Error);
        toast({
          title: 'Erro',
          description: 'Erro ao salvar dados do empregador',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      }
    }
  });

  const renderFormulario = (formikProps: FormikProps<DadosEmpregador>) => {
    const { values, handleChange, handleBlur, touched, errors, setFieldValue } = formikProps;

    const handleMaskedChange = (field: string, mask: (value: string) => string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const maskedValue = mask(e.target.value);
      setFieldValue(field, maskedValue);
    };

    return (
      <Box as="form" onSubmit={handleSubmit} width="100%">
        <VStack spacing={4} align="stretch">
          <Text fontSize="xl" fontWeight="bold">
            {empregadorId ? 'Editar Dados do Empregador' : 'Cadastro de Empregador'}
          </Text>

          <FormControl isInvalid={touched.tipoEmpregador && !!errors.tipoEmpregador}>
            <FormLabel htmlFor="tipoEmpregador">Tipo de Empregador</FormLabel>
            <Select
              id="tipoEmpregador"
              name="tipoEmpregador"
              value={values.tipoEmpregador}
              onChange={handleChange}
              onBlur={handleBlur}
              isRequired
            >
              <option value="PF">Pessoa Física</option>
              <option value="PJ">Pessoa Jurídica</option>
            </Select>
            {touched.tipoEmpregador && errors.tipoEmpregador && (
              <FormErrorMessage>{errors.tipoEmpregador}</FormErrorMessage>
            )}
          </FormControl>

          {values.tipoEmpregador === 'PF' ? (
            <>
              <FormInput
                label="Nome"
                name="nome"
                value={values.nome}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.nome}
                touched={touched.nome}
                isRequired
              />

              <FormInput
                label="CPF"
                name="cpf"
                value={values.cpf}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.cpf}
                touched={touched.cpf}
                mask={formatCPF}
                isRequired
              />
            </>
          ) : (
            <>
              <FormInput
                label="Razão Social"
                name="razaoSocial"
                value={values.razaoSocial}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.razaoSocial}
                touched={touched.razaoSocial}
                isRequired
              />

              <FormInput
                label="CNPJ"
                name="cnpj"
                value={values.cnpj}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.cnpj}
                touched={touched.cnpj}
                mask="cnpj"
                isRequired
              />
            </>
          )}

          <FormInput
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
            touched={touched.email}
            isRequired
          />

          <FormInput
            label="Telefone"
            name="telefone"
            value={values.telefone}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.telefone}
            touched={touched.telefone}
            mask={formatPhone}
            isRequired
          />

          <FormInput
            label="Celular"
            name="celular"
            value={values.celular}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.celular}
            touched={touched.celular}
            mask={formatPhone}
          />

          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={4}>Dados Bancários</Text>
            <VStack spacing={4}>
              <FormInput
                label="Banco"
                name="dadosBancarios.banco"
                value={values.dadosBancarios.banco}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.dadosBancarios?.banco}
                touched={touched.dadosBancarios?.banco}
                isRequired
              />

              <FormInput
                label="Agência"
                name="dadosBancarios.agencia"
                value={values.dadosBancarios.agencia}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.dadosBancarios?.agencia}
                touched={touched.dadosBancarios?.agencia}
                required
                aria-required="true"
              />

              <FormInput
                label="Conta"
                name="dadosBancarios.conta"
                value={values.dadosBancarios.conta}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.dadosBancarios?.conta}
                touched={touched.dadosBancarios?.conta}
                required
                aria-required="true"
              />

              <FormInput
                label="Tipo de Conta"
                name="dadosBancarios.tipoConta"
                value={values.dadosBancarios.tipoConta}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.dadosBancarios?.tipoConta}
                touched={touched.dadosBancarios?.tipoConta}
                as={Select}
                required
                aria-required="true"
              >
                <option value="CORRENTE">Conta Corrente</option>
                <option value="POUPANCA">Conta Poupança</option>
              </FormInput>
            </VStack>
          </Box>

          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={4}>Dados do Imóvel</Text>
            <VStack spacing={4}>
              <FormInput
                label="Endereço"
                name="dadosImovel.endereco"
                value={values.dadosImovel.endereco}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.dadosImovel?.endereco}
                touched={touched.dadosImovel?.endereco}
                isRequired
              />

              <FormInput
                label="Número"
                name="dadosImovel.numero"
                value={values.dadosImovel.numero}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.dadosImovel?.numero}
                touched={touched.dadosImovel?.numero}
                isRequired
              />

              <FormInput
                label="Complemento"
                name="dadosImovel.complemento"
                value={values.dadosImovel.complemento}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.dadosImovel?.complemento}
                touched={touched.dadosImovel?.complemento}
              />

              <FormInput
                label="Bairro"
                name="dadosImovel.bairro"
                value={values.dadosImovel.bairro}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.dadosImovel?.bairro}
                touched={touched.dadosImovel?.bairro}
                isRequired
              />

              <FormInput
                label="Cidade"
                name="dadosImovel.cidade"
                value={values.dadosImovel.cidade}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.dadosImovel?.cidade}
                touched={touched.dadosImovel?.cidade}
                isRequired
              />

              <FormInput
                label="Estado"
                name="dadosImovel.estado"
                value={values.dadosImovel.estado}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.dadosImovel?.estado}
                touched={touched.dadosImovel?.estado}
                as={Select}
                isRequired
                title="Selecione o estado"
              >
                <option value="">Selecione...</option>
                <option value="AC">Acre</option>
                <option value="AL">Alagoas</option>
                <option value="AP">Amapá</option>
                <option value="AM">Amazonas</option>
                <option value="BA">Bahia</option>
                <option value="CE">Ceará</option>
                <option value="DF">Distrito Federal</option>
                <option value="ES">Espírito Santo</option>
                <option value="GO">Goiás</option>
                <option value="MA">Maranhão</option>
                <option value="MT">Mato Grosso</option>
                <option value="MS">Mato Grosso do Sul</option>
                <option value="MG">Minas Gerais</option>
                <option value="PA">Pará</option>
                <option value="PB">Paraíba</option>
                <option value="PR">Paraná</option>
                <option value="PE">Pernambuco</option>
                <option value="PI">Piauí</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="RN">Rio Grande do Norte</option>
                <option value="RS">Rio Grande do Sul</option>
                <option value="RO">Rondônia</option>
                <option value="RR">Roraima</option>
                <option value="SC">Santa Catarina</option>
                <option value="SP">São Paulo</option>
                <option value="SE">Sergipe</option>
                <option value="TO">Tocantins</option>
              </FormInput>

              <FormInput
                label="CEP"
                name="dadosImovel.cep"
                value={values.dadosImovel.cep}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.dadosImovel?.cep}
                touched={touched.dadosImovel?.cep}
                mask={formatCEP}
                isRequired
              />
            </VStack>
          </Box>

          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={4}>Dados Familiares</Text>
            <VStack spacing={4}>
              <FormInput
                label="Estado Civil"
                name="dadosFamiliares.estadoCivil"
                value={values.dadosFamiliares.estadoCivil}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.dadosFamiliares?.estadoCivil}
                touched={touched.dadosFamiliares?.estadoCivil}
                as={Select}
                isRequired
                title="Selecione o estado civil"
              >
                <option value="solteiro">Solteiro(a)</option>
                <option value="casado">Casado(a)</option>
                <option value="divorciado">Divorciado(a)</option>
                <option value="viuvo">Viúvo(a)</option>
              </FormInput>

              {values.dadosFamiliares.estadoCivil === 'casado' && (
                <>
                  <FormInput
                    label="Nome do Cônjuge"
                    name="dadosFamiliares.conjuge.nome"
                    value={values.dadosFamiliares.conjuge?.nome}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.dadosFamiliares?.conjuge?.nome}
                    touched={touched.dadosFamiliares?.conjuge?.nome}
                    isRequired
                  />

                  <FormInput
                    label="CPF do Cônjuge"
                    name="dadosFamiliares.conjuge.cpf"
                    value={values.dadosFamiliares.conjuge?.cpf}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.dadosFamiliares?.conjuge?.cpf}
                    touched={touched.dadosFamiliares?.conjuge?.cpf}
                    mask={formatCPF}
                    isRequired
                  />

                  <FormInput
                    label="RG do Cônjuge"
                    name="dadosFamiliares.conjuge.rg"
                    value={values.dadosFamiliares.conjuge?.rg}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.dadosFamiliares?.conjuge?.rg}
                    touched={touched.dadosFamiliares?.conjuge?.rg}
                    isRequired
                  />
                </>
              )}
            </VStack>
          </Box>

          <Box display="flex" justifyContent="space-between" mt={8}>
            {empregadorId && (
              <Button onClick={() => router.push('/empregadores')} variant="outline">
                Voltar
              </Button>
            )}
            <Button
              type="submit"
              colorScheme="blue"
              isDisabled={!isValid}
            >
              Salvar
            </Button>
          </Box>
        </VStack>
      </Box>
    );
  };

  return (
    <FormularioBase<DadosEmpregador>
      titulo={empregadorId ? 'Editar Dados do Empregador' : 'Cadastro de Empregador'}
      valoresIniciais={dadosIniciais}
      validacao={validarFormulario}
      onSubmit={handleSubmit}
    >
      {renderFormulario}
    </FormularioBase>
  );
} 