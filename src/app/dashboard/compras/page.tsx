'use client';
import { Box, Heading, VStack, Flex, Text, Button, Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface GrupoDeCompras {
  id: string;
  nome: string;
  produtos: { comprado: boolean }[];
}

export default function ComprasPage() {
  const router = useRouter();
  const [grupos, setGrupos] = useState<GrupoDeCompras[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGrupos() {
      setLoading(true);
      const snapshot = await getDocs(collection(db, 'shoppingGroups'));
      const gruposData: GrupoDeCompras[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any;
      setGrupos(gruposData);
      setLoading(false);
    }
    fetchGrupos();
  }, []);

  return (
    <Box>
      <Heading as="h1" size="lg" mb={6} color="blue.700">
        Grupos de Compras
      </Heading>
      {loading ? (
        <Flex justify="center" align="center" minH="100px"><Spinner /></Flex>
      ) : (
        <VStack align="stretch" spacing={4}>
          {grupos.map((grupo) => {
            const aComprar = grupo.produtos?.filter((p) => !p.comprado).length || 0;
            return (
              <Flex key={grupo.id} align="center" justify="space-between" p={4} bg="white" borderRadius="md" boxShadow="sm">
                <Text fontWeight="bold" fontSize="md">
                  {grupo.nome} <Text as="span" color="red.500" display="inline" fontWeight="bold">{aComprar}</Text>
                </Text>
                <Button colorScheme="blue" size="sm" onClick={() => router.push(`/dashboard/compras/${grupo.id}`)}>
                  Ver Lista
                </Button>
              </Flex>
            );
          })}
        </VStack>
      )}
    </Box>
  );
} 