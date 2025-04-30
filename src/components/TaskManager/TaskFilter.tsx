import React from 'react';
import { Box, HStack, Input, InputGroup, InputLeftElement, Select } from '@chakra-ui/react';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { SelectField } from '@/components/SelectField';
import { TaskStatus, TaskPriority } from '../../types/task';
import styles from './TaskFilter.module.css';

const { Search } = Input;
const { Option } = Select;

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
  { value: 'pending', label: 'Pendente' },
  { value: 'in_progress', label: 'Em Andamento' },
  { value: 'completed', label: 'Concluído' }
];

const priorityOptions = [
  { value: 'all', label: 'Todas as Prioridades' },
  { value: 'high', label: 'Alta' },
  { value: 'medium', label: 'Média' },
  { value: 'low', label: 'Baixa' }
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

        <SelectField
          label="Status"
          options={statusOptions}
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          formControlProps={{ width: "auto" }}
        />

        <SelectField
          label="Prioridade"
          options={priorityOptions}
          value={priorityFilter}
          onChange={(e) => onPriorityFilterChange(e.target.value)}
          formControlProps={{ width: "auto" }}
        />
      </HStack>
    </Box>
  );
} 