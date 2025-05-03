import { Button } from '@chakra-ui/react';
import { Flex, Button, Text, HStack } from '@chakra-ui/react';

interface PaginacaoProps {
  paginaAtual: number;
  totalPaginas: number;
  onPaginaChange: (pagina: number) => void;
}

export function Paginacao({ paginaAtual, totalPaginas, onPaginaChange }: PaginacaoProps) {
  const handleAnterior = () => {
    if (paginaAtual > 1) {
      onPaginaChange(paginaAtual - 1);
    }
  };

  const handleProxima = () => {
    if (paginaAtual < totalPaginas) {
      onPaginaChange(paginaAtual + 1);
    }
  };

  return (
    <Flex justify="space-between" align="center" p={4}>
      <Text>
        Página {paginaAtual} de {totalPaginas}
      </Text>
      <HStack spacing={2}>
        <Button
          onClick={handleAnterior}
          isDisabled={paginaAtual === 1}
          aria-label="Página anterior"
        >
          Anterior
        </Button>
        <Button
          onClick={handleProxima}
          isDisabled={paginaAtual === totalPaginas}
          aria-label="Próxima página"
        >
          Próxima
        </Button>
      </HStack>
    </Flex>
  );
} 