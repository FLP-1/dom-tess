'use client';

import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Textarea,
  Select,
  VStack,
  HStack,
  Box,
  useToast,
  Tag,
  TagLabel,
  TagCloseButton,
  IconButton,
  InputGroup,
  InputRightElement,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { ITask, ETaskPriority, ETaskRecurrence } from '../../types/task';
import { EStatus } from '../../types/common';
import { FiPlus, FiX } from 'react-icons/fi';
import { collection, addDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { SelectCustom } from '../common/SelectCustom';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  task?: ITask;
  onUpdate?: () => void;
}

const statusOptions = [
  { value: EStatus.NOT_STARTED, label: 'Não Iniciada' },
  { value: EStatus.IN_PROGRESS, label: 'Em Andamento' },
  { value: EStatus.COMPLETED, label: 'Concluída' },
  { value: EStatus.CANCELLED, label: 'Cancelada' }
];

const priorityOptions = [
  { value: ETaskPriority.LOW, label: 'Baixa' },
  { value: ETaskPriority.MEDIUM, label: 'Média' },
  { value: ETaskPriority.HIGH, label: 'Alta' },
  { value: ETaskPriority.URGENT, label: 'Urgente' }
];

const assigneeOptions = [
  { value: 'user1', label: 'Usuário 1' },
  { value: 'user2', label: 'Usuário 2' },
  { value: 'user3', label: 'Usuário 3' }
];

const recurrenceOptions = [
  { value: ETaskRecurrence.NONE, label: 'Nenhuma' },
  { value: ETaskRecurrence.DAILY, label: 'Diária' },
  { value: ETaskRecurrence.WEEKLY, label: 'Semanal' },
  { value: ETaskRecurrence.MONTHLY, label: 'Mensal' },
  { value: ETaskRecurrence.YEARLY, label: 'Anual' }
];

export const TaskForm: React.FC<TaskFormProps> = ({ isOpen, onClose, task, onUpdate }) => {
  const { user } = useAuth();
  const toast = useToast();
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState<EStatus>(task?.status || EStatus.NOT_STARTED);
  const [priority, setPriority] = useState<ETaskPriority>(task?.priority || ETaskPriority.MEDIUM);
  const [dueDate, setDueDate] = useState<Date | null>(task?.dueDate || null);
  const [estimatedTime, setEstimatedTime] = useState<number | undefined>(task?.estimatedTime);
  const [estimatedCost, setEstimatedCost] = useState<number | undefined>(task?.estimatedCost);
  const [recurrenceType, setRecurrenceType] = useState<ETaskRecurrence>(task?.recurrence?.type || ETaskRecurrence.NONE);
  const [recurrenceInterval, setRecurrenceInterval] = useState<number>(task?.recurrence?.interval || 1);
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<Date | null>(task?.recurrence?.endDate || null);
  const [tags, setTags] = useState<string[]>(task?.tags || []);
  const [newTag, setNewTag] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const taskData: Partial<ITask> = {
        title,
        description,
        status,
        priority,
        dueDate: dueDate || new Date(),
        estimatedTime,
        estimatedCost,
        recurrence: recurrenceType !== ETaskRecurrence.NONE ? {
          type: recurrenceType,
          interval: recurrenceInterval,
          endDate: recurrenceEndDate || undefined
        } : undefined,
        updatedAt: Timestamp.now(),
        createdBy: user?.uid,
        assignedTo: task?.assignedTo || [user?.uid],
      };

      if (task) {
        await updateDoc(doc(db, 'tasks', task.id), taskData);
        toast({
          title: 'Tarefa atualizada',
          status: 'success',
          duration: 3000,
        });
      } else {
        await addDoc(collection(db, 'tasks'), {
          ...taskData,
          createdAt: Timestamp.now(),
        });
        toast({
          title: 'Tarefa criada',
          status: 'success',
          duration: 3000,
        });
      }

      onClose();
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
      toast({
        title: 'Erro ao salvar tarefa',
        description: 'Ocorreu um erro ao salvar a tarefa. Tente novamente.',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{task ? 'Editar Tarefa' : 'Nova Tarefa'}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Título</FormLabel>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Digite o título da tarefa"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Descrição</FormLabel>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Digite a descrição da tarefa"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Status</FormLabel>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as EStatus)}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Prioridade</FormLabel>
                <Select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as ETaskPriority)}
                >
                  {priorityOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Data de Vencimento</FormLabel>
                <Input
                  type="datetime-local"
                  value={dueDate ? dueDate.toISOString().slice(0, 16) : ''}
                  onChange={(e) => setDueDate(e.target.value ? new Date(e.target.value) : null)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Tempo Estimado (horas)</FormLabel>
                <NumberInput
                  value={estimatedTime || ''}
                  onChange={(_, value) => setEstimatedTime(value || undefined)}
                  min={0}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>Custo Estimado (R$)</FormLabel>
                <NumberInput
                  value={estimatedCost || ''}
                  onChange={(_, value) => setEstimatedCost(value || undefined)}
                  min={0}
                  precision={2}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>Recorrência</FormLabel>
                <Select
                  value={recurrenceType}
                  onChange={(e) => setRecurrenceType(e.target.value as ETaskRecurrence)}
                >
                  {recurrenceOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </Select>
              </FormControl>

              {recurrenceType !== ETaskRecurrence.NONE && (
                <>
                  <FormControl>
                    <FormLabel>Intervalo de Recorrência</FormLabel>
                    <NumberInput
                      value={recurrenceInterval}
                      onChange={(_, value) => setRecurrenceInterval(value)}
                      min={1}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Data Final da Recorrência</FormLabel>
                    <Input
                      type="date"
                      value={recurrenceEndDate ? recurrenceEndDate.toISOString().slice(0, 10) : ''}
                      onChange={(e) => setRecurrenceEndDate(e.target.value ? new Date(e.target.value) : null)}
                    />
                  </FormControl>
                </>
              )}

              <Box width="100%">
                <FormLabel>Tags</FormLabel>
                <HStack spacing={2} wrap="wrap">
                  {tags.map((tag) => (
                    <Tag key={tag} size="md" borderRadius="full" variant="solid" colorScheme="blue">
                      <TagLabel>{tag}</TagLabel>
                      <TagCloseButton onClick={() => removeTag(tag)} />
                    </Tag>
                  ))}
                </HStack>
                <HStack mt={2}>
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Nova tag"
                  />
                  <IconButton
                    aria-label="Adicionar tag"
                    icon={<FiPlus />}
                    onClick={addTag}
                  />
                </HStack>
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="blue" type="submit">
              {task ? 'Atualizar' : 'Criar'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}; 