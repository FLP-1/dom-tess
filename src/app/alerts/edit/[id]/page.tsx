'use client';

import { Container, Heading, useToast, Spinner } from '@chakra-ui/react';
import { AlertForm } from '@/components/alerts/AlertForm';
import { useRouter, useParams } from 'next/navigation';
import { getAlert, updateAlert } from '@/services/alertsService';
import { useEffect, useState } from 'react';
import { sendPushNotification, sendSMS } from '@/services/notificationService';

export default function EditAlertPage() {
  const router = useRouter();
  const toast = useToast();
  const params = useParams();
  const id = params?.id as string;
  const [alert, setAlert] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getAlert(id).then((a) => {
      setAlert(a);
      setLoading(false);
    });
  }, [id, getAlert, setAlert, setLoading]);

  const handleSubmit = async (data: { title: string; description: string; sendPush: boolean; sendSMS: boolean }) => {
    try {
      await updateAlert(id, data);
      if (data.sendPush) {
        await sendPushNotification({ title: data.title, description: data.description });
      }
      if (data.sendSMS) {
        await sendSMS({ title: data.title, description: data.description });
      }
      toast({
        title: 'Alerta atualizado com sucesso!',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
      router.push('/alerts');
    } catch (e) {
      toast({
        title: 'Erro ao atualizar alerta',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return <Container py={8}><Spinner /></Container>;
  }

  if (!alert) {
    return <Container py={8}><Heading size="md">Alerta não encontrado.</Heading></Container>;
  }

  return (
    <Container maxW="container.sm" py={8}>
      <Heading as="h1" size="lg" mb={6}>
        Editar Alerta
      </Heading>
      <AlertForm initialTitle={alert.title} initialDescription={alert.description} onSubmit={handleSubmit} />
    </Container>
  );
} 