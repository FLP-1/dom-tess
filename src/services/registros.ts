import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { verificarAtraso, verificarFalta } from './horarios';
import {
  criarNotificacaoAtraso,
  criarNotificacaoFalta,
  criarNotificacaoHorario,
} from './notificacoes';

interface RegistroPonto {
  id?: string;
  userId: string;
  tipo: 'entrada' | 'saida' | 'intervalo';
  dataHora: Date;
  localizacao: { lat: number; lng: number };
  wifi: string;
  observacao: string;
  createdAt?: Date;
}

export async function criarRegistro(registro: Omit<RegistroPonto, 'id' | 'createdAt'>) {
  try {
    const docRef = await addDoc(collection(db, 'registros_ponto'), {
      ...registro,
      createdAt: new Date(),
    });

    // Verificar atraso e criar notificação se necessário
    if (registro.tipo === 'entrada') {
      const atraso = await verificarAtraso(registro.userId, registro.dataHora.toTimeString().slice(0, 5));
      if (atraso) {
        const minutosAtraso = Math.floor((registro.dataHora.getTime() - new Date().setHours(8, 0, 0, 0)) / 60000);
        await criarNotificacaoAtraso(registro.userId, minutosAtraso);
      }
    }

    return docRef.id;
  } catch (error) {
    console.error('Erro ao criar registro:', error);
    throw error;
  }
}

export async function buscarRegistros(userId: string, dataInicio?: Date, dataFim?: Date) {
  try {
    let q = query(
      collection(db, 'registros_ponto'),
      where('userId', '==', userId),
      orderBy('dataHora', 'desc')
    );

    if (dataInicio && dataFim) {
      q = query(
        q,
        where('dataHora', '>=', Timestamp.fromDate(dataInicio)),
        where('dataHora', '<=', Timestamp.fromDate(dataFim))
      );
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      dataHora: doc.data().dataHora.toDate(),
      createdAt: doc.data().createdAt.toDate(),
    })) as RegistroPonto[];
  } catch (error) {
    console.error('Erro ao buscar registros:', error);
    throw error;
  }
}

export async function verificarRegistrosDoDia(userId: string) {
  try {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const registros = await buscarRegistros(userId, hoje, new Date());
    const temEntrada = registros.some(r => r.tipo === 'entrada');
    const temSaida = registros.some(r => r.tipo === 'saida');
    const temIntervalo = registros.some(r => r.tipo === 'intervalo');

    return { temEntrada, temSaida, temIntervalo };
  } catch (error) {
    console.error('Erro ao verificar registros do dia:', error);
    throw error;
  }
}

export async function verificarEEnviarNotificacoes(userId: string) {
  try {
    const { temEntrada } = await verificarRegistrosDoDia(userId);
    const falta = await verificarFalta(userId);

    if (!temEntrada && falta) {
      await criarNotificacaoFalta(userId);
    }
  } catch (error) {
    console.error('Erro ao verificar e enviar notificações:', error);
    throw error;
  }
}

export async function calcularHorasTrabalhadas(userId: string, dataInicio: Date, dataFim: Date) {
  try {
    const registros = await buscarRegistros(userId, dataInicio, dataFim);
    let totalMinutos = 0;

    for (let i = 0; i < registros.length; i += 2) {
      if (i + 1 < registros.length) {
        const entrada = registros[i];
        const saida = registros[i + 1];
        const diferenca = saida.dataHora.getTime() - entrada.dataHora.getTime();
        totalMinutos += Math.floor(diferenca / 60000);
      }
    }

    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;

    return { horas, minutos };
  } catch (error) {
    console.error('Erro ao calcular horas trabalhadas:', error);
    throw error;
  }
} 