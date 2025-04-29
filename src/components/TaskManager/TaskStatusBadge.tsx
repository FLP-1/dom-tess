import React from 'react';
import { Tag } from '@chakra-ui/react';
import { TaskStatus } from '../../types/task';

interface TaskStatusBadgeProps {
  status: TaskStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({ status, size = 'sm' }) => {
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.NOT_STARTED:
        return 'gray';
      case TaskStatus.PENDING:
        return 'yellow';
      case TaskStatus.IN_PROGRESS:
        return 'blue';
      case TaskStatus.COMPLETED:
        return 'green';
      case TaskStatus.CANCELLED:
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.NOT_STARTED:
        return 'Não Iniciado';
      case TaskStatus.PENDING:
        return 'Pendente';
      case TaskStatus.IN_PROGRESS:
        return 'Em Andamento';
      case TaskStatus.COMPLETED:
        return 'Concluído';
      case TaskStatus.CANCELLED:
        return 'Cancelado';
      default:
        return '';
    }
  };

  return (
    <Tag
      colorScheme={getStatusColor(status)}
      size={size}
      aria-label={`Status: ${getStatusLabel(status)}`}
    >
      {getStatusLabel(status)}
    </Tag>
  );
}; 