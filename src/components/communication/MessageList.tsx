'use client';

import { VStack, Box, Text, Avatar, HStack } from '@chakra-ui/react';

interface MessageListProps {
  chatType: 'group' | 'private';
}

// Mock de mensagens para layout
const mockMessages = [
  { id: 1, user: 'Maria', text: 'Olá a todos!', time: '09:00', avatar: '', isMe: false },
  { id: 2, user: 'Você', text: 'Bom dia!', time: '09:01', avatar: '', isMe: true },
  { id: 3, user: 'João', text: 'Tudo certo?', time: '09:02', avatar: '', isMe: false },
];

export function MessageList({ chatType }: MessageListProps) {
  return (
    <VStack spacing={3} align="stretch">
      {mockMessages.map(msg => (
        <HStack key={msg.id} alignSelf={msg.isMe ? 'flex-end' : 'flex-start'}>
          {!msg.isMe && <Avatar size="sm" name={msg.user} src={msg.avatar} />}
          <Box
            bg={msg.isMe ? 'blue.100' : 'gray.100'}
            borderRadius="md"
            px={3}
            py={2}
            maxW="70%"
            alignSelf={msg.isMe ? 'flex-end' : 'flex-start'}
          >
            <Text fontWeight="bold" fontSize="sm" color="blue.700">{msg.user}</Text>
            <Text>{msg.text}</Text>
            <Text fontSize="xs" color="gray.500" textAlign="right">{msg.time}</Text>
          </Box>
        </HStack>
      ))}
    </VStack>
  );
} 