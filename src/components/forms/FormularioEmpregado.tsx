'use client';

import React from 'react';
import { FormikProps } from 'formik';
import { Grid, TextField, MenuItem } from '@mui/material';
import { DadosEmpregado } from '@/types/esocial';
import { FormularioBase } from './FormularioBase';
import { EsocialService } from '@/services/esocialService';
import { useRouter } from 'next/navigation';
import { DatePicker } from '@mui/x-date-pickers';
import { toast } from 'react-toastify';

type FormValues = Omit<DadosEmpregado, 'id' | 'ultimaAtualizacao'>;

const valoresIniciaisVazios: FormValues = {
  empregadorId: '',
  cpf: '',
  nome: '',
  dataNascimento: new Date(),
  pis: '',
  ctps: {
    numero: '',
    serie: '',
    uf: ''
  },
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
  dadosTrabalho: {
    dataAdmissao: new Date(),
    cargo: '',
    salario: 0,
    cargaHoraria: 44,
    tipoContrato: 'prazo_indeterminado',
    regimeTrabalho: 'mensalista'
  },
  status: 'ativo'
};

interface Props {
  dadosIniciais?: FormValues;
  empregadorId: string;
  empregadoId?: string;
}

export function FormularioEmpregado({ dadosIniciais = valoresIniciaisVazios, empregadorId, empregadoId }: Props) {
  const router = useRouter();

  const validarFormulario = (values: FormValues) => {
    const erros: Record<string, string> = {};
    
    if (!values.cpf) erros.cpf = 'CPF é obrigatório';
    if (!values.nome) erros.nome = 'Nome é obrigatório';
    if (!values.dataNascimento) erros.dataNascimento = 'Data de nascimento é obrigatória';
    if (!values.pis) erros.pis = 'PIS é obrigatório';
    if (!values.ctps.numero) erros['ctps.numero'] = 'Número da CTPS é obrigatório';
    if (!values.ctps.serie) erros['ctps.serie'] = 'Série da CTPS é obrigatória';
    if (!values.ctps.uf) erros['ctps.uf'] = 'UF da CTPS é obrigatória';
    if (!values.endereco.cep) erros.cep = 'CEP é obrigatório';
    if (!values.contato.telefone) erros.telefone = 'Telefone é obrigatório';
    if (!values.contato.email) erros.email = 'E-mail é obrigatório';
    if (!values.dadosTrabalho.cargo) erros['dadosTrabalho.cargo'] = 'Cargo é obrigatório';
    if (!values.dadosTrabalho.salario) erros['dadosTrabalho.salario'] = 'Salário é obrigatório';
    
    return erros;
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      const dadosCompletos = {
        ...values,
        empregadorId
      };

      if (empregadoId) {
        await EsocialService.atualizarEmpregado(empregadoId, dadosCompletos);
        toast.success('Dados atualizados com sucesso!');
      } else {
        const resultado = await EsocialService.criarEmpregado(dadosCompletos);
        toast.success('Empregado cadastrado com sucesso!');
        router.push(`/empregador/${empregadorId}/empregados/${resultado.id}`);
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
            onChange={(date) => setFieldValue('dataNascimento', date)}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="pis"
            label="PIS/PASEP"
            value={values.pis}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.pis && !!errors.pis}
            helperText={touched.pis && errors.pis}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            name="ctps.numero"
            label="Número da CTPS"
            value={values.ctps.numero}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.ctps?.numero && !!errors['ctps.numero']}
            helperText={touched.ctps?.numero && errors['ctps.numero']}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            name="ctps.serie"
            label="Série da CTPS"
            value={values.ctps.serie}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.ctps?.serie && !!errors['ctps.serie']}
            helperText={touched.ctps?.serie && errors['ctps.serie']}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            name="ctps.uf"
            label="UF da CTPS"
            value={values.ctps.uf}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.ctps?.uf && !!errors['ctps.uf']}
            helperText={touched.ctps?.uf && errors['ctps.uf']}
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

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Dados do Trabalho
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <DatePicker
            label="Data de Admissão"
            value={values.dadosTrabalho.dataAdmissao}
            onChange={(date) => setFieldValue('dadosTrabalho.dataAdmissao', date)}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="dadosTrabalho.cargo"
            label="Cargo"
            value={values.dadosTrabalho.cargo}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.dadosTrabalho?.cargo && !!errors['dadosTrabalho.cargo']}
            helperText={touched.dadosTrabalho?.cargo && errors['dadosTrabalho.cargo']}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="dadosTrabalho.salario"
            label="Salário"
            type="number"
            value={values.dadosTrabalho.salario}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.dadosTrabalho?.salario && !!errors['dadosTrabalho.salario']}
            helperText={touched.dadosTrabalho?.salario && errors['dadosTrabalho.salario']}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="dadosTrabalho.cargaHoraria"
            label="Carga Horária Semanal"
            type="number"
            value={values.dadosTrabalho.cargaHoraria}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            select
            name="dadosTrabalho.tipoContrato"
            label="Tipo de Contrato"
            value={values.dadosTrabalho.tipoContrato}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <MenuItem value="prazo_indeterminado">Prazo Indeterminado</MenuItem>
            <MenuItem value="prazo_determinado">Prazo Determinado</MenuItem>
            <MenuItem value="temporario">Temporário</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            select
            name="dadosTrabalho.regimeTrabalho"
            label="Regime de Trabalho"
            value={values.dadosTrabalho.regimeTrabalho}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <MenuItem value="mensalista">Mensalista</MenuItem>
            <MenuItem value="horista">Horista</MenuItem>
          </TextField>
        </Grid>
      </Grid>
    );
  };

  return (
    <FormularioBase<FormValues>
      titulo={empregadoId ? 'Editar Dados do Empregado' : 'Cadastro de Empregado'}
      valoresIniciais={dadosIniciais}
      validacao={validarFormulario}
      onSubmit={handleSubmit}
      botaoSubmit={empregadoId ? 'Atualizar' : 'Cadastrar'}
    >
      {renderFormulario}
    </FormularioBase>
  );
} 