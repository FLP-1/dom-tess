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

type FormValues = Omit<DadosEmpregador, 'id' | 'ultimaAtualizacao' | 'certificadoDigital'>;

const valoresIniciaisVazios: FormValues = {
  userId: '',
  cpf: '',
  nome: '',
  dataNascimento: new Date(),
  nacionalidade: '',
  estadoCivil: '',
  rg: {
    numero: '',
    orgaoEmissor: '',
    dataEmissao: new Date()
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
  dadosImovel: {
    tipoImovel: 'proprio',
    numeroEmpregados: 0
  },
  dadosFamiliares: {
    nomeMae: '',
    nomePai: ''
  },
  profissao: '',
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
    
    // Dados Pessoais
    if (!values.cpf) erros.cpf = 'CPF é obrigatório';
    if (!values.nome) erros.nome = 'Nome é obrigatório';
    if (!values.dataNascimento) erros.dataNascimento = 'Data de nascimento é obrigatória';
    if (!values.nacionalidade) erros.nacionalidade = 'Nacionalidade é obrigatória';
    if (!values.estadoCivil) erros.estadoCivil = 'Estado civil é obrigatório';

    // RG
    if (!values.rg.numero) erros['rg.numero'] = 'Número do RG é obrigatório';
    if (!values.rg.orgaoEmissor) erros['rg.orgaoEmissor'] = 'Órgão emissor do RG é obrigatório';
    if (!values.rg.dataEmissao) erros['rg.dataEmissao'] = 'Data de emissão do RG é obrigatória';

    // Endereço
    if (!values.endereco.logradouro) erros['endereco.logradouro'] = 'Logradouro é obrigatório';
    if (!values.endereco.numero) erros['endereco.numero'] = 'Número é obrigatório';
    if (!values.endereco.bairro) erros['endereco.bairro'] = 'Bairro é obrigatório';
    if (!values.endereco.cidade) erros['endereco.cidade'] = 'Cidade é obrigatória';
    if (!values.endereco.estado) erros['endereco.estado'] = 'Estado é obrigatório';
    if (!values.endereco.cep) erros['endereco.cep'] = 'CEP é obrigatório';

    // Contato
    if (!values.contato.telefone) erros['contato.telefone'] = 'Telefone é obrigatório';

    // Dados Bancários
    if (!values.dadosBancarios.banco) erros['dadosBancarios.banco'] = 'Banco é obrigatório';
    if (!values.dadosBancarios.agencia) erros['dadosBancarios.agencia'] = 'Agência é obrigatória';
    if (!values.dadosBancarios.conta) erros['dadosBancarios.conta'] = 'Conta é obrigatória';
    if (!values.dadosBancarios.tipoConta) erros['dadosBancarios.tipoConta'] = 'Tipo de conta é obrigatório';

    // Dados do Imóvel
    if (!values.dadosImovel.tipoImovel) erros['dadosImovel.tipoImovel'] = 'Tipo do imóvel é obrigatório';
    if (values.dadosImovel.numeroEmpregados < 0) erros['dadosImovel.numeroEmpregados'] = 'Número de empregados deve ser maior ou igual a zero';

    // Dados Familiares
    if (!values.dadosFamiliares.nomeMae) erros['dadosFamiliares.nomeMae'] = 'Nome da mãe é obrigatório';
    if (!values.dadosFamiliares.nomePai) erros['dadosFamiliares.nomePai'] = 'Nome do pai é obrigatório';
    
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
    const { values, handleChange, handleBlur, touched, errors, setFieldValue } = formikProps;

    return (
      <Grid container spacing={2}>
        {/* Dados Pessoais */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>Dados Pessoais</Typography>
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
            name="nome"
            label="Nome Completo"
            value={values.nome}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.nome && !!errors.nome}
            helperText={touched.nome && errors.nome}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <DatePicker
            label="Data de Nascimento"
            value={values.dataNascimento}
            onChange={(date) => setFieldValue('dataNascimento', date)}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            name="nacionalidade"
            label="Nacionalidade"
            value={values.nacionalidade}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.nacionalidade && !!errors.nacionalidade}
            helperText={touched.nacionalidade && errors.nacionalidade}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Estado Civil</InputLabel>
            <Select
              name="estadoCivil"
              value={values.estadoCivil}
              onChange={handleChange}
              label="Estado Civil"
            >
              <MenuItem value="solteiro">Solteiro(a)</MenuItem>
              <MenuItem value="casado">Casado(a)</MenuItem>
              <MenuItem value="divorciado">Divorciado(a)</MenuItem>
              <MenuItem value="viuvo">Viúvo(a)</MenuItem>
              <MenuItem value="uniao_estavel">União Estável</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* RG */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>Documento de Identidade (RG)</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            name="rg.numero"
            label="Número do RG"
            value={values.rg.numero}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            name="rg.orgaoEmissor"
            label="Órgão Emissor"
            value={values.rg.orgaoEmissor}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <DatePicker
            label="Data de Emissão"
            value={values.rg.dataEmissao}
            onChange={(date) => setFieldValue('rg.dataEmissao', date)}
          />
        </Grid>

        {/* Endereço */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>Endereço</Typography>
        </Grid>

        <Grid item xs={12} md={8}>
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

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            name="endereco.complemento"
            label="Complemento"
            value={values.endereco.complemento}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            name="endereco.bairro"
            label="Bairro"
            value={values.endereco.bairro}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            name="endereco.cep"
            label="CEP"
            value={values.endereco.cep}
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

        {/* Contato */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>Contato</Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="contato.telefone"
            label="Telefone"
            value={values.contato.telefone}
            onChange={handleChange}
            onBlur={handleBlur}
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
          />
        </Grid>

        {/* Dados Bancários */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>Dados Bancários</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            name="dadosBancarios.banco"
            label="Banco"
            value={values.dadosBancarios.banco}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            name="dadosBancarios.agencia"
            label="Agência"
            value={values.dadosBancarios.agencia}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            name="dadosBancarios.conta"
            label="Conta"
            value={values.dadosBancarios.conta}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Tipo de Conta</InputLabel>
            <Select
              name="dadosBancarios.tipoConta"
              value={values.dadosBancarios.tipoConta}
              onChange={handleChange}
              label="Tipo de Conta"
            >
              <MenuItem value="corrente">Conta Corrente</MenuItem>
              <MenuItem value="poupanca">Conta Poupança</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Dados do Imóvel */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>Dados do Imóvel</Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Tipo do Imóvel</InputLabel>
            <Select
              name="dadosImovel.tipoImovel"
              value={values.dadosImovel.tipoImovel}
              onChange={handleChange}
              label="Tipo do Imóvel"
            >
              <MenuItem value="proprio">Próprio</MenuItem>
              <MenuItem value="alugado">Alugado</MenuItem>
              <MenuItem value="cedido">Cedido</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="dadosImovel.numeroEmpregados"
            label="Número de Empregados"
            type="number"
            value={values.dadosImovel.numeroEmpregados}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Grid>

        {/* Dados Familiares */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>Dados Familiares</Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="dadosFamiliares.nomeMae"
            label="Nome da Mãe"
            value={values.dadosFamiliares.nomeMae}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="dadosFamiliares.nomePai"
            label="Nome do Pai"
            value={values.dadosFamiliares.nomePai}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Grid>

        {/* Profissão */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>Profissão</Typography>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            name="profissao"
            label="Profissão"
            value={values.profissao}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Grid>
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