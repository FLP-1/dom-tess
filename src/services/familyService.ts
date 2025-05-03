import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { formatCPF, validateCPF } from '@/utils/formatting';
import { BaseService } from './base/BaseService';
import { FamilyMember } from '@/types/family';

export class FamilyService extends BaseService<FamilyMember> {
  protected collectionName = 'family';

  async createFamilyMember(familyMember: Omit<FamilyMember, 'id'>): Promise<string> {
    if (!validateCPF(familyMember.cpf)) {
      throw new Error('CPF inválido');
    }

    const cpfFormatted = formatCPF(familyMember.cpf);
    
    // Verificar se já existe familiar com o mesmo CPF
    const isUnique = await this.checkUnique('cpf', cpfFormatted);
    if (!isUnique) {
      throw new Error('Já existe um familiar cadastrado com este CPF');
    }

    return this.create({
      ...familyMember,
      cpf: cpfFormatted,
    });
  }

  async getFamilyMembers(): Promise<FamilyMember[]> {
    return this.getAll();
  }

  async getFamilyMemberById(id: string): Promise<FamilyMember | null> {
    return this.getById(id);
  }

  async updateFamilyMember(id: string, data: Partial<FamilyMember>): Promise<void> {
    if (data.cpf) {
      if (!validateCPF(data.cpf)) {
        throw new Error('CPF inválido');
      }
      data.cpf = formatCPF(data.cpf);
    }
    return this.update(id, data);
  }

  async deleteFamilyMember(id: string): Promise<void> {
    return this.delete(id);
  }

  async getFamilyMembersByEmployeeId(empregadoId: string): Promise<FamilyMember[]> {
    const q = query(collection(db, this.collectionName), where('empregadoId', '==', empregadoId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FamilyMember[];
  }

  static async create(member: Omit<FamilyMember, 'id'>): Promise<FamilyMember> {
    const docRef = doc(db, this.collectionName);
    const newMember: FamilyMember = {
      ...member,
      id: docRef.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await setDoc(docRef, newMember);
    return newMember;
  }

  static async getAll(employeeId: string): Promise<FamilyMember[]> {
    const q = query(
      db,
      this.collectionName,
      where('employeeId', '==', employeeId),
      where('status', '!=', 'deleted')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    })) as FamilyMember[];
  }

  static async getById(id: string): Promise<FamilyMember | null> {
    const docRef = doc(db, this.collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    return { ...docSnap.data(), id: docSnap.id } as FamilyMember;
  }

  static async update(id: string, data: Partial<FamilyMember>): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await setDoc(
      docRef,
      {
        ...data,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
  }

  static async delete(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await setDoc(docRef, { status: 'deleted' }, { merge: true });
  }
}

export const familyService = new FamilyService(); 