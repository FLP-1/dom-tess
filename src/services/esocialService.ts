import { DadosEmpregador, DadosEmpregado, Familiar, CertificadoDigital } from '../types/esocial';
import { db } from '../lib/firebase';
import { collection, doc, setDoc, getDoc, updateDoc, getDocs, query, where } from 'firebase/firestore';

export class EsocialService {
  // Métodos para Empregador
  static async criarDadosEmpregador(dados: Omit<DadosEmpregador, 'id' | 'ultimaAtualizacao'>): Promise<DadosEmpregador> {
    const empregadorRef = doc(collection(db, 'empregadores'));
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
    const docRef = doc(collection(db, 'certificados'));
    const dadosCompletos = {
      ...certificado,
      id: docRef.id,
      status: 'ativo' as CertificadoDigital['status']
    };
    
    await setDoc(docRef, dadosCompletos);
    await updateDoc(doc(db, 'empregadores', empregadorId), {
      certificadoDigital: dadosCompletos
    });
    
    return dadosCompletos as CertificadoDigital;
  }

  // Métodos para Empregados
  static async criarEmpregado(dados: Omit<DadosEmpregado, 'id' | 'ultimaAtualizacao'>): Promise<DadosEmpregado> {
    const docRef = doc(collection(db, 'empregados'));
    const dadosCompletos = {
      ...dados,
      id: docRef.id,
      ultimaAtualizacao: new Date(),
      status: 'ativo' as DadosEmpregado['status']
    };
    
    await setDoc(docRef, dadosCompletos);
    return dadosCompletos as DadosEmpregado;
  }

  static async atualizarEmpregado(id: string, dados: Partial<DadosEmpregado>): Promise<void> {
    const docRef = doc(db, 'empregados', id);
    await updateDoc(docRef, {
      ...dados,
      ultimaAtualizacao: new Date()
    });
  }

  static async listarEmpregados(empregadorId: string): Promise<DadosEmpregado[]> {
    const q = query(collection(db, 'empregados'), where('empregadorId', '==', empregadorId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => doc.data() as DadosEmpregado);
  }

  // Métodos para Familiares
  static async criarFamiliar(dados: Omit<Familiar, 'id' | 'ultimaAtualizacao'>): Promise<Familiar> {
    const docRef = doc(collection(db, 'familiares'));
    const dadosCompletos = {
      ...dados,
      id: docRef.id,
      ultimaAtualizacao: new Date(),
      status: 'ativo' as Familiar['status']
    };
    
    await setDoc(docRef, dadosCompletos);
    return dadosCompletos as Familiar;
  }

  static async atualizarFamiliar(id: string, dados: Partial<Familiar>): Promise<void> {
    const docRef = doc(db, 'familiares', id);
    await updateDoc(docRef, {
      ...dados,
      ultimaAtualizacao: new Date()
    });
  }

  static async listarFamiliares(empregadorId: string): Promise<Familiar[]> {
    const q = query(collection(db, 'familiares'), where('empregadorId', '==', empregadorId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => doc.data() as Familiar);
  }

  static async criarDadosEmpregado(dados: Omit<DadosEmpregado, 'id' | 'ultimaAtualizacao'>): Promise<DadosEmpregado> {
    const empregadoRef = doc(collection(db, 'empregados'));
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