import { IBaseEntity, EStatus } from './common';

export enum ETaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

/**
 * Função para validar se um valor é um ETaskPriority válido
 * @param priority - Valor a ser validado
 * @returns true se o valor for um ETaskPriority válido
 */
export const isValidTaskPriority = (priority: unknown): priority is ETaskPriority => {
  if (typeof priority !== 'string') return false;
  return Object.values(ETaskPriority).includes(priority as ETaskPriority);
};

/**
 * Função para comparar dois níveis de prioridade
 * @param a - Primeiro nível de prioridade
 * @param b - Segundo nível de prioridade
 * @returns 0 se iguais, negativo se a < b, positivo se a > b
 */
export const compareTaskPriority = (a: ETaskPriority, b: ETaskPriority): number => {
  const priorityOrder = Object.values(ETaskPriority);
  return priorityOrder.indexOf(a) - priorityOrder.indexOf(b);
};

/**
 * Função para obter o nível de prioridade mais alto entre dois valores
 * @param a - Primeiro nível de prioridade
 * @param b - Segundo nível de prioridade
 * @returns O nível de prioridade mais alto
 */
export const getHighestPriority = (a: ETaskPriority, b: ETaskPriority): ETaskPriority => {
  return compareTaskPriority(a, b) >= 0 ? a : b;
};

export enum ETaskRecurrence {
  NONE = 'none',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

/**
 * Função para validar se um valor é um ETaskRecurrence válido
 * @param recurrence - Valor a ser validado
 * @returns true se o valor for um ETaskRecurrence válido
 */
export const isValidTaskRecurrence = (recurrence: unknown): recurrence is ETaskRecurrence => {
  if (typeof recurrence !== 'string') return false;
  return Object.values(ETaskRecurrence).includes(recurrence as ETaskRecurrence);
};

/**
 * Função para comparar dois tipos de recorrência
 * @param a - Primeiro tipo de recorrência
 * @param b - Segundo tipo de recorrência
 * @returns 0 se iguais, negativo se a < b, positivo se a > b
 */
export const compareTaskRecurrence = (a: ETaskRecurrence, b: ETaskRecurrence): number => {
  const recurrenceOrder = Object.values(ETaskRecurrence);
  return recurrenceOrder.indexOf(a) - recurrenceOrder.indexOf(b);
};

/**
 * Função para calcular a próxima data de recorrência
 * @param baseDate - Data base para cálculo
 * @param recurrence - Tipo de recorrência
 * @param interval - Intervalo entre recorrências
 * @returns Nova data calculada
 */
export const getNextRecurrenceDate = (
  baseDate: Date,
  recurrence: ETaskRecurrence,
  interval: number = 1
): Date => {
  const newDate = new Date(baseDate);
  
  switch (recurrence) {
    case ETaskRecurrence.DAILY:
      newDate.setDate(newDate.getDate() + interval);
      break;
    case ETaskRecurrence.WEEKLY:
      newDate.setDate(newDate.getDate() + (7 * interval));
      break;
    case ETaskRecurrence.MONTHLY:
      newDate.setMonth(newDate.getMonth() + interval);
      break;
    case ETaskRecurrence.YEARLY:
      newDate.setFullYear(newDate.getFullYear() + interval);
      break;
    case ETaskRecurrence.NONE:
      // Não faz nada, retorna a mesma data
      break;
  }
  
  return newDate;
};

export interface ITaskAttachment {
  id: string;
  type: 'audio' | 'photo' | 'document';
  url: string;
  name: string;
  uploadedAt: Date;
}

export interface ITaskComment extends IBaseEntity {
  userId: string;
  content: string;
}

export interface ITaskHistory {
  userId: string;
  action: string;
  timestamp: Date;
  changes: Record<string, unknown>;
}

export interface ITaskRecurrenceConfig {
  type: ETaskRecurrence;
  interval: number;
  endDate?: Date;
}

export interface ITaskFilter {
  status?: EStatus;
  priority?: ETaskPriority;
  assignedTo?: string;
  createdBy?: string;
  startDate?: Date;
  endDate?: Date;
  estimatedTime?: number;
  estimatedCost?: number;
  tags?: string[];
  category?: string;
  teamId?: string;
  search?: string;
  userId?: string;
}

export interface ITask extends IBaseEntity {
  title: string;
  description: string;
  status: EStatus;
  priority: ETaskPriority;
  dueDate: Date;
  assignedTo: string;
  createdBy: string;
  estimatedTime?: number;
  estimatedCost?: number;
  attachments?: ITaskAttachment[];
  comments?: string[];
  tags?: string[];
  recurrence?: ITaskRecurrenceConfig;
} 