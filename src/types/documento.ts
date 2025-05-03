import { IBaseEntity, EStatus } from './common';

export type TTipoDocumento = 
  | 'certificado_digital'
  | 'rg'
  | 'cpf'
  | 'ctps'
  | 'titulo_eleitor'
  | 'certificado_reservista'
  | 'comprovante_residencia'
  | 'atestado_medico'
  | 'contrato_trabalho'
  | 'termo_rescisao'
  | 'outros';

export type TStatusDocumento = 'pending' | 'valid' | 'invalid' | 'expired';

export interface IDocumento extends IBaseEntity {
  tipo: TTipoDocumento;
  titulo: string;
  descricao?: string;
  arquivoUrl: string;
  mimeType: string;
  tamanho: number;
  status: TStatusDocumento;
  dataEmissao: Date;
  dataValidade: Date;
  dataUpload: Date;
  usuarioId: string;
  entidadeId: string;
  entidadeTipo: 'empregador' | 'empregado';
  metadata?: Record<string, unknown>;
  versao: number;
  notificacoes: {
    diasAntecedencia: number[];
    ultimaNotificacao?: Date;
  };
  nome: string;
  url: string;
  userId: string;
  validacoes?: IValidacaoDocumento[];
  alertas?: IAlertaDocumento[];
}

export type TTipoAlerta = 
  | 'vencimento'
  | 'atualizacao'
  | 'pendencia'
  | 'rejeicao';

export type TPrioridadeAlerta = 'baixa' | 'media' | 'alta';

export interface ITPrioridadeAlertaInfo {
  label: string;
  descricao: string;
  icon: string;
  color: string;
}

export function isValidTPrioridadeAlerta(tipo: unknown): tipo is TPrioridadeAlerta {
  const validTypes: TPrioridadeAlerta[] = ['baixa', 'media', 'alta'];
  return typeof tipo === 'string' && validTypes.includes(tipo as TPrioridadeAlerta);
}

export function getTPrioridadeAlertaLabel(tipo: TPrioridadeAlerta): string | undefined {
  const labels: Record<TPrioridadeAlerta, string> = {
    'baixa': 'Baixa',
    'media': 'Média',
    'alta': 'Alta'
  };

  return isValidTPrioridadeAlerta(tipo) ? labels[tipo] : undefined;
}

export function getTPrioridadeAlertaInfo(tipo: TPrioridadeAlerta): ITPrioridadeAlertaInfo | undefined {
  const info: Record<TPrioridadeAlerta, ITPrioridadeAlertaInfo> = {
    'baixa': {
      label: 'Baixa',
      descricao: 'Prioridade baixa para o alerta',
      icon: 'arrow_downward',
      color: 'success'
    },
    'media': {
      label: 'Média',
      descricao: 'Prioridade média para o alerta',
      icon: 'arrow_forward',
      color: 'warning'
    },
    'alta': {
      label: 'Alta',
      descricao: 'Prioridade alta para o alerta',
      icon: 'arrow_upward',
      color: 'error'
    }
  };

  return isValidTPrioridadeAlerta(tipo) ? info[tipo] : undefined;
}

export type TStatusAlerta = 'pending' | 'active' | 'inactive';

export interface IAlertaDocumento extends IBaseEntity {
  documentoId: string;
  tipo: TTipoAlerta;
  mensagem: string;
  dataAlerta: Date;
  dataResolucao?: Date;
  status: TStatusAlerta;
  prioridade: TPrioridadeAlerta;
  usuarioId: string;
  acoes?: {
    tipo: string;
    descricao: string;
    url?: string;
  }[];
  dataEnvio: Date;
  dataLeitura?: Date;
}

export interface IHistoricoDocumento extends IBaseEntity {
  documentoId: string;
  tipo: 'criacao' | 'atualizacao' | 'exclusao' | 'visualizacao' | 'download';
  dataAcao: Date;
  usuarioId: string;
  detalhes?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export interface IValidacaoDocumento extends IBaseEntity {
  documentoId: string;
  status: EStatus;
  observacao?: string;
  validadoPor: string;
  dataValidacao: Date;
}

export interface ITTipoDocumentoInfo {
  label: string;
  descricao: string;
  icon: string;
}

export function isValidTTipoDocumento(tipo: unknown): tipo is TTipoDocumento {
  const validTypes: TTipoDocumento[] = [
    'certificado_digital',
    'rg',
    'cpf',
    'ctps',
    'titulo_eleitor',
    'certificado_reservista',
    'comprovante_residencia',
    'atestado_medico',
    'contrato_trabalho',
    'termo_rescisao',
    'outros'
  ];
  return typeof tipo === 'string' && validTypes.includes(tipo as TTipoDocumento);
}

export function getTTipoDocumentoLabel(tipo: TTipoDocumento): string | undefined {
  const labels: Record<TTipoDocumento, string> = {
    'certificado_digital': 'Certificado Digital',
    'rg': 'RG',
    'cpf': 'CPF',
    'ctps': 'CTPS',
    'titulo_eleitor': 'Título de Eleitor',
    'certificado_reservista': 'Certificado de Reservista',
    'comprovante_residencia': 'Comprovante de Residência',
    'atestado_medico': 'Atestado Médico',
    'contrato_trabalho': 'Contrato de Trabalho',
    'termo_rescisao': 'Termo de Rescisão',
    'outros': 'Outros'
  };

  return isValidTTipoDocumento(tipo) ? labels[tipo] : undefined;
}

export function getTTipoDocumentoInfo(tipo: TTipoDocumento): ITTipoDocumentoInfo | undefined {
  const info: Record<TTipoDocumento, ITTipoDocumentoInfo> = {
    'certificado_digital': {
      label: 'Certificado Digital',
      descricao: 'Certificado digital para assinatura eletrônica',
      icon: 'badge'
    },
    'rg': {
      label: 'RG',
      descricao: 'Registro Geral de Identidade',
      icon: 'badge'
    },
    'cpf': {
      label: 'CPF',
      descricao: 'Cadastro de Pessoa Física',
      icon: 'badge'
    },
    'ctps': {
      label: 'CTPS',
      descricao: 'Carteira de Trabalho e Previdência Social',
      icon: 'work'
    },
    'titulo_eleitor': {
      label: 'Título de Eleitor',
      descricao: 'Documento de identificação eleitoral',
      icon: 'how_to_vote'
    },
    'certificado_reservista': {
      label: 'Certificado de Reservista',
      descricao: 'Documento militar de reservista',
      icon: 'military_tech'
    },
    'comprovante_residencia': {
      label: 'Comprovante de Residência',
      descricao: 'Documento que comprova endereço',
      icon: 'home'
    },
    'atestado_medico': {
      label: 'Atestado Médico',
      descricao: 'Documento médico com informações de saúde',
      icon: 'medical_services'
    },
    'contrato_trabalho': {
      label: 'Contrato de Trabalho',
      descricao: 'Documento que formaliza a relação de trabalho',
      icon: 'description'
    },
    'termo_rescisao': {
      label: 'Termo de Rescisão',
      descricao: 'Documento que formaliza o término do contrato',
      icon: 'description'
    },
    'outros': {
      label: 'Outros',
      descricao: 'Outros tipos de documentos',
      icon: 'description'
    }
  };

  return isValidTTipoDocumento(tipo) ? info[tipo] : undefined;
}

export interface ITTipoAlertaInfo {
  label: string;
  descricao: string;
  icon: string;
}

export function isValidTTipoAlerta(tipo: unknown): tipo is TTipoAlerta {
  const validTypes: TTipoAlerta[] = ['vencimento', 'atualizacao', 'pendencia', 'rejeicao'];
  return typeof tipo === 'string' && validTypes.includes(tipo as TTipoAlerta);
}

export function getTTipoAlertaLabel(tipo: TTipoAlerta): string | undefined {
  const labels: Record<TTipoAlerta, string> = {
    'vencimento': 'Vencimento',
    'atualizacao': 'Atualização',
    'pendencia': 'Pendência',
    'rejeicao': 'Rejeição'
  };

  return isValidTTipoAlerta(tipo) ? labels[tipo] : undefined;
}

export function getTTipoAlertaInfo(tipo: TTipoAlerta): ITTipoAlertaInfo | undefined {
  const info: Record<TTipoAlerta, ITTipoAlertaInfo> = {
    'vencimento': {
      label: 'Vencimento',
      descricao: 'Alerta de vencimento de documento',
      icon: 'event_busy'
    },
    'atualizacao': {
      label: 'Atualização',
      descricao: 'Alerta para atualização de documento',
      icon: 'update'
    },
    'pendencia': {
      label: 'Pendência',
      descricao: 'Alerta de pendência em documento',
      icon: 'warning'
    },
    'rejeicao': {
      label: 'Rejeição',
      descricao: 'Alerta de rejeição de documento',
      icon: 'cancel'
    }
  };

  return isValidTTipoAlerta(tipo) ? info[tipo] : undefined;
}

export interface ITStatusAlertaInfo {
  label: string;
  descricao: string;
  icon: string;
  color: string;
}

export function isValidTStatusAlerta(tipo: unknown): tipo is TStatusAlerta {
  const validTypes: TStatusAlerta[] = ['pending', 'active', 'inactive'];
  return typeof tipo === 'string' && validTypes.includes(tipo as TStatusAlerta);
}

export function getTStatusAlertaLabel(tipo: TStatusAlerta): string | undefined {
  const labels: Record<TStatusAlerta, string> = {
    'pending': 'Pendente',
    'active': 'Ativo',
    'inactive': 'Inativo'
  };

  return isValidTStatusAlerta(tipo) ? labels[tipo] : undefined;
}

export function getTStatusAlertaInfo(tipo: TStatusAlerta): ITStatusAlertaInfo | undefined {
  const info: Record<TStatusAlerta, ITStatusAlertaInfo> = {
    'pending': {
      label: 'Pendente',
      descricao: 'Alerta pendente de processamento',
      icon: 'schedule',
      color: 'warning'
    },
    'active': {
      label: 'Ativo',
      descricao: 'Alerta ativo e sendo monitorado',
      icon: 'check_circle',
      color: 'success'
    },
    'inactive': {
      label: 'Inativo',
      descricao: 'Alerta inativo ou resolvido',
      icon: 'cancel',
      color: 'error'
    }
  };

  return isValidTStatusAlerta(tipo) ? info[tipo] : undefined;
} 