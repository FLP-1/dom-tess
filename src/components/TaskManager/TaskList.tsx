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
} from '@chakra-ui/react';
import { collection, query, where, orderBy, getDocs, Timestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Task, TaskStatus, TaskPriority } from '../../types/task';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { DragDropContext, Droppable, Draggable, DroppableProvided, DraggableProvided } from '@hello-pangea/dnd';

export const TaskList: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'ALL'>('ALL');
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();

  useEffect(() => {
    fetchTasks();
  }, []);

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
      })) as Task[];

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

  const handleEditTask = (task: Task) => {
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

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const taskId = result.draggableId;
    const newStatus = destination.droppableId as TaskStatus;

    // Atualizar o status da tarefa no banco de dados
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      updateTaskStatus(taskId, newStatus);
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
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

  const getTasksByStatus = (status: TaskStatus) => {
    return filteredTasks.filter(task => task.status === status);
  };

  const statusColumns = [
    { id: TaskStatus.NOT_STARTED, title: 'Não Iniciado' },
    { id: TaskStatus.PENDING, title: 'Pendente' },
    { id: TaskStatus.IN_PROGRESS, title: 'Em Andamento' },
    { id: TaskStatus.COMPLETED, title: 'Concluído' },
    { id: TaskStatus.CANCELLED, title: 'Cancelado' },
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
              <Select
                id="priority-filter"
                name="priority-filter"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | 'ALL')}
                aria-labelledby="priority-filter-label"
                aria-label="Filtrar por prioridade"
                title="Filtrar por prioridade"
              >
                <option value="ALL">Todas as prioridades</option>
                <option value={TaskPriority.LOW}>Baixa</option>
                <option value={TaskPriority.MEDIUM}>Média</option>
                <option value={TaskPriority.HIGH}>Alta</option>
                <option value={TaskPriority.URGENT}>Urgente</option>
              </Select>
            </FormControl>
          </Box>
        </HStack>

        <DragDropContext onDragEnd={handleDragEnd}>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={4}>
            {statusColumns.map((column) => (
              <Box key={column.id} p={2} bg="gray.50" borderRadius="md">
                <Heading size="sm" mb={4}>{column.title}</Heading>
                <Droppable droppableId={column.id}>
                  {(provided: DroppableProvided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      minH="200px"
                    >
                      {getTasksByStatus(column.id).map((task, index) => (
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