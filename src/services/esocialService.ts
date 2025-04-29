import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccount from '../secrets/serviceAccount.json';
import { DadosEmpregador, DadosEmpregado, Familiar, CertificadoDigital } from '../types/esocial';

// Inicializa o Firebase Admin
const app = initializeApp({
  credential: cert(serviceAccount as any)
});

const db = getFirestore(app);

export class EsocialService {
  // Métodos para Empregador
  static async criarDadosEmpregador(dados: Omit<DadosEmpregador, 'id' | 'ultimaAtualizacao'>): Promise<DadosEmpregador> {
    const docRef = db.collection('empregadores').doc();
    const dadosCompletos = {
      ...dados,
      id: docRef.id,
      ultimaAtualizacao: new Date(),
      status: 'incompleto'
    };
    
    await docRef.set(dadosCompletos);
    return dadosCompletos;
  }

  static async atualizarDadosEmpregador(id: string, dados: Partial<DadosEmpregador>): Promise<void> {
    const docRef = db.collection('empregadores').doc(id);
    await docRef.update({
      ...dados,
      ultimaAtualizacao: new Date()
    });
  }

  static async obterDadosEmpregador(userId: string): Promise<DadosEmpregador | null> {
    const snapshot = await db.collection('empregadores')
      .where('userId', '==', userId)
      .get();
    
    if (snapshot.empty) return null;
    return snapshot.docs[0].data() as DadosEmpregador;
  }

  // Métodos para Certificado Digital
  static async uploadCertificadoDigital(
    empregadorId: string,
    certificado: Omit<CertificadoDigital, 'id' | 'status'>
  ): Promise<CertificadoDigital> {
    const docRef = db.collection('certificados').doc();
    const dadosCompletos = {
      ...certificado,
      id: docRef.id,
      status: 'ativo'
    };
    
    await docRef.set(dadosCompletos);
    await db.collection('empregadores').doc(empregadorId).update({
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
} 