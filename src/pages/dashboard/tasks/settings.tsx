import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Divider,
  FormControl,
  FormLabel,
  Switch,
  Select,
  Button,
  useToast,
} from '@chakra-ui/react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { CalendarIntegration } from '../../../components/TaskManager/CalendarIntegration';

const TaskSettingsPage: React.FC = () => {
  const toast = useToast();

  return (
    <DashboardLayout>
      <Box p={6}>
        <VStack spacing={6} align="stretch">
          <Heading size="lg">Configurações de Tarefas</Heading>
          <Divider />
          
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="notifications" mb="0">
              Notificações por e-mail
            </FormLabel>
            <Switch id="notifications" colorScheme="blue" />
          </FormControl>

          <FormControl>
            <FormLabel>Fuso Horário</FormLabel>
            <Select 
              placeholder="Selecione o fuso horário"
              aria-label="Selecione o fuso horário para as tarefas"
            >
              <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
              <option value="America/Manaus">Manaus (GMT-4)</option>
              <option value="America/Rio_Branco">Rio Branco (GMT-5)</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Formato de Data</FormLabel>
            <Select 
              placeholder="Selecione o formato de data"
              aria-label="Selecione o formato de exibição das datas"
            >
              <option value="dd/MM/yyyy">DD/MM/AAAA</option>
              <option value="MM/dd/yyyy">MM/DD/AAAA</option>
              <option value="yyyy-MM-dd">AAAA-MM-DD</option>
            </Select>
          </FormControl>

          <CalendarIntegration />

          <Button colorScheme="blue" size="lg">
            Salvar Configurações
          </Button>
        </VStack>
      </Box>
    </DashboardLayout>
  );
};

export default TaskSettingsPage; 