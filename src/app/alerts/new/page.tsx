'use client';

import { Container, Heading } from '@chakra-ui/react';
import { AlertForm } from '@/components/alerts/AlertForm';
import { useRouter } from 'next/navigation';
import { createAlert } from '@/services/alertsService';
import { useAppNotifications } from '@/hooks/useAppNotifications';

export default function NewAlertPage() {
  const router = useRouter();
  const notifications = useAppNotifications();

  const handleSubmit = async (data: { title: string; description: string; sendPush: boolean; sendSMS: boolean }) => {
    try {
      await createAlert(data);
      
      notifications.showSuccess('Alerta criado com sucesso!', undefined, {
        persistent: true,
        pushNotification: data.sendPush,
        sms: data.sendSMS
      });
      
      router.push('/alerts');
    } catch (e) {
      notifications.showError(
        'Erro ao criar alerta',
        'Não foi possível criar o alerta. Tente novamente mais tarde.',
        { persistent: true }
      );
    }
  };

  return (
    <Container maxW="container.sm" py={8}>
      <Heading as="h1" size="lg" mb={6}>
        Novo Alerta
      </Heading>
      <AlertForm onSubmit={handleSubmit} />
    </Container>
  );
} 