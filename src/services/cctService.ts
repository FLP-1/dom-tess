import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { criarNotificacaoAlerta } from './notificacoes';
import { Document } from '@/types';

export interface CCT {
  id?: string;
  state: string;
  position: string;
  salary: number;
  validityStart: Date;
  validityEnd: Date;
  document: Document;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExpiredCCT extends CCT {
  isExpired: boolean;
  daysUntilExpiration: number;
}

export const cctService = {
  async createCCT(cct: Omit<CCT, 'id' | 'createdAt' | 'updatedAt'>) {
    const cctsRef = collection(db, 'ccts');
    const newCCT = {
      ...cct,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const docRef = await addDoc(cctsRef, newCCT);
    return { id: docRef.id, ...newCCT };
  },

  async getCCTByStateAndPosition(state: string, position: string) {
    const cctsRef = collection(db, 'ccts');
    const q = query(
      cctsRef,
      where('state', '==', state),
      where('position', '==', position),
      orderBy('validityEnd', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }

    const now = new Date();
    let validCCT = null;

    // Procura a CCT mais recente que esteja dentro do período de validade
    for (const doc of querySnapshot.docs) {
      const cct = doc.data();
      const validityStart = cct.validityStart?.toDate();
      const validityEnd = cct.validityEnd?.toDate();

      if (validityStart && validityEnd && now >= validityStart && now <= validityEnd) {
        validCCT = {
          id: doc.id,
          ...cct,
          validityStart,
          validityEnd,
          document: cct.document,
          createdAt: cct.createdAt?.toDate(),
          updatedAt: cct.updatedAt?.toDate(),
        };
        break;
      }
    }

    return validCCT as CCT | null;
  },

  async getAllCCTs() {
    const cctsRef = collection(db, 'ccts');
    const q = query(cctsRef, orderBy('state'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      validityStart: doc.data().validityStart?.toDate(),
      validityEnd: doc.data().validityEnd?.toDate(),
      document: doc.data().document,
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as CCT[];
  },

  async getExpiredCCTs(): Promise<ExpiredCCT[]> {
    const cctsRef = collection(db, 'ccts');
    const q = query(cctsRef, orderBy('validityEnd', 'desc'));
    const querySnapshot = await getDocs(q);
    const now = new Date();

    const expiredCCTs = querySnapshot.docs
      .map(doc => {
        const data = doc.data();
        const validityEnd = data.validityEnd?.toDate();
        return {
          id: doc.id,
          state: data.state,
          position: data.position,
          salary: data.salary,
          validityStart: data.validityStart?.toDate(),
          validityEnd,
          document: data.document,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          isExpired: validityEnd ? now > validityEnd : false,
          daysUntilExpiration: validityEnd ? Math.ceil((validityEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0,
        };
      })
      .filter(cct => cct.isExpired || cct.daysUntilExpiration <= 30);

    // Criar notificações para CCTs expiradas ou próximas de expirar
    for (const cct of expiredCCTs) {
      const message = cct.isExpired
        ? `A CCT para ${cct.position} no estado ${cct.state} expirou em ${cct.validityEnd?.toLocaleDateString()}`
        : `A CCT para ${cct.position} no estado ${cct.state} expira em ${cct.daysUntilExpiration} dias`;

      await criarNotificacaoAlerta('admin', message);
    }

    return expiredCCTs;
  },
}; 