'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  VStack,
  Text,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  useToast,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { SelectCustom } from '../common/SelectCustom';

interface RegistroPonto {
  id: string;
  tipo: 'entrada' | 'saida' | 'intervalo';
  dataHora: Date;
  localizacao: { lat: number; lng: number };
  wifi: string;
  observacao: string;
}

interface RelatoriosPontoProps {
  userId: string;
}

export function RelatoriosPonto({ userId }: RelatoriosPontoProps) {
  const [registros, setRegistros] = useState<RegistroPonto[]>([]);
  const [loading, setLoading] = useState(false);
  const [periodo, setPeriodo] = useState('hoje');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const toast = useToast();

  const buscarRegistros = async () => {
    setLoading(true);
    try {
      let q = query(
        collection(db, 'registros_ponto'),
        where('userId', '==', userId),
        orderBy('dataHora', 'desc')
      );

      if (periodo === 'hoje') {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        q = query(q, where('dataHora', '>=', hoje));
      } else if (periodo === 'personalizado' && dataInicio && dataFim) {
        const inicio = new Date(dataInicio);
        const fim = new Date(dataFim);
        inicio.setHours(0, 0, 0, 0);
        fim.setHours(23, 59, 59, 999);
        q = query(q, where('dataHora', '>=', inicio), where('dataHora', '<=', fim));
      }

      const querySnapshot = await getDocs(q);
      const registrosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dataHora: doc.data().dataHora.toDate(),
      })) as RegistroPonto[];

      setRegistros(registrosData);
    } catch (error) {
      console.error('Erro ao buscar registros:', error);
      toast({
        title: 'Erro ao buscar registros',
        description: 'Tente novamente mais tarde.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarRegistros();
  }, [periodo, dataInicio, dataFim, buscarRegistros]);

  const exportarCSV = () => {
    const headers = ['Data/Hora', 'Tipo', 'Localização', 'WiFi', 'Observação'];
    const rows = registros.map(reg => [
      format(reg.dataHora, 'dd/MM/yyyy HH:mm:ss'),
      reg.tipo,
      `${reg.localizacao.lat}, ${reg.localizacao.lng}`,
      reg.wifi,
      reg.observacao,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `registros_ponto_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  return (
    <Box p={6} bg="white" borderRadius="lg" boxShadow="md">
      <VStack spacing={6}>
        <Text fontSize="2xl" fontWeight="bold" color="brand.blue">
          Relatórios de Ponto
        </Text>

        <HStack spacing={4}>
          <FormControl>
            <FormLabel id="label-periodo-select" htmlFor="periodo-select">Período</FormLabel>
            <SelectCustom
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              options={[
                { value: 'diario', label: 'Diário' },
                { value: 'semanal', label: 'Semanal' },
                { value: 'mensal', label: 'Mensal' }
              ]}
              placeholder="Selecione o período"
              isRequired
            />
          </FormControl>

          {periodo === 'personalizado' && (
            <>
              <Input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                width="200px"
              />
              <Input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                width="200px"
              />
            </>
          )}

          <Button
            colorScheme="blue"
            onClick={exportarCSV}
            isLoading={loading}
          >
            Exportar CSV
          </Button>
        </HStack>

        <Box width="100%" overflowX="auto">
          <Table variant="simple">
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
              {registros.map((registro) => (
                <Tr key={registro.id}>
                  <Td>{format(registro.dataHora, 'dd/MM/yyyy HH:mm:ss')}</Td>
                  <Td>{registro.tipo}</Td>
                  <Td>{`${registro.localizacao.lat}, ${registro.localizacao.lng}`}</Td>
                  <Td>{registro.wifi}</Td>
                  <Td>{registro.observacao}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </Box>
  );
} 