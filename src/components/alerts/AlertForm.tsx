'use client';

import { Box, FormControl, FormLabel, Input, Textarea, Button, VStack, Checkbox } from '@chakra-ui/react';
import { useState } from 'react';

interface AlertFormProps {
  initialTitle?: string;
  initialDescription?: string;
  onSubmit: (data: { title: string; description: string; sendPush: boolean; sendSMS: boolean }) => void;
  isLoading?: boolean;
}

export function AlertForm({ initialTitle = '', initialDescription = '', onSubmit, isLoading }: AlertFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [sendPush, setSendPush] = useState(false);
  const [sendSMS, setSendSMS] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, sendPush, sendSMS });
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel htmlFor="alert-title">Título</FormLabel>
          <Input
            id="alert-title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Digite o título do alerta"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel htmlFor="alert-description">Descrição</FormLabel>
          <Textarea
            id="alert-description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Descreva o alerta"
          />
        </FormControl>
        <Checkbox isChecked={sendPush} onChange={e => setSendPush(e.target.checked)}>
          Enviar notificação push
        </Checkbox>
        <Checkbox isChecked={sendSMS} onChange={e => setSendSMS(e.target.checked)}>
          Enviar SMS
        </Checkbox>
        <Button colorScheme="blue" type="submit" isLoading={isLoading}>
          Salvar Alerta
        </Button>
      </VStack>
    </Box>
  );
} 