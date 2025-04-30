'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { buscarHorarios } from '@/services/horarios';

interface HorarioTrabalho {
  id: string;
  userId: string;
  entrada: string;
  saida: string;
  intervalo: string;
  duracaoIntervalo: string;
  regime: 'CLT' | 'PJ' | 'Autônomo';
  flexivel: boolean;
  diasTrabalho: string[];
  createdAt: Date;
}

export function useHorarios(userId: string) {
  const [horarios, setHorarios] = useState<HorarioTrabalho[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let unsubscribe: () => void;

    const setupHorarios = async () => {
      try {
        // Carrega os horários iniciais
        const horariosIniciais = await buscarHorarios(userId);
        setHorarios(horariosIniciais);

        // Configura o listener em tempo real
        const q = query(
          collection(db, 'horarios_trabalho'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );

        unsubscribe = onSnapshot(q, (snapshot) => {
          const novosHorarios = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate(),
          })) as HorarioTrabalho[];

          setHorarios(novosHorarios);
        });
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    setupHorarios();

    // Limpa o listener quando o componente é desmontado
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userId]);

  const horarioAtual = horarios[0] || null;

  return {
    horarios,
    horarioAtual,
    loading,
    error,
  };
} 