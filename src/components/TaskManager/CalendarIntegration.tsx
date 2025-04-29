import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  useToast,
  Switch,
  FormControl,
  FormLabel,
  Select,
} from '@chakra-ui/react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Task } from '../../types/task';
import { useAuth } from '../../contexts/AuthContext';
import { FiCalendar, FiRefreshCw } from 'react-icons/fi';

export const CalendarIntegration: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [calendarType, setCalendarType] = useState<'google' | 'outlook'>('google');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkCalendarConnection();
  }, []);

  const checkCalendarConnection = async () => {
    // Aqui você implementaria a lógica para verificar se o usuário já está conectado
    // com algum serviço de calendário
    setIsConnected(false);
  };

  const handleConnectCalendar = async () => {
    try {
      // Aqui você implementaria a lógica de autenticação com o serviço de calendário escolhido
      // Por exemplo, usando OAuth para Google Calendar ou Microsoft Graph API para Outlook
      setIsConnected(true);
      toast({
        title: 'Calendário conectado',
        description: 'Seu calendário foi conectado com sucesso.',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Erro ao conectar calendário:', error);
      toast({
        title: 'Erro ao conectar calendário',
        description: 'Ocorreu um erro ao conectar seu calendário. Tente novamente.',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleSyncTasks = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'tasks'),
        where('assignedTo', 'array-contains', user?.uid),
        where('status', 'in', ['PENDING', 'IN_PROGRESS'])
      );

      const querySnapshot = await getDocs(q);
      const tasksData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dueDate: doc.data().dueDate.toDate(),
      })) as Task[];

      setTasks(tasksData);

      // Aqui você implementaria a lógica para sincronizar as tarefas com o calendário
      // Por exemplo, criando eventos no Google Calendar ou Outlook Calendar

      toast({
        title: 'Tarefas sincronizadas',
        description: 'Suas tarefas foram sincronizadas com o calendário.',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Erro ao sincronizar tarefas:', error);
      toast({
        title: 'Erro ao sincronizar tarefas',
        description: 'Ocorreu um erro ao sincronizar suas tarefas com o calendário.',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4} bg="white" borderRadius="md" boxShadow="sm">
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between">
          <Text fontSize="lg" fontWeight="bold">
            Integração com Calendário
          </Text>
          <Switch
            isChecked={isConnected}
            onChange={() => setIsConnected(!isConnected)}
            colorScheme="blue"
          />
        </HStack>

        {isConnected ? (
          <>
            <FormControl>
              <FormLabel>Selecione o Calendário</FormLabel>
              <Select
                value={calendarType}
                onChange={(e) => setCalendarType(e.target.value as 'google' | 'outlook')}
                disabled={!isConnected}
              >
                <option value="google">Google Calendar</option>
                <option value="outlook">Outlook Calendar</option>
              </Select>
            </FormControl>

            <Button
              leftIcon={<FiRefreshCw />}
              colorScheme="blue"
              onClick={handleSyncTasks}
              isLoading={loading}
              disabled={!isConnected}
            >
              Sincronizar Tarefas
            </Button>

            <Text fontSize="sm" color="gray.600">
              {tasks.length} tarefas serão sincronizadas com seu calendário.
            </Text>
          </>
        ) : (
          <Button
            leftIcon={<FiCalendar />}
            colorScheme="blue"
            onClick={handleConnectCalendar}
          >
            Conectar Calendário
          </Button>
        )}
      </VStack>
    </Box>
  );
}; 