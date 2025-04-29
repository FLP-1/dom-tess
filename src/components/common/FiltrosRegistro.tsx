import { HStack, Select, Icon, FormControl, FormLabel } from '@chakra-ui/react';
import { FaFilter } from 'react-icons/fa';

interface FiltrosRegistroProps {
  tipoFiltro: string;
  periodoFiltro: string;
  onTipoChange: (value: string) => void;
  onPeriodoChange: (value: string) => void;
}

export function FiltrosRegistro({
  tipoFiltro,
  periodoFiltro,
  onTipoChange,
  onPeriodoChange,
}: FiltrosRegistroProps) {
  return (
    <HStack spacing={4} align="center">
      <FormControl>
        <FormLabel htmlFor="tipo-filtro">
          <HStack>
            <Icon as={FaFilter} />
            <span>Tipo</span>
          </HStack>
        </FormLabel>
        <Select
          id="tipo-filtro"
          value={tipoFiltro}
          onChange={(e) => onTipoChange(e.target.value)}
          aria-label="Filtrar por tipo de registro"
        >
          <option value="todos">Todos os tipos</option>
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
          <option value="intervalo">Intervalo</option>
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="periodo-filtro">Período</FormLabel>
        <Select
          id="periodo-filtro"
          value={periodoFiltro}
          onChange={(e) => onPeriodoChange(e.target.value)}
          aria-label="Filtrar por período"
        >
          <option value="todos">Todos os períodos</option>
          <option value="hoje">Hoje</option>
          <option value="semana">Esta semana</option>
          <option value="mes">Este mês</option>
        </Select>
      </FormControl>
    </HStack>
  );
} 