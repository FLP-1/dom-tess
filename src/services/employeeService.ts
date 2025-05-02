import { collection, doc, getDoc, setDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DadosEmpregado } from '@/types/esocial';
import { useAppNotifications } from '@/hooks/useAppNotifications';

class EmployeeService {
  private collection = collection(db, 'empregados');
  private notifications = useAppNotifications();

  async getEmployeeById(id: string): Promise<DadosEmpregado | null> {
    try {
      const docRef = doc(this.collection, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }

      return {
        ...docSnap.data(),
        id: docSnap.id,
      } as DadosEmpregado;
    } catch (error) {
      this.notifications.showError(
        'Erro ao carregar dados',
        'Não foi possível carregar os dados do empregado',
        { persistent: true }
      );
      throw error;
    }
  }

  async getIncompleteEmployees(empregadorId: string): Promise<DadosEmpregado[]> {
    try {
      const q = query(
        this.collection,
        where('empregadorId', '==', empregadorId),
        where('status', '==', 'incompleto')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })) as DadosEmpregado[];
    } catch (error) {
      this.notifications.showError(
        'Erro ao carregar rascunhos',
        'Não foi possível carregar os cadastros incompletos',
        { persistent: true }
      );
      throw error;
    }
  }

  async createEmployee(data: Partial<DadosEmpregado>): Promise<string> {
    try {
      const employeeData = {
        ...data,
        status: 'completo',
        dataCriacao: new Date(),
        ultimaAtualizacao: new Date(),
      };

      const docRef = doc(this.collection);
      await setDoc(docRef, employeeData);
      return docRef.id;
    } catch (error) {
      this.notifications.showError(
        'Erro ao criar empregado',
        'Não foi possível criar o cadastro do empregado',
        { persistent: true }
      );
      throw error;
    }
  }

  async saveEmployee(data: Partial<DadosEmpregado>, isComplete: boolean = false): Promise<string> {
    try {
      const employeeData = {
        ...data,
        status: isComplete ? 'completo' : 'incompleto',
        ultimaAtualizacao: new Date(),
      };

      if (data.id) {
        // Atualiza documento existente
        const docRef = doc(this.collection, data.id);
        await updateDoc(docRef, employeeData);
        return data.id;
      } else {
        // Cria novo documento
        const docRef = doc(this.collection);
        await setDoc(docRef, employeeData);
        return docRef.id;
      }
    } catch (error) {
      this.notifications.showError(
        'Erro ao salvar dados',
        'Não foi possível salvar os dados do empregado',
        { persistent: true }
      );
      throw error;
    }
  }

  async deleteEmployee(id: string): Promise<void> {
    try {
      await updateDoc(doc(this.collection, id), {
        status: 'excluido',
        dataExclusao: new Date(),
      });
      
      this.notifications.showSuccess(
        'Empregado excluído',
        'O cadastro foi excluído com sucesso',
        { persistent: true }
      );
    } catch (error) {
      this.notifications.showError(
        'Erro ao excluir',
        'Não foi possível excluir o cadastro do empregado',
        { persistent: true }
      );
      throw error;
    }
  }
}

export const employeeService = new EmployeeService(); 