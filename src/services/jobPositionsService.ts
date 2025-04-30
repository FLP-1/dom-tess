import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, setDoc, deleteDoc, query, where } from 'firebase/firestore';

export interface JobPosition {
  id?: string;
  title: string;
  department: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class JobPositionsService {
  private static readonly COLLECTION_NAME = 'jobPositions';

  static async createJobPosition(jobPosition: Omit<JobPosition, 'id' | 'createdAt' | 'updatedAt'>) {
    const docRef = await addDoc(collection(db, this.COLLECTION_NAME), {
      ...jobPosition,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { ...jobPosition, id: docRef.id };
  }

  static async getAllJobPositions() {
    const querySnapshot = await getDocs(collection(db, this.COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as JobPosition[];
  }

  static async getJobPositionsByDepartment(department: string) {
    const q = query(collection(db, this.COLLECTION_NAME), where('department', '==', department));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as JobPosition[];
  }

  static async updateJobPosition(id: string, jobPosition: Partial<JobPosition>) {
    await setDoc(doc(db, this.COLLECTION_NAME, id), {
      ...jobPosition,
      updatedAt: new Date()
    }, { merge: true });
  }

  static async deleteJobPosition(id: string) {
    await deleteDoc(doc(db, this.COLLECTION_NAME, id));
  }
} 