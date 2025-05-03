import { db } from '@/config/firebase';
import { BaseServiceResponse } from '@/types/common';
import { Document, DocumentType, DocumentStatus, DocumentFilter, DocumentListResponse, DocumentSort, DocumentUploadOptions } from '@/types/document';
import { doc, setDoc, getDoc, deleteDoc, collection, query, where, getDocs, orderBy, limit, startAfter, Timestamp, DocumentData, QueryConstraint, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import imageCompression from 'browser-image-compression';
import { differenceInDays, addDays } from 'date-fns';

const CACHE_PREFIX = 'document_cache_';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 horas

export class DocumentService {
  static readonly COLLECTION_NAME = 'documents';

  private async compressImage(file: File): Promise<File> {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    };
    return await imageCompression(file, options);
  }

  private async getFromCache(documentId: string): Promise<Document | null> {
    const cached = localStorage.getItem(CACHE_PREFIX + documentId);
    if (cached) {
      const { document, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_EXPIRY) {
        return document;
      }
      localStorage.removeItem(CACHE_PREFIX + documentId);
    }
    return null;
  }

  private async setCache(document: Document): Promise<void> {
    localStorage.setItem(
      CACHE_PREFIX + document.id,
      JSON.stringify({
        document,
        timestamp: Date.now()
      })
    );
  }

  static async uploadDocument(options: DocumentUploadOptions): Promise<Document> {
    const docRef = doc(db, this.COLLECTION_NAME);
    const storageRef = ref(storage, `documents/${options.userId}/${docRef.id}`);
    
    await uploadBytes(storageRef, options.file);
    const fileUrl = await getDownloadURL(storageRef);

    const document: Document = {
      id: docRef.id,
      type: options.type,
      name: options.name,
      description: options.description || '',
      fileUrl,
      status: DocumentStatus.PENDING,
      dataEmissao: options.dataEmissao || new Date(),
      dataValidade: options.dataValidade || new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: options.userId,
      updatedBy: options.userId,
      version: 1,
      notificacoes: {
        expiracao: false,
        rejeicao: false
      }
    };

    await setDoc(docRef, document);
    return document;
  }

  static async getDocuments(filter: DocumentFilter = {}): Promise<DocumentListResponse> {
    const constraints: QueryConstraint[] = [];

    if (filter.type) {
      constraints.push(where('type', '==', filter.type));
    }

    if (filter.status) {
      constraints.push(where('status', '==', filter.status));
    }

    if (filter.startDate) {
      constraints.push(where('createdAt', '>=', Timestamp.fromDate(new Date(filter.startDate))));
    }

    if (filter.endDate) {
      constraints.push(where('createdAt', '<=', Timestamp.fromDate(new Date(filter.endDate))));
    }

    if (filter.userId) {
      constraints.push(where('createdBy', '==', filter.userId));
    }

    const q = query(collection(db, this.COLLECTION_NAME), ...constraints);
    const querySnapshot = await getDocs(q);

    const documents: Document[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      documents.push({
        id: doc.id,
        type: data.type,
        name: data.name,
        description: data.description,
        fileUrl: data.fileUrl,
        status: data.status,
        dataEmissao: data.dataEmissao?.toDate(),
        dataValidade: data.dataValidade?.toDate(),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        createdBy: data.createdBy,
        updatedBy: data.updatedBy,
        version: data.version,
        notificacoes: data.notificacoes
      });
    });

    return {
      documents,
      pagination: {
        page: filter.page || 1,
        limit: filter.limit || 10,
        total: documents.length
      }
    };
  }

  static async getDocumentById(id: string): Promise<Document | null> {
    const docRef = doc(db, this.COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      type: data.type,
      name: data.name,
      description: data.description,
      fileUrl: data.fileUrl,
      status: data.status,
      dataEmissao: data.dataEmissao.toDate(),
      dataValidade: data.dataValidade.toDate(),
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
      createdBy: data.createdBy,
      updatedBy: data.updatedBy,
      version: data.version,
      notificacoes: data.notificacoes
    } as Document;
  }

  static async updateDocument(id: string, data: Partial<Document>): Promise<void> {
    const docRef = doc(db, this.COLLECTION_NAME, id);
    await setDoc(
      docRef,
      {
        ...data,
        updatedAt: new Date()
      },
      { merge: true }
    );
  }

  static async deleteDocument(id: string): Promise<void> {
    const document = await this.getDocumentById(id);
    if (!document) {
      throw new Error('Documento não encontrado');
    }

    // Deleta o arquivo do storage
    const storageRef = ref(storage, `documents/${document.createdBy}/${id}`);
    await deleteObject(storageRef);

    // Deleta o documento do Firestore
    const docRef = doc(db, this.COLLECTION_NAME, id);
    await deleteDoc(docRef);
  }

  public async getDocument(id: string): Promise<BaseServiceResponse<Document>> {
    try {
      const cached = await this.getFromCache(id);
      if (cached) {
        return {
          success: true,
          data: cached,
          message: 'Documento recuperado do cache'
        };
      }

      const docRef = doc(db, 'documents', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: 'Documento não encontrado',
          statusCode: 404
        };
      }

      const data = docSnap.data();
      const document: Document = {
        id: docSnap.id,
        type: data.type,
        name: data.name,
        description: data.description,
        fileUrl: data.fileUrl,
        status: data.status,
        dataEmissao: data.dataEmissao.toDate(),
        dataValidade: data.dataValidade.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        createdBy: data.createdBy,
        updatedBy: data.updatedBy,
        version: data.version,
        notificacoes: data.notificacoes
      };

      await this.setCache(document);

      return {
        success: true,
        data: document,
        message: 'Documento recuperado com sucesso'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao recuperar documento',
        statusCode: 500
      };
    }
  }

  public async listDocuments(
    filter: DocumentFilter,
    sort: DocumentSort,
    pagination: DocumentPagination
  ): Promise<BaseServiceResponse<DocumentListResponse>> {
    try {
      const conditions: any[] = [];

      if (filter.userId) {
        conditions.push(where('userId', '==', filter.userId));
      }

      if (filter.type) {
        conditions.push(where('type', '==', filter.type));
      }

      if (filter.status) {
        conditions.push(where('status', '==', filter.status));
      }

      if (filter.startDate) {
        conditions.push(where('uploadedAt', '>=', filter.startDate));
      }

      if (filter.endDate) {
        conditions.push(where('uploadedAt', '<=', filter.endDate));
      }

      const q = query(
        collection(db, 'documents'),
        ...conditions,
        orderBy(sort.field, sort.direction),
        limit(pagination.limit)
      );

      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Document[];

      return {
        success: true,
        data: {
          documents,
          pagination: {
            ...pagination,
            total: querySnapshot.size
          }
        },
        message: 'Documentos recuperados com sucesso'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao listar documentos',
        message: 'Falha ao listar documentos'
      };
    }
  }

  public async deleteDocument(id: string): Promise<BaseServiceResponse<void>> {
    try {
      const docRef = doc(db, 'documents', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: 'Documento não encontrado',
          message: 'Documento não encontrado'
        };
      }

      const document = docSnap.data() as Document;
      const storageRef = ref(storage, `documents/${document.userId}/${id}`);

      await deleteObject(storageRef);
      await deleteDoc(docRef);
      localStorage.removeItem(CACHE_PREFIX + id);

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

  public async clearCache(): Promise<void> {
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
  }
}

export const documentService = new DocumentService(); 