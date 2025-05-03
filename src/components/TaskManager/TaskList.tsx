'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  SimpleGrid,
  useDisclosure,
  Button,
  Input,
  Select,
  HStack,
  VStack,
  Text,
  IconButton,
  useToast,
  InputGroup,
  InputLeftElement,
  FormControl,
  FormLabel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue
} from '@chakra-ui/react';
import { collection, query, where, orderBy, getDocs, Timestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ITask, ETaskPriority } from '../../types/task';
import { EStatus } from '../../types/common';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { FiPlus, FiSearch, FiFilter, FiMoreVertical } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { DragDropContext, Droppable, Draggable, DroppableProvided, DraggableProvided } from '@hello-pangea/dnd';
import { SelectCustom } from '../common/SelectCustom';
import { TaskStatusBadge } from './TaskStatusBadge';
import { TaskPriorityBadge } from './TaskPriorityBadge';

interface TaskListProps {
  tasks: ITask[];
  onEdit: (task: ITask) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: EStatus) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks: initialTasks,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  const { user } = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<ITask[]>(initialTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<ETaskPriority | 'ALL'>('ALL');
  const [selectedTask, setSelectedTask] = useState<ITask | undefined>();
  const [sortBy, setSortBy] = useState('dueDate');
  const bgColor = useColorModeValue('white', 'gray.700');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'tasks'),
        where('assignedTo', 'array-contains', user?.uid),
        orderBy('dueDate', 'asc')
      );

      const querySnapshot = await getDocs(q);
      const tasksData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dueDate: doc.data().dueDate.toDate(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      })) as ITask[];

      setTasks(tasksData);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
      toast({
        title: 'Erro ao buscar tarefas',
        description: 'Ocorreu um erro ao carregar as tarefas. Tente novamente.',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleEditTask = (task: ITask) => {
    setSelectedTask(task);
    onOpen();
  };

  const handleCreateTask = () => {
    setSelectedTask(undefined);
    onOpen();
  };

  const handleTaskUpdated = () => {
    fetchTasks();
    onClose();
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    const newStatus = destination.droppableId as EStatus;
    const oldStatus = source.droppableId as EStatus;

    if (newStatus === oldStatus) return;

    try {
      await updateTaskStatus(draggableId, newStatus);
      // ... existing code ...
    } catch (error) {
      // ... existing code ...
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: EStatus) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        status: newStatus,
        updatedAt: Timestamp.now(),
      });
      fetchTasks();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: 'Erro ao atualizar status',
        description: 'Ocorreu um erro ao atualizar o status da tarefa.',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const getTasksByStatus = (tasks: ITask[], status: EStatus) => {
    return tasks.filter(task => task.status === status);
  };

  const columns = [
    { id: EStatus.NOT_STARTED, title: 'Não Iniciadas' },
    { id: EStatus.IN_PROGRESS, title: 'Em Andamento' },
    { id: EStatus.COMPLETED, title: 'Concluídas' }
  ];

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">Minhas Tarefas</Heading>
          <Button
            leftIcon={<FiPlus />}
            colorScheme="blue"
            onClick={handleCreateTask}
          >
            Nova Tarefa
          </Button>
        </HStack>

        <HStack spacing={4}>
          <InputGroup>
            <InputLeftElement pointerEvents='none'>
              <FiSearch />
            </InputLeftElement>
            <Input
              placeholder="Buscar tarefas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          <Box width="200px">
            <FormControl isRequired>
              <FormLabel htmlFor="priority-filter" id="priority-filter-label">Filtrar por prioridade</FormLabel>
              <SelectCustom
                id="priority-filter"
                name="priority-filter"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as ETaskPriority | 'ALL')}
                options={[
                  { value: 'ALL', label: 'Todas as prioridades' },
                  { value: ETaskPriority.LOW, label: 'Baixa' },
                  { value: ETaskPriority.MEDIUM, label: 'Média' },
                  { value: ETaskPriority.HIGH, label: 'Alta' },
                  { value: ETaskPriority.URGENT, label: 'Urgente' }
                ]}
                placeholder="Selecione uma prioridade"
                aria-label="Filtrar por prioridade"
                aria-labelledby="priority-filter-label"
                title="Filtrar por prioridade"
              />
            </FormControl>
          </Box>
        </HStack>

        <DragDropContext onDragEnd={handleDragEnd}>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={4}>
            {columns.map((column) => (
              <Box key={column.id} p={2} bg={bgColor} borderRadius="md">
                <Heading size="sm" mb={4}>{column.title}</Heading>
                <Droppable droppableId={column.id}>
                  {(provided: DroppableProvided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      minH="200px"
                    >
                      {getTasksByStatus(tasks, column.id).map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided: DraggableProvided) => (
                            <Box
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              mb={2}
                            >
                              <TaskCard
                                task={task}
                                onClick={() => handleEditTask(task)}
                              />
                            </Box>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </Box>
            ))}
          </SimpleGrid>
        </DragDropContext>
      </VStack>

      <TaskForm
        isOpen={isOpen}
        onClose={onClose}
        task={selectedTask}
        onUpdate={handleTaskUpdated}
      />
    </Box>
  );
}; 