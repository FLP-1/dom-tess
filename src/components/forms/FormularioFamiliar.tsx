'use client';

import React from 'react';
import { FormikProps } from 'formik';
import { Grid, TextField } from '@mui/material';
import { Familiar } from '@/types/esocial';
import { FormularioBase } from './FormularioBase';
import { EsocialService } from '@/services/esocialService';
import { useRouter } from 'next/navigation';
import { DatePicker } from '@mui/x-date-pickers';
import { toast } from 'react-toastify';

type FormValues = Omit<Familiar, 'id' | 'ultimaAtualizacao'>;

const valoresIniciaisVazios: FormValues = {
  empregadorId: '',
  nome: '',
  parentesco: '',
  dataNascimento: new Date(),
  cpf: '',
  telefone: '',
  email: '',
  status: 'ativo'
};

interface Props {
  dadosIniciais?: FormValues;
  empregadorId: string;
  familiarId?: string;
}

export function FormularioFamiliar({ dadosIniciais = valoresIniciaisVazios, empregadorId, familiarId }: Props) {
  const router = useRouter();

  const validarFormulario = (values: FormValues) => {
    const erros: Record<string, string> = {};
    
    if (!values.nome) erros.nome = 'Nome é obrigatório';
    if (!values.parentesco) erros.parentesco = 'Parentesco é obrigatório';
    if (!values.dataNascimento) erros.dataNascimento = 'Data de nascimento é obrigatória';
    if (!values.cpf) erros.cpf = 'CPF é obrigatório';
    if (!values.telefone) erros.telefone = 'Telefone é obrigatório';
    if (!values.email) erros.email = 'E-mail é obrigatório';
    
    return erros;
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      const dadosCompletos = {
        ...values,
        empregadorId
      };

      if (familiarId) {
        await EsocialService.atualizarFamiliar(familiarId, dadosCompletos);
        toast.success('Dados atualizados com sucesso!');
      } else {
        const resultado = await EsocialService.criarFamiliar(dadosCompletos);
        toast.success('Familiar cadastrado com sucesso!');
        router.push(`/empregador/${empregadorId}/familiares/${resultado.id}`);
      }
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      toast.error('Erro ao salvar dados. Tente novamente.');
    }
  };

  const renderFormulario = (formikProps: FormikProps<FormValues>) => {
    const { values, handleChange, handleBlur, touched, errors, setFieldValue } = formikProps;

    return (
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="nome"
            label="Nome Completo"
            value={values.nome}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.nome && !!errors.nome}
            helperText={touched.nome && errors.nome}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="parentesco"
            label="Parentesco"
            value={values.parentesco}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.parentesco && !!errors.parentesco}
            helperText={touched.parentesco && errors.parentesco}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <DatePicker
            label="Data de Nascimento"
            value={values.dataNascimento}
            onChange={(date) => setFieldValue('dataNascimento', date)}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="cpf"
            label="CPF"
            value={values.cpf}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.cpf && !!errors.cpf}
            helperText={touched.cpf && errors.cpf}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="telefone"
            label="Telefone"
            value={values.telefone}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.telefone && !!errors.telefone}
            helperText={touched.telefone && errors.telefone}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="email"
            label="E-mail"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email && !!errors.email}
            helperText={touched.email && errors.email}
          />
        </Grid>
      </Grid>
    );
  };

  return (
    <FormularioBase<FormValues>
      titulo={familiarId ? 'Editar Dados do Familiar' : 'Cadastro de Familiar'}
      valoresIniciais={dadosIniciais}
      validacao={validarFormulario}
      onSubmit={handleSubmit}
      botaoSubmit={familiarId ? 'Atualizar' : 'Cadastrar'}
    >
      {renderFormulario}
    </FormularioBase>
  );
} 