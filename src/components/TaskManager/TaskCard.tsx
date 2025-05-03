import React from 'react';
import { Card, CardBody, CardHeader, Heading, Text, Flex, Box, Icon } from '@chakra-ui/react';
import { TaskStatusBadge } from './TaskStatusBadge';
import { TaskPriorityBadge } from './TaskPriorityBadge';
import { ITask } from '../../types/task';
import { FiCalendar, FiDollarSign, FiClock } from 'react-icons/fi';

interface TaskCardProps {
  task: ITask;
  onClick: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onClick();
    }
  };

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyPress={handleKeyPress}
      cursor="pointer"
      _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
      transition="all 0.2s"
      aria-label={`Tarefa: ${task.title}. Clique para ver detalhes.`}
    >
      <CardHeader>
        <Flex justify="space-between" align="center">
          <Heading size="md" aria-label={`Título: ${task.title}`}>
            {task.title}
          </Heading>
          <TaskStatusBadge status={task.status} />
        </Flex>
      </CardHeader>
      <CardBody>
        <Box mb={4}>
          <TaskPriorityBadge priority={task.priority} />
        </Box>
        <Flex direction="column" gap={2}>
          <Flex align="center" gap={2}>
            <Icon as={FiCalendar} aria-hidden="true" />
            <Text aria-label={`Data de vencimento: ${new Date(task.dueDate).toLocaleDateString()}`}>
              {new Date(task.dueDate).toLocaleDateString()}
            </Text>
          </Flex>
          {task.estimatedCost && (
            <Flex align="center" gap={2}>
              <Icon as={FiDollarSign} aria-hidden="true" />
              <Text aria-label={`Custo estimado: R$ ${task.estimatedCost.toFixed(2)}`}>
                R$ {task.estimatedCost.toFixed(2)}
              </Text>
            </Flex>
          )}
          {task.estimatedTime && (
            <Flex align="center" gap={2}>
              <Icon as={FiClock} aria-hidden="true" />
              <Text aria-label={`Tempo estimado: ${task.estimatedTime} horas`}>
                {task.estimatedTime} horas
              </Text>
            </Flex>
          )}
        </Flex>
      </CardBody>
    </Card>
  );
}; 