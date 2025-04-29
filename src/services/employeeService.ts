import { BaseService } from './base/BaseService';
import { formatCPF, validateCPF } from '@/utils/formatting';

export interface Employee {
  id?: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  cargo: string;
  dataAdmissao: string;
  salario: number;
}

export class EmployeeService extends BaseService<Employee> {
  protected collectionName = 'employees';

  async createEmployee(employee: Omit<Employee, 'id'>): Promise<string> {
    if (!validateCPF(employee.cpf)) {
      throw new Error('CPF inválido');
    }

    const cpfFormatted = formatCPF(employee.cpf);
    
    // Verificar se já existe empregado com o mesmo CPF
    const isUnique = await this.checkUnique('cpf', cpfFormatted);
    if (!isUnique) {
      throw new Error('Já existe um empregado cadastrado com este CPF');
    }

    return this.create({
      ...employee,
      cpf: cpfFormatted,
      salario: Number(employee.salario),
    });
  }

  async getEmployees(): Promise<Employee[]> {
    return this.getAll();
  }

  async getEmployeeById(id: string): Promise<Employee | null> {
    return this.getById(id);
  }

  async updateEmployee(id: string, data: Partial<Employee>): Promise<void> {
    if (data.cpf) {
      if (!validateCPF(data.cpf)) {
        throw new Error('CPF inválido');
      }
      data.cpf = formatCPF(data.cpf);
    }
    return this.update(id, data);
  }

  async deleteEmployee(id: string): Promise<void> {
    return this.delete(id);
  }
}

export const employeeService = new EmployeeService(); 