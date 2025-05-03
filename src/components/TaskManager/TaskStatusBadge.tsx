import React from 'react';
import { Badge, BadgeProps } from '@chakra-ui/react';
import { EStatus, getStatusLabel } from '../../types/common';

interface TaskStatusBadgeProps extends Omit<BadgeProps, 'colorScheme'> {
  status: EStatus;
}

const statusColors = {
  [EStatus.NOT_STARTED]: 'gray',
  [EStatus.PENDING]: 'yellow',
  [EStatus.IN_PROGRESS]: 'blue',
  [EStatus.COMPLETED]: 'green',
  [EStatus.CANCELLED]: 'red',
  [EStatus.DELETED]: 'gray',
  [EStatus.FAILED]: 'red',
  [EStatus.INVALID]: 'red',
  [EStatus.ACTIVE]: 'green',
  [EStatus.INACTIVE]: 'gray',
  [EStatus.VALID]: 'green',
  [EStatus.EXPIRED]: 'red',
  [EStatus.ON_VACATION]: 'blue',
  [EStatus.ON_LEAVE]: 'blue',
  [EStatus.DISMISSED]: 'red',
  [EStatus.INCOMPLETE]: 'yellow'
};

export const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({ status, ...props }) => {
  return (
    <Badge
      colorScheme={statusColors[status]}
      {...props}
    >
      {getStatusLabel(status)}
    </Badge>
  );
}; 