import { db } from '../lib/firebase';
import { collection, doc, setDoc, getDocs, getDoc, query, where, updateDoc, Timestamp } from 'firebase/firestore';
import { Documento, AlertaDocumento, StatusDocumento } from '@/types/documento';
import { differenceInDays, addDays } from 'date-fns';

export class DocumentoService {
  static async criarDocumento(documento: Omit<Documento, 'id' | 'status' | 'dataUpload'>): Promise<Documento> {
    const docRef = doc(collection(db, 'documentos'));
    const dataUpload = new Date();
    const status = this.calcularStatusDocumento(documento.dataValidade);
    
    const novoDocumento: Documento = {
      ...documento,
      id: docRef.id,
      status,
      dataUpload,
      notificacoes: {
        diasAntecedencia: [30, 15, 7, 3, 1],
        ultimaNotificacao: undefined
      }
    };

    await setDoc(docRef, novoDocumento);
    await this.criarAlertasIniciais(novoDocumento);
    
    return novoDocumento;
  }

  static async atualizarDocumento(id: string, dados: Partial<Documento>): Promise<void> {
    const docRef = doc(db, 'documentos', id);
    const documentoAtual = await this.obterDocumento(id);
    
    if (!documentoAtual) {
      throw new Error('Documento não encontrado');
    }

    const dadosAtualizados = {
      ...dados,
      status: dados.dataValidade ? this.calcularStatusDocumento(dados.dataValidade) : undefined
    };

    await updateDoc(docRef, dadosAtualizados);
    
    if (dados.dataValidade) {
      await this.criarAlertasIniciais({ ...documentoAtual, ...dadosAtualizados });
    }
  }

  static async obterDocumento(id: string): Promise<Documento | null> {
    const docRef = doc(db, 'documentos', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }

    return docSnap.data() as Documento;
  }

  static async listarDocumentosPorUsuario(userId: string): Promise<Documento[]> {
    const q = query(collection(db, 'documentos'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => doc.data() as Documento);
  }

  static async listarDocumentosPorEmpregador(empregadorId: string): Promise<Documento[]> {
    const q = query(collection(db, 'documentos'), where('empregadorId', '==', empregadorId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => doc.data() as Documento);
  }

  static async listarDocumentosPorEmpregado(empregadoId: string): Promise<Documento[]> {
    const q = query(collection(db, 'documentos'), where('empregadoId', '==', empregadoId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => doc.data() as Documento);
  }

  static async criarAlerta(alerta: Omit<AlertaDocumento, 'id'>): Promise<AlertaDocumento> {
    const docRef = doc(collection(db, 'alertas'));
    const novoAlerta: AlertaDocumento = {
      ...alerta,
      id: docRef.id
    };

    await setDoc(docRef, novoAlerta);
    return novoAlerta;
  }

  static async atualizarStatusAlerta(id: string, status: AlertaDocumento['status']): Promise<void> {
    const docRef = doc(db, 'alertas', id);
    await updateDoc(docRef, { status });
  }

  static async listarAlertasPendentes(userId: string): Promise<AlertaDocumento[]> {
    const q = query(
      collection(db, 'alertas'),
      where('status', '==', 'pendente'),
      where('dataAlerta', '<=', Timestamp.now())
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as AlertaDocumento);
  }

  private static calcularStatusDocumento(dataValidade: Date): StatusDocumento {
    const hoje = new Date();
    const diasRestantes = differenceInDays(dataValidade, hoje);

    if (diasRestantes < 0) {
      return 'expirado';
    } else if (diasRestantes <= 30) {
      return 'a_vencer';
    } else {
      return 'ativo';
    }
  }

  private static async criarAlertasIniciais(documento: Documento): Promise<void> {
    const hoje = new Date();
    const diasAntecedencia = documento.notificacoes.diasAntecedencia;

    for (const dias of diasAntecedencia) {
      const dataAlerta = addDays(documento.dataValidade, -dias);
      
      if (dataAlerta > hoje) {
        await this.criarAlerta({
          documentoId: documento.id,
          tipo: 'vencimento',
          mensagem: `O documento ${documento.nome} vencerá em ${dias} dias`,
          dataAlerta,
          status: 'pendente',
          prioridade: dias <= 7 ? 'alta' : dias <= 15 ? 'media' : 'baixa'
        });
      }
    }
  }
} 