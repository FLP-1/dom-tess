'use client';

import { Box, VStack } from '@chakra-ui/react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

export function PrivateChat() {
  return (
    <VStack spacing={4} align="stretch">
      <Box flex={1} minH="300px" maxH="50vh" overflowY="auto" borderWidth="1px" borderRadius="md" p={4} bg="white">
        <MessageList chatType="private" />
      </Box>
      <Box>
        <MessageInput chatType="private" />
      </Box>
    </VStack>
  );
} 