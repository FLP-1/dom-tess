import { collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BaseServiceResponse } from '@/types/common';

export abstract class BaseService<T extends { id?: string }> {
  protected abstract collectionName: string;

  protected async create(data: Omit<T, 'id'>): Promise<BaseServiceResponse<string>> {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), data);
      return {
        success: true,
        data: docRef.id,
        message: 'Documento criado com sucesso'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao criar documento',
        message: 'Falha ao criar documento'
      };
    }
  }

  protected async getAll(): Promise<BaseServiceResponse<T[]>> {
    try {
      const querySnapshot = await getDocs(collection(db, this.collectionName));
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
      
      return {
        success: true,
        data: documents,
        message: 'Documentos recuperados com sucesso'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao recuperar documentos',
        message: 'Falha ao recuperar documentos'
      };
    }
  }

  protected async getById(id: string): Promise<BaseServiceResponse<T | null>> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDocs(query(collection(db, this.collectionName), where('id', '==', id)));
      
      if (docSnap.empty) {
        return {
          success: true,
          data: null,
          message: 'Documento não encontrado'
        };
      }

      return {
        success: true,
        data: { id, ...docSnap.docs[0].data() } as T,
        message: 'Documento recuperado com sucesso'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao recuperar documento',
        message: 'Falha ao recuperar documento'
      };
    }
  }

  protected async update(id: string, data: Partial<T>): Promise<BaseServiceResponse<void>> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, data as any);
      return {
        success: true,
        message: 'Documento atualizado com sucesso'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao atualizar documento',
        message: 'Falha ao atualizar documento'
      };
    }
  }

  protected async delete(id: string): Promise<BaseServiceResponse<void>> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
      return {
        success: true,
        message: 'Documento excluído com sucesso'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao excluir documento',
        message: 'Falha ao excluir documento'
      };
    }
  }

  protected async checkUnique(field: keyof T, value: any): Promise<BaseServiceResponse<boolean>> {
    try {
      const q = query(collection(db, this.collectionName), where(field as string, '==', value));
      const querySnapshot = await getDocs(q);
      return {
        success: true,
        data: querySnapshot.empty,
        message: querySnapshot.empty ? 'Valor é único' : 'Valor já existe'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao verificar unicidade',
        message: 'Falha ao verificar unicidade'
      };
    }
  }
} 