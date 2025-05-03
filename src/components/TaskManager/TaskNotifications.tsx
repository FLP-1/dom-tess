'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Icon,
  Badge,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useColorModeValue
} from '@chakra-ui/react';
import { FiBell, FiCheck, FiX } from 'react-icons/fi';
import { collection, query, where, onSnapshot, Timestamp, updateDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { ITask, ETaskStatus } from '../../types/task';
import { useAuth } from '../../contexts/AuthContext';
import { useAppNotifications } from '@/hooks/useAppNotifications';
import { TaskStatusBadge } from './TaskStatusBadge';

interface TaskNotificationsProps {
  userId: string;
}

export const TaskNotifications: React.FC<TaskNotificationsProps> = ({ userId }) => {
  const { user } = useAuth();
  const notifications = useAppNotifications();
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const bgColor = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    if (!user) return;

    const fetchTasks = async () => {
      const q = query(
        collection(db, 'tasks'),
        where('assignedTo', '==', userId),
        where('status', 'in', [ETaskStatus.PENDING, ETaskStatus.IN_PROGRESS])
      );

      const querySnapshot = await getDocs(q);
      const tasks: ITask[] = [];

      querySnapshot.forEach(doc => {
        const data = doc.data();
        tasks.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          status: data.status,
          priority: data.priority,
          dueDate: data.dueDate.toDate(),
          assignedTo: data.assignedTo,
          createdBy: data.createdBy,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate()
        } as ITask);
      });

      setTasks(tasks);
    };

    fetchTasks();
  }, [userId]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'tasks'),
      where('assignedTo', 'array-contains', user.uid),
      where('status', 'in', [ETaskStatus.PENDING, ETaskStatus.IN_PROGRESS])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasks: ITask[] = [];
      let unread = 0;

      snapshot.forEach((doc) => {
        const task = {
          id: doc.id,
          ...doc.data(),
          dueDate: doc.data().dueDate.toDate(),
        } as ITask;

        // Verificar se a tarefa está próxima do vencimento
        const now = new Date();
        const dueDate = new Date(task.dueDate);
        const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);

        if (hoursUntilDue <= 24 && hoursUntilDue > 0) {
          tasks.push(task);
          unread++;
        }
      });

      setTasks(tasks);
      setUnreadCount(unread);

      // Mostrar notificação para novas tarefas próximas do vencimento
      if (unread > 0) {
        notifications.showWarning(
          'Tarefas próximas do vencimento',
          `Você tem ${unread} tarefa(s) que vencem em breve.`,
          { 
            persistent: true,
            pushNotification: true 
          }
        );
      }
    });

    return () => unsubscribe();
  }, [user, notifications]);

  const handleMarkAsRead = async (taskId: string) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        lastNotified: Timestamp.now(),
      });
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      notifications.showError(
        'Erro ao marcar notificação como lida',
        'Não foi possível atualizar o status da notificação.',
        { persistent: true }
      );
    }
  };

  const handleDismiss = async (taskId: string) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        lastNotified: Timestamp.now(),
        notificationDismissed: true,
      });
      setTasks(prev => prev.filter(task => task.id !== taskId));
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      notifications.showError(
        'Erro ao descartar notificação',
        'Não foi possível descartar a notificação.',
        { persistent: true }
      );
    }
  };

  return (
    <Menu>
      <MenuButton
        as={Button}
        variant="ghost"
        position="relative"
        aria-label="Notificações"
      >
        <Icon as={FiBell} fontSize="xl" />
        {unreadCount > 0 && (
          <Badge
            colorScheme="red"
            position="absolute"
            top="-1"
            right="-1"
            borderRadius="full"
          >
            {unreadCount}
          </Badge>
        )}
      </MenuButton>
      <MenuList maxH="400px" overflowY="auto">
        {tasks.length === 0 ? (
          <MenuItem>
            <Text>Nenhuma notificação</Text>
          </MenuItem>
        ) : (
          tasks.map((task) => (
            <MenuItem key={task.id}>
              <VStack align="start" spacing={1} width="100%">
                <HStack justify="space-between" width="100%">
                  <Text fontWeight="bold">{task.title}</Text>
                  <HStack>
                    <IconButton
                      aria-label="Marcar como lida"
                      icon={<FiCheck />}
                      size="sm"
                      variant="ghost"
                      onClick={() => handleMarkAsRead(task.id)}
                    />
                    <IconButton
                      aria-label="Descartar"
                      icon={<FiX />}
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDismiss(task.id)}
                    />
                  </HStack>
                </HStack>
                <Text fontSize="sm" color="gray.600">
                  Vence em: {new Date(task.dueDate).toLocaleDateString()}
                </Text>
              </VStack>
            </MenuItem>
          ))
        )}
      </MenuList>
    </Menu>
  );
}; 