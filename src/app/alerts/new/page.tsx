'use client';

import { Container, Heading, useToast } from '@chakra-ui/react';
import { AlertForm } from '@/components/alerts/AlertForm';
import { useRouter } from 'next/navigation';
import { createAlert } from '@/services/alertsService';
import { sendPushNotification, sendSMS } from '@/services/notificationService';

export default function NewAlertPage() {
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async (data: { title: string; description: string; sendPush: boolean; sendSMS: boolean }) => {
    try {
      await createAlert(data);
      if (data.sendPush) {
        await sendPushNotification({ title: data.title, description: data.description });
      }
      if (data.sendSMS) {
        await sendSMS({ title: data.title, description: data.description });
      }
      toast({
        title: 'Alerta criado com sucesso!',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
      router.push('/alerts');
    } catch (e) {
      toast({
        title: 'Erro ao criar alerta',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
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