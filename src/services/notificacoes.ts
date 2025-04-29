import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';

interface Notificacao {
  userId: string;
  tipo: 'atraso' | 'falta' | 'horario' | 'alerta';
  mensagem: string;
  data: Date;
  lida: boolean;
}

export async function criarNotificacao(notificacao: Omit<Notificacao, 'data' | 'lida'>) {
  try {
    await addDoc(collection(db, 'notificacoes'), {
      ...notificacao,
      data: new Date(),
      lida: false,
    });
  } catch (error) {
    console.error('Erro ao criar notificação:', error);
    throw error;
  }
}

export async function buscarNotificacoes(userId: string) {
  try {
    const q = query(
      collection(db, 'notificacoes'),
      where('userId', '==', userId),
      orderBy('data', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      data: doc.data().data.toDate(),
    })) as Notificacao[];
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    throw error;
  }
}

export async function marcarComoLida(notificacaoId: string) {
  try {
    const notificacaoRef = doc(db, 'notificacoes', notificacaoId);
    await updateDoc(notificacaoRef, { lida: true });
  } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error);
    throw error;
  }
}

// Funções auxiliares para criar tipos específicos de notificações
export async function criarNotificacaoAtraso(userId: string, minutos: number) {
  await criarNotificacao({
    userId,
    tipo: 'atraso',
    mensagem: `Você está ${minutos} minutos atrasado para o trabalho.`,
  });
}

export async function criarNotificacaoFalta(userId: string) {
  await criarNotificacao({
    userId,
    tipo: 'falta',
    mensagem: 'Você não registrou entrada hoje.',
  });
}

export async function criarNotificacaoHorario(userId: string, tipo: 'entrada' | 'saida' | 'intervalo') {
  const mensagens = {
    entrada: 'Hora de registrar sua entrada.',
    saida: 'Hora de registrar sua saída.',
    intervalo: 'Hora de registrar seu intervalo.',
  };

  await criarNotificacao({
    userId,
    tipo: 'horario',
    mensagem: mensagens[tipo],
  });
}

export async function criarNotificacaoAlerta(userId: string, mensagem: string) {
  await criarNotificacao({
    userId,
    tipo: 'alerta',
    mensagem,
  });
} 