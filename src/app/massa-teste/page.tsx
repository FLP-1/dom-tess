'use client';

import { Button, VStack, useToast } from '@chakra-ui/react';
import { populatePositions } from '@/scripts/populatePositions';
import { populateCCTs } from '@/scripts/populateCCTs';

export default function MassaTestePage() {
  const toast = useToast();

  const handlePopulatePositions = async () => {
    try {
      await populatePositions();
      toast({
        title: 'Sucesso',
        description: 'Cargos populados com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao popular cargos',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handlePopulateCCTs = async () => {
    try {
      await populateCCTs();
      toast({
        title: 'Sucesso',
        description: 'CCTs populadas com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao popular CCTs',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={4} p={4}>
      <Button
        colorScheme="blue"
        onClick={handlePopulatePositions}
      >
        Popular Cargos
      </Button>
      <Button
        colorScheme="green"
        onClick={handlePopulateCCTs}
      >
        Popular CCTs
      </Button>
    </VStack>
  );
} 