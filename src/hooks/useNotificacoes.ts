'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { buscarNotificacoes } from '@/services/notificacoes';

interface Notificacao {
  id: string;
  tipo: 'atraso' | 'falta' | 'horario' | 'alerta';
  mensagem: string;
  data: Date;
  lida: boolean;
}

export function useNotificacoes(userId: string) {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let unsubscribe: () => void;

    const setupNotificacoes = async () => {
      try {
        // Carrega as notificações iniciais
        const notificacoesIniciais = await buscarNotificacoes(userId);
        setNotificacoes(notificacoesIniciais);

        // Configura o listener em tempo real
        const q = query(
          collection(db, 'notificacoes'),
          where('userId', '==', userId),
          orderBy('data', 'desc')
        );

        unsubscribe = onSnapshot(q, (snapshot) => {
          const novasNotificacoes = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            data: doc.data().data.toDate(),
          })) as Notificacao[];

          setNotificacoes(novasNotificacoes);
        });
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    setupNotificacoes();

    // Limpa o listener quando o componente é desmontado
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userId, setNotificacoes, setError, setLoading]);

  const notificacoesNaoLidas = notificacoes.filter(notif => !notif.lida);

  return {
    notificacoes,
    notificacoesNaoLidas,
    loading,
    error,
  };
} 