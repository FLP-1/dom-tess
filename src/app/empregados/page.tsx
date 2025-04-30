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

export default function EmpregadosPage() {
  const [empregados, setEmpregados] = useState<DadosEmpregado[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmpregado, setSelectedEmpregado] = useState<DadosEmpregado | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();
  const router = useRouter();
  const notifications = useAppNotifications();
  const employeeService = new EmployeeService();

  useEffect(() => {
    if (user) {
      loadEmpregados();
    }
  }, [user]);

  const loadEmpregados = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'empregados'),
        where('empregadorId', '==', user.uid),
        where('status', '==', 'completo')
      );
      const querySnapshot = await getDocs(q);
      const empregadosList = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })) as DadosEmpregado[];
      setEmpregados(empregadosList);
    } catch (error) {
      notifications.showError(
        'Erro ao carregar empregados',
        'Não foi possível carregar a lista de empregados',
        { persistent: true }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (empregado: DadosEmpregado) => {
    router.push(`/empregados/editar/${empregado.id}`);
  };

  const handleDelete = (empregado: DadosEmpregado) => {
    setSelectedEmpregado(empregado);
    onOpen();
  };

  const confirmDelete = async () => {
    if (selectedEmpregado?.id) {
      try {
        await employeeService.deleteEmployee(selectedEmpregado.id);
        setEmpregados(prev => prev.filter(e => e.id !== selectedEmpregado.id));
        onClose();
      } catch (error) {
        notifications.showError(
          'Erro ao excluir',
          'Não foi possível excluir o cadastro do empregado',
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
          <Heading size="lg">Empregados</Heading>
          <HStack>
            <Button
              colorScheme="blue"
              onClick={() => router.push('/empregados/novo')}
            >
              Novo Cadastro
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/empregados/rascunhos')}
            >
              Rascunhos
            </Button>
          </HStack>
        </HStack>

        {empregados.length === 0 ? (
          <Text>Nenhum empregado cadastrado.</Text>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Nome</Th>
                <Th>CPF</Th>
                <Th>Função</Th>
                <Th>Status</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {empregados.map((empregado) => (
                <Tr key={empregado.id}>
                  <Td>{empregado.nome}</Td>
                  <Td>{empregado.cpf}</Td>
                  <Td>{empregado.dadosProfissionais?.funcao || '-'}</Td>
                  <Td>
                    <Badge colorScheme="green">Ativo</Badge>
                  </Td>
                  <Td>
                    <Button
                      colorScheme="blue"
                      size="sm"
                      mr={2}
                      onClick={() => handleEdit(empregado)}
                    >
                      Editar
                    </Button>
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() => handleDelete(empregado)}
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
            Tem certeza que deseja excluir este empregado? Esta ação não pode ser desfeita.
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