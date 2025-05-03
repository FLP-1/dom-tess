import React from 'react';
import { Box, HStack, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';
import { SelectCustom } from '../common/SelectCustom';
import { ETaskStatus, ETaskPriority } from '../../types/task';
import styles from './TaskFilter.module.css';

interface TaskFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  priorityFilter: string;
  onPriorityFilterChange: (value: string) => void;
}

const statusOptions = [
  { value: 'all', label: 'Todos os Status' },
  { value: ETaskStatus.PENDING, label: 'Pendente' },
  { value: ETaskStatus.IN_PROGRESS, label: 'Em Andamento' },
  { value: ETaskStatus.COMPLETED, label: 'Concluído' }
];

const priorityOptions = [
  { value: 'all', label: 'Todas as Prioridades' },
  { value: ETaskPriority.HIGH, label: 'Alta' },
  { value: ETaskPriority.MEDIUM, label: 'Média' },
  { value: ETaskPriority.LOW, label: 'Baixa' }
];

export function TaskFilter({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange
}: TaskFilterProps) {
  return (
    <Box mb={4}>
      <HStack spacing={4}>
        <InputGroup maxW="300px">
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Buscar tarefas..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </InputGroup>

        <SelectCustom
          label="Status"
          options={statusOptions}
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          width="auto"
        />

        <SelectCustom
          label="Prioridade"
          options={priorityOptions}
          value={priorityFilter}
          onChange={(e) => onPriorityFilterChange(e.target.value)}
          width="auto"
        />
      </HStack>
    </Box>
  );
} 