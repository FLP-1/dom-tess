'use client';

import { VStack, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { employeeService } from '@/services/employeeService';
import { formatCPF, formatPhone, formatSalary, validateCPF, validatePhone, validateSalary, validateEmail } from '@/utils/formatting';
import { MaskedInput } from '@/components/form/MaskedInput';
import { DatePicker } from '@/components/form/DatePicker';
import { FormularioBase } from '@/components/forms/FormularioBase';
import { AuthLayout } from '@/components/layout/AuthLayout';

interface FormValues {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  cargo: string;
  dataAdmissao: string;
  salario: string;
}

const valoresIniciais: FormValues = {
  nome: '',
  cpf: '',
  email: '',
  telefone: '',
  cargo: '',
  dataAdmissao: '',
  salario: '',
};

export default function RegisterEmployee() {
  const toast = useToast();
  const router = useRouter();

  const validacao = (values: FormValues) => {
    const errors: Partial<Record<keyof FormValues, string>> = {};

    if (!values.nome) {
      errors.nome = 'Nome é obrigatório';
    } else if (values.nome.length < 3) {
      errors.nome = 'Nome deve ter pelo menos 3 caracteres';
    }

    if (!values.cpf) {
      errors.cpf = 'CPF é obrigatório';
    } else if (!validateCPF(values.cpf)) {
      errors.cpf = 'CPF inválido';
    }

    if (!values.email) {
      errors.email = 'Email é obrigatório';
    } else if (!validateEmail(values.email)) {
      errors.email = 'Email inválido';
    }

    if (!values.telefone) {
      errors.telefone = 'Telefone é obrigatório';
    } else if (!validatePhone(values.telefone)) {
      errors.telefone = 'Telefone inválido';
    }

    if (!values.cargo) {
      errors.cargo = 'Cargo é obrigatório';
    }

    if (!values.dataAdmissao) {
      errors.dataAdmissao = 'Data de admissão é obrigatória';
    } else {
      const dataAdmissao = new Date(values.dataAdmissao);
      const hoje = new Date();
      if (dataAdmissao > hoje) {
        errors.dataAdmissao = 'Data de admissão não pode ser futura';
      }
    }

    if (!values.salario) {
      errors.salario = 'Salário é obrigatório';
    } else if (!validateSalary(values.salario)) {
      errors.salario = 'Salário deve ser um valor positivo';
    }

    return errors;
  };

  const onSubmit = async (values: FormValues) => {
    try {
      await employeeService.createEmployee({
        ...values,
        salario: Number(values.salario.replace(/\D/g, '')) / 100,
        telefone: values.telefone.replace(/\D/g, ''),
        cpf: values.cpf.replace(/\D/g, ''),
      });
      
      toast({
        title: 'Sucesso',
        description: 'Empregado cadastrado com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      router.push('/dashboard');
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao cadastrar empregado',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <AuthLayout title="Cadastro de Empregado">
      <FormularioBase
        titulo="Cadastro de Empregado"
        valoresIniciais={valoresIniciais}
        validacao={validacao}
        onSubmit={onSubmit}
      >
        {(formikProps) => (
          <VStack spacing={4}>
            <MaskedInput
              name="nome"
              label="Nome Completo"
              value={formikProps.values.nome}
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
              error={formikProps.touched.nome && formikProps.errors.nome}
              placeholder="Digite o nome completo"
            />

            <MaskedInput
              name="cpf"
              label="CPF"
              value={formikProps.values.cpf}
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
              error={formikProps.touched.cpf && formikProps.errors.cpf}
              placeholder="Digite o CPF"
              mask={formatCPF}
              maxLength={14}
            />

            <MaskedInput
              name="email"
              label="Email"
              value={formikProps.values.email}
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
              error={formikProps.touched.email && formikProps.errors.email}
              placeholder="Digite o email"
              type="email"
            />

            <MaskedInput
              name="telefone"
              label="Telefone"
              value={formikProps.values.telefone}
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
              error={formikProps.touched.telefone && formikProps.errors.telefone}
              placeholder="Digite o telefone"
              mask={formatPhone}
              maxLength={15}
            />

            <MaskedInput
              name="cargo"
              label="Cargo"
              value={formikProps.values.cargo}
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
              error={formikProps.touched.cargo && formikProps.errors.cargo}
              placeholder="Digite o cargo"
            />

            <DatePicker
              name="dataAdmissao"
              label="Data de Admissão"
              value={formikProps.values.dataAdmissao}
              onChange={(date) => formikProps.setFieldValue('dataAdmissao', date)}
              error={formikProps.touched.dataAdmissao && formikProps.errors.dataAdmissao}
            />

            <MaskedInput
              name="salario"
              label="Salário"
              value={formikProps.values.salario}
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
              error={formikProps.touched.salario && formikProps.errors.salario}
              placeholder="Digite o salário"
              mask={formatSalary}
            />
          </VStack>
        )}
      </FormularioBase>
    </AuthLayout>
  );
} 