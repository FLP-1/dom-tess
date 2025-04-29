'use client';

import {
  Box,
  VStack,
  Text,
  HStack,
  Icon,
  Badge,
  useToast,
  Button,
} from '@chakra-ui/react';
import { FaBell, FaCheck } from 'react-icons/fa';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { marcarComoLida } from '@/services/notificacoes';
import { useNotificacoes } from '@/hooks/useNotificacoes';

interface NotificacoesListaProps {
  userId: string;
}

export function NotificacoesLista({ userId }: NotificacoesListaProps) {
  const { notificacoes, loading, error } = useNotificacoes(userId);
  const toast = useToast();

  const handleMarcarComoLida = async (notificacaoId: string) => {
    try {
      await marcarComoLida(notificacaoId);
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      toast({
        title: 'Erro ao marcar notificação como lida',
        description: 'Tente novamente mais tarde.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getBadgeColor = (tipo: string) => {
    switch (tipo) {
      case 'atraso':
        return 'red';
      case 'falta':
        return 'orange';
      case 'horario':
        return 'blue';
      case 'alerta':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  if (error) {
    return (
      <Box p={6} bg="white" borderRadius="lg" boxShadow="md">
        <Text color="red.500">Erro ao carregar notificações</Text>
      </Box>
    );
  }

  return (
    <Box p={6} bg="white" borderRadius="lg" boxShadow="md">
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between">
          <Text fontSize="xl" fontWeight="bold" color="brand.blue">
            Notificações
          </Text>
          <Button
            size="sm"
            colorScheme="blue"
            variant="ghost"
            isLoading={loading}
          >
            Atualizar
          </Button>
        </HStack>

        {notificacoes.length === 0 ? (
          <Text textAlign="center" color="gray.500">
            Nenhuma notificação encontrada
          </Text>
        ) : (
          notificacoes.map((notificacao) => (
            <Box
              key={notificacao.id}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              bg={notificacao.lida ? 'gray.50' : 'white'}
            >
              <HStack justify="space-between">
                <HStack>
                  <Icon as={FaBell} color={getBadgeColor(notificacao.tipo)} />
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="medium">{notificacao.mensagem}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {format(notificacao.data, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </Text>
                  </VStack>
                </HStack>
                <HStack>
                  <Badge colorScheme={getBadgeColor(notificacao.tipo)}>
                    {notificacao.tipo}
                  </Badge>
                  {!notificacao.lida && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleMarcarComoLida(notificacao.id)}
                    >
                      <Icon as={FaCheck} />
                    </Button>
                  )}
                </HStack>
              </HStack>
            </Box>
          ))
        )}
      </VStack>
    </Box>
  );
} 