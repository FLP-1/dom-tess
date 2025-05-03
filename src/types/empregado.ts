import { IBaseEntity, EStatus } from './common';
import { IDocument } from './document';

export type TEmployeeStatus = EStatus;
export type TEmployerStatus = EStatus;

export interface IEmployee extends IBaseEntity {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  documents: IDocument[];
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  status: TEmployeeStatus;
}

export interface IEmployer extends IBaseEntity {
  name: string;
  email: string;
  phone: string;
  cnpj?: string;
  cpf?: string;
  documents: IDocument[];
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  status: TEmployerStatus;
}

export interface Endereco {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface RG {
  numero: string;
  orgaoEmissor: string;
  dataEmissao: string;
  uf: string;
}

export interface Contato {
  telefone: string;
  celular?: string;
  email: string;
}

export interface DadosBancarios {
  banco: string;
  agencia: string;
  conta: string;
  tipoConta: 'corrente' | 'poupanca';
}

export interface DadosFamiliares {
  nomeMae: string;
  nomePai?: string;
  nomeConjuge?: string;
  estadoCivil: 'solteiro' | 'casado' | 'divorciado' | 'viuvo' | 'uniao_estavel';
}

export interface Dependente {
  nome: string;
  cpf: string;
  dataNascimento: string;
  parentesco: 'filho' | 'conjuge' | 'pai' | 'mae' | 'outro';
}

export interface DadosEmpregado extends Omit<IEmployee, 'status'> {
  dataNascimento: string;
  nacionalidade: string;
  rg: RG;
  endereco: Endereco;
  contato: Contato;
  dadosBancarios: DadosBancarios;
  dadosFamiliares: DadosFamiliares;
  dependentes?: Dependente[];
  empregadorId: string;
  funcao: string;
  salario: number;
  dataAdmissao: string;
  dataDemissao?: string;
  status: TEmployeeStatus;
  observacoes?: string;
  documentos?: string[];
  ultimaAtualizacao: string;
} 