'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Stepper, Step, StepLabel } from '@mui/material';
import { FormularioEmpregado } from '@/components/forms/FormularioEmpregado';
import { EsocialService } from '@/services/esocialService';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { DadosEmpregado } from '@/types/esocial';

const passos = [
  'Dados Pessoais',
  'Dados Profissionais',
  'Confirmação'
];

export default function ComplementoDadosPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [passoAtivo, setPassoAtivo] = useState(0);
  const [dadosEmpregado, setDadosEmpregado] = useState<DadosEmpregado | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const carregarDados = async () => {
      try {
        const dados = await EsocialService.obterDadosEmpregado(user.uid);
        if (dados) {
          setDadosEmpregado(dados);
          if (dados.status === 'completo') {
            setPassoAtivo(2);
          } else if (dados.dadosProfissionais) {
            setPassoAtivo(1);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    carregarDados();
  }, [user, router]);

  const renderConteudo = () => {
    switch (passoAtivo) {
      case 0:
        return (
          <FormularioEmpregado
            dadosIniciais={dadosEmpregado ? {
              userId: dadosEmpregado.userId,
              empregadorId: dadosEmpregado.empregadorId,
              cpf: dadosEmpregado.cpf,
              nome: dadosEmpregado.nome,
              dataNascimento: dadosEmpregado.dataNascimento,
              nacionalidade: dadosEmpregado.nacionalidade,
              estadoCivil: dadosEmpregado.estadoCivil,
              rg: dadosEmpregado.rg,
              endereco: dadosEmpregado.endereco,
              contato: dadosEmpregado.contato,
              dadosBancarios: dadosEmpregado.dadosBancarios,
              dadosFamiliares: dadosEmpregado.dadosFamiliares,
              status: dadosEmpregado.status
            } : undefined}
            empregadoId={dadosEmpregado?.id}
          />
        );
      case 1:
        return (
          <FormularioEmpregado
            dadosIniciais={dadosEmpregado ? {
              userId: dadosEmpregado.userId,
              empregadorId: dadosEmpregado.empregadorId,
              dadosProfissionais: dadosEmpregado.dadosProfissionais,
              dadosTrabalhistas: dadosEmpregado.dadosTrabalhistas,
              grauInstrucao: dadosEmpregado.grauInstrucao,
              numeroDependentes: dadosEmpregado.numeroDependentes,
              informacoesSaude: dadosEmpregado.informacoesSaude,
              status: dadosEmpregado.status
            } : undefined}
            empregadoId={dadosEmpregado?.id}
          />
        );
      case 2:
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Dados Completos
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Seus dados foram cadastrados com sucesso e você já pode começar a usar o sistema.
            </Typography>
            <Button
              variant="contained"
              onClick={() => router.push('/dashboard')}
            >
              Ir para o Dashboard
            </Button>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ width: '100%' }}>
        <Stepper activeStep={passoAtivo} alternativeLabel>
          {passos.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      {renderConteudo()}
    </Container>
  );
} 