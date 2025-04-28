'use client';

import { Box, Container, Heading, Button, VStack, useToast, useDisclosure, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Input } from '@chakra-ui/react';
import { AlertCard } from '@/components/alerts/AlertCard';
import { useRouter } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';
import { listenAlerts, deleteAlert } from '@/services/alertsService';

export default function AlertsPage() {
  const router = useRouter();
  const toast = useToast();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [alertToDelete, setAlertToDelete] = useState<any>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsubscribe = listenAlerts(setAlerts);
    return () => unsubscribe();
  }, []);

  const filteredAlerts = alerts.filter(alert =>
    alert.title.toLowerCase().includes(search.toLowerCase()) ||
    alert.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (alert: any) => {
    setAlertToDelete(alert);
    onOpen();
  };

  const confirmDelete = async () => {
    await deleteAlert(alertToDelete.id);
    toast({ title: 'Alerta excluído!', status: 'success' });
    setAlertToDelete(null);
    onClose();
  };

  const handleEdit = (alert: any) => {
    router.push(`/alerts/edit/${alert.id}`);
  };

  return (
    <Container maxW="container.md" py={8}>
      <Heading as="h1" size="lg" mb={6}>
        Alertas
      </Heading>
      <Input
        placeholder="Buscar alerta..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        mb={4}
      />
      <Button colorScheme="blue" mb={6} onClick={() => router.push('/alerts/new')}>
        Criar Alerta
      </Button>
      <VStack spacing={4} align="stretch">
        {filteredAlerts.map(alert => (
          <AlertCard
            key={alert.id}
            title={alert.title}
            description={alert.description}
            unread={alert.unread}
            onEdit={() => handleEdit(alert)}
            onDelete={() => handleDelete(alert)}
          />
        ))}
      </VStack>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Excluir Alerta</AlertDialogHeader>
          <AlertDialogBody>Tem certeza que deseja excluir este alerta?</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>Cancelar</Button>
            <Button colorScheme="red" onClick={confirmDelete} ml={3}>Excluir</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Container>
  );
} 