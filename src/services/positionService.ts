import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Position {
  id?: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const positionService = {
  async createPosition(position: Omit<Position, 'id' | 'createdAt' | 'updatedAt'>) {
    const positionsRef = collection(db, 'positions');
    const newPosition = {
      ...position,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const docRef = await addDoc(positionsRef, newPosition);
    return { id: docRef.id, ...newPosition };
  },

  async getAllPositions() {
    const positionsRef = collection(db, 'positions');
    const q = query(positionsRef, orderBy('name'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Position[];
  },
}; 