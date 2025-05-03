import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Button,
  useToast,
  Badge,
  Collapse,
  useDisclosure
} from '@chakra-ui/react';
import { WarningIcon, CheckIcon, TimeIcon } from '@chakra-ui/icons';
import { DocumentoService } from '@/services/documentoService';
import { AlertaDocumento, Documento } from '@/types/documento';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Props {
  userId: string;
}

export function DocumentoAlerta({ userId }: Props) {
  const [alertas, setAlertas] = useState<AlertaDocumento[]>([]);
  const [documentos, setDocumentos] = useState<Record<string, Documento>>({});
  const toast = useToast();
  const { isOpen, onToggle } = useDisclosure();

  useEffect(() => {
    const carregarAlertas = async () => {
      try {
        const alertasPendentes = await DocumentoService.listarAlertasPendentes(userId);
        setAlertas(alertasPendentes);

        // Carregar documentos relacionados
        const docs: Record<string, Documento> = {};
        for (const alerta of alertasPendentes) {
          const doc = await DocumentoService.obterDocumento(alerta.documentoId);
          if (doc) {
            docs[doc.id] = doc;
          }
        }
        setDocumentos(docs);
      } catch (error) {
        console.error('Erro ao carregar alertas:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os alertas',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    carregarAlertas();
  }, [userId, toast]);

  const handleMarcarComoVisualizado = async (alertaId: string) => {
    try {
      await DocumentoService.atualizarStatusAlerta(alertaId, 'visualizado');
      setAlertas(alertas.filter(a => a.id !== alertaId));
    } catch (error) {
      console.error('Erro ao atualizar alerta:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o alerta',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const getIconByPrioridade = (prioridade: AlertaDocumento['prioridade']) => {
    switch (prioridade) {
      case 'alta':
        return <WarningIcon color="red.500" />;
      case 'media':
        return <TimeIcon color="orange.500" />;
      case 'baixa':
        return <TimeIcon color="yellow.500" />;
    }
  };

  return (
    <Box>
      <Button
        onClick={onToggle}
        rightIcon={isOpen ? <CheckIcon /> : <WarningIcon />}
        colorScheme={alertas.length > 0 ? 'red' : 'green'}
        variant="ghost"
      >
        {alertas.length > 0 ? `${alertas.length} Alertas` : 'Sem alertas'}
      </Button>

      <Collapse in={isOpen}>
        <VStack spacing={4} mt={4} align="stretch">
          {alertas.map(alerta => {
            const documento = documentos[alerta.documentoId];
            return (
              <Box
                key={alerta.id}
                p={4}
                borderWidth="1px"
                borderRadius="lg"
                bg={alerta.prioridade === 'alta' ? 'red.50' : 'white'}
              >
                <HStack justify="space-between">
                  <HStack>
                    {getIconByPrioridade(alerta.prioridade)}
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="bold">{documento?.nome || 'Documento'}</Text>
                      <Text fontSize="sm" color="gray.600">
                        {alerta.mensagem}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {format(alerta.dataAlerta, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </Text>
                    </VStack>
                  </HStack>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() => handleMarcarComoVisualizado(alerta.id)}
                  >
                    Visualizado
                  </Button>
                </HStack>
              </Box>
            );
          })}
        </VStack>
      </Collapse>
    </Box>
  );
} 