export interface CertificadoDigital {
  id: string;
  nome: string;
  dataValidade: Date;
  senha: string;
  arquivoUrl: string;
  status: 'ativo' | 'inativo' | 'expirado';
}

export interface DadosEmpregador {
  id: string;
  userId: string;
  cpf: string;
  nome: string;
  dataNascimento: Date;
  endereco: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  contato: {
    telefone: string;
    email: string;
  };
  dadosBancarios?: {
    banco: string;
    agencia: string;
    conta: string;
    tipoConta: 'corrente' | 'poupanca';
  };
  certificadoDigital?: CertificadoDigital;
  status: 'completo' | 'incompleto' | 'pendente';
  ultimaAtualizacao: Date;
}

export interface DadosEmpregado {
  id: string;
  empregadorId: string;
  cpf: string;
  nome: string;
  dataNascimento: Date;
  pis: string;
  ctps: {
    numero: string;
    serie: string;
    uf: string;
  };
  endereco: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  contato: {
    telefone: string;
    email: string;
  };
  dadosBancarios?: {
    banco: string;
    agencia: string;
    conta: string;
    tipoConta: 'corrente' | 'poupanca';
  };
  dadosTrabalho: {
    dataAdmissao: Date;
    cargo: string;
    salario: number;
    cargaHoraria: number;
    tipoContrato: 'prazo_indeterminado' | 'prazo_determinado' | 'temporario';
    regimeTrabalho: 'mensalista' | 'horista';
  };
  status: 'ativo' | 'inativo' | 'ferias' | 'licenca';
  ultimaAtualizacao: Date;
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