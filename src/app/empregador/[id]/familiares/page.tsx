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
import { Familiar } from '@/types/esocial';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Props {
  params: {
    id: string;
  };
}

export default function ListagemFamiliaresPage({ params }: Props) {
  const router = useRouter();
  const [familiares, setFamiliares] = useState<Familiar[]>([]);

  useEffect(() => {
    const carregarFamiliares = async () => {
      try {
        const lista = await EsocialService.listarFamiliares(params.id);
        setFamiliares(lista);
      } catch (error) {
        console.error('Erro ao carregar familiares:', error);
      }
    };

    carregarFamiliares();
  }, [params.id]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Familiares
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push(`/empregador/${params.id}/familiares/novo`)}
          >
            Novo Familiar
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Parentesco</TableCell>
                <TableCell>CPF</TableCell>
                <TableCell>Data de Nascimento</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {familiares.map((familiar) => (
                <TableRow key={familiar.id}>
                  <TableCell>{familiar.nome}</TableCell>
                  <TableCell>{familiar.parentesco}</TableCell>
                  <TableCell>{familiar.cpf}</TableCell>
                  <TableCell>
                    {format(new Date(familiar.dataNascimento), 'dd/MM/yyyy', { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={familiar.status}
                      color={familiar.status === 'ativo' ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => router.push(`/empregador/${params.id}/familiares/${familiar.id}`)}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {familiares.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary">
                      Nenhum familiar cadastrado
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