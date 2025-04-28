'use client';

import { HStack, Input, IconButton, Box } from '@chakra-ui/react';
import { FiSend, FiPaperclip } from 'react-icons/fi';
import { useRef } from 'react';

interface MessageInputProps {
  chatType: 'group' | 'private';
}

export function MessageInput({ chatType }: MessageInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <HStack spacing={2}>
      <IconButton
        aria-label="Anexar arquivo"
        icon={<FiPaperclip />}
        onClick={() => fileInputRef.current?.click()}
        variant="ghost"
      />
      <Input placeholder="Digite sua mensagem..." />
      <IconButton aria-label="Enviar" icon={<FiSend />} colorScheme="blue" />
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        multiple
        accept="image/*,video/*,application/pdf"
      />
    </HStack>
  );
} 