'use client';

import { Box, Container, Heading } from '@chakra-ui/react';
import { PrivateChat } from '@/components/communication/PrivateChat';

export default function PrivateChatPage() {
  return (
    <Container maxW="container.md" py={8}>
      <Heading as="h1" size="lg" mb={6}>
        Chat Individual
      </Heading>
      <Box>
        <PrivateChat />
      </Box>
    </Container>
  );
} 