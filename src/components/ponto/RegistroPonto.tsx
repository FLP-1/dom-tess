'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  VStack,
  Text,
  useToast,
  HStack,
  Icon,
  Tooltip,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react';
import { FaClock, FaMapMarkerAlt, FaWifi, FaStickyNote } from 'react-icons/fa';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { criarRegistro, verificarRegistrosDoDia } from '@/services/registros';
import { criarNotificacaoHorario } from '@/services/notificacoes';
import { useAppNotifications } from '@/contexts/AppNotificationsContext';

interface RegistroPontoProps {
  userId: string;
}

export function RegistroPonto({ userId }: RegistroPontoProps) {
  const [loading, setLoading] = useState(false);
  const [localizacao, setLocalizacao] = useState<{ lat: number; lng: number } | null>(null);
  const [wifi, setWifi] = useState<string | null>(null);
  const [observacao, setObservacao] = useState('');
  const [registrosHoje, setRegistrosHoje] = useState({
    temEntrada: false,
    temSaida: false,
    temIntervalo: false,
  });
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const notifications = useAppNotifications();

  useEffect(() => {
    // Obter localização
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocalizacao({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
        }
      );
    }

    // Obter informações do WiFi
    if (navigator.connection) {
      const connection = navigator.connection as any;
      if (connection.type === 'wifi') {
        setWifi(connection.ssid || 'WiFi Desconhecido');
      }
    }

    // Verificar registros do dia
    verificarRegistrosDoDia(userId).then(setRegistrosHoje);
  }, [userId]);

  const registrarPonto = async (tipo: 'entrada' | 'saida' | 'intervalo') => {
    if (!localizacao) {
      toast({
        title: 'Localização não disponível',
        description: 'Por favor, permita o acesso à localização.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      await criarRegistro({
        userId,
        tipo,
        dataHora: new Date(),
        localizacao,
        wifi: wifi || 'WiFi não detectado',
        observacao,
      });

      toast({
        title: 'Registro realizado com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Atualizar estado dos registros
      const novosRegistros = await verificarRegistrosDoDia(userId);
      setRegistrosHoje(novosRegistros);

      // Limpar observação
      setObservacao('');
      onClose();
    } catch (error) {
      console.error('Erro ao registrar ponto:', error);
      toast({
        title: 'Erro ao registrar ponto',
        description: 'Tente novamente mais tarde.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegistro = (tipo: 'entrada' | 'saida' | 'intervalo') => {
    if (tipo === 'entrada' && registrosHoje.temEntrada) {
      notifications.showWarning(
        'Entrada já registrada',
        'Você já registrou entrada hoje.',
        { persistent: true }
      );
      return;
    }

    if (tipo === 'saida' && !registrosHoje.temEntrada) {
      notifications.showWarning(
        'Entrada não registrada',
        'Você precisa registrar a entrada primeiro.',
        { persistent: true }
      );
      return;
    }

    if (tipo === 'intervalo' && !registrosHoje.temEntrada) {
      notifications.showWarning(
        'Entrada não registrada',
        'Você precisa registrar a entrada primeiro.',
        { persistent: true }
      );
      return;
    }

    onOpen();
  };

  return (
    <>
      <Box p={6} bg="white" borderRadius="lg" boxShadow="md">
        <VStack spacing={6}>
          <Text fontSize="2xl" fontWeight="bold" color="brand.blue">
            Registro de Ponto
          </Text>
          
          <Text fontSize="lg">
            {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </Text>
          
          <HStack spacing={4}>
            <Tooltip label="Localização">
              <Badge colorScheme="blue" p={2}>
                <Icon as={FaMapMarkerAlt} mr={2} />
                {localizacao ? 'Localização obtida' : 'Localização não disponível'}
              </Badge>
            </Tooltip>
            
            <Tooltip label="WiFi">
              <Badge colorScheme="green" p={2}>
                <Icon as={FaWifi} mr={2} />
                {wifi || 'WiFi não detectado'}
              </Badge>
            </Tooltip>
          </HStack>

          <HStack spacing={4}>
            <Button
              leftIcon={<FaClock />}
              colorScheme="green"
              onClick={() => handleRegistro('entrada')}
              isLoading={loading}
              isDisabled={registrosHoje.temEntrada}
            >
              Registrar Entrada
            </Button>
            
            <Button
              leftIcon={<FaClock />}
              colorScheme="red"
              onClick={() => handleRegistro('saida')}
              isLoading={loading}
              isDisabled={!registrosHoje.temEntrada || registrosHoje.temSaida}
            >
              Registrar Saída
            </Button>
            
            <Button
              leftIcon={<FaClock />}
              colorScheme="yellow"
              onClick={() => handleRegistro('intervalo')}
              isLoading={loading}
              isDisabled={!registrosHoje.temEntrada || registrosHoje.temIntervalo}
            >
              Intervalo
            </Button>
          </HStack>
        </VStack>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Adicionar Observação</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Textarea
                placeholder="Digite sua observação (opcional)"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
              />
              <Button
                colorScheme="blue"
                onClick={() => registrarPonto('entrada')}
                isLoading={loading}
                width="100%"
              >
                Confirmar Registro
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
} 