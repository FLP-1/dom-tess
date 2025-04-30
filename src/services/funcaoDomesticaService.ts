import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccount from '../secrets/serviceAccount.json';
import { FuncaoDomestica } from '@/types/esocial';

// Inicializa o Firebase Admin
const app = initializeApp({
  credential: cert(serviceAccount as any)
});

const dbAdmin = getFirestore(app);

export class FuncaoDomesticaService {
  static async criarFuncao(funcao: Omit<FuncaoDomestica, 'id' | 'ultimaAtualizacao'>): Promise<FuncaoDomestica> {
    const docRef = dbAdmin.collection('funcoes_domesticas').doc();
    const dadosCompletos: FuncaoDomestica = {
      ...funcao,
      id: docRef.id,
      ultimaAtualizacao: new Date()
    };
    
    await docRef.set(dadosCompletos);
    return dadosCompletos;
  }

  static async criarFuncoesEmMassa(funcoes: Omit<FuncaoDomestica, 'id' | 'ultimaAtualizacao'>[]): Promise<void> {
    const batch = dbAdmin.batch();
    
    funcoes.forEach(funcao => {
      const docRef = dbAdmin.collection('funcoes_domesticas').doc();
      const dadosCompletos: FuncaoDomestica = {
        ...funcao,
        id: docRef.id,
        ultimaAtualizacao: new Date()
      };
      batch.set(docRef, dadosCompletos);
    });
    
    await batch.commit();
  }

  static async listarFuncoes(): Promise<FuncaoDomestica[]> {
    const snapshot = await dbAdmin.collection('funcoes_domesticas').get();
    return snapshot.docs.map(doc => doc.data() as FuncaoDomestica);
  }

  static async obterFuncaoPorId(id: string): Promise<FuncaoDomestica | null> {
    const doc = await dbAdmin.collection('funcoes_domesticas').doc(id).get();
    return doc.exists ? doc.data() as FuncaoDomestica : null;
  }
} 