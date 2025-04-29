import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, VStack, HStack, Button, Spinner, useDisclosure } from '@chakra-ui/react';
import { Task, TaskStatus } from '../../types/task';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { TaskForm } from './TaskForm';
import { TaskStatusBadge } from './TaskStatusBadge';
import { Card } from '../common/Card';
import { useRouter } from 'next/navigation';

export const TodayTasksCard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  useEffect(() => {
    const fetchTodayTasks = async () => {
      try {
        setLoading(true);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const q = query(
          collection(db, 'tasks'),
          where('dueDate', '>=', Timestamp.fromDate(today)),
          where('dueDate', '<', Timestamp.fromDate(tomorrow)),
          where('status', 'in', [TaskStatus.NOT_STARTED, TaskStatus.PENDING, TaskStatus.IN_PROGRESS])
        );

        const querySnapshot = await getDocs(q);
        const tasksData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          dueDate: doc.data().dueDate.toDate(),
        })) as Task[];

        setTasks(tasksData);
      } catch (error) {
        console.error('Erro ao buscar tarefas do dia:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayTasks();
  }, []);

  return (
    <Card variant="hoverable">
      <HStack justify="space-between" mb={4}>
        <Heading size="md">Tarefas de Hoje</Heading>
        <Button size="sm" colorScheme="blue" onClick={onOpen}>
          Nova Tarefa
        </Button>
      </HStack>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minH="100px">
          <Spinner />
        </Box>
      ) : tasks.length === 0 ? (
        <Text color="gray.500" textAlign="center">
          Nenhuma tarefa para hoje
        </Text>
      ) : (
        <VStack align="stretch" spacing={3}>
          {tasks.map((task) => (
            <Box
              key={task.id}
              p={3}
              borderRadius="md"
              borderWidth="1px"
              borderColor="gray.200"
              cursor="pointer"
              onClick={() => router.push(`/dashboard/tasks/${task.id}`)}
              _hover={{ bg: 'gray.50' }}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  router.push(`/dashboard/tasks/${task.id}`);
                }
              }}
            >
              <HStack justify="space-between">
                <Text fontWeight="medium">{task.title}</Text>
                <TaskStatusBadge status={task.status} />
              </HStack>
              {task.description && (
                <Text fontSize="sm" color="gray.600" mt={1} noOfLines={1}>
                  {task.description}
                </Text>
              )}
            </Box>
          ))}
        </VStack>
      )}

      <TaskForm isOpen={isOpen} onClose={onClose} />
    </Card>
  );
}; 