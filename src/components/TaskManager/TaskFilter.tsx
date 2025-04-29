import React from 'react';
import { Input, Select, Space } from 'antd';
import { TaskStatus, TaskPriority } from '../../types/task';
import styles from './TaskFilter.module.css';

const { Search } = Input;
const { Option } = Select;

interface TaskFilterProps {
  onFilterChange: (filters: any) => void;
}

export const TaskFilter: React.FC<TaskFilterProps> = ({ onFilterChange }) => {
  const handleSearch = (value: string) => {
    onFilterChange({ search: value });
  };

  const handleStatusChange = (value: TaskStatus[]) => {
    onFilterChange({ status: value });
  };

  const handlePriorityChange = (value: TaskPriority[]) => {
    onFilterChange({ priority: value });
  };

  return (
    <div className={styles.filterContainer}>
      <Space size="middle">
        <Search
          placeholder="Buscar tarefas..."
          onSearch={handleSearch}
          style={{ width: 200 }}
        />

        <Select
          mode="multiple"
          placeholder="Status"
          style={{ width: 200 }}
          onChange={handleStatusChange}
        >
          <Option value={TaskStatus.NOT_STARTED}>Não Iniciado</Option>
          <Option value={TaskStatus.PENDING}>Pendente</Option>
          <Option value={TaskStatus.IN_PROGRESS}>Em Andamento</Option>
          <Option value={TaskStatus.COMPLETED}>Concluído</Option>
          <Option value={TaskStatus.CANCELLED}>Cancelado</Option>
        </Select>

        <Select
          mode="multiple"
          placeholder="Prioridade"
          style={{ width: 200 }}
          onChange={handlePriorityChange}
        >
          <Option value={TaskPriority.HIGH}>Alta</Option>
          <Option value={TaskPriority.MEDIUM}>Média</Option>
          <Option value={TaskPriority.LOW}>Baixa</Option>
        </Select>
      </Space>
    </div>
  );
}; 