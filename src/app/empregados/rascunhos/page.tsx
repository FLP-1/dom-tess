'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Heading,
  VStack,
  Text,
  HStack,
  Badge,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from '@chakra-ui/react';
import { useAuth } from '@/contexts/AuthContext';
import { EmployeeService } from '@/services/employeeService';
import { DadosEmpregado } from '@/types/esocial';
import { useRouter } from 'next/navigation';
import { useAppNotifications } from '@/hooks/useAppNotifications';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';

export default function RascunhosPage() {
  const [rascunhos, setRascunhos] = useState<DadosEmpregado[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRascunho, setSelectedRascunho] = useState<DadosEmpregado | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();
  const router = useRouter();
  const notifications = useAppNotifications();
  const employeeService = new EmployeeService();

  useEffect(() => {
    if (user) {
      loadRascunhos();
    }
  }, [user]);

  const loadRascunhos = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'empregados'),
        where('empregadorId', '==', user.uid),
        where('status', '==', 'incompleto')
      );
      const querySnapshot = await getDocs(q);
      const rascunhosList = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })) as DadosEmpregado[];
      setRascunhos(rascunhosList);
    } catch (error) {
      notifications.showError(
        'Erro ao carregar rascunhos',
        'Não foi possível carregar a lista de rascunhos',
        { persistent: true }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = (rascunho: DadosEmpregado) => {
    router.push(`/empregados/editar/${rascunho.id}`);
  };

  const handleDelete = (rascunho: DadosEmpregado) => {
    setSelectedRascunho(rascunho);
    onOpen();
  };

  const confirmDelete = async () => {
    if (selectedRascunho?.id) {
      try {
        await employeeService.deleteEmployee(selectedRascunho.id);
        setRascunhos(prev => prev.filter(r => r.id !== selectedRascunho.id));
        onClose();
      } catch (error) {
        notifications.showError(
          'Erro ao excluir',
          'Não foi possível excluir o rascunho',
          { persistent: true }
        );
      }
    }
  };

  if (loading) {
    return (
      <Box p={4}>
        <Text>Carregando...</Text>
      </Box>
    );
  }

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">Rascunhos</Heading>
          <Button
            colorScheme="blue"
            onClick={() => router.push('/empregados/novo')}
          >
            Novo Cadastro
          </Button>
        </HStack>

        {rascunhos.length === 0 ? (
          <Text>Nenhum rascunho encontrado.</Text>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Nome</Th>
                <Th>CPF</Th>
                <Th>Última Atualização</Th>
                <Th>Status</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {rascunhos.map((rascunho) => (
                <Tr key={rascunho.id}>
                  <Td>{rascunho.nome || '-'}</Td>
                  <Td>{rascunho.cpf || '-'}</Td>
                  <Td>{new Date(rascunho.updatedAt).toLocaleDateString()}</Td>
                  <Td>
                    <Badge colorScheme="yellow">Rascunho</Badge>
                  </Td>
                  <Td>
                    <Button
                      colorScheme="blue"
                      size="sm"
                      mr={2}
                      onClick={() => handleContinue(rascunho)}
                    >
                      Continuar
                    </Button>
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() => handleDelete(rascunho)}
                    >
                      Excluir
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar Exclusão</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Tem certeza que deseja excluir este rascunho? Esta ação não pode ser desfeita.
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={confirmDelete}>
              Excluir
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
} 