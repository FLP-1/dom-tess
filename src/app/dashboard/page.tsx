import { Box, SimpleGrid, Heading, Text } from '@chakra-ui/react';

export default function DashboardPage() {
  return (
    <Box>
      <Heading as="h1" size="xl" mb={4} color="blue.700">
        Bem-vindo ao novo Dashboard!
      </Heading>
      <Text color="gray.600" mb={8}>
        Aqui você pode acessar as principais funcionalidades do sistema.
      </Text>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        <Card title="Controle de Ponto" description="Registre e gerencie o ponto." />
        <Card title="Folha de Pagamento" description="Gerencie salários e pagamentos." />
        <Card title="Documentos" description="Acesse seus documentos." />
      </SimpleGrid>
    </Box>
  );
}

function Card({ title, description }: { title: string; description: string }) {
  return (
    <Box p={6} bg="white" borderRadius="lg" boxShadow="md">
      <Heading as="h3" size="md" color="blue.700" mb={2}>
        {title}
      </Heading>
      <Text color="gray.600">{description}</Text>
    </Box>
  );
} 