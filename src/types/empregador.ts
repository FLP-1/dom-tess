/** Tipo de empregador: Pessoa Física ou Pessoa Jurídica */
export type TipoEmpregador = 'PF' | 'PJ';

/** Tipo de imóvel onde o empregado trabalha */
export type TipoImovel = 'proprio' | 'alugado' | 'cedido';

/** Tipo de conta bancária */
export type TipoConta = 'corrente' | 'poupanca';

/** Estado civil do empregador */
export type EstadoCivil = 'solteiro' | 'casado' | 'divorciado' | 'viuvo' | 'uniao_estavel';

/** Status do cadastro do empregador */
export type StatusEmpregador = 'completo' | 'incompleto' | 'pendente' | 'inativo';

/** Dados bancários do empregador */
export interface DadosBancarios {
  /** Nome do banco */
  banco: string;
  /** Número da agência (4 dígitos) */
  agencia: string;
  /** Número da conta com dígito (formato: 00000-0) */
  conta: string;
  /** Tipo da conta bancária */
  tipoConta: TipoConta;
}

/** Dados do imóvel onde o empregado trabalha */
export interface DadosImovel {
  /** Tipo do imóvel */
  tipoImovel: TipoImovel;
  /** Quantidade de empregados que trabalham no imóvel */
  numeroEmpregados: number;
  /** Endereço completo */
  endereco: string;
  /** Número do endereço */
  numero: string;
  /** Complemento do endereço (opcional) */
  complemento?: string;
  /** Bairro */
  bairro: string;
  /** Cidade */
  cidade: string;
  /** Estado (UF) */
  estado: string;
  /** CEP no formato 00000-000 */
  cep: string;
}

/** Dados do cônjuge do empregador */
export interface DadosConjuge {
  /** Nome completo do cônjuge */
  nome: string;
  /** CPF do cônjuge no formato 000.000.000-00 */
  cpf: string;
  /** RG do cônjuge no formato 00.000.000-0 */
  rg: string;
  /** Data de nascimento do cônjuge */
  dataNascimento?: Date;
}

/** Dados familiares do empregador */
export interface DadosFamiliares {
  /** Nome completo da mãe */
  nomeMae: string;
  /** Nome completo do pai */
  nomePai: string;
  /** Estado civil atual */
  estadoCivil: EstadoCivil;
  /** Dados do cônjuge (obrigatório se casado ou em união estável) */
  conjuge?: DadosConjuge;
}

/** Certificado digital do empregador */
export interface CertificadoDigital {
  /** Nome do arquivo do certificado */
  arquivo: string;
  /** Senha do certificado */
  senha: string;
  /** Data de validade do certificado */
  validade: Date;
}

/** Dados completos do empregador */
export interface DadosEmpregador {
  /** ID único do empregador */
  id?: string;
  /** ID do usuário associado */
  userId?: string;
  /** Tipo do empregador (PF ou PJ) */
  tipoEmpregador: TipoEmpregador;
  /** Nome completo (PF) ou nome fantasia (PJ) */
  nome: string;
  /** CPF no formato 000.000.000-00 (obrigatório para PF) */
  cpf: string;
  /** Razão social (obrigatório para PJ) */
  razaoSocial: string;
  /** CNPJ no formato 00.000.000/0000-00 (obrigatório para PJ) */
  cnpj: string;
  /** E-mail para contato */
  email: string;
  /** Telefone fixo no formato (00) 0000-0000 */
  telefone: string;
  /** Celular no formato (00) 00000-0000 */
  celular?: string;
  /** Data de nascimento (obrigatório para PF) */
  dataNascimento?: Date;
  /** Nacionalidade */
  nacionalidade?: string;
  /** Profissão ou ocupação principal */
  profissao?: string;
  /** Status atual do cadastro */
  status?: StatusEmpregador;
  /** Data da última atualização do cadastro */
  ultimaAtualizacao?: Date;
  /** Dados do certificado digital */
  certificadoDigital?: CertificadoDigital;
  /** Dados bancários */
  dadosBancarios: DadosBancarios;
  /** Dados do imóvel */
  dadosImovel: DadosImovel;
  /** Dados familiares */
  dadosFamiliares: DadosFamiliares;
} 