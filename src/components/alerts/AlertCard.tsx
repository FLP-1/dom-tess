'use client';

import { Box, Text, Badge, Flex, IconButton } from '@chakra-ui/react';
import { FiBell, FiEdit2, FiTrash2 } from 'react-icons/fi';

interface AlertCardProps {
  title: string;
  description: string;
  unread?: boolean;
}

export function AlertCard({ title, description, unread, onEdit, onDelete, onMarkAsRead }: AlertCardProps & { onEdit?: () => void; onDelete?: () => void; onMarkAsRead?: () => void }) {
  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      p={4}
      bg={unread ? 'yellow.50' : 'white'}
      boxShadow={unread ? 'md' : 'sm'}
      cursor={onMarkAsRead ? 'pointer' : 'default'}
      onClick={onMarkAsRead}
      _hover={onMarkAsRead ? { bg: 'yellow.100' } : {}}
    >
      <Flex align="center" mb={2} gap={2} justify="space-between">
        <Flex align="center" gap={2}>
          <FiBell color="#DD6B20" />
          <Text fontWeight="bold" fontSize="md">{title}</Text>
          {unread && <Badge colorScheme="yellow">Não lido</Badge>}
        </Flex>
        <Flex gap={1}>
          {onEdit && <IconButton aria-label="Editar alerta" icon={<FiEdit2 />} size="sm" variant="ghost" onClick={e => { e.stopPropagation(); onEdit(); }} />}
          {onDelete && <IconButton aria-label="Excluir alerta" icon={<FiTrash2 />} size="sm" variant="ghost" colorScheme="red" onClick={e => { e.stopPropagation(); onDelete(); }} />}
        </Flex>
      </Flex>
      <Text color="gray.700">{description}</Text>
    </Box>
  );
} 