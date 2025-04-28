'use client';

import { Box, Container, Heading, VStack } from '@chakra-ui/react';
import { GroupChat } from '@/components/communication/GroupChat';

export default function GroupChatPage() {
  return (
    <Container maxW="container.md" py={8}>
      <Heading as="h1" size="lg" mb={6}>
        Chat em Grupo
      </Heading>
      <Box>
        <GroupChat />
      </Box>
    </Container>
  );
} 