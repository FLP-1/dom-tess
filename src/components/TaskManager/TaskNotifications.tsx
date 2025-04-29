import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Icon,
  useToast,
  Badge,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from '@chakra-ui/react';
import { FiBell, FiCheck, FiX } from 'react-icons/fi';
import { collection, query, where, onSnapshot, Timestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Task, TaskStatus } from '../../types/task';
import { useAuth } from '../../contexts/AuthContext';

export const TaskNotifications: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [notifications, setNotifications] = useState<Task[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'tasks'),
      where('assignedTo', 'array-contains', user.uid),
      where('status', 'in', [TaskStatus.PENDING, TaskStatus.IN_PROGRESS])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasks: Task[] = [];
      let unread = 0;

      snapshot.forEach((doc) => {
        const task = {
          id: doc.id,
          ...doc.data(),
          dueDate: doc.data().dueDate.toDate(),
        } as Task;

        // Verificar se a tarefa está próxima do vencimento
        const now = new Date();
        const dueDate = new Date(task.dueDate);
        const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);

        if (hoursUntilDue <= 24 && hoursUntilDue > 0) {
          tasks.push(task);
          unread++;
        }
      });

      setNotifications(tasks);
      setUnreadCount(unread);

      // Mostrar notificação para novas tarefas próximas do vencimento
      if (unread > 0) {
        toast({
          title: 'Tarefas próximas do vencimento',
          description: `Você tem ${unread} tarefa(s) que vencem em breve.`,
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
      }
    });

    return () => unsubscribe();
  }, [user, toast]);

  const handleMarkAsRead = async (taskId: string) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        lastNotified: Timestamp.now(),
      });
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  const handleDismiss = async (taskId: string) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        lastNotified: Timestamp.now(),
        notificationDismissed: true,
      });
      setNotifications(prev => prev.filter(task => task.id !== taskId));
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error('Erro ao descartar notificação:', error);
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
        {notifications.length === 0 ? (
          <MenuItem>
            <Text>Nenhuma notificação</Text>
          </MenuItem>
        ) : (
          notifications.map((task) => (
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