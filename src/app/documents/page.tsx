'use client';

import { Box, Container, Heading, VStack, Button } from '@chakra-ui/react';
import { DocumentUploadForm } from '@/components/documents/DocumentUploadForm';
import { DocumentList } from '@/components/documents/DocumentList';
import { useRouter } from 'next/navigation';

export default function DocumentsPage() {
  const router = useRouter();
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Button mb={4} variant="outline" onClick={() => router.back()}>
            Voltar
          </Button>
          <Heading as="h1" size="xl" mb={4}>
            Controle de Documentos
          </Heading>
          <DocumentUploadForm />
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Documentos Cadastrados
          </Heading>
          <DocumentList />
        </Box>
      </VStack>
    </Container>
  );
} 