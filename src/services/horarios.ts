import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore';

interface HorarioTrabalho {
  id?: string;
  userId: string;
  entrada: string;
  saida: string;
  intervalo: string;
  duracaoIntervalo: string;
  regime: 'CLT' | 'PJ' | 'Autônomo';
  flexivel: boolean;
  diasTrabalho: string[];
  createdAt?: Date;
}

export async function criarHorario(horario: Omit<HorarioTrabalho, 'id' | 'createdAt'>) {
  try {
    const docRef = await addDoc(collection(db, 'horarios_trabalho'), {
      ...horario,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Erro ao criar horário:', error);
    throw error;
  }
}

export async function buscarHorarios(userId: string) {
  try {
    const q = query(
      collection(db, 'horarios_trabalho'),
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
    })) as HorarioTrabalho[];
  } catch (error) {
    console.error('Erro ao buscar horários:', error);
    throw error;
  }
}

export async function atualizarHorario(horarioId: string, dados: Partial<HorarioTrabalho>) {
  try {
    const horarioRef = doc(db, 'horarios_trabalho', horarioId);
    await updateDoc(horarioRef, dados);
  } catch (error) {
    console.error('Erro ao atualizar horário:', error);
    throw error;
  }
}

export async function deletarHorario(horarioId: string) {
  try {
    await deleteDoc(doc(db, 'horarios_trabalho', horarioId));
  } catch (error) {
    console.error('Erro ao deletar horário:', error);
    throw error;
  }
}

export async function verificarAtraso(userId: string, horarioEntrada: string) {
  try {
    const horarios = await buscarHorarios(userId);
    if (horarios.length === 0) return false;

    const horarioAtual = new Date();
    const [hora, minuto] = horarioEntrada.split(':').map(Number);
    const horarioEsperado = new Date();
    horarioEsperado.setHours(hora, minuto, 0, 0);

    return horarioAtual > horarioEsperado;
  } catch (error) {
    console.error('Erro ao verificar atraso:', error);
    throw error;
  }
}

export async function verificarFalta(userId: string) {
  try {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const q = query(
      collection(db, 'registros_ponto'),
      where('userId', '==', userId),
      where('tipo', '==', 'entrada'),
      where('dataHora', '>=', hoje)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  } catch (error) {
    console.error('Erro ao verificar falta:', error);
    throw error;
  }
} 