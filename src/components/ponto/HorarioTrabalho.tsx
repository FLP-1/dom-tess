'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  VStack,
  Text,
  useToast,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Switch,
  FormErrorMessage,
} from '@chakra-ui/react';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface HorarioTrabalhoProps {
  userId: string;
}

export function HorarioTrabalho({ userId }: HorarioTrabalhoProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    entrada: '',
    saida: '',
    intervalo: '',
    duracaoIntervalo: '',
    regime: 'CLT',
    flexivel: false,
    diasTrabalho: ['segunda', 'terca', 'quarta', 'quinta', 'sexta'],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const toast = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.entrada) newErrors.entrada = 'Horário de entrada é obrigatório';
    if (!formData.saida) newErrors.saida = 'Horário de saída é obrigatório';
    if (!formData.intervalo) newErrors.intervalo = 'Horário de intervalo é obrigatório';
    if (!formData.duracaoIntervalo) newErrors.duracaoIntervalo = 'Duração do intervalo é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'horarios_trabalho'), {
        userId,
        ...formData,
        createdAt: new Date(),
      });

      toast({
        title: 'Horário cadastrado com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Erro ao cadastrar horário:', error);
      toast({
        title: 'Erro ao cadastrar horário',
        description: 'Tente novamente mais tarde.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={6} bg="white" borderRadius="lg" boxShadow="md">
      <VStack spacing={6}>
        <Text fontSize="2xl" fontWeight="bold" color="brand.blue">
          Configurar Horário de Trabalho
        </Text>

        <FormControl isInvalid={!!errors.entrada}>
          <FormLabel>Horário de Entrada</FormLabel>
          <Input
            type="time"
            value={formData.entrada}
            onChange={(e) => setFormData({ ...formData, entrada: e.target.value })}
          />
          <FormErrorMessage>{errors.entrada}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.saida}>
          <FormLabel>Horário de Saída</FormLabel>
          <Input
            type="time"
            value={formData.saida}
            onChange={(e) => setFormData({ ...formData, saida: e.target.value })}
          />
          <FormErrorMessage>{errors.saida}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.intervalo}>
          <FormLabel>Horário do Intervalo</FormLabel>
          <Input
            type="time"
            value={formData.intervalo}
            onChange={(e) => setFormData({ ...formData, intervalo: e.target.value })}
          />
          <FormErrorMessage>{errors.intervalo}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.duracaoIntervalo}>
          <FormLabel>Duração do Intervalo (minutos)</FormLabel>
          <Input
            type="number"
            value={formData.duracaoIntervalo}
            onChange={(e) => setFormData({ ...formData, duracaoIntervalo: e.target.value })}
          />
          <FormErrorMessage>{errors.duracaoIntervalo}</FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel>Regime de Trabalho</FormLabel>
          <Select
            value={formData.regime}
            onChange={(e) => setFormData({ ...formData, regime: e.target.value })}
          >
            <option value="CLT">CLT</option>
            <option value="PJ">PJ</option>
            <option value="Autônomo">Autônomo</option>
          </Select>
        </FormControl>

        <FormControl display="flex" alignItems="center">
          <FormLabel mb="0">Horário Flexível</FormLabel>
          <Switch
            isChecked={formData.flexivel}
            onChange={(e) => setFormData({ ...formData, flexivel: e.target.checked })}
          />
        </FormControl>

        <Button
          colorScheme="blue"
          onClick={handleSubmit}
          isLoading={loading}
          width="100%"
        >
          Salvar Horário
        </Button>
      </VStack>
    </Box>
  );
} 