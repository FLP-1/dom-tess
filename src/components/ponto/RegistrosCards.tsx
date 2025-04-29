import {
  Box,
  SimpleGrid,
  Text,
  useColorModeValue,
  Badge,
  Icon,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FaClock, FaMapMarkerAlt, FaWifi } from 'react-icons/fa';

interface RegistroPonto {
  id: string;
  tipo: 'entrada' | 'saida' | 'intervalo';
  dataHora: Date;
  localizacao: { lat: number; lng: number };
  wifi: string;
  observacao: string;
}

interface RegistrosCardsProps {
  registros: RegistroPonto[];
}

export function RegistrosCards({ registros }: RegistrosCardsProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const getBadgeColor = (tipo: string) => {
    switch (tipo) {
      case 'entrada':
        return 'green';
      case 'saida':
        return 'red';
      case 'intervalo':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
      {registros.map((registro) => (
        <Box
          key={registro.id}
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          bg={bgColor}
          borderColor={borderColor}
          p={4}
        >
          <VStack align="start" spacing={3}>
            <HStack justify="space-between" width="100%">
              <Text fontSize="lg" fontWeight="bold">
                {format(registro.dataHora, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </Text>
              <Badge
                colorScheme={getBadgeColor(registro.tipo)}
                fontSize="sm"
                px={2}
                py={1}
              >
                {registro.tipo.charAt(0).toUpperCase() + registro.tipo.slice(1)}
              </Badge>
            </HStack>

            <HStack>
              <Icon as={FaMapMarkerAlt} color="gray.500" />
              <Text fontSize="sm">
                {registro.localizacao
                  ? `${registro.localizacao.lat.toFixed(4)}, ${registro.localizacao.lng.toFixed(4)}`
                  : 'Localização não disponível'}
              </Text>
            </HStack>

            <HStack>
              <Icon as={FaWifi} color="gray.500" />
              <Text fontSize="sm">{registro.wifi || 'WiFi não detectado'}</Text>
            </HStack>

            {registro.observacao && (
              <Box width="100%" mt={2}>
                <Text fontSize="sm" color="gray.600">
                  {registro.observacao}
                </Text>
              </Box>
            )}
          </VStack>
        </Box>
      ))}
    </SimpleGrid>
  );
} 