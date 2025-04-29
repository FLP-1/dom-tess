'use client';

import React, { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import { FormularioEmpregado } from '@/components/forms/FormularioEmpregado';
import { EsocialService } from '@/services/esocialService';
import { useRouter } from 'next/navigation';
import { DadosEmpregado } from '@/types/esocial';

interface Props {
  params: {
    id: string;
    empregadoId: string;
  };
}

export default function EmpregadoPage({ params }: Props) {
  const router = useRouter();
  const [empregado, setEmpregado] = useState<DadosEmpregado | null>(null);
  const isNovo = params.empregadoId === 'novo';

  useEffect(() => {
    if (!isNovo) {
      const carregarEmpregado = async () => {
        try {
          const empregados = await EsocialService.listarEmpregados(params.id);
          const empregadoEncontrado = empregados.find(e => e.id === params.empregadoId);
          if (empregadoEncontrado) {
            setEmpregado(empregadoEncontrado);
          } else {
            router.push(`/empregador/${params.id}/empregados`);
          }
        } catch (error) {
          console.error('Erro ao carregar empregado:', error);
          router.push(`/empregador/${params.id}/empregados`);
        }
      };

      carregarEmpregado();
    }
  }, [params.id, params.empregadoId, isNovo, router]);

  return (
    <Container maxWidth="lg">
      <FormularioEmpregado
        empregadorId={params.id}
        empregadoId={isNovo ? undefined : params.empregadoId}
        dadosIniciais={empregado ? {
          empregadorId: empregado.empregadorId,
          cpf: empregado.cpf,
          nome: empregado.nome,
          dataNascimento: empregado.dataNascimento,
          pis: empregado.pis,
          ctps: empregado.ctps,
          endereco: empregado.endereco,
          contato: empregado.contato,
          dadosBancarios: empregado.dadosBancarios,
          dadosTrabalho: empregado.dadosTrabalho,
          status: empregado.status
        } : undefined}
      />
    </Container>
  );
} 