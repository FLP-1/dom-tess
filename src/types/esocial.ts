import { EStatus } from './common';

export interface Endereco {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  pais: string;
  tipoEndereco: 'residencial' | 'comercial' | 'outro';
}

export type StatusCertificado = 'active' | 'inactive' | 'expired' | 'invalid';
export type TipoCertificado = 'e-CPF' | 'e-CNPJ' | 'NF-e';

export interface CertificadoDigital {
  id: string;
  nome: string;
  tipo: TipoCertificado;
  dataValidade: Date;
  dataEmissao: Date;
  senha: string;
  arquivoUrl: string;
  status: StatusCertificado;
  cnpjCpf: string;
  serialNumber?: string;
  emissor?: string;
  ultimaVerificacao?: Date;
}

export type TipoConta = 'corrente' | 'poupanca' | 'salario';
export type TipoBanco = 'banco' | 'cooperativa' | 'caixa';

export interface DadosBancarios {
  banco: string;
  codigoBanco: string;
  agencia: string;
  conta: string;
  digitoConta: string;
  tipoConta: TipoConta;
  titularConta: string;
  cpfTitular: string;
}

export type TipoVinculo = 'empregado_domestico' | 'trabalhador_temporario' | 'aprendiz' | 'estagiario';

export interface DadosFamiliares {
  nomeMae: string;
  nomePai: string;
}

export type EstadoCivil = 'solteiro' | 'casado' | 'divorciado' | 'viuvo' | 'uniao_estavel';
export type TipoImovel = 'casa' | 'apartamento' | 'terreno' | 'comercial';
export type FormaPagamento = 'deposito' | 'dinheiro';
export type Status = 'incomplete' | 'completed';
export type StatusPessoa = 'active' | 'inactive';

export interface DadosEmpregador {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: Date;
  email: string;
  telefone: string;
  endereco: Endereco;
  dadosBancarios: DadosBancarios;
  certificadoDigital?: CertificadoDigital;
  status: 'ativo' | 'inativo' | 'pendente' | 'bloqueado';
  ultimaAtualizacao: Date;
  dataCadastro: Date;
}

export interface DadosEmpregado {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: Date;
  nomeMae: string;
  nomePai?: string;
  email?: string;
  telefone?: string;
  endereco: Endereco;
  dadosBancarios: DadosBancarios;
  tipoVinculo: TipoVinculo;
  dataAdmissao: Date;
  dataDemissao?: Date;
  salarioBase: number;
  jornadaTrabalho: JornadaTrabalho;
  beneficios: Beneficio[];
  documentos: DocumentoEmpregado[];
  status: 'ativo' | 'inativo' | 'ferias' | 'afastado' | 'demitido';
  empregadorId: string;
  ultimaAtualizacao: Date;
  dataCadastro: Date;
}

export interface Familiar {
  id: string;
  empregadorId: string;
  nome: string;
  parentesco: string;
  dataNascimento: string;
  cpf: string;
  telefone: string;
  email: string;
  status: StatusPessoa;
  ultimaAtualizacao: string;
}

export interface FuncaoDomestica {
  id: string;
  nome: string;
  descricao: string;
  cbo: string;
  salarioBase: number;
  beneficiosObrigatorios: string[];
  atribuicoes: string[];
  requisitos: string[];
  ultimaAtualizacao: Date;
}

export interface Parentesco {
  id: string;
  codigo: string;
  descricao: string;
  categoria: 'DIRETO' | 'CASAMENTO' | 'COLATERAL';
  idadeMinima?: number;
  idadeMaxima?: number;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface JornadaTrabalho {
  horaEntrada: string;
  horaSaida: string;
  intervaloInicio?: string;
  intervaloFim?: string;
  diasTrabalho: ('segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo')[];
  cargaHorariaSemanal: number;
  trabalhaFeriados: boolean;
  observacoes?: string;
}

export interface Beneficio {
  id: string;
  tipo: 'vale_transporte' | 'vale_refeicao' | 'vale_alimentacao' | 'plano_saude' | 'outro';
  valor: number;
  descricao?: string;
  dataInicio: Date;
  dataFim?: Date;
}

export interface DocumentoEmpregado {
  id: string;
  tipo: 'rg' | 'cpf' | 'ctps' | 'pis' | 'titulo_eleitor' | 'reservista' | 'outro';
  numero: string;
  orgaoEmissor?: string;
  dataEmissao?: Date;
  dataValidade?: Date;
  arquivoUrl?: string;
}

export interface ITipoCertificadoInfo {
  label: string;
  descricao: string;
  icon: string;
}

export function isValidTipoCertificado(tipo: unknown): tipo is TipoCertificado {
  const validTypes: TipoCertificado[] = ['e-CPF', 'e-CNPJ', 'NF-e'];
  return typeof tipo === 'string' && validTypes.includes(tipo as TipoCertificado);
}

export function getTipoCertificadoLabel(tipo: TipoCertificado): string | undefined {
  const labels: Record<TipoCertificado, string> = {
    'e-CPF': 'e-CPF',
    'e-CNPJ': 'e-CNPJ',
    'NF-e': 'NF-e'
  };

  return isValidTipoCertificado(tipo) ? labels[tipo] : undefined;
}

export function getTipoCertificadoInfo(tipo: TipoCertificado): ITipoCertificadoInfo | undefined {
  const info: Record<TipoCertificado, ITipoCertificadoInfo> = {
    'e-CPF': {
      label: 'e-CPF',
      descricao: 'Certificado digital para pessoa física',
      icon: 'badge'
    },
    'e-CNPJ': {
      label: 'e-CNPJ',
      descricao: 'Certificado digital para pessoa jurídica',
      icon: 'business'
    },
    'NF-e': {
      label: 'NF-e',
      descricao: 'Certificado digital para emissão de notas fiscais eletrônicas',
      icon: 'receipt'
    }
  };

  return isValidTipoCertificado(tipo) ? info[tipo] : undefined;
}

export interface ITipoContaInfo {
  label: string;
  descricao: string;
  icon: string;
}

export function isValidTipoConta(tipo: unknown): tipo is TipoConta {
  const validTypes: TipoConta[] = ['corrente', 'poupanca', 'salario'];
  return typeof tipo === 'string' && validTypes.includes(tipo as TipoConta);
}

export function getTipoContaLabel(tipo: TipoConta): string | undefined {
  const labels: Record<TipoConta, string> = {
    'corrente': 'Conta Corrente',
    'poupanca': 'Conta Poupança',
    'salario': 'Conta Salário'
  };

  return isValidTipoConta(tipo) ? labels[tipo] : undefined;
}

export function getTipoContaInfo(tipo: TipoConta): ITipoContaInfo | undefined {
  const info: Record<TipoConta, ITipoContaInfo> = {
    'corrente': {
      label: 'Conta Corrente',
      descricao: 'Conta corrente para movimentações financeiras',
      icon: 'account_balance'
    },
    'poupanca': {
      label: 'Conta Poupança',
      descricao: 'Conta poupança para investimentos',
      icon: 'savings'
    },
    'salario': {
      label: 'Conta Salário',
      descricao: 'Conta específica para recebimento de salário',
      icon: 'payments'
    }
  };

  return isValidTipoConta(tipo) ? info[tipo] : undefined;
}

export interface ITipoBancoInfo {
  label: string;
  descricao: string;
  icon: string;
}

export function isValidTipoBanco(tipo: unknown): tipo is TipoBanco {
  const validTypes: TipoBanco[] = ['banco', 'cooperativa', 'caixa'];
  return typeof tipo === 'string' && validTypes.includes(tipo as TipoBanco);
}

export function getTipoBancoLabel(tipo: TipoBanco): string | undefined {
  const labels: Record<TipoBanco, string> = {
    'banco': 'Banco',
    'cooperativa': 'Cooperativa',
    'caixa': 'Caixa Econômica'
  };

  return labels[tipo];
}

export function getTipoBancoInfo(tipo: TipoBanco): ITipoBancoInfo | undefined {
  const info: Record<TipoBanco, ITipoBancoInfo> = {
    'banco': {
      label: 'Banco',
      descricao: 'Instituição bancária tradicional',
      icon: 'account_balance'
    },
    'cooperativa': {
      label: 'Cooperativa',
      descricao: 'Cooperativa de crédito',
      icon: 'group'
    },
    'caixa': {
      label: 'Caixa Econômica',
      descricao: 'Caixa Econômica Federal',
      icon: 'account_balance'
    }
  };

  return info[tipo];
}

export interface ITipoImovelInfo {
  label: string;
  descricao: string;
  icon: string;
}

export function isValidTipoImovel(tipo: unknown): tipo is TipoImovel {
  const validTypes: TipoImovel[] = ['casa', 'apartamento', 'terreno', 'comercial'];
  return typeof tipo === 'string' && validTypes.includes(tipo as TipoImovel);
}

export function getTipoImovelLabel(tipo: TipoImovel): string | undefined {
  const labels: Record<TipoImovel, string> = {
    'casa': 'Casa',
    'apartamento': 'Apartamento',
    'terreno': 'Terreno',
    'comercial': 'Imóvel Comercial'
  };

  return labels[tipo];
}

export function getTipoImovelInfo(tipo: TipoImovel): ITipoImovelInfo | undefined {
  const info: Record<TipoImovel, ITipoImovelInfo> = {
    'casa': {
      label: 'Casa',
      descricao: 'Imóvel residencial unifamiliar',
      icon: 'home'
    },
    'apartamento': {
      label: 'Apartamento',
      descricao: 'Imóvel residencial em condomínio',
      icon: 'apartment'
    },
    'terreno': {
      label: 'Terreno',
      descricao: 'Terreno sem construção',
      icon: 'landscape'
    },
    'comercial': {
      label: 'Imóvel Comercial',
      descricao: 'Imóvel para uso comercial',
      icon: 'store'
    }
  };

  return info[tipo];
}

export interface ITipoVinculoInfo {
  label: string;
  descricao: string;
  icon: string;
}

export function isValidTipoVinculo(tipo: unknown): tipo is TipoVinculo {
  const validTypes: TipoVinculo[] = ['empregado_domestico', 'trabalhador_temporario', 'aprendiz', 'estagiario'];
  return typeof tipo === 'string' && validTypes.includes(tipo as TipoVinculo);
}

export function getTipoVinculoLabel(tipo: TipoVinculo): string | undefined {
  const labels: Record<TipoVinculo, string> = {
    'empregado_domestico': 'Empregado Doméstico',
    'trabalhador_temporario': 'Trabalhador Temporário',
    'aprendiz': 'Aprendiz',
    'estagiario': 'Estagiário'
  };

  return labels[tipo];
}

export function getTipoVinculoInfo(tipo: TipoVinculo): ITipoVinculoInfo | undefined {
  const info: Record<TipoVinculo, ITipoVinculoInfo> = {
    'empregado_domestico': {
      label: 'Empregado Doméstico',
      descricao: 'Trabalhador que presta serviços de natureza contínua e de finalidade não lucrativa à pessoa ou família no âmbito residencial',
      icon: 'home'
    },
    'trabalhador_temporario': {
      label: 'Trabalhador Temporário',
      descricao: 'Trabalhador contratado por tempo determinado para atender necessidade transitória',
      icon: 'schedule'
    },
    'aprendiz': {
      label: 'Aprendiz',
      descricao: 'Jovem contratado para formação técnico-profissional',
      icon: 'school'
    },
    'estagiario': {
      label: 'Estagiário',
      descricao: 'Estudante em formação para o mercado de trabalho',
      icon: 'person_outline'
    }
  };

  return info[tipo];
} 