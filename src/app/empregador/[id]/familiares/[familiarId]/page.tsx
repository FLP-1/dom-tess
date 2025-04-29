'use client';

import React, { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import { FormularioFamiliar } from '@/components/forms/FormularioFamiliar';
import { EsocialService } from '@/services/esocialService';
import { useRouter } from 'next/navigation';
import { Familiar } from '@/types/esocial';

interface Props {
  params: {
    id: string;
    familiarId: string;
  };
}

export default function FamiliarPage({ params }: Props) {
  const router = useRouter();
  const [familiar, setFamiliar] = useState<Familiar | null>(null);
  const isNovo = params.familiarId === 'novo';

  useEffect(() => {
    if (!isNovo) {
      const carregarFamiliar = async () => {
        try {
          const familiares = await EsocialService.listarFamiliares(params.id);
          const familiarEncontrado = familiares.find(f => f.id === params.familiarId);
          if (familiarEncontrado) {
            setFamiliar(familiarEncontrado);
          } else {
            router.push(`/empregador/${params.id}/familiares`);
          }
        } catch (error) {
          console.error('Erro ao carregar familiar:', error);
          router.push(`/empregador/${params.id}/familiares`);
        }
      };

      carregarFamiliar();
    }
  }, [params.id, params.familiarId, isNovo, router]);

  return (
    <Container maxWidth="lg">
      <FormularioFamiliar
        empregadorId={params.id}
        familiarId={isNovo ? undefined : params.familiarId}
        dadosIniciais={familiar ? {
          empregadorId: familiar.empregadorId,
          nome: familiar.nome,
          parentesco: familiar.parentesco,
          dataNascimento: familiar.dataNascimento,
          cpf: familiar.cpf,
          telefone: familiar.telefone,
          email: familiar.email,
          status: familiar.status
        } : undefined}
      />
    </Container>
  );
} 