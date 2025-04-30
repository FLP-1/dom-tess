import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccount from '../secrets/serviceAccount.json';
import { DadosEmpregador, DadosEmpregado, Familiar, CertificadoDigital } from '../types/esocial';
import { db } from '@/config/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { collection, query, where, getDocs } from 'firebase/firestore';

// Inicializa o Firebase Admin
const app = initializeApp({
  credential: cert(serviceAccount as any)
});

const dbAdmin = getFirestore(app);

export class EsocialService {
  // Métodos para Empregador
  static async criarDadosEmpregador(dados: Omit<DadosEmpregador, 'id' | 'ultimaAtualizacao'>): Promise<DadosEmpregador> {
    const empregadorRef = doc(db, 'empregadores', dados.userId);
    const dadosCompletos: DadosEmpregador = {
      ...dados,
      id: empregadorRef.id,
      ultimaAtualizacao: new Date(),
      status: 'incompleto'
    };
    
    await setDoc(empregadorRef, dadosCompletos);
    return dadosCompletos;
  }

  static async atualizarDadosEmpregador(id: string, dados: Partial<DadosEmpregador>): Promise<void> {
    const empregadorRef = doc(db, 'empregadores', id);
    await updateDoc(empregadorRef, {
      ...dados,
      ultimaAtualizacao: new Date()
    });
  }

  static async obterDadosEmpregador(userId: string): Promise<DadosEmpregador | null> {
    const empregadorRef = doc(db, 'empregadores', userId);
    const empregadorDoc = await getDoc(empregadorRef);
    
    if (empregadorDoc.exists()) {
      return empregadorDoc.data() as DadosEmpregador;
    }
    
    return null;
  }

  // Métodos para Certificado Digital
  static async uploadCertificadoDigital(
    empregadorId: string,
    certificado: Omit<CertificadoDigital, 'id' | 'status'>
  ): Promise<CertificadoDigital> {
    const docRef = dbAdmin.collection('certificados').doc();
    const dadosCompletos = {
      ...certificado,
      id: docRef.id,
      status: 'ativo'
    };
    
    await docRef.set(dadosCompletos);
    await dbAdmin.collection('empregadores').doc(empregadorId).update({
      certificadoDigital: dadosCompletos
    });
    
    return dadosCompletos;
  }

  // Métodos para Empregados
  static async criarEmpregado(dados: Omit<DadosEmpregado, 'id' | 'ultimaAtualizacao'>): Promise<DadosEmpregado> {
    const docRef = db.collection('empregados').doc();
    const dadosCompletos = {
      ...dados,
      id: docRef.id,
      ultimaAtualizacao: new Date(),
      status: 'ativo'
    };
    
    await docRef.set(dadosCompletos);
    return dadosCompletos;
  }

  static async atualizarEmpregado(id: string, dados: Partial<DadosEmpregado>): Promise<void> {
    const docRef = db.collection('empregados').doc(id);
    await docRef.update({
      ...dados,
      ultimaAtualizacao: new Date()
    });
  }

  static async listarEmpregados(empregadorId: string): Promise<DadosEmpregado[]> {
    const snapshot = await db.collection('empregados')
      .where('empregadorId', '==', empregadorId)
      .get();
    
    return snapshot.docs.map(doc => doc.data() as DadosEmpregado);
  }

  // Métodos para Familiares
  static async criarFamiliar(dados: Omit<Familiar, 'id' | 'ultimaAtualizacao'>): Promise<Familiar> {
    const docRef = db.collection('familiares').doc();
    const dadosCompletos = {
      ...dados,
      id: docRef.id,
      ultimaAtualizacao: new Date(),
      status: 'ativo'
    };
    
    await docRef.set(dadosCompletos);
    return dadosCompletos;
  }

  static async atualizarFamiliar(id: string, dados: Partial<Familiar>): Promise<void> {
    const docRef = db.collection('familiares').doc(id);
    await docRef.update({
      ...dados,
      ultimaAtualizacao: new Date()
    });
  }

  static async listarFamiliares(empregadorId: string): Promise<Familiar[]> {
    const snapshot = await db.collection('familiares')
      .where('empregadorId', '==', empregadorId)
      .get();
    
    return snapshot.docs.map(doc => doc.data() as Familiar);
  }

  static async criarDadosEmpregado(dados: Omit<DadosEmpregado, 'id' | 'ultimaAtualizacao'>): Promise<DadosEmpregado> {
    const empregadoRef = doc(db, 'empregados', dados.userId);
    const dadosCompletos: DadosEmpregado = {
      ...dados,
      id: empregadoRef.id,
      ultimaAtualizacao: new Date(),
      status: 'incompleto'
    };
    
    await setDoc(empregadoRef, dadosCompletos);
    return dadosCompletos;
  }

  static async atualizarDadosEmpregado(id: string, dados: Partial<DadosEmpregado>): Promise<void> {
    const empregadoRef = doc(db, 'empregados', id);
    await updateDoc(empregadoRef, {
      ...dados,
      ultimaAtualizacao: new Date()
    });
  }

  static async obterDadosEmpregado(userId: string): Promise<DadosEmpregado | null> {
    const empregadoRef = doc(db, 'empregados', userId);
    const empregadoDoc = await getDoc(empregadoRef);
    
    if (empregadoDoc.exists()) {
      return empregadoDoc.data() as DadosEmpregado;
    }
    
    return null;
  }

  static async obterEmpregadosPorEmpregador(empregadorId: string): Promise<DadosEmpregado[]> {
    const empregadosRef = collection(db, 'empregados');
    const q = query(empregadosRef, where('empregadorId', '==', empregadorId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as DadosEmpregado[];
  }

  static async atualizarStatusEmpregado(id: string, status: 'incompleto' | 'completo'): Promise<void> {
    const empregadoRef = doc(db, 'empregados', id);
    await updateDoc(empregadoRef, {
      status,
      ultimaAtualizacao: new Date()
    });
  }

  static async atualizarStatusEmpregador(id: string, status: 'incompleto' | 'completo'): Promise<void> {
    const empregadorRef = doc(db, 'empregadores', id);
    await updateDoc(empregadorRef, {
      status,
      ultimaAtualizacao: new Date()
    });
  }
} 