'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Stepper, Step, StepLabel } from '@mui/material';
import { FormularioEmpregador } from '@/components/forms/FormularioEmpregador';
import { EsocialService } from '@/services/esocialService';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { DadosEmpregador } from '@/types/esocial';

const passos = [
  'Dados Pessoais',
  'Certificado Digital',
  'Confirmação'
];

export default function ComplementoDadosPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [passoAtivo, setPassoAtivo] = useState(0);
  const [dadosEmpregador, setDadosEmpregador] = useState<DadosEmpregador | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const carregarDados = async () => {
      try {
        const dados = await EsocialService.obterDadosEmpregador(user.uid);
        if (dados) {
          setDadosEmpregador(dados);
          if (dados.certificadoDigital) {
            setPassoAtivo(2);
          } else if (dados.status === 'completo') {
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
          <FormularioEmpregador
            dadosIniciais={dadosEmpregador ? {
              userId: dadosEmpregador.userId,
              cpf: dadosEmpregador.cpf,
              nome: dadosEmpregador.nome,
              dataNascimento: dadosEmpregador.dataNascimento,
              endereco: dadosEmpregador.endereco,
              contato: dadosEmpregador.contato,
              dadosBancarios: dadosEmpregador.dadosBancarios,
              status: dadosEmpregador.status
            } : undefined}
            empregadorId={dadosEmpregador?.id}
          />
        );
      case 1:
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Certificado Digital
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Para enviar informações ao eSocial Doméstico, é necessário ter um certificado digital válido.
              Por favor, faça o upload do seu certificado digital e informe a senha.
            </Typography>
            {dadosEmpregador && (
              <CertificadoDigitalUpload empregadorId={dadosEmpregador.id} />
            )}
          </Box>
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
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Complemento de Dados
        </Typography>

        <Stepper activeStep={passoAtivo} sx={{ mb: 4 }}>
          {passos.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderConteudo()}
      </Box>
    </Container>
  );
} 