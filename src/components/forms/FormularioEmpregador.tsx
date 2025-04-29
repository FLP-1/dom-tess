'use client';

import React from 'react';
import { FormikProps } from 'formik';
import { Grid, TextField } from '@mui/material';
import { DadosEmpregador } from '@/types/esocial';
import { FormularioBase } from './FormularioBase';
import { EsocialService } from '@/services/esocialService';
import { useRouter } from 'next/navigation';
import { DatePicker } from '@mui/x-date-pickers';
import { CertificadoDigitalUpload } from '../CertificadoDigitalUpload';
import { toast } from 'react-toastify';

type FormValues = Omit<DadosEmpregador, 'id' | 'ultimaAtualizacao' | 'certificadoDigital'>;

const valoresIniciaisVazios: FormValues = {
  userId: '',
  cpf: '',
  nome: '',
  dataNascimento: new Date(),
  endereco: {
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: ''
  },
  contato: {
    telefone: '',
    email: ''
  },
  dadosBancarios: {
    banco: '',
    agencia: '',
    conta: '',
    tipoConta: 'corrente'
  },
  status: 'incompleto'
};

interface Props {
  dadosIniciais?: FormValues;
  empregadorId?: string;
}

export function FormularioEmpregador({ dadosIniciais = valoresIniciaisVazios, empregadorId }: Props) {
  const router = useRouter();

  const validarFormulario = (values: FormValues) => {
    const erros: Record<string, string> = {};
    
    if (!values.cpf) erros.cpf = 'CPF é obrigatório';
    if (!values.nome) erros.nome = 'Nome é obrigatório';
    if (!values.dataNascimento) erros.dataNascimento = 'Data de nascimento é obrigatória';
    if (!values.endereco.cep) erros.cep = 'CEP é obrigatório';
    if (!values.contato.telefone) erros.telefone = 'Telefone é obrigatório';
    if (!values.contato.email) erros.email = 'E-mail é obrigatório';
    
    return erros;
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      if (empregadorId) {
        await EsocialService.atualizarDadosEmpregador(empregadorId, values);
        toast.success('Dados atualizados com sucesso!');
      } else {
        const resultado = await EsocialService.criarDadosEmpregador(values);
        toast.success('Dados cadastrados com sucesso!');
        router.push(`/empregador/${resultado.id}`);
      }
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      toast.error('Erro ao salvar dados. Tente novamente.');
    }
  };

  const renderFormulario = (formikProps: FormikProps<FormValues>) => {
    const { values, handleChange, handleBlur, touched, errors } = formikProps;

    return (
      <Grid container spacing={2}>
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
          <DatePicker
            label="Data de Nascimento"
            value={values.dataNascimento}
            onChange={(date) => formikProps.setFieldValue('dataNascimento', date)}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            name="endereco.logradouro"
            label="Logradouro"
            value={values.endereco.logradouro}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            name="endereco.numero"
            label="Número"
            value={values.endereco.numero}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            name="endereco.complemento"
            label="Complemento"
            value={values.endereco.complemento}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="endereco.bairro"
            label="Bairro"
            value={values.endereco.bairro}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="endereco.cidade"
            label="Cidade"
            value={values.endereco.cidade}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="endereco.estado"
            label="Estado"
            value={values.endereco.estado}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="endereco.cep"
            label="CEP"
            value={values.endereco.cep}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.endereco?.cep && !!errors.cep}
            helperText={touched.endereco?.cep && errors.cep}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="contato.telefone"
            label="Telefone"
            value={values.contato.telefone}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.contato?.telefone && !!errors.telefone}
            helperText={touched.contato?.telefone && errors.telefone}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="contato.email"
            label="E-mail"
            value={values.contato.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.contato?.email && !!errors.email}
            helperText={touched.contato?.email && errors.email}
          />
        </Grid>

        {empregadorId && (
          <Grid item xs={12}>
            <CertificadoDigitalUpload empregadorId={empregadorId} />
          </Grid>
        )}
      </Grid>
    );
  };

  return (
    <FormularioBase<FormValues>
      titulo={empregadorId ? 'Editar Dados do Empregador' : 'Cadastro de Empregador'}
      valoresIniciais={dadosIniciais}
      validacao={validarFormulario}
      onSubmit={handleSubmit}
      botaoSubmit={empregadorId ? 'Atualizar' : 'Cadastrar'}
    >
      {renderFormulario}
    </FormularioBase>
  );
} 