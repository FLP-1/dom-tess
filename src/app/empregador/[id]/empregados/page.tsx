'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import { EsocialService } from '@/services/esocialService';
import { useRouter } from 'next/navigation';
import { DadosEmpregado } from '@/types/esocial';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Props {
  params: {
    id: string;
  };
}

export default function ListagemEmpregadosPage({ params }: Props) {
  const router = useRouter();
  const [empregados, setEmpregados] = useState<DadosEmpregado[]>([]);

  useEffect(() => {
    const carregarEmpregados = async () => {
      try {
        const lista = await EsocialService.listarEmpregados(params.id);
        setEmpregados(lista);
      } catch (error) {
        console.error('Erro ao carregar empregados:', error);
      }
    };

    carregarEmpregados();
  }, [params.id]);

  const getCorStatus = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'success';
      case 'inativo':
        return 'error';
      case 'ferias':
        return 'warning';
      case 'licenca':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Empregados
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push(`/empregador/${params.id}/empregados/novo`)}
          >
            Novo Empregado
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>CPF</TableCell>
                <TableCell>Cargo</TableCell>
                <TableCell>Data de Admissão</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {empregados.map((empregado) => (
                <TableRow key={empregado.id}>
                  <TableCell>{empregado.nome}</TableCell>
                  <TableCell>{empregado.cpf}</TableCell>
                  <TableCell>{empregado.dadosTrabalho.cargo}</TableCell>
                  <TableCell>
                    {format(new Date(empregado.dadosTrabalho.dataAdmissao), 'dd/MM/yyyy', { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={empregado.status}
                      color={getCorStatus(empregado.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => router.push(`/empregador/${params.id}/empregados/${empregado.id}`)}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {empregados.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary">
                      Nenhum empregado cadastrado
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
} 