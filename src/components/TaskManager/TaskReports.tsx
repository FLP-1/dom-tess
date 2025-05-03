import { FormControl, FormLabel, Button } from '@chakra-ui/react';
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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useColorModeValue
} from '@chakra-ui/react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ITask, ETaskStatus, ETaskPriority } from '../../types/task';
import { useAuth } from '../../contexts/AuthContext';
import { FiDownload } from 'react-icons/fi';
import * as XLSX from 'xlsx';
import { SelectCustom } from '../common/SelectCustom';
import { TaskStatusBadge } from './TaskStatusBadge';
import { TaskPriorityBadge } from './TaskPriorityBadge';

interface TaskReportsProps {
  startDate: Date;
  endDate: Date;
}

export const TaskReports: React.FC<TaskReportsProps> = ({ startDate, endDate }) => {
  const { user } = useAuth();
  const toast = useToast();
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [completedTasks, setCompletedTasks] = useState<ITask[]>([]);
  const [urgentTasks, setUrgentTasks] = useState<ITask[]>([]);
  const bgColor = useColorModeValue('white', 'gray.700');

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
        q = query(q, where('status', '==', ETaskStatus.COMPLETED));
      } else if (filter === 'pending') {
        q = query(q, where('status', 'in', [ETaskStatus.PENDING, ETaskStatus.IN_PROGRESS]));
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
      setCompletedTasks(tasksData.filter(task => task.status === ETaskStatus.COMPLETED));
      setUrgentTasks(tasksData.filter(task => task.priority === ETaskPriority.URGENT));
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
  }, [startDate, endDate, filter, fetchTasks]);

  const getStatusCount = (status: ETaskStatus) => {
    return tasks.filter(task => task.status === status).length;
  };

  const getPriorityCount = (priority: ETaskPriority) => {
    return tasks.filter(task => task.priority === priority).length;
  };

  const getCompletionRate = () => {
    if (tasks.length === 0) return 0;
    return Math.round((getStatusCount(ETaskStatus.COMPLETED) / tasks.length) * 100);
  };

  const getAverageTimeToComplete = () => {
    if (completedTasks.length === 0) return 0;
    const totalTime = completedTasks.reduce((acc, task) => {
      const completionTime = task.updatedAt.getTime() - task.createdAt.getTime();
      return acc + completionTime;
    }, 0);
    return Math.round(totalTime / completedTasks.length / (1000 * 60 * 60 * 24)); // Convert to days
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
    <Box p={4} bg={bgColor} borderRadius="lg" shadow="md">
      <VStack spacing={6} align="stretch">
        <Heading size="lg">Relatório de Tarefas</Heading>

        <HStack spacing={8} justify="space-between">
          <Stat>
            <StatLabel>Total de Tarefas</StatLabel>
            <StatNumber>{tasks.length}</StatNumber>
          </Stat>

          <Stat>
            <StatLabel>Tarefas Concluídas</StatLabel>
            <StatNumber>{getStatusCount(ETaskStatus.COMPLETED)}</StatNumber>
            <StatHelpText>
              {tasks.length > 0
                ? `${getCompletionRate()}% de conclusão`
                : 'Nenhuma tarefa'}
            </StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>Tempo Médio de Conclusão</StatLabel>
            <StatNumber>{getAverageTimeToComplete()} dias</StatNumber>
          </Stat>

          <Stat>
            <StatLabel>Tarefas Urgentes</StatLabel>
            <StatNumber>{getPriorityCount(ETaskPriority.URGENT)}</StatNumber>
            <StatHelpText>
              {urgentTasks.length > 0
                ? `${Math.round((urgentTasks.length / tasks.length) * 100)}% do total`
                : 'Nenhuma tarefa urgente'}
            </StatHelpText>
          </Stat>
        </HStack>

        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Título</Th>
                <Th>Status</Th>
                <Th>Prioridade</Th>
                <Th>Data de Criação</Th>
                <Th>Data de Conclusão</Th>
                <Th>Tempo Estimado (h)</Th>
                <Th>Custo Estimado (R$)</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tasks.map(task => (
                <Tr key={task.id}>
                  <Td>{task.title}</Td>
                  <Td>
                    <TaskStatusBadge status={task.status} />
                  </Td>
                  <Td>
                    <TaskPriorityBadge priority={task.priority} />
                  </Td>
                  <Td>{task.createdAt.toLocaleDateString()}</Td>
                  <Td>
                    {task.status === ETaskStatus.COMPLETED
                      ? task.updatedAt.toLocaleDateString()
                      : '-'}
                  </Td>
                  <Td>{task.estimatedTime || '-'}</Td>
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
