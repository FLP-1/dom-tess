import { InputProps, SelectProps as ChakraSelectProps } from '@chakra-ui/react';
import { ReactNode, ChangeEvent, KeyboardEvent, FocusEvent } from 'react';
import { DocumentData, Timestamp } from 'firebase/firestore';
import { v4 as uuidv4, validate as isValidUUID } from 'uuid';
import { z } from 'zod';

/**
 * Tipos primitivos e utilitários
 */
export type TEntityId = string;
export type TValidationRule = (value: unknown) => boolean;
export type TCallbackFunction = (...args: unknown[]) => void;

/**
 * Códigos de erro padronizados
 */
export enum EErrorCode {
  VALIDATION = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  CONFLICT = 'CONFLICT',
  INTERNAL = 'INTERNAL_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',
  INVALID_INPUT = 'INVALID_INPUT'
}

/**
 * Interface para informações detalhadas de um código de erro
 */
export interface IErrorCodeInfo {
  label: string;
  descricao: string;
}

/**
 * Valida se um valor é um EErrorCode válido
 * @param code - Valor a ser validado
 * @returns true se o valor for um EErrorCode válido
 */
export function isValidErrorCode(code: unknown): code is EErrorCode {
  return typeof code === 'string' && Object.values(EErrorCode).includes(code as EErrorCode);
}

/**
 * Retorna o label descritivo para um código de erro
 * @param code - Código de erro para obter o label
 * @returns Label descritivo ou undefined se o código for inválido
 */
export function getErrorCodeLabel(code: EErrorCode): string | undefined {
  const labels: Record<EErrorCode, string> = {
    [EErrorCode.VALIDATION]: 'Erro de Validação',
    [EErrorCode.NOT_FOUND]: 'Não Encontrado',
    [EErrorCode.UNAUTHORIZED]: 'Não Autorizado',
    [EErrorCode.FORBIDDEN]: 'Acesso Negado',
    [EErrorCode.CONFLICT]: 'Conflito',
    [EErrorCode.INTERNAL]: 'Erro Interno',
    [EErrorCode.BAD_REQUEST]: 'Requisição Inválida',
    [EErrorCode.INVALID_INPUT]: 'Entrada Inválida'
  };

  return isValidErrorCode(code) ? labels[code] : undefined;
}

/**
 * Retorna informações detalhadas sobre um código de erro
 * @param code - Código de erro para obter informações
 * @returns Informações detalhadas ou undefined se o código for inválido
 */
export function getErrorCodeInfo(code: EErrorCode): IErrorCodeInfo | undefined {
  const info: Record<EErrorCode, IErrorCodeInfo> = {
    [EErrorCode.VALIDATION]: {
      label: 'Erro de Validação',
      descricao: 'Erro na validação dos dados fornecidos'
    },
    [EErrorCode.NOT_FOUND]: {
      label: 'Não Encontrado',
      descricao: 'O recurso solicitado não foi encontrado'
    },
    [EErrorCode.UNAUTHORIZED]: {
      label: 'Não Autorizado',
      descricao: 'Usuário não está autorizado a realizar esta ação'
    },
    [EErrorCode.FORBIDDEN]: {
      label: 'Acesso Negado',
      descricao: 'Acesso negado ao recurso solicitado'
    },
    [EErrorCode.CONFLICT]: {
      label: 'Conflito',
      descricao: 'Conflito com o estado atual do recurso'
    },
    [EErrorCode.INTERNAL]: {
      label: 'Erro Interno',
      descricao: 'Erro interno do servidor'
    },
    [EErrorCode.BAD_REQUEST]: {
      label: 'Requisição Inválida',
      descricao: 'A requisição contém dados inválidos'
    },
    [EErrorCode.INVALID_INPUT]: {
      label: 'Entrada Inválida',
      descricao: 'Os dados fornecidos são inválidos'
    }
  };

  return isValidErrorCode(code) ? info[code] : undefined;
}

/**
 * Níveis de severidade do erro
 */
export enum EErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Interface para informações detalhadas de um nível de severidade
 */
export interface IErrorSeverityInfo {
  label: string;
  descricao: string;
  color: string;
}

/**
 * Função para validar se um valor é um EErrorSeverity válido
 * @param severity - Valor a ser validado
 * @returns true se o valor for um EErrorSeverity válido
 */
export const isValidErrorSeverity = (severity: unknown): severity is EErrorSeverity => {
  return typeof severity === 'string' && Object.values(EErrorSeverity).includes(severity as EErrorSeverity);
};

/**
 * Função para comparar níveis de severidade
 * @param a - Primeiro nível de severidade
 * @param b - Segundo nível de severidade
 * @returns 1 se a > b, -1 se a < b, 0 se a == b
 */
export const compareErrorSeverity = (a: EErrorSeverity, b: EErrorSeverity): number => {
  const order = Object.values(EErrorSeverity);
  return order.indexOf(a) - order.indexOf(b);
};

/**
 * Função para obter o nível de severidade mais alto entre dois valores
 * @param a - Primeiro nível de severidade
 * @param b - Segundo nível de severidade
 * @returns O nível de severidade mais alto
 */
export const getHighestSeverity = (a: EErrorSeverity, b: EErrorSeverity): EErrorSeverity => {
  return compareErrorSeverity(a, b) > 0 ? a : b;
};

/**
 * Função para obter o label descritivo para um nível de severidade
 * @param severity - Nível de severidade para obter o label
 * @returns Label descritivo ou undefined se o nível for inválido
 */
export function getErrorSeverityLabel(severity: EErrorSeverity): string | undefined {
  const labels: Record<EErrorSeverity, string> = {
    [EErrorSeverity.LOW]: 'Baixa',
    [EErrorSeverity.MEDIUM]: 'Média',
    [EErrorSeverity.HIGH]: 'Alta',
    [EErrorSeverity.CRITICAL]: 'Crítica'
  };

  return isValidErrorSeverity(severity) ? labels[severity] : undefined;
}

/**
 * Retorna informações detalhadas sobre um nível de severidade
 * @param severity - Nível de severidade para obter informações
 * @returns Informações detalhadas ou undefined se o nível for inválido
 */
export function getErrorSeverityInfo(severity: EErrorSeverity): IErrorSeverityInfo | undefined {
  const info: Record<EErrorSeverity, IErrorSeverityInfo> = {
    [EErrorSeverity.LOW]: {
      label: 'Baixa',
      descricao: 'Erro com impacto mínimo no sistema',
      color: 'yellow'
    },
    [EErrorSeverity.MEDIUM]: {
      label: 'Média',
      descricao: 'Erro que pode afetar funcionalidades secundárias',
      color: 'orange'
    },
    [EErrorSeverity.HIGH]: {
      label: 'Alta',
      descricao: 'Erro que afeta funcionalidades principais',
      color: 'red'
    },
    [EErrorSeverity.CRITICAL]: {
      label: 'Crítica',
      descricao: 'Erro que compromete o funcionamento do sistema',
      color: 'purple'
    }
  };

  return isValidErrorSeverity(severity) ? info[severity] : undefined;
}

/**
 * Interface para objetos de erro
 * @property code - Código único que identifica o tipo de erro
 * @property message - Mensagem descritiva do erro
 * @property details - Detalhes adicionais sobre o erro (opcional)
 * @property timestamp - Data e hora em que o erro ocorreu (opcional)
 * @property stack - Stack trace do erro (opcional)
 * @property severity - Nível de severidade do erro (opcional)
 * @property source - Origem do erro (opcional)
 */
export interface TErrorObject {
  code: EErrorCode;
  message: string;
  details?: unknown;
  timestamp?: Date;
  stack?: string;
  severity?: EErrorSeverity;
  source?: string;
}

/**
 * Função para criar um objeto de erro
 * @param code - Código do erro
 * @param message - Mensagem do erro
 * @param options - Opções adicionais do erro
 * @returns Objeto de erro formatado
 */
export const createErrorObject = (
  code: EErrorCode,
  message: string,
  options?: {
    details?: unknown;
    severity?: EErrorSeverity;
    source?: string;
  }
): TErrorObject => ({
  code,
  message,
  details: options?.details,
  timestamp: new Date(),
  stack: new Error().stack,
  severity: options?.severity || EErrorSeverity.MEDIUM,
  source: options?.source
});

/**
 * Função para validar se um objeto é um TErrorObject
 * @param error - Objeto a ser validado
 * @returns true se o objeto for um TErrorObject válido
 */
export const isValidErrorObject = (error: unknown): error is TErrorObject => {
  if (!error || typeof error !== 'object') return false;
  const err = error as TErrorObject;
  return (
    Object.values(EErrorCode).includes(err.code) &&
    typeof err.message === 'string' &&
    (err.details === undefined || err.details !== null) &&
    (err.timestamp === undefined || err.timestamp instanceof Date) &&
    (err.stack === undefined || typeof err.stack === 'string') &&
    (err.severity === undefined || Object.values(EErrorSeverity).includes(err.severity)) &&
    (err.source === undefined || typeof err.source === 'string')
  );
};

/**
 * Tipos de status
 */
export type EStatusValues = 
  | 'active'
  | 'inactive'
  | 'pending'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'invalid'
  | 'not_started'
  | 'in_progress'
  | 'deleted'
  | 'valid'
  | 'expired'
  | 'on_vacation'
  | 'on_leave'
  | 'dismissed'
  | 'incomplete';

export type EStatus = EStatusValues;

/**
 * Interface para informações detalhadas de um status
 */
export interface IStatusInfo {
  label: string;
  description: string;
  icon: string;
  color: string;
}

/**
 * Valida se um valor é um EStatus válido
 * @param status - Valor a ser validado
 * @returns true se o valor for um EStatus válido
 */
export function isValidStatus(status: unknown): status is EStatus {
  return typeof status === 'string' && Object.values(StatusGroups).flat().includes(status as EStatus);
}

/**
 * Retorna o label descritivo para um status
 * @param status - Status para obter o label
 * @returns Label descritivo ou undefined se o status for inválido
 */
export function getStatusLabel(status: EStatus): string | undefined {
  const labels: Record<EStatus, string> = {
    'active': 'Ativo',
    'inactive': 'Inativo',
    'pending': 'Pendente',
    'completed': 'Concluído',
    'failed': 'Falhou',
    'cancelled': 'Cancelado',
    'invalid': 'Inválido',
    'not_started': 'Não iniciado',
    'in_progress': 'Em progresso',
    'deleted': 'Excluído',
    'valid': 'Válido',
    'expired': 'Expirado',
    'on_vacation': 'Em férias',
    'on_leave': 'Em licença',
    'dismissed': 'Demitido',
    'incomplete': 'Incompleto'
  };

  return isValidStatus(status) ? labels[status] : undefined;
}

/**
 * Retorna informações detalhadas sobre um status
 * @param status - Status para obter informações
 * @returns Informações detalhadas ou undefined se o status for inválido
 */
export function getStatusInfo(status: EStatus): IStatusInfo | undefined {
  const info: Record<EStatus, IStatusInfo> = {
    'active': {
      label: 'Ativo',
      description: 'Registro ativo e em uso',
      icon: 'check_circle',
      color: 'green'
    },
    'inactive': {
      label: 'Inativo',
      description: 'Registro inativo, mas mantido no sistema',
      icon: 'cancel',
      color: 'gray'
    },
    'pending': {
      label: 'Pendente',
      description: 'Aguardando processamento ou aprovação',
      icon: 'hourglass_empty',
      color: 'yellow'
    },
    'completed': {
      label: 'Concluído',
      description: 'Processo finalizado com sucesso',
      icon: 'task_alt',
      color: 'green'
    },
    'failed': {
      label: 'Falhou',
      description: 'Processo finalizado com erro',
      icon: 'error',
      color: 'red'
    },
    'cancelled': {
      label: 'Cancelado',
      description: 'Processo cancelado pelo usuário',
      icon: 'cancel',
      color: 'gray'
    },
    'invalid': {
      label: 'Inválido',
      description: 'Registro com dados inconsistentes',
      icon: 'warning',
      color: 'red'
    },
    'not_started': {
      label: 'Não iniciado',
      description: 'Processo ainda não iniciado',
      icon: 'schedule',
      color: 'gray'
    },
    'in_progress': {
      label: 'Em progresso',
      description: 'Processo em andamento',
      icon: 'autorenew',
      color: 'blue'
    },
    'deleted': {
      label: 'Excluído',
      description: 'Registro excluído do sistema',
      icon: 'delete',
      color: 'red'
    },
    'valid': {
      label: 'Válido',
      description: 'Registro válido e atual',
      icon: 'check_circle',
      color: 'green'
    },
    'expired': {
      label: 'Expirado',
      description: 'Registro expirado e não mais válido',
      icon: 'timer_off',
      color: 'red'
    },
    'on_vacation': {
      label: 'Em férias',
      description: 'Registro em férias',
      icon: 'beach_access',
      color: 'blue'
    },
    'on_leave': {
      label: 'Em licença',
      description: 'Registro em licença',
      icon: 'sick',
      color: 'orange'
    },
    'dismissed': {
      label: 'Demitido',
      description: 'Registro demitido do sistema',
      icon: 'person_off',
      color: 'red'
    },
    'incomplete': {
      label: 'Incompleto',
      description: 'Registro com informações incompletas',
      icon: 'error_outline',
      color: 'orange'
    }
  };

  return isValidStatus(status) ? info[status] : undefined;
}

/**
 * Grupos de status
 */
export const StatusGroups = {
  ACTIVE: ['active', 'inactive'] as const,
  PROGRESS: ['pending', 'completed', 'cancelled'] as const,
  VALIDATION: ['valid', 'invalid'] as const,
  AVAILABILITY: ['expired', 'not_started', 'in_progress'] as const,
  EMPLOYEE: ['on_vacation', 'on_leave', 'dismissed'] as const
} as const;

export type StatusGroup = keyof typeof StatusGroups;

/**
 * Funções auxiliares de status
 */
export const isStatusInGroup = (status: EStatus, group: keyof typeof StatusGroups): boolean => {
  return StatusGroups[group].includes(status as typeof StatusGroups[typeof group][number]);
};

export const getNextStatus = (currentStatus: EStatus): EStatus | undefined => {
  const group = getStatusGroup(currentStatus);
  if (!group) return undefined;

  const groupStatuses = StatusGroups[group];
  const currentIndex = groupStatuses.indexOf(currentStatus as any);
  
  if (currentIndex === -1 || currentIndex === groupStatuses.length - 1) {
    return undefined;
  }

  return groupStatuses[currentIndex + 1];
};

export const isValidStatusTransition = (
  fromStatus: EStatus,
  toStatus: EStatus
): boolean => {
  const group = getStatusGroup(fromStatus);
  if (!group || group !== getStatusGroup(toStatus)) return false;

  const groupStatuses = StatusGroups[group];
  const fromIndex = groupStatuses.indexOf(fromStatus as any);
  const toIndex = groupStatuses.indexOf(toStatus as any);
  
  if (fromIndex === -1 || toIndex === -1) {
    return false;
  }

  return toIndex > fromIndex;
};

/**
 * Tipos para IDs
 */
export type TEntityId = string & { readonly __brand: unique symbol };

/**
 * Opções para criação de ID
 */
export interface IEntityIdOptions {
  prefix?: string;
  namespace?: string;
  timestamp?: boolean;
}

/**
 * Função para criar um ID de entidade
 * @param options - Opções de criação do ID
 * @returns ID único da entidade
 */
export const createEntityId = (options?: IEntityIdOptions): TEntityId => {
  const id = uuidv4();
  if (!isValidUUID(id)) {
    throw new Error('ID inválido gerado');
  }

  const parts: string[] = [];
  
  if (options?.prefix) {
    parts.push(options.prefix.toUpperCase());
  }
  
  if (options?.namespace) {
    parts.push(options.namespace.toLowerCase());
  }
  
  parts.push(id);
  
  if (options?.timestamp) {
    parts.push(Date.now().toString(36));
  }
  
  return parts.join('_') as TEntityId;
};

/**
 * Função para validar um ID de entidade
 * @param id - ID a ser validado
 * @returns true se o ID for válido
 */
export const isValidEntityId = (id: unknown): id is TEntityId => {
  if (typeof id !== 'string' || id.length === 0) return false;
  
  const parts = id.split('_');
  const uuid = parts[parts.length - 1];
  
  if (parts.length > 1) {
    // Se tem prefixo/namespace, valida apenas o UUID
    return isValidUUID(uuid);
  }
  
  // Se não tem prefixo/namespace, o ID inteiro deve ser um UUID
  return isValidUUID(id);
};

/**
 * Função para extrair informações de um ID
 * @param id - ID a ser analisado
 * @returns Informações do ID
 */
export const parseEntityId = (id: TEntityId): {
  prefix?: string;
  namespace?: string;
  uuid: string;
  timestamp?: number;
} => {
  const parts = id.split('_');
  const result: ReturnType<typeof parseEntityId> = {
    uuid: parts[parts.length - 1]
  };

  if (parts.length > 1) {
    if (/^[A-Z]+$/.test(parts[0])) {
      result.prefix = parts[0];
    }
    
    if (parts.length > 2 && /^[a-z]+$/.test(parts[1])) {
      result.namespace = parts[1];
    }
    
    const lastPart = parts[parts.length - 1];
    if (/^[0-9a-z]+$/.test(lastPart) && lastPart.length <= 8) {
      result.timestamp = parseInt(lastPart, 36);
      result.uuid = parts[parts.length - 2];
    }
  }

  return result;
};

/**
 * Interfaces base
 */
export interface IBaseEntity {
  id: TEntityId;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
  status: EStatus;
}

export interface IBaseDocument extends IBaseEntity {
  version: number;
  name: string;
  description?: string;
  url: string;
  type: string;
  size: number;
  mimeType: string;
  userId: string;
}

/**
 * Tipos para formulários
 */
export type TPrimitiveValue = string | number | boolean;
export type TArrayValue = Array<TPrimitiveValue>;
export type TFieldValue = TPrimitiveValue | TArrayValue | Date | null | undefined;

export interface IFormField<T> {
  value: T;
  error?: string;
  touched: boolean;
  valid: boolean;
}

export interface IFormState<T> {
  fields: {
    [K in keyof T]: IFormField<T[K]>;
  };
  isValid: boolean;
  isSubmitting: boolean;
  isSubmitted: boolean;
}

/**
 * Tipos para respostas HTTP
 */
export type THttpStatus = 
  | 200 | 201 | 202 | 204
  | 400 | 401 | 403 | 404 | 409 | 422
  | 500 | 502 | 503 | 504;

export type TSuccessResponse<T> = {
  type: 'success';
  data: T;
  statusCode: THttpStatus;
  metadata?: Record<string, unknown>;
};

export type TErrorResponse<E> = {
  type: 'error';
  error: E;
  statusCode: THttpStatus;
  metadata?: Record<string, unknown>;
};

export type TServiceResponse<T, E> = TSuccessResponse<T> | TErrorResponse<E>;

/**
 * Tipos para paginação
 */
export const PAGINATION_LIMITS = [10, 25, 50, 100] as const;
export type TPaginationLimit = typeof PAGINATION_LIMITS[number];
export type TPaginationPage = number & { readonly __brand: unique symbol };

export const isValidPaginationPage = (page: unknown): page is TPaginationPage => {
  return typeof page === 'number' && page > 0;
};

export interface IPaginationParams {
  page: TPaginationPage;
  limit: TPaginationLimit;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, unknown>;
}

export interface IPaginationResult<T> {
  items: T[];
  total: number;
  page: TPaginationPage;
  limit: TPaginationLimit;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Schema base para validação
 */
export const BaseEntitySchema = z.object({
  id: z.string().min(1),
  createdAt: z.union([z.date(), z.instanceof(Timestamp)]),
  updatedAt: z.union([z.date(), z.instanceof(Timestamp)]),
  status: z.string().refine(isValidStatus, {
    message: 'Status inválido'
  })
});

/**
 * Tipos para erros e validação
 */
export interface IValidationRule {
  rule: TValidationRule;
  message: string;
}

/**
 * Tipos de validação padrão
 */
export const ValidationRules = {
  required: (message = 'Campo obrigatório'): IValidationRule => ({
    rule: (value) => value !== null && value !== undefined && value !== '',
    message
  }),
  
  minLength: (min: number, message = `Mínimo de ${min} caracteres`): IValidationRule => ({
    rule: (value) => typeof value === 'string' && value.length >= min,
    message
  }),
  
  maxLength: (max: number, message = `Máximo de ${max} caracteres`): IValidationRule => ({
    rule: (value) => typeof value === 'string' && value.length <= max,
    message
  }),
  
  pattern: (regex: RegExp, message = 'Formato inválido'): IValidationRule => ({
    rule: (value) => typeof value === 'string' && regex.test(value),
    message
  }),
  
  email: (message = 'E-mail inválido'): IValidationRule => ({
    rule: (value) => {
      if (typeof value !== 'string') return false;
      // Limite de comprimento para prevenir ReDoS
      if (value.length > 254) return false;
      // Expressão regular mais robusta para validação de email
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      return emailRegex.test(value);
    },
    message
  }),
  
  number: (message = 'Deve ser um número'): IValidationRule => ({
    rule: (value) => typeof value === 'number' && !isNaN(value),
    message
  }),
  
  min: (min: number, message = `Valor mínimo: ${min}`): IValidationRule => ({
    rule: (value) => typeof value === 'number' && value >= min,
    message
  }),
  
  max: (max: number, message = `Valor máximo: ${max}`): IValidationRule => ({
    rule: (value) => typeof value === 'number' && value <= max,
    message
  }),
  
  boolean: (message = 'Deve ser um booleano'): IValidationRule => ({
    rule: (value) => typeof value === 'boolean',
    message
  }),
  
  date: (message = 'Data inválida'): IValidationRule => ({
    rule: (value) => {
      if (!(value instanceof Date)) return false;
      // Verifica se é uma data válida
      if (isNaN(value.getTime())) return false;
      // Verifica se está dentro de um intervalo razoável (1000-9999)
      const year = value.getFullYear();
      if (year < 1000 || year > 9999) return false;
      return true;
    },
    message
  }),
  
  future: (message = 'A data deve estar no futuro'): IValidationRule => ({
    rule: (value) => {
      if (!(value instanceof Date)) return false;
      // Considera o timezone local
      const now = new Date();
      return value > now;
    },
    message
  }),
  
  past: (message = 'A data deve estar no passado'): IValidationRule => ({
    rule: (value) => {
      if (!(value instanceof Date)) return false;
      // Considera o timezone local
      const now = new Date();
      return value < now;
    },
    message
  }),
  
  custom: (validator: (value: unknown) => boolean, message: string): IValidationRule => ({
    rule: validator,
    message
  })
};

/**
 * Função para validar um campo
 * @param value - Valor a ser validado
 * @param rules - Regras de validação
 * @returns Resultado da validação
 */
export const validateField = (
  value: unknown,
  rules: IValidationRule[] = []
): { isValid: boolean; message?: string } => {
  // Primeiro, verifica se o valor é obrigatório
  const requiredRule = rules.find(r => r.rule === ValidationRules.required().rule);
  if (requiredRule && !requiredRule.rule(value)) {
    return { isValid: false, message: requiredRule.message };
  }

  // Se o valor é opcional e está vazio, retorna válido
  if (value === null || value === undefined || value === '') {
    return { isValid: true };
  }

  // Aplica as demais regras
  for (const { rule, message } of rules) {
    if (!rule(value)) {
      return { isValid: false, message };
    }
  }

  return { isValid: true };
};

export const createValidationRule = (
  rule: TValidationRule,
  message: string
): IValidationRule => ({
  rule,
  message
});

/**
 * Função para criar limite de paginação
 */
export const createPaginationLimit = (limit: number): TPaginationLimit => {
  if (limit <= 0 || limit > 100) {
    throw new Error('O limite deve estar entre 1 e 100');
  }
  if (!PAGINATION_LIMITS.includes(limit as TPaginationLimit)) {
    return PAGINATION_LIMITS[0];
  }
  return limit as TPaginationLimit;
};

export const createPaginationPage = (page: number): TPaginationPage => {
  if (page <= 0) {
    throw new Error('A página deve ser maior que 0');
  }
  return page as TPaginationPage;
};

export const validatePaginationParams = (params: Partial<IPaginationParams>): IPaginationParams => {
  const page = params.page ? createPaginationPage(params.page) : 1 as TPaginationPage;
  const limit = params.limit ? createPaginationLimit(params.limit) : PAGINATION_LIMITS[0];
  
  return {
    page,
    limit,
    orderBy: params.orderBy,
    orderDirection: params.orderDirection || 'asc',
    search: params.search,
    filters: params.filters || {}
  };
};

/**
 * Tipos para upload de arquivos
 */
export interface IFileUpload {
  file: File;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  error?: string;
}

export interface IFileUploadResponse {
  url: string;
  path: string;
  filename: string;
  size: number;
  type: string;
  metadata?: Record<string, unknown>;
  thumbnailUrl?: string;
}

/**
 * Tipos para filtros
 */
export type TFilterOperator = 
  | 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte'
  | 'contains' | 'startsWith' | 'endsWith'
  | 'in' | 'nin' | 'exists' | 'notExists';

export interface IFilterParam {
  field: string;
  operator: TFilterOperator;
  value: unknown;
}

export interface IFilterParams {
  filters: IFilterParam[];
  logic: 'and' | 'or';
}

/**
 * Tipos para seleção
 */
export interface ISelectOption<T = string | number> {
  value: T;
  label: string;
  group?: string;
  disabled?: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * Tipos para cache
 */
export interface ICacheOptions {
  ttl?: number;
  key?: string;
  tags?: string[];
}

export interface ICacheResult<T> {
  data: T;
  timestamp: number;
  ttl?: number;
}

/**
 * Tipos para erros e validação
 */
export type TValidationError = {
  field: string;
  message: string;
  code?: string;
};

export type TValidationResult = {
  isValid: boolean;
  errors: TValidationError[];
};

export type TServiceErrorDetails = {
  field?: string;
  value?: unknown;
  reason?: string;
  stack?: string;
  context?: Record<string, unknown>;
};

export type TServiceError = {
  code: string;
  message: string;
  details?: TServiceErrorDetails;
  validationErrors?: TValidationError[];
  timestamp?: Date;
  severity?: EErrorSeverity;
};

/**
 * Tipos para eventos
 */
export type TEventType = 'create' | 'update' | 'delete' | 'status_change';

/**
 * Interface para informações detalhadas de um tipo de evento
 */
export interface IEventTypeInfo {
  label: string;
  descricao: string;
  icon: string;
}

/**
 * Valida se um valor é um TEventType válido
 * @param type - Valor a ser validado
 * @returns true se o valor for um TEventType válido
 */
export function isValidEventType(type: unknown): type is TEventType {
  const validTypes: TEventType[] = ['create', 'update', 'delete', 'status_change'];
  return typeof type === 'string' && validTypes.includes(type as TEventType);
}

/**
 * Retorna o label descritivo para um tipo de evento
 * @param type - Tipo de evento para obter o label
 * @returns Label descritivo ou undefined se o tipo for inválido
 */
export function getEventTypeLabel(type: TEventType): string | undefined {
  const labels: Record<TEventType, string> = {
    'create': 'Criação',
    'update': 'Atualização',
    'delete': 'Exclusão',
    'status_change': 'Mudança de Status'
  };

  return isValidEventType(type) ? labels[type] : undefined;
}

/**
 * Retorna informações detalhadas sobre um tipo de evento
 * @param type - Tipo de evento para obter informações
 * @returns Informações detalhadas ou undefined se o tipo for inválido
 */
export function getEventTypeInfo(type: TEventType): IEventTypeInfo | undefined {
  const info: Record<TEventType, IEventTypeInfo> = {
    'create': {
      label: 'Criação',
      descricao: 'Evento de criação de um novo registro',
      icon: 'add'
    },
    'update': {
      label: 'Atualização',
      descricao: 'Evento de atualização de um registro existente',
      icon: 'edit'
    },
    'delete': {
      label: 'Exclusão',
      descricao: 'Evento de exclusão de um registro',
      icon: 'delete'
    },
    'status_change': {
      label: 'Mudança de Status',
      descricao: 'Evento de alteração do status de um registro',
      icon: 'sync'
    }
  };

  return isValidEventType(type) ? info[type] : undefined;
}

export interface IBaseEvent {
  type: TEventType;
  entityId: TEntityId;
  timestamp: Date;
  userId: string;
  metadata?: Record<string, unknown>;
}

/**
 * Tipos para permissões
 */
export type TPermission = 'read' | 'write' | 'delete' | 'admin';

/**
 * Interface para informações detalhadas de uma permissão
 */
export interface IPermissionInfo {
  label: string;
  descricao: string;
  icon: string;
}

/**
 * Valida se um valor é um TPermission válido
 * @param permission - Valor a ser validado
 * @returns true se o valor for um TPermission válido
 */
export function isValidPermission(permission: unknown): permission is TPermission {
  const validPermissions: TPermission[] = ['read', 'write', 'delete', 'admin'];
  return typeof permission === 'string' && validPermissions.includes(permission as TPermission);
}

/**
 * Retorna o label descritivo para uma permissão
 * @param permission - Permissão para obter o label
 * @returns Label descritivo ou undefined se a permissão for inválida
 */
export function getPermissionLabel(permission: TPermission): string | undefined {
  const labels: Record<TPermission, string> = {
    'read': 'Leitura',
    'write': 'Escrita',
    'delete': 'Exclusão',
    'admin': 'Administrador'
  };

  return isValidPermission(permission) ? labels[permission] : undefined;
}

/**
 * Retorna informações detalhadas sobre uma permissão
 * @param permission - Permissão para obter informações
 * @returns Informações detalhadas ou undefined se a permissão for inválida
 */
export function getPermissionInfo(permission: TPermission): IPermissionInfo | undefined {
  const info: Record<TPermission, IPermissionInfo> = {
    'read': {
      label: 'Leitura',
      descricao: 'Permissão para visualizar recursos',
      icon: 'visibility'
    },
    'write': {
      label: 'Escrita',
      descricao: 'Permissão para criar e editar recursos',
      icon: 'edit'
    },
    'delete': {
      label: 'Exclusão',
      descricao: 'Permissão para excluir recursos',
      icon: 'delete'
    },
    'admin': {
      label: 'Administrador',
      descricao: 'Permissão total sobre todos os recursos',
      icon: 'admin_panel_settings'
    }
  };

  return isValidPermission(permission) ? info[permission] : undefined;
}

export interface IUserPermission {
  userId: string;
  permissions: TPermission[];
  resources: string[];
}

/**
 * Tipos para logs
 */
export type TLogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Interface para informações detalhadas de um nível de log
 */
export interface ILogLevelInfo {
  label: string;
  descricao: string;
  color: string;
  icon: string;
}

/**
 * Valida se um valor é um TLogLevel válido
 * @param level - Valor a ser validado
 * @returns true se o valor for um TLogLevel válido
 */
export function isValidLogLevel(level: unknown): level is TLogLevel {
  const validLevels: TLogLevel[] = ['debug', 'info', 'warn', 'error'];
  return typeof level === 'string' && validLevels.includes(level as TLogLevel);
}

/**
 * Retorna o label descritivo para um nível de log
 * @param level - Nível de log para obter o label
 * @returns Label descritivo ou undefined se o nível for inválido
 */
export function getLogLevelLabel(level: TLogLevel): string | undefined {
  const labels: Record<TLogLevel, string> = {
    'debug': 'Depuração',
    'info': 'Informação',
    'warn': 'Aviso',
    'error': 'Erro'
  };

  return isValidLogLevel(level) ? labels[level] : undefined;
}

/**
 * Retorna informações detalhadas sobre um nível de log
 * @param level - Nível de log para obter informações
 * @returns Informações detalhadas ou undefined se o nível for inválido
 */
export function getLogLevelInfo(level: TLogLevel): ILogLevelInfo | undefined {
  const info: Record<TLogLevel, ILogLevelInfo> = {
    'debug': {
      label: 'Depuração',
      descricao: 'Mensagens de depuração para desenvolvimento',
      color: 'gray',
      icon: 'bug_report'
    },
    'info': {
      label: 'Informação',
      descricao: 'Mensagens informativas sobre o sistema',
      color: 'blue',
      icon: 'info'
    },
    'warn': {
      label: 'Aviso',
      descricao: 'Avisos sobre situações que podem precisar de atenção',
      color: 'orange',
      icon: 'warning'
    },
    'error': {
      label: 'Erro',
      descricao: 'Erros que precisam de atenção imediata',
      color: 'red',
      icon: 'error'
    }
  };

  return isValidLogLevel(level) ? info[level] : undefined;
}

export interface ILogEntry {
  level: TLogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, unknown>;
}

/**
 * Tipos para configurações
 */
export interface IAppConfig {
  environment: 'development' | 'staging' | 'production';
  apiUrl: string;
  timeout: number;
  retryAttempts: number;
}

/**
 * Tipos para notificações, alertas e mensagens
 */
export type TNotificationType = 'success' | 'error' | 'warning' | 'info';

/**
 * Interface para informações detalhadas de um tipo de notificação
 */
export interface INotificationTypeInfo {
  label: string;
  descricao: string;
  color: string;
  icon: string;
}

/**
 * Valida se um valor é um TNotificationType válido
 * @param type - Valor a ser validado
 * @returns true se o valor for um TNotificationType válido
 */
export function isValidNotificationType(type: unknown): type is TNotificationType {
  const validTypes: TNotificationType[] = ['success', 'error', 'warning', 'info'];
  return typeof type === 'string' && validTypes.includes(type as TNotificationType);
}

/**
 * Retorna o label descritivo para um tipo de notificação
 * @param type - Tipo de notificação para obter o label
 * @returns Label descritivo ou undefined se o tipo for inválido
 */
export function getNotificationTypeLabel(type: TNotificationType): string | undefined {
  const labels: Record<TNotificationType, string> = {
    'success': 'Sucesso',
    'error': 'Erro',
    'warning': 'Aviso',
    'info': 'Informação'
  };

  return isValidNotificationType(type) ? labels[type] : undefined;
}

/**
 * Retorna informações detalhadas sobre um tipo de notificação
 * @param type - Tipo de notificação para obter informações
 * @returns Informações detalhadas ou undefined se o tipo for inválido
 */
export function getNotificationTypeInfo(type: TNotificationType): INotificationTypeInfo | undefined {
  const info: Record<TNotificationType, INotificationTypeInfo> = {
    'success': {
      label: 'Sucesso',
      descricao: 'Operação realizada com sucesso',
      color: 'green',
      icon: 'check_circle'
    },
    'error': {
      label: 'Erro',
      descricao: 'Ocorreu um erro durante a operação',
      color: 'red',
      icon: 'error'
    },
    'warning': {
      label: 'Aviso',
      descricao: 'Atenção: situação que requer cuidado',
      color: 'orange',
      icon: 'warning'
    },
    'info': {
      label: 'Informação',
      descricao: 'Mensagem informativa',
      color: 'blue',
      icon: 'info'
    }
  };

  return isValidNotificationType(type) ? info[type] : undefined;
}

export type TAlertType = 'success' | 'error' | 'warning' | 'info';

/**
 * Valida se um valor é um TAlertType válido
 * @param type - Valor a ser validado
 * @returns true se o valor for um TAlertType válido
 */
export function isValidAlertType(type: unknown): type is TAlertType {
  return isValidNotificationType(type);
}

/**
 * Retorna o label descritivo para um tipo de alerta
 * @param type - Tipo de alerta para obter o label
 * @returns Label descritivo ou undefined se o tipo for inválido
 */
export function getAlertTypeLabel(type: TAlertType): string | undefined {
  return getNotificationTypeLabel(type);
}

/**
 * Retorna informações detalhadas sobre um tipo de alerta
 * @param type - Tipo de alerta para obter informações
 * @returns Informações detalhadas ou undefined se o tipo for inválido
 */
export function getAlertTypeInfo(type: TAlertType): INotificationTypeInfo | undefined {
  return getNotificationTypeInfo(type);
}

export type TMessageType = 'info' | 'success' | 'warning' | 'error';

export interface IMessageTypeInfo {
  label: string;
  description: string;
  icon: string;
  color: string;
}

/**
 * Valida se um valor é um TMessageType válido
 * @param type - Valor a ser validado
 * @returns true se o valor for um TMessageType válido
 */
export function isValidMessageType(type: unknown): type is TMessageType {
  const validTypes: TMessageType[] = ['info', 'success', 'warning', 'error'];
  return typeof type === 'string' && validTypes.includes(type as TMessageType);
}

/**
 * Retorna o label descritivo para um tipo de mensagem
 * @param type - Tipo de mensagem para obter o label
 * @returns Label descritivo ou undefined se o tipo for inválido
 */
export function getMessageTypeLabel(type: TMessageType): string | undefined {
  const labels: Record<TMessageType, string> = {
    'info': 'Informação',
    'success': 'Sucesso',
    'warning': 'Alerta',
    'error': 'Erro'
  };

  return isValidMessageType(type) ? labels[type] : undefined;
}

/**
 * Retorna informações detalhadas sobre um tipo de mensagem
 * @param type - Tipo de mensagem para obter informações
 * @returns Informações detalhadas ou undefined se o tipo for inválido
 */
export function getMessageTypeInfo(type: TMessageType): IMessageTypeInfo | undefined {
  const info: Record<TMessageType, IMessageTypeInfo> = {
    'info': {
      label: 'Informação',
      description: 'Mensagem informativa',
      icon: 'info',
      color: 'blue'
    },
    'success': {
      label: 'Sucesso',
      description: 'Mensagem de sucesso',
      icon: 'check_circle',
      color: 'green'
    },
    'warning': {
      label: 'Alerta',
      description: 'Mensagem de alerta',
      icon: 'warning',
      color: 'orange'
    },
    'error': {
      label: 'Erro',
      description: 'Mensagem de erro',
      icon: 'error',
      color: 'red'
    }
  };

  return isValidMessageType(type) ? info[type] : undefined;
}

export interface IBaseMessage {
  id: string;
  type: TMessageType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  userId: string;
}

export interface INotification extends IBaseMessage {
  type: TNotificationType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
  onDismiss?: () => void;
}

export interface IAlert extends IBaseMessage {
  type: TAlertType;
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  severity?: 'low' | 'medium' | 'high';
}

export interface IMessage extends IBaseMessage {
  type: TMessageType;
  title?: string;
  icon?: string;
  metadata?: Record<string, unknown>;
  priority?: 'low' | 'normal' | 'high';
}

/**
 * Funções utilitárias para Firebase
 */
export const convertFirebaseTimestamp = (timestamp: Timestamp): Date => {
  return timestamp.toDate();
};

export const convertDateToFirebaseTimestamp = (date: Date): Timestamp => {
  return Timestamp.fromDate(date);
};

/**
 * Interface para informações detalhadas de uma regra de validação
 */
export interface IValidationRuleInfo {
  label: string;
  descricao: string;
  icon: string;
}

/**
 * Valida se um valor é uma função de validação válida
 * @param rule - Valor a ser validado
 * @returns true se o valor for uma função de validação válida
 */
export function isValidValidationRule(rule: unknown): rule is TValidationRule {
  return typeof rule === 'function' && rule.length === 1;
}

/**
 * Retorna o label descritivo para uma regra de validação
 * @param rule - Regra de validação para obter o label
 * @returns Label descritivo ou undefined se a regra for inválida
 */
export function getValidationRuleLabel(rule: TValidationRule): string | undefined {
  const labels: Record<string, string> = {
    'required': 'Obrigatório',
    'email': 'Email',
    'minLength': 'Tamanho Mínimo',
    'maxLength': 'Tamanho Máximo',
    'pattern': 'Padrão',
    'number': 'Número',
    'min': 'Valor Mínimo',
    'max': 'Valor Máximo',
    'boolean': 'Booleano',
    'date': 'Data',
    'future': 'Data Futura',
    'past': 'Data Passada'
  };

  return isValidValidationRule(rule) ? labels[rule.name] || 'Regra Personalizada' : undefined;
}

/**
 * Retorna informações detalhadas sobre uma regra de validação
 * @param rule - Regra de validação para obter informações
 * @returns Informações detalhadas ou undefined se a regra for inválida
 */
export function getValidationRuleInfo(rule: TValidationRule): IValidationRuleInfo | undefined {
  const info: Record<string, IValidationRuleInfo> = {
    'required': {
      label: 'Obrigatório',
      descricao: 'Campo é obrigatório e não pode estar vazio',
      icon: 'error'
    },
    'email': {
      label: 'Email',
      descricao: 'Valor deve ser um endereço de email válido',
      icon: 'email'
    },
    'minLength': {
      label: 'Tamanho Mínimo',
      descricao: 'Valor deve ter um tamanho mínimo',
      icon: 'short_text'
    },
    'maxLength': {
      label: 'Tamanho Máximo',
      descricao: 'Valor deve ter um tamanho máximo',
      icon: 'text_fields'
    },
    'pattern': {
      label: 'Padrão',
      descricao: 'Valor deve seguir um padrão específico',
      icon: 'pattern'
    },
    'number': {
      label: 'Número',
      descricao: 'Valor deve ser um número',
      icon: 'numbers'
    },
    'min': {
      label: 'Valor Mínimo',
      descricao: 'Valor deve ser maior ou igual ao mínimo',
      icon: 'arrow_upward'
    },
    'max': {
      label: 'Valor Máximo',
      descricao: 'Valor deve ser menor ou igual ao máximo',
      icon: 'arrow_downward'
    },
    'boolean': {
      label: 'Booleano',
      descricao: 'Valor deve ser verdadeiro ou falso',
      icon: 'toggle_on'
    },
    'date': {
      label: 'Data',
      descricao: 'Valor deve ser uma data válida',
      icon: 'event'
    },
    'future': {
      label: 'Data Futura',
      descricao: 'Data deve estar no futuro',
      icon: 'event_available'
    },
    'past': {
      label: 'Data Passada',
      descricao: 'Data deve estar no passado',
      icon: 'event_busy'
    }
  };

  return isValidValidationRule(rule) ? info[rule.name] || {
    label: 'Regra Personalizada',
    descricao: 'Regra de validação personalizada',
    icon: 'rule'
  } : undefined;
}

/**
 * Interface para informações detalhadas de uma função de callback
 */
export interface ICallbackFunctionInfo {
  label: string;
  descricao: string;
  icon: string;
}

/**
 * Valida se um valor é uma função de callback válida
 * @param callback - Valor a ser validado
 * @returns true se o valor for uma função de callback válida
 */
export function isValidCallbackFunction(callback: unknown): callback is TCallbackFunction {
  return typeof callback === 'function';
}

/**
 * Retorna o label descritivo para uma função de callback
 * @param callback - Função de callback para obter o label
 * @returns Label descritivo ou undefined se a função for inválida
 */
export function getCallbackFunctionLabel(callback: TCallbackFunction): string | undefined {
  const labels: Record<string, string> = {
    'onSuccess': 'Sucesso',
    'onError': 'Erro',
    'onComplete': 'Completo',
    'onChange': 'Mudança',
    'onSubmit': 'Submeter',
    'onClick': 'Clique',
    'onFocus': 'Foco',
    'onBlur': 'Desfocar',
    'onKeyDown': 'Tecla Pressionada',
    'onKeyUp': 'Tecla Liberada',
    'onMouseEnter': 'Mouse Entrou',
    'onMouseLeave': 'Mouse Saiu',
    'onScroll': 'Rolagem',
    'onResize': 'Redimensionar',
    'onLoad': 'Carregar',
    'onUnload': 'Descarregar'
  };

  return isValidCallbackFunction(callback) ? labels[callback.name] || 'Callback Personalizado' : undefined;
}

/**
 * Retorna informações detalhadas sobre uma função de callback
 * @param callback - Função de callback para obter informações
 * @returns Informações detalhadas ou undefined se a função for inválida
 */
export function getCallbackFunctionInfo(callback: TCallbackFunction): ICallbackFunctionInfo | undefined {
  const info: Record<string, ICallbackFunctionInfo> = {
    'onSuccess': {
      label: 'Sucesso',
      descricao: 'Função chamada quando a operação é bem-sucedida',
      icon: 'check_circle'
    },
    'onError': {
      label: 'Erro',
      descricao: 'Função chamada quando ocorre um erro',
      icon: 'error'
    },
    'onComplete': {
      label: 'Completo',
      descricao: 'Função chamada quando a operação é concluída',
      icon: 'done_all'
    },
    'onChange': {
      label: 'Mudança',
      descricao: 'Função chamada quando o valor é alterado',
      icon: 'edit'
    },
    'onSubmit': {
      label: 'Submeter',
      descricao: 'Função chamada quando o formulário é submetido',
      icon: 'send'
    },
    'onClick': {
      label: 'Clique',
      descricao: 'Função chamada quando o elemento é clicado',
      icon: 'touch_app'
    },
    'onFocus': {
      label: 'Foco',
      descricao: 'Função chamada quando o elemento recebe foco',
      icon: 'center_focus_strong'
    },
    'onBlur': {
      label: 'Desfocar',
      descricao: 'Função chamada quando o elemento perde foco',
      icon: 'center_focus_weak'
    },
    'onKeyDown': {
      label: 'Tecla Pressionada',
      descricao: 'Função chamada quando uma tecla é pressionada',
      icon: 'keyboard'
    },
    'onKeyUp': {
      label: 'Tecla Liberada',
      descricao: 'Função chamada quando uma tecla é liberada',
      icon: 'keyboard_return'
    },
    'onMouseEnter': {
      label: 'Mouse Entrou',
      descricao: 'Função chamada quando o mouse entra no elemento',
      icon: 'mouse'
    },
    'onMouseLeave': {
      label: 'Mouse Saiu',
      descricao: 'Função chamada quando o mouse sai do elemento',
      icon: 'mouse'
    },
    'onScroll': {
      label: 'Rolagem',
      descricao: 'Função chamada quando ocorre rolagem',
      icon: 'swap_vert'
    },
    'onResize': {
      label: 'Redimensionar',
      descricao: 'Função chamada quando o elemento é redimensionado',
      icon: 'aspect_ratio'
    },
    'onLoad': {
      label: 'Carregar',
      descricao: 'Função chamada quando o elemento é carregado',
      icon: 'file_download'
    },
    'onUnload': {
      label: 'Descarregar',
      descricao: 'Função chamada quando o elemento é descarregado',
      icon: 'file_upload'
    }
  };

  return isValidCallbackFunction(callback) ? info[callback.name] || {
    label: 'Callback Personalizado',
    descricao: 'Função de callback personalizada',
    icon: 'functions'
  } : undefined;
}

export interface ITHttpStatusInfo {
  label: string;
  descricao: string;
  color: string;
  icon: string;
}

export function isValidTHttpStatus(status: unknown): status is THttpStatus {
  const validStatuses: THttpStatus[] = [
    200, 201, 202, 204,
    400, 401, 403, 404, 409, 422,
    500, 502, 503, 504
  ];
  return typeof status === 'number' && validStatuses.includes(status as THttpStatus);
}

export function getTHttpStatusLabel(status: THttpStatus): string | undefined {
  const labels: Record<THttpStatus, string> = {
    200: 'OK',
    201: 'Criado',
    202: 'Aceito',
    204: 'Sem Conteúdo',
    400: 'Requisição Inválida',
    401: 'Não Autorizado',
    403: 'Acesso Negado',
    404: 'Não Encontrado',
    409: 'Conflito',
    422: 'Entidade Não Processável',
    500: 'Erro Interno do Servidor',
    502: 'Bad Gateway',
    503: 'Serviço Indisponível',
    504: 'Gateway Timeout'
  };

  return isValidTHttpStatus(status) ? labels[status] : undefined;
}

export function getTHttpStatusInfo(status: THttpStatus): ITHttpStatusInfo | undefined {
  const info: Record<THttpStatus, ITHttpStatusInfo> = {
    200: {
      label: 'OK',
      descricao: 'A requisição foi bem-sucedida',
      color: 'success',
      icon: 'check_circle'
    },
    201: {
      label: 'Criado',
      descricao: 'O recurso foi criado com sucesso',
      color: 'success',
      icon: 'add_circle'
    },
    202: {
      label: 'Aceito',
      descricao: 'A requisição foi aceita para processamento',
      color: 'info',
      icon: 'pending'
    },
    204: {
      label: 'Sem Conteúdo',
      descricao: 'A requisição foi bem-sucedida, mas não há conteúdo para retornar',
      color: 'info',
      icon: 'check_circle'
    },
    400: {
      label: 'Requisição Inválida',
      descricao: 'A requisição contém dados inválidos',
      color: 'error',
      icon: 'error'
    },
    401: {
      label: 'Não Autorizado',
      descricao: 'O usuário não está autorizado a acessar o recurso',
      color: 'error',
      icon: 'lock'
    },
    403: {
      label: 'Acesso Negado',
      descricao: 'O acesso ao recurso foi negado',
      color: 'error',
      icon: 'block'
    },
    404: {
      label: 'Não Encontrado',
      descricao: 'O recurso solicitado não foi encontrado',
      color: 'error',
      icon: 'search_off'
    },
    409: {
      label: 'Conflito',
      descricao: 'Conflito com o estado atual do recurso',
      color: 'error',
      icon: 'warning'
    },
    422: {
      label: 'Entidade Não Processável',
      descricao: 'A entidade fornecida não pôde ser processada',
      color: 'error',
      icon: 'error'
    },
    500: {
      label: 'Erro Interno do Servidor',
      descricao: 'Ocorreu um erro interno no servidor',
      color: 'error',
      icon: 'error'
    },
    502: {
      label: 'Bad Gateway',
      descricao: 'O servidor recebeu uma resposta inválida de um servidor upstream',
      color: 'error',
      icon: 'error'
    },
    503: {
      label: 'Serviço Indisponível',
      descricao: 'O serviço está temporariamente indisponível',
      color: 'error',
      icon: 'error'
    },
    504: {
      label: 'Gateway Timeout',
      descricao: 'O servidor não recebeu uma resposta a tempo de um servidor upstream',
      color: 'error',
      icon: 'error'
    }
  };

  return isValidTHttpStatus(status) ? info[status] : undefined;
}

export interface ITFilterOperatorInfo {
  label: string;
  descricao: string;
  icon: string;
  symbol: string;
}

export function isValidTFilterOperator(operator: unknown): operator is TFilterOperator {
  const validOperators: TFilterOperator[] = [
    'eq', 'neq', 'gt', 'gte', 'lt', 'lte',
    'contains', 'startsWith', 'endsWith',
    'in', 'nin', 'exists', 'notExists'
  ];
  return typeof operator === 'string' && validOperators.includes(operator as TFilterOperator);
}

export function getTFilterOperatorLabel(operator: TFilterOperator): string | undefined {
  const labels: Record<TFilterOperator, string> = {
    'eq': 'Igual a',
    'neq': 'Diferente de',
    'gt': 'Maior que',
    'gte': 'Maior ou igual a',
    'lt': 'Menor que',
    'lte': 'Menor ou igual a',
    'contains': 'Contém',
    'startsWith': 'Começa com',
    'endsWith': 'Termina com',
    'in': 'Está em',
    'nin': 'Não está em',
    'exists': 'Existe',
    'notExists': 'Não existe'
  };

  return isValidTFilterOperator(operator) ? labels[operator] : undefined;
}

export function getTFilterOperatorInfo(operator: TFilterOperator): ITFilterOperatorInfo | undefined {
  const info: Record<TFilterOperator, ITFilterOperatorInfo> = {
    'eq': {
      label: 'Igual a',
      descricao: 'O valor é igual ao valor fornecido',
      icon: 'equal',
      symbol: '='
    },
    'neq': {
      label: 'Diferente de',
      descricao: 'O valor é diferente do valor fornecido',
      icon: 'not_equal',
      symbol: '!='
    },
    'gt': {
      label: 'Maior que',
      descricao: 'O valor é maior que o valor fornecido',
      icon: 'greater_than',
      symbol: '>'
    },
    'gte': {
      label: 'Maior ou igual a',
      descricao: 'O valor é maior ou igual ao valor fornecido',
      icon: 'greater_than_equal',
      symbol: '>='
    },
    'lt': {
      label: 'Menor que',
      descricao: 'O valor é menor que o valor fornecido',
      icon: 'less_than',
      symbol: '<'
    },
    'lte': {
      label: 'Menor ou igual a',
      descricao: 'O valor é menor ou igual ao valor fornecido',
      icon: 'less_than_equal',
      symbol: '<='
    },
    'contains': {
      label: 'Contém',
      descricao: 'O valor contém o valor fornecido',
      icon: 'search',
      symbol: '⊃'
    },
    'startsWith': {
      label: 'Começa com',
      descricao: 'O valor começa com o valor fornecido',
      icon: 'text_fields',
      symbol: '^'
    },
    'endsWith': {
      label: 'Termina com',
      descricao: 'O valor termina com o valor fornecido',
      icon: 'text_fields',
      symbol: '$'
    },
    'in': {
      label: 'Está em',
      descricao: 'O valor está na lista fornecida',
      icon: 'list',
      symbol: '∈'
    },
    'nin': {
      label: 'Não está em',
      descricao: 'O valor não está na lista fornecida',
      icon: 'list',
      symbol: '∉'
    },
    'exists': {
      label: 'Existe',
      descricao: 'O campo existe',
      icon: 'check',
      symbol: '∃'
    },
    'notExists': {
      label: 'Não existe',
      descricao: 'O campo não existe',
      icon: 'close',
      symbol: '∄'
    }
  };

  return isValidTFilterOperator(operator) ? info[operator] : undefined;
}

export function getStatusGroup(status: EStatus): StatusGroup | undefined {
  for (const [group, statuses] of Object.entries(StatusGroups)) {
    if (statuses.includes(status as any)) {
      return group as StatusGroup;
    }
  }
  return undefined;
}

/**
 * Interface base para informações de tipo
 */
export interface ITypeInfo {
  label: string;
  descricao: string;
  icon: string;
} 