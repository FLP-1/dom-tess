import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { formatCPF, validateCPF } from '@/utils/formatting';
import { BaseService } from './base/BaseService';

export interface FamilyMember {
  id?: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  parentesco: 'CONJUGE' | 'FILHO' | 'PAI' | 'MAE' | 'OUTRO';
  empregadoId: string;
}

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
}

export const familyService = new FamilyService(); 