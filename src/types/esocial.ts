export interface Endereco {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface CertificadoDigital {
  id: string;
  nome: string;
  dataValidade: Date;
  senha: string;
  arquivoUrl: string;
  status: 'ativo' | 'inativo' | 'expirado';
}

export interface DadosEmpregador {
  id?: string;
  userId: string;
  cpf: string;
  nome: string;
  dataNascimento: Date;
  nacionalidade: string;
  estadoCivil: string;
  rg: {
    numero: string;
    orgaoEmissor: string;
    dataEmissao: Date;
  };
  endereco: Endereco;
  contato: {
    telefone: string;
    email?: string;
  };
  dadosBancarios: {
    banco: string;
    agencia: string;
    conta: string;
    tipoConta: 'corrente' | 'poupanca';
  };
  dadosImovel: {
    tipoImovel: 'proprio' | 'alugado' | 'cedido';
    numeroEmpregados: number;
  };
  dadosFamiliares: {
    nomeMae: string;
    nomePai: string;
  };
  profissao?: string;
  status: 'incompleto' | 'completo';
  ultimaAtualizacao?: Date;
  certificadoDigital?: {
    certificado: string;
    senha: string;
  };
}

export interface DadosEmpregado {
  id?: string;
  userId: string;
  empregadorId: string;
  cpf: string;
  nome: string;
  dataNascimento: Date;
  nacionalidade: string;
  estadoCivil: string;
  rg: {
    numero: string;
    orgaoEmissor: string;
    dataEmissao: Date;
  };
  endereco: Endereco;
  contato: {
    telefone: string;
    email?: string;
  };
  dadosBancarios: {
    banco: string;
    agencia: string;
    conta: string;
    tipoConta: 'corrente' | 'poupanca';
  };
  dadosProfissionais: {
    cbo: string;
    funcao: string;
    dataAdmissao: Date;
    jornadaTrabalho: number;
    salario: number;
    formaPagamento: 'deposito' | 'dinheiro';
  };
  dadosTrabalhistas: {
    pisPasep: string;
    ctps: {
      numero: string;
      serie: string;
      uf: string;
    };
    tituloEleitor?: string;
    certificadoReservista?: string;
  };
  dadosFamiliares: {
    nomeMae: string;
    nomePai: string;
  };
  grauInstrucao?: string;
  numeroDependentes?: number;
  informacoesSaude?: string;
  dependentes?: Array<{
    nome: string;
    cpf: string;
    dataNascimento: Date;
    parentesco: string;
  }>;
  status: 'incompleto' | 'completo';
  ultimaAtualizacao?: Date;
}

export interface Familiar {
  id: string;
  empregadorId: string;
  nome: string;
  parentesco: string;
  dataNascimento: Date;
  cpf: string;
  telefone: string;
  email: string;
  status: 'ativo' | 'inativo';
  ultimaAtualizacao: Date;
}

export interface FuncaoDomestica {
  id?: string;
  codigo: string;
  nome: string;
  descricao: string;
  cbo: string;
  ultimaAtualizacao?: Date;
}

export interface Parentesco {
  id: string;
  codigo: string;
  descricao: string;
  categoria: 'DIRETO' | 'CASAMENTO' | 'COLATERAL';
  idadeMinima?: number;
  idadeMaxima?: number;
  ativo: boolean;
  criadoEm: Date;
  atualizadoEm: Date;
} 