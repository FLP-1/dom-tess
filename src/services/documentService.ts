import { db, storage } from '@/lib/firebase';
import { Document } from '@/types';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import imageCompression from 'browser-image-compression';

const CACHE_PREFIX = 'document_cache_';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 horas

class DocumentService {
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

  async uploadDocument(
    file: File,
    type: string,
    title: string,
    userId: string,
    expiresAt?: Date,
    progressCallback?: (progress: number) => void
  ): Promise<Document> {
    let fileToUpload = file;
    
    // Comprimir imagem se for uma imagem
    if (file.type.startsWith('image/')) {
      fileToUpload = await this.compressImage(file);
    }

    const documentId = uuidv4();
    const storageRef = ref(storage, `documents/${userId}/${documentId}_${fileToUpload.name}`);
    
    // Upload com progresso
    const uploadTask = uploadBytes(storageRef, fileToUpload);
    if (progressCallback) {
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          progressCallback(progress);
        }
      );
    }

    const snapshot = await uploadTask;
    const url = await getDownloadURL(snapshot.ref);

    const document: Document = {
      id: documentId,
      type,
      title,
      url,
      userId,
      uploadedAt: new Date(),
      expiresAt
    };

    await setDoc(doc(db, 'documents', documentId), document);
    await this.setCache(document);

    return document;
  }

  async getDocument(documentId: string): Promise<Document | null> {
    // Tentar obter do cache primeiro
    const cached = await this.getFromCache(documentId);
    if (cached) {
      return cached;
    }

    // Se não estiver no cache, buscar do Firestore
    const docRef = doc(db, 'documents', documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const document = docSnap.data() as Document;
      await this.setCache(document);
      return document;
    }

    return null;
  }

  async deleteDocument(documentId: string, userId: string): Promise<void> {
    const docRef = doc(db, 'documents', documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const document = docSnap.data() as Document;
      const storageRef = ref(storage, `documents/${userId}/${documentId}_${document.title}`);
      await deleteObject(storageRef);
      await deleteDoc(docRef);
      localStorage.removeItem(CACHE_PREFIX + documentId);
    }
  }

  async clearCache(): Promise<void> {
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
  }
}

export const documentService = new DocumentService(); 