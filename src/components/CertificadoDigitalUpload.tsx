'use client';

import React, { useState } from 'react';
import { Box, Button, TextField, Typography, CircularProgress } from '@mui/material';
import { Upload } from '@mui/icons-material';
import { EsocialService } from '@/services/esocialService';
import { toast } from 'react-toastify';

interface Props {
  empregadorId: string;
}

export function CertificadoDigitalUpload({ empregadorId }: Props) {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleArquivoSelecionado = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setArquivo(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!arquivo || !senha) {
      toast.error('Selecione um arquivo e informe a senha do certificado');
      return;
    }

    setCarregando(true);
    try {
      // TODO: Implementar o upload do arquivo para o storage
      const arquivoUrl = 'url_do_arquivo';
      
      await EsocialService.uploadCertificadoDigital(empregadorId, {
        nome: arquivo.name,
        dataValidade: new Date(), // TODO: Extrair data de validade do certificado
        senha,
        arquivoUrl
      });

      toast.success('Certificado digital enviado com sucesso!');
      setArquivo(null);
      setSenha('');
    } catch (error) {
      console.error('Erro ao enviar certificado:', error);
      toast.error('Erro ao enviar certificado. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Box sx={{ border: '1px dashed grey', p: 3, borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        Certificado Digital
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          variant="outlined"
          component="label"
          startIcon={<Upload />}
          disabled={carregando}
        >
          Selecionar Certificado
          <input
            type="file"
            hidden
            accept=".pfx"
            onChange={handleArquivoSelecionado}
          />
        </Button>

        {arquivo && (
          <Typography variant="body2" color="textSecondary">
            Arquivo selecionado: {arquivo.name}
          </Typography>
        )}

        <TextField
          label="Senha do Certificado"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          disabled={carregando}
        />

        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!arquivo || !senha || carregando}
          startIcon={carregando ? <CircularProgress size={20} /> : null}
        >
          Enviar Certificado
        </Button>
      </Box>
    </Box>
  );
} 