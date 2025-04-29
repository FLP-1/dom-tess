'use client';

import { Box, SimpleGrid, Heading, Text, VStack } from '@chakra-ui/react';
import { AlertCard } from '@/components/alerts/AlertCard';
import { useEffect, useState } from 'react';
import { listenAlerts, updateAlert } from '@/services/alertsService';
import { TodayTasksCard } from '@/components/TaskManager/TodayTasksCard';

export default function DashboardPage() {
  const [unreadAlerts, setUnreadAlerts] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = listenAlerts((alerts) => {
      setUnreadAlerts(alerts.filter((a) => a.unread));
    });
    return () => unsubscribe();
  }, []);

  const handleMarkAsRead = async (alert: any) => {
    await updateAlert(alert.id, { ...alert, unread: false });
  };

  return (
    <Box>
      <Heading as="h1" size="xl" mb={4} color="blue.700">
        Bem-vindo ao novo Dashboard!
      </Heading>
      <Text color="gray.600" mb={8}>
        Aqui você pode acessar as principais funcionalidades do sistema.
      </Text>
      {unreadAlerts.length > 0 && (
        <VStack align="stretch" spacing={3} mb={8}>
          <Heading as="h2" size="md" color="orange.600">Alertas não lidos</Heading>
          {unreadAlerts.map(alert => (
            <AlertCard key={alert.id} title={alert.title} description={alert.description} unread onMarkAsRead={() => handleMarkAsRead(alert)} />
          ))}
        </VStack>
      )}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        <TodayTasksCard />
        <Card title="Controle de Ponto" description="Registre e gerencie o ponto." />
        <Card title="Folha de Pagamento" description="Gerencie salários e pagamentos." />
        <Card title="Documentos" description="Acesse seus documentos." />
      </SimpleGrid>
    </Box>
  );
}

function Card({ title, description }: { title: string; description: string }) {
  return (
    <Box
      p={6}
      borderRadius="lg"
      borderWidth="1px"
      borderColor="gray.200"
      bg="white"
      textAlign="center"
      transition="all 0.3s"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: 'lg',
      }}
    >
      <Heading as="h4" size="md" color="brand.blue" mb={2}>
        {title}
      </Heading>
      <Text color="gray.600">{description}</Text>
    </Box>
  );
} 