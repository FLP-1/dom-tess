import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useColorModeValue,
  Flex,
  useToast,
  Progress,
  VisuallyHidden,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useRegistros } from '@/hooks/useRegistros';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState, useMemo, useCallback, memo } from 'react';
import { ExportButton } from '@/components/common/ExportButton';
import { FiltrosRegistro } from '@/components/common/FiltrosRegistro';
import { Paginacao } from '@/components/common/Paginacao';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { exportarDados } from '@/services/exportacao';

interface ListaRegistrosProps {
  userId: string;
  dataInicio?: Date;
  dataFim?: Date;
}

// Componente memoizado para evitar re-renders desnecessários
const RegistroRow = memo(({ registro }: { registro: any }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Tr bg={bgColor} borderColor={borderColor}>
      <Td>
        {format(registro.dataHora, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
      </Td>
      <Td>
        <Text
          color={
            registro.tipo === 'entrada'
              ? 'green.500'
              : registro.tipo === 'saida'
              ? 'red.500'
              : 'yellow.500'
          }
          fontWeight="bold"
        >
          {registro.tipo.charAt(0).toUpperCase() + registro.tipo.slice(1)}
        </Text>
      </Td>
      <Td>
        {registro.localizacao
          ? `${registro.localizacao.lat.toFixed(4)}, ${registro.localizacao.lng.toFixed(4)}`
          : '-'}
      </Td>
      <Td>{registro.wifi || '-'}</Td>
      <Td>{registro.observacao || '-'}</Td>
    </Tr>
  );
});

RegistroRow.displayName = 'RegistroRow';

export function ListaRegistros({ userId, dataInicio, dataFim }: ListaRegistrosProps) {
  const { registros, loading, error, horasTrabalhadas } = useRegistros(userId, dataInicio, dataFim);
  const [tipoFiltro, setTipoFiltro] = useState<string>('todos');
  const [periodoFiltro, setPeriodoFiltro] = useState<string>('todos');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [exportando, setExportando] = useState(false);
  const registrosPorPagina = 10;
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Memoização dos registros filtrados
  const registrosFiltrados = useMemo(() => {
    let filtrados = [...registros];

    if (tipoFiltro !== 'todos') {
      filtrados = filtrados.filter(reg => reg.tipo === tipoFiltro);
    }

    if (periodoFiltro !== 'todos') {
      const hoje = new Date();
      const inicioSemana = new Date(hoje);
      inicioSemana.setDate(hoje.getDate() - hoje.getDay());
      const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

      filtrados = filtrados.filter(reg => {
        const dataRegistro = reg.dataHora;
        switch (periodoFiltro) {
          case 'hoje':
            return dataRegistro.toDateString() === hoje.toDateString();
          case 'semana':
            return dataRegistro >= inicioSemana;
          case 'mes':
            return dataRegistro >= inicioMes;
          default:
            return true;
        }
      });
    }

    return filtrados;
  }, [registros, tipoFiltro, periodoFiltro]);

  const totalPaginas = Math.ceil(registrosFiltrados.length / registrosPorPagina);
  const registrosPaginados = useMemo(() => 
    registrosFiltrados.slice(
      (paginaAtual - 1) * registrosPorPagina,
      paginaAtual * registrosPorPagina
    ),
    [registrosFiltrados, paginaAtual, registrosPorPagina]
  );

  // Callback memoizado para exportação
  const handleExport = useCallback(async (format: 'csv' | 'pdf' | 'xlsx') => {
    setExportando(true);
    try {
      const headers = ['Data/Hora', 'Tipo', 'Localização', 'WiFi', 'Observação'];
      const rows = registrosFiltrados.map(reg => [
        format(reg.dataHora, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }),
        reg.tipo,
        reg.localizacao ? `${reg.localizacao.lat.toFixed(4)}, ${reg.localizacao.lng.toFixed(4)}` : '-',
        reg.wifi || '-',
        reg.observacao || '-'
      ]);

      await exportarDados({
        headers,
        rows,
        titulo: 'Registros de Ponto'
      }, format);

      toast({
        title: 'Exportação concluída',
        description: `Os dados foram exportados com sucesso em formato ${format.toUpperCase()}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Erro na exportação',
        description: 'Ocorreu um erro ao exportar os dados. Por favor, tente novamente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setExportando(false);
    }
  }, [registrosFiltrados, toast]);

  if (loading) {
    return (
      <Box p={4}>
        <Progress size="xs" isIndeterminate />
        <VisuallyHidden>Carregando registros...</VisuallyHidden>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error" variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" height="200px">
        <AlertIcon boxSize="40px" mr={0} />
        <Text mt={4} mb={1} fontSize="lg">
          Erro ao carregar registros
        </Text>
        <Text mb={4}>
          {error.message}
        </Text>
      </Alert>
    );
  }

  if (registros.length === 0) {
    return (
      <Alert status="info" variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" height="200px">
        <AlertIcon boxSize="40px" mr={0} />
        <Text mt={4} mb={1} fontSize="lg">
          Nenhum registro encontrado
        </Text>
        <Text mb={4}>
          Não há registros de ponto para exibir no período selecionado.
        </Text>
      </Alert>
    );
  }

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={bgColor}
      borderColor={borderColor}
      role="region"
      aria-label="Lista de registros de ponto"
    >
      <Flex p={4} gap={4} wrap="wrap" align="center" justify="space-between">
        <FiltrosRegistro
          tipoFiltro={tipoFiltro}
          periodoFiltro={periodoFiltro}
          onTipoChange={setTipoFiltro}
          onPeriodoChange={setPeriodoFiltro}
        />
        <ExportButton 
          onExport={handleExport} 
          isLoading={exportando} 
          aria-label="Exportar registros"
        />
      </Flex>

      <Table variant="simple" role="grid" aria-label="Tabela de registros">
        <Thead>
          <Tr>
            <Th>Data/Hora</Th>
            <Th>Tipo</Th>
            <Th>Localização</Th>
            <Th>WiFi</Th>
            <Th>Observação</Th>
          </Tr>
        </Thead>
        <Tbody>
          {registrosPaginados.map((registro) => (
            <RegistroRow key={registro.id} registro={registro} />
          ))}
        </Tbody>
      </Table>

      <Paginacao
        paginaAtual={paginaAtual}
        totalPaginas={totalPaginas}
        onPaginaChange={setPaginaAtual}
        aria-label="Navegação de páginas"
      />

      {horasTrabalhadas && (
        <Box p={4} borderTopWidth="1px" borderColor={borderColor} role="status">
          <Text fontWeight="bold">
            Total de horas trabalhadas: {horasTrabalhadas.horas}h {horasTrabalhadas.minutos}min
          </Text>
        </Box>
      )}
    </Box>
  );
} 