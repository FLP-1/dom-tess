import React from 'react';
import { Tag } from '@chakra-ui/react';
import { ETaskPriority } from '../../types/task';

interface TaskPriorityBadgeProps {
  priority: ETaskPriority;
  size?: 'sm' | 'md' | 'lg';
}

export const TaskPriorityBadge: React.FC<TaskPriorityBadgeProps> = ({ priority, size = 'sm' }) => {
  const getPriorityColor = (priority: ETaskPriority) => {
    switch (priority) {
      case ETaskPriority.LOW:
        return 'green';
      case ETaskPriority.MEDIUM:
        return 'yellow';
      case ETaskPriority.HIGH:
        return 'orange';
      case ETaskPriority.URGENT:
        return 'red';
      default:
        return 'gray';
    }
  };

  const getPriorityLabel = (priority: ETaskPriority) => {
    switch (priority) {
      case ETaskPriority.LOW:
        return 'Baixa';
      case ETaskPriority.MEDIUM:
        return 'Média';
      case ETaskPriority.HIGH:
        return 'Alta';
      case ETaskPriority.URGENT:
        return 'Urgente';
      default:
        return '';
    }
  };

  return (
    <Tag
      colorScheme={getPriorityColor(priority)}
      size={size}
      aria-label={`Prioridade: ${getPriorityLabel(priority)}`}
    >
      {getPriorityLabel(priority)}
    </Tag>
  );
}; 