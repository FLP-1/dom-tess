'use client';

import React from 'react';
import { Box, Button, VStack, useToast } from '@chakra-ui/react';
import { ParentescoService } from '@/services/parentescoService';

export default function MassaTeste() {
  const toast = useToast();

  const handlePopularParentescos = async () => {
    try {
      await ParentescoService.popularParentescos();
      toast({
        title: 'Sucesso',
        description: 'Parentescos populados com sucesso',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Erro ao popular parentescos:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao popular parentescos',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <Button
          colorScheme="blue"
          onClick={handlePopularParentescos}
        >
          Popular Parentescos
        </Button>
      </VStack>
    </Box>
  );
} 