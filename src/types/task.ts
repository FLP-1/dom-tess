export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum TaskStatus {
  NOT_STARTED = 'NOT_STARTED',
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum TaskRecurrence {
  NONE = 'NONE',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo: string[]; // IDs dos usuários responsáveis
  createdBy: string; // ID do usuário que criou a tarefa
  createdAt: Date;
  updatedAt: Date;
  estimatedCost?: number;
  estimatedTime?: number; // em horas
  recurrence?: {
    type: TaskRecurrence;
    interval: number; // número de dias/semanas/meses/anos
    endDate?: Date; // data final da recorrência
  };
  attachments?: {
    photos?: string[]; // URLs das fotos
    audios?: string[]; // URLs dos áudios
    documents?: string[]; // URLs dos documentos
  };
  comments?: {
    userId: string;
    text: string;
    createdAt: Date;
  }[];
  history?: {
    userId: string;
    action: string;
    timestamp: Date;
    changes: Record<string, any>;
  }[];
  tags?: string[];
  category?: string;
}

export interface TaskFilter {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  assignedTo?: string[];
  dueDateFrom?: Date;
  dueDateTo?: Date;
  tags?: string[];
  category?: string;
  teamId?: string;
  search?: string;
} 