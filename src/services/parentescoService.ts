import { db } from '@/lib/firebase';
import { collection, doc, getDocs, setDoc, query, where } from 'firebase/firestore';
import { Parentesco } from '@/types/esocial';

const PARENTESCO_COLLECTION = 'parentescos';

export const ParentescoService = {
  async listarParentescos(): Promise<Parentesco[]> {
    const parentescosRef = collection(db, PARENTESCO_COLLECTION);
    const q = query(parentescosRef, where('ativo', '==', true));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      criadoEm: doc.data().criadoEm?.toDate(),
      atualizadoEm: doc.data().atualizadoEm?.toDate(),
    })) as Parentesco[];
  },

  async popularParentescos(): Promise<void> {
    const parentescos: Omit<Parentesco, 'id' | 'criadoEm' | 'atualizadoEm'>[] = [
      {
        codigo: 'CONJUGE',
        descricao: 'Cônjuge ou companheiro(a)',
        categoria: 'CASAMENTO',
        idadeMinima: 18,
        ativo: true,
      },
      {
        codigo: 'FILHO',
        descricao: 'Filho(a) biológico(a) ou adotivo(a)',
        categoria: 'DIRETO',
        idadeMinima: 0,
        idadeMaxima: 18,
        ativo: true,
      },
      {
        codigo: 'PAI',
        descricao: 'Pai biológico ou adotivo',
        categoria: 'DIRETO',
        idadeMinima: 18,
        ativo: true,
      },
      {
        codigo: 'MAE',
        descricao: 'Mãe biológica ou adotiva',
        categoria: 'DIRETO',
        idadeMinima: 18,
        ativo: true,
      },
      {
        codigo: 'IRMAO',
        descricao: 'Irmão(ã) biológico(a) ou adotivo(a)',
        categoria: 'COLATERAL',
        idadeMinima: 0,
        ativo: true,
      },
      {
        codigo: 'AVO',
        descricao: 'Avô(ó)',
        categoria: 'COLATERAL',
        idadeMinima: 40,
        ativo: true,
      },
      {
        codigo: 'NETO',
        descricao: 'Neto(a)',
        categoria: 'COLATERAL',
        idadeMinima: 0,
        idadeMaxima: 18,
        ativo: true,
      },
      {
        codigo: 'SOGRO',
        descricao: 'Sogro(a)',
        categoria: 'CASAMENTO',
        idadeMinima: 40,
        ativo: true,
      },
      {
        codigo: 'GENRO',
        descricao: 'Genro',
        categoria: 'CASAMENTO',
        idadeMinima: 18,
        ativo: true,
      },
      {
        codigo: 'NORA',
        descricao: 'Nora',
        categoria: 'CASAMENTO',
        idadeMinima: 18,
        ativo: true,
      },
    ];

    const batch = [];
    const now = new Date();

    for (const parentesco of parentescos) {
      const docRef = doc(collection(db, PARENTESCO_COLLECTION));
      batch.push(
        setDoc(docRef, {
          ...parentesco,
          criadoEm: now,
          atualizadoEm: now,
        })
      );
    }

    await Promise.all(batch);
  },
}; 