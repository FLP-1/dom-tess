import React from 'react';
import { Tag } from '@chakra-ui/react';
import { TaskPriority } from '../../types/task';

interface TaskPriorityBadgeProps {
  priority: TaskPriority;
  size?: 'sm' | 'md' | 'lg';
}

export const TaskPriorityBadge: React.FC<TaskPriorityBadgeProps> = ({ priority, size = 'sm' }) => {
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.LOW:
        return 'green';
      case TaskPriority.MEDIUM:
        return 'yellow';
      case TaskPriority.HIGH:
        return 'orange';
      case TaskPriority.URGENT:
        return 'red';
      default:
        return 'gray';
    }
  };

  const getPriorityLabel = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.LOW:
        return 'Baixa';
      case TaskPriority.MEDIUM:
        return 'Média';
      case TaskPriority.HIGH:
        return 'Alta';
      case TaskPriority.URGENT:
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