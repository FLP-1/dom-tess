'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Heading,
  VStack,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useToast
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import { ITask, ETaskPriority } from '../../types/task';
import { EStatus } from '../../types/common';
import { useTask } from '../../contexts/TaskContext';
import { TaskList } from './TaskList';
import { TaskFilter } from './TaskFilter';
import { TaskForm } from './TaskForm';

interface TaskFilters {
  status: EStatus[];
  priority: ETaskPriority[];
  search: string;
}

interface TaskManagerProps {
  onFilterChange?: (filters: TaskFilters) => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({ onFilterChange }) => {
  const { tasks, loading, error, updateTaskStatus, loadTasks } = useTask();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({
    status: [],
    priority: [],
    search: ''
  });
  const toast = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleStatusChange = async (taskId: string, status: EStatus) => {
    try {
      await updateTaskStatus(taskId, status);
      toast({
        title: 'Status atualizado',
        description: 'Status da tarefa atualizado com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar status da tarefa',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  const handleEdit = (task: ITask) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  const handleDelete = async (taskId: string) => {
    try {
      await updateTaskStatus(taskId, EStatus.DELETED);
      toast({
        title: 'Tarefa excluída',
        description: 'Tarefa excluída com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir tarefa',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  const handleFilterChange = (newFilters: TaskFilters) => {
    setFilters(newFilters);
  };

  const filteredTasks = tasks.filter(task => {
    if (filters.status.length && !filters.status.includes(task.status)) return false;
    if (filters.priority.length && !filters.priority.includes(task.priority)) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const handleCreateTask = () => {
    setSelectedTask(null);
    setIsFormOpen(true);
  };

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">Gerenciador de Tarefas</Heading>
          <Button
            leftIcon={<FiPlus />}
            colorScheme="blue"
            onClick={handleCreateTask}
          >
            Nova Tarefa
          </Button>
        </HStack>

        <TaskFilter onFilterChange={handleFilterChange} />

        {loading ? (
          <Box textAlign="center">Carregando...</Box>
        ) : error ? (
          <Box textAlign="center" color="red.500">
            {error}
          </Box>
        ) : (
          <TaskList
            tasks={filteredTasks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        )}

        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody p={6}>
              <TaskForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                task={selectedTask || undefined}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
}; 