import { Button } from '@chakra-ui/react';
'use client';

import { Box, Button, Container, Text, Heading } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { DoubleBorderCard } from '@/components/DoubleBorderCard';

export default function Home() {
  const router = useRouter();
  return (
    <Container maxW="container.xl" py={10} display="flex" flexDir="column" alignItems="center" justifyContent="center" minH="100vh">
      <DoubleBorderCard>
        <Text fontSize="2xl" color="brand.blue" mb={8}>
          Bem-vindo ao DOM
        </Text>
        <Button colorScheme="blue" size="lg" mb={8} onClick={() => router.push('/login')} w="100%">
          Entrar
        </Button>
      </DoubleBorderCard>
    </Container>
  );
}

function Feature({ title, description, icon }: { title: string; description: string; icon: string }) {
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
      <Text fontSize="3xl" mb={4}>{icon}</Text>
      <Heading as="h4" size="md" color="brand.blue" mb={2}>
        {title}
      </Heading>
      <Text color="gray.600">{description}</Text>
    </Box>
  );
}
