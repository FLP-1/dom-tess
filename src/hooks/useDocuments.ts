import { useState, useEffect } from 'react';
import { Document } from '@/types';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { documentService } from '@/services/documentService';

export function useDocuments(userId: string) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'documents'),
      where('userId', '==', userId)
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
          uploadedAt: doc.data().uploadedAt?.toDate(),
          expiresAt: doc.data().expiresAt?.toDate()
        })) as Document[];
        
        setDocuments(docs);
        setLoading(false);
      },
      (err) => {
        console.error('Erro ao buscar documentos:', err);
        setError('Erro ao carregar documentos');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const deleteDocument = async (documentId: string) => {
    try {
      await documentService.deleteDocument(documentId, userId);
    } catch (err) {
      console.error('Erro ao deletar documento:', err);
      throw new Error('Erro ao deletar documento');
    }
  };

  return {
    documents,
    loading,
    error,
    deleteDocument
  };
} 