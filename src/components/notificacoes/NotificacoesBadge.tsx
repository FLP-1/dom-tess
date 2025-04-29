'use client';

import { Box, Badge, Icon, useDisclosure } from '@chakra-ui/react';
import { FaBell } from 'react-icons/fa';
import { useNotificacoes } from '@/hooks/useNotificacoes';
import { NotificacoesLista } from './NotificacoesLista';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
} from '@chakra-ui/react';

interface NotificacoesBadgeProps {
  userId: string;
}

export function NotificacoesBadge({ userId }: NotificacoesBadgeProps) {
  const { notificacoesNaoLidas } = useNotificacoes(userId);
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Popover isOpen={isOpen} onClose={onToggle}>
      <PopoverTrigger>
        <Box position="relative" cursor="pointer" onClick={onToggle}>
          <Icon as={FaBell} boxSize={6} color="brand.blue" />
          {notificacoesNaoLidas.length > 0 && (
            <Badge
              colorScheme="red"
              position="absolute"
              top="-1"
              right="-1"
              borderRadius="full"
            >
              {notificacoesNaoLidas.length}
            </Badge>
          )}
        </Box>
      </PopoverTrigger>
      <PopoverContent width="400px">
        <PopoverArrow />
        <PopoverBody p={0}>
          <NotificacoesLista userId={userId} />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
} 