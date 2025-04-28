'use client';

import { Box, Container, Heading, SimpleGrid, Button, Text } from '@chakra-ui/react';
import { FiUsers, FiUser, FiBell } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { DoubleBorderCard } from '@/components/DoubleBorderCard';

export default function CommunicationPage() {
  const router = useRouter();
  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h1" size="xl" mb={8}>
        Comunicação
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
        <DoubleBorderCard>
          <Box textAlign="center">
            <FiUsers size={40} style={{ margin: '0 auto', color: '#2B6CB0' }} />
            <Heading as="h2" size="md" mt={4} mb={2}>
              Chat em Grupo
            </Heading>
            <Text mb={4} color="gray.600">
              Converse com todos do grupo, compartilhe arquivos e receba notificações.
            </Text>
            <Button colorScheme="blue" onClick={() => router.push('/communication/group')}>Acessar</Button>
          </Box>
        </DoubleBorderCard>
        <DoubleBorderCard>
          <Box textAlign="center">
            <FiUser size={40} style={{ margin: '0 auto', color: '#2B6CB0' }} />
            <Heading as="h2" size="md" mt={4} mb={2}>
              Chat Individual
            </Heading>
            <Text mb={4} color="gray.600">
              Converse de forma privada com qualquer usuário do sistema.
            </Text>
            <Button colorScheme="blue" onClick={() => router.push('/communication/private')}>Acessar</Button>
          </Box>
        </DoubleBorderCard>
        <DoubleBorderCard>
          <Box textAlign="center">
            <FiBell size={40} style={{ margin: '0 auto', color: '#2B6CB0' }} />
            <Heading as="h2" size="md" mt={4} mb={2}>
              Alertas
            </Heading>
            <Text mb={4} color="gray.600">
              Gerencie e visualize alertas importantes, aniversários e comunicados.
            </Text>
            <Button colorScheme="blue" onClick={() => router.push('/alerts')}>Acessar</Button>
          </Box>
        </DoubleBorderCard>
      </SimpleGrid>
    </Container>
  );
} 