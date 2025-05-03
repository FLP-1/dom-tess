import { Box, VStack } from '@chakra-ui/react';
import { CadastroEmpregador } from '@/components/empregador/cadastro/CadastroEmpregador';

export default function CadastroEmpregadorPage() {
  return (
    <Box p={4}>
      <VStack spacing={6} align="stretch">
        <CadastroEmpregador />
      </VStack>
    </Box>
  );
} 