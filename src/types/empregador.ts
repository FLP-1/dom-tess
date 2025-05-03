import { IBaseEntity, EStatus, ITypeInfo } from './common';
import { IDocument } from './document';

/**
 * Tipos de empregador
 */
export enum ETipoEmpregador {
  PF = 'pf',
  PJ = 'pj'
}

export type ITipoEmpregadorInfo = ITypeInfo;

/**
 * Tipos de imóvel
 */
export enum ETipoImovel {
  PROPRIO = 'proprio',
  ALUGADO = 'alugado',
  CEDIDO = 'cedido'
}

export type ITipoImovelInfo = ITypeInfo;

/**
 * Tipos de conta
 */
export enum ETipoConta {
  CORRENTE = 'corrente',
  POUPANCA = 'poupanca',
  SALARIO = 'salario'
}

export type ITipoContaInfo = ITypeInfo;

export interface IEmpregadorPF extends IBaseEntity {
  nome: string;
  tipo: ETipoEmpregador.PF;
  cpf: string;
  cnpj?: never;
  email: string;
  telefone: string;
  documentos: IDocument[];
  imovel?: {
    tipo: ETipoImovel;
    endereco: {
      cep: string;
      logradouro: string;
      numero: string;
      complemento?: string;
      bairro: string;
      cidade: string;
      estado: string;
    };
    valorAluguel?: number;
    dataInicio?: Date;
    dataFim?: Date;
  };
  contaBancaria?: {
    tipo: ETipoConta;
    banco: string;
    agencia: string;
    conta: string;
    digito: string;
  };
  status: EStatus;
}

export interface IEmpregadorPJ extends IBaseEntity {
  nome: string;
  tipo: ETipoEmpregador.PJ;
  cpf?: never;
  cnpj: string;
  email: string;
  telefone: string;
  documentos: IDocument[];
  imovel?: {
    tipo: ETipoImovel;
    endereco: {
      cep: string;
      logradouro: string;
      numero: string;
      complemento?: string;
      bairro: string;
      cidade: string;
      estado: string;
    };
    valorAluguel?: number;
    dataInicio?: Date;
    dataFim?: Date;
  };
  contaBancaria?: {
    tipo: ETipoConta;
    banco: string;
    agencia: string;
    conta: string;
    digito: string;
  };
  status: EStatus;
}

export type IEmpregador = IEmpregadorPF | IEmpregadorPJ;

export function isValidTipoEmpregador(tipo: unknown): tipo is ETipoEmpregador {
  return typeof tipo === 'string' && Object.values(ETipoEmpregador).includes(tipo as ETipoEmpregador);
}

export function getTipoEmpregadorLabel(tipo: ETipoEmpregador): string | undefined {
  const labels: Record<ETipoEmpregador, string> = {
    [ETipoEmpregador.PF]: 'Pessoa Física',
    [ETipoEmpregador.PJ]: 'Pessoa Jurídica'
  };
  return labels[tipo];
}

export function getTipoEmpregadorInfo(tipo: ETipoEmpregador): ITipoEmpregadorInfo | undefined {
  const info: Record<ETipoEmpregador, ITipoEmpregadorInfo> = {
    [ETipoEmpregador.PF]: {
      label: 'Pessoa Física',
      descricao: 'Empregador individual',
      icon: 'person'
    },
    [ETipoEmpregador.PJ]: {
      label: 'Pessoa Jurídica',
      descricao: 'Empresa ou organização',
      icon: 'business'
    }
  };
  return info[tipo];
}

export function isValidTipoImovel(tipo: unknown): tipo is ETipoImovel {
  return typeof tipo === 'string' && Object.values(ETipoImovel).includes(tipo as ETipoImovel);
}

export function getTipoImovelLabel(tipo: ETipoImovel): string | undefined {
  const labels: Record<ETipoImovel, string> = {
    [ETipoImovel.PROPRIO]: 'Próprio',
    [ETipoImovel.ALUGADO]: 'Alugado',
    [ETipoImovel.CEDIDO]: 'Cedido'
  };
  return labels[tipo];
}

export function getTipoImovelInfo(tipo: ETipoImovel): ITipoImovelInfo | undefined {
  const info: Record<ETipoImovel, ITipoImovelInfo> = {
    [ETipoImovel.PROPRIO]: {
      label: 'Próprio',
      descricao: 'Imóvel de propriedade do empregador',
      icon: 'home'
    },
    [ETipoImovel.ALUGADO]: {
      label: 'Alugado',
      descricao: 'Imóvel alugado de terceiros',
      icon: 'apartment'
    },
    [ETipoImovel.CEDIDO]: {
      label: 'Cedido',
      descricao: 'Imóvel cedido por terceiros',
      icon: 'house'
    }
  };
  return info[tipo];
}

export function isValidTipoConta(tipo: unknown): tipo is ETipoConta {
  return typeof tipo === 'string' && Object.values(ETipoConta).includes(tipo as ETipoConta);
}

export function getTipoContaLabel(tipo: ETipoConta): string | undefined {
  const labels: Record<ETipoConta, string> = {
    [ETipoConta.CORRENTE]: 'Conta Corrente',
    [ETipoConta.POUPANCA]: 'Conta Poupança',
    [ETipoConta.SALARIO]: 'Conta Salário'
  };
  return labels[tipo];
}

export function getTipoContaInfo(tipo: ETipoConta): ITipoContaInfo | undefined {
  const info: Record<ETipoConta, ITipoContaInfo> = {
    [ETipoConta.CORRENTE]: {
      label: 'Conta Corrente',
      descricao: 'Conta para movimentações diárias',
      icon: 'account_balance'
    },
    [ETipoConta.POUPANCA]: {
      label: 'Conta Poupança',
      descricao: 'Conta para investimentos e rendimentos',
      icon: 'savings'
    },
    [ETipoConta.SALARIO]: {
      label: 'Conta Salário',
      descricao: 'Conta específica para recebimento de salário',
      icon: 'payments'
    }
  };
  return info[tipo];
}

export function validateCamposImovel(tipo: ETipoImovel, dados: Partial<IEmpregador['imovel']>): string[] {
  const erros: string[] = [];
  
  if (!dados.endereco) {
    erros.push('Endereço é obrigatório');
  }
  
  if (tipo === ETipoImovel.ALUGADO) {
    if (!dados.valorAluguel) {
      erros.push('Valor do aluguel é obrigatório para imóveis alugados');
    }
    if (!dados.dataInicio) {
      erros.push('Data de início é obrigatória para imóveis alugados');
    }
  }
  
  return erros;
}

export function calcularValorAluguel(tipo: ETipoImovel, valorBase: number, periodo: number): number {
  if (tipo !== ETipoImovel.ALUGADO || periodo <= 0) {
    return 0;
  }

  const taxaBase = 1.1; // Taxa base de 10%
  const taxaPeriodo = periodo > 3 ? 1.2 : 1.0; // Taxa adicional para períodos longos

  return valorBase * taxaBase * taxaPeriodo;
}

export function getDocumentosImovel(tipo: ETipoImovel): string[] {
  const documentosBase = ['escritura', 'iptu'];
  
  switch (tipo) {
    case ETipoImovel.PROPRIO:
      return [...documentosBase, 'registro_imovel'];
    case ETipoImovel.ALUGADO:
      return [...documentosBase, 'contrato_aluguel'];
    case ETipoImovel.CEDIDO:
      return [...documentosBase, 'termo_cessao'];
    default:
      return documentosBase;
  }
} 