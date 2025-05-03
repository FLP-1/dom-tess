import { Button } from '@chakra-ui/react';
'use client';

import { Box, Container, Heading, VStack, Button, useDisclosure } from '@chakra-ui/react';
import { TaskForm } from '@/components/TaskManager/TaskForm';
import { TaskList } from '@/components/TaskManager/TaskList';
import { useRouter } from 'next/navigation';

export default function TasksPage() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Button mb={4} variant="outline" onClick={() => router.back()}>
            Voltar
          </Button>
          <Heading as="h1" size="xl" mb={4}>
            Gerenciamento de Tarefas
          </Heading>
          <Button colorScheme="blue" onClick={onOpen} mb={4}>
            Nova Tarefa
          </Button>
        </Box>

        <Box>
          <TaskList />
        </Box>
      </VStack>

      <TaskForm isOpen={isOpen} onClose={onClose} />
    </Container>
  );
} 