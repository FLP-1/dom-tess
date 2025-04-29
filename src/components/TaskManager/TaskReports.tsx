import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Select,
  VStack,
  HStack,
  Text,
  useToast,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Task, TaskStatus, TaskPriority } from '../../types/task';
import { useAuth } from '../../contexts/AuthContext';
import { FiDownload } from 'react-icons/fi';
import * as XLSX from 'xlsx';

interface TaskReportsProps {
  startDate: Date;
  endDate: Date;
}

export const TaskReports: React.FC<TaskReportsProps> = ({ startDate, endDate }) => {
  const { user } = useAuth();
  const toast = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  useEffect(() => {
    fetchTasks();
  }, [startDate, endDate, filter]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      let q = query(
        collection(db, 'tasks'),
        where('assignedTo', 'array-contains', user?.uid),
        where('createdAt', '>=', Timestamp.fromDate(startDate)),
        where('createdAt', '<=', Timestamp.fromDate(endDate))
      );

      if (filter === 'completed') {
        q = query(q, where('status', '==', TaskStatus.COMPLETED));
      } else if (filter === 'pending') {
        q = query(q, where('status', 'in', [TaskStatus.PENDING, TaskStatus.IN_PROGRESS]));
      }

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

  const getStatusCount = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status).length;
  };

  const getPriorityCount = (priority: TaskPriority) => {
    return tasks.filter(task => task.priority === priority).length;
  };

  const calculateAverageCompletionTime = () => {
    const completedTasks = tasks.filter(task => task.status === TaskStatus.COMPLETED);
    if (completedTasks.length === 0) return 0;

    const totalTime = completedTasks.reduce((acc, task) => {
      const completionTime = task.updatedAt.getTime() - task.createdAt.getTime();
      return acc + completionTime;
    }, 0);

    return Math.round(totalTime / completedTasks.length / (1000 * 60 * 60)); // em horas
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      tasks.map(task => ({
        Título: task.title,
        Status: task.status,
        Prioridade: task.priority,
        'Data de Vencimento': task.dueDate.toLocaleDateString(),
        'Tempo Estimado': task.estimatedTime,
        'Custo Estimado': task.estimatedCost,
        'Data de Criação': task.createdAt.toLocaleDateString(),
        'Data de Atualização': task.updatedAt.toLocaleDateString(),
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tarefas');
    XLSX.writeFile(workbook, 'relatorio_tarefas.xlsx');
  };

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">Relatórios de Tarefas</Heading>
          <Button
            leftIcon={<FiDownload />}
            colorScheme="blue"
            onClick={exportToExcel}
          >
            Exportar para Excel
          </Button>
        </HStack>

        <FormControl maxW="200px">
          <FormLabel id="label-filtro-tarefas" htmlFor="filtro-tarefas">Filtrar tarefas</FormLabel>
          <Select
            id="filtro-tarefas"
            title="Filtrar tarefas"
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'completed' | 'pending')}
            width="200px"
          >
            <option value="all">Todas as Tarefas</option>
            <option value="completed">Tarefas Concluídas</option>
            <option value="pending">Tarefas Pendentes</option>
          </Select>
        </FormControl>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
          <Stat>
            <StatLabel>Total de Tarefas</StatLabel>
            <StatNumber>{tasks.length}</StatNumber>
          </Stat>

          <Stat>
            <StatLabel>Tarefas Concluídas</StatLabel>
            <StatNumber>{getStatusCount(TaskStatus.COMPLETED)}</StatNumber>
            <StatHelpText>
              {tasks.length > 0
                ? `${Math.round((getStatusCount(TaskStatus.COMPLETED) / tasks.length) * 100)}% de conclusão`
                : '0% de conclusão'}
            </StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>Tempo Médio de Conclusão</StatLabel>
            <StatNumber>{calculateAverageCompletionTime()}h</StatNumber>
            <StatHelpText>Média de tempo para conclusão</StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>Tarefas Urgentes</StatLabel>
            <StatNumber>{getPriorityCount(TaskPriority.URGENT)}</StatNumber>
            <StatHelpText>Prioridade máxima</StatHelpText>
          </Stat>
        </SimpleGrid>

        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Título</Th>
                <Th>Status</Th>
                <Th>Prioridade</Th>
                <Th>Data de Vencimento</Th>
                <Th>Tempo Estimado</Th>
                <Th>Custo Estimado</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tasks.map((task) => (
                <Tr key={task.id}>
                  <Td>{task.title}</Td>
                  <Td>
                    <Badge
                      colorScheme={
                        task.status === TaskStatus.COMPLETED
                          ? 'green'
                          : task.status === TaskStatus.IN_PROGRESS
                          ? 'blue'
                          : task.status === TaskStatus.CANCELLED
                          ? 'red'
                          : 'yellow'
                      }
                    >
                      {task.status}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={
                        task.priority === TaskPriority.URGENT
                          ? 'red'
                          : task.priority === TaskPriority.HIGH
                          ? 'orange'
                          : task.priority === TaskPriority.MEDIUM
                          ? 'yellow'
                          : 'green'
                      }
                    >
                      {task.priority}
                    </Badge>
                  </Td>
                  <Td>{task.dueDate.toLocaleDateString()}</Td>
                  <Td>{task.estimatedTime || '-'}h</Td>
                  <Td>
                    {task.estimatedCost
                      ? `R$ ${task.estimatedCost.toFixed(2)}`
                      : '-'}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </Box>
  );
}; 