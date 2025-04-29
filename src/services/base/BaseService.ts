import { collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export abstract class BaseService<T> {
  protected abstract collectionName: string;

  protected async create(data: Omit<T, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, this.collectionName), data);
    return docRef.id;
  }

  protected async getAll(): Promise<T[]> {
    const querySnapshot = await getDocs(collection(db, this.collectionName));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
  }

  protected async getById(id: string): Promise<T | null> {
    const docRef = doc(db, this.collectionName, id);
    const docSnap = await getDocs(query(collection(db, this.collectionName), where('id', '==', id)));
    if (docSnap.empty) return null;
    return { id, ...docSnap.docs[0].data() } as T;
  }

  protected async update(id: string, data: Partial<T>): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await updateDoc(docRef, data as any);
  }

  protected async delete(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await deleteDoc(docRef);
  }

  protected async checkUnique(field: keyof T, value: any): Promise<boolean> {
    const q = query(collection(db, this.collectionName), where(field as string, '==', value));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  }
} 