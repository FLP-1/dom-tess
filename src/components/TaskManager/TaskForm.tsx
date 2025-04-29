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
  FormControl,
  FormLabel,
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
} from '@chakra-ui/react';
import { Task, TaskPriority, TaskStatus, TaskRecurrence } from '../../types/task';
import { FiPlus, FiX } from 'react-icons/fi';
import { collection, addDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
  onUpdate?: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ isOpen, onClose, task, onUpdate }) => {
  const { user } = useAuth();
  const toast = useToast();
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [dueDate, setDueDate] = useState(task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || TaskPriority.MEDIUM);
  const [status, setStatus] = useState<TaskStatus>(task?.status || TaskStatus.NOT_STARTED);
  const [estimatedCost, setEstimatedCost] = useState(task?.estimatedCost?.toString() || '');
  const [estimatedTime, setEstimatedTime] = useState(task?.estimatedTime?.toString() || '');
  const [recurrenceType, setRecurrenceType] = useState<TaskRecurrence>(task?.recurrence?.type || TaskRecurrence.NONE);
  const [recurrenceInterval, setRecurrenceInterval] = useState(task?.recurrence?.interval?.toString() || '1');
  const [recurrenceEndDate, setRecurrenceEndDate] = useState(
    task?.recurrence?.endDate ? new Date(task.recurrence.endDate).toISOString().split('T')[0] : ''
  );
  const [tags, setTags] = useState<string[]>(task?.tags || []);
  const [newTag, setNewTag] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const taskData = {
        title,
        description,
        dueDate: Timestamp.fromDate(new Date(dueDate)),
        priority,
        status,
        estimatedCost: estimatedCost ? parseFloat(estimatedCost) : undefined,
        estimatedTime: estimatedTime ? parseFloat(estimatedTime) : undefined,
        recurrence: recurrenceType !== TaskRecurrence.NONE ? {
          type: recurrenceType,
          interval: parseInt(recurrenceInterval),
          endDate: recurrenceEndDate ? Timestamp.fromDate(new Date(recurrenceEndDate)) : undefined,
        } : undefined,
        tags,
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

              <HStack width="100%" spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Data de Vencimento</FormLabel>
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Prioridade</FormLabel>
                  <Select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    aria-label="Selecione a prioridade da tarefa"
                  >
                    <option value={TaskPriority.LOW}>Baixa</option>
                    <option value={TaskPriority.MEDIUM}>Média</option>
                    <option value={TaskPriority.HIGH}>Alta</option>
                    <option value={TaskPriority.URGENT}>Urgente</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TaskStatus)}
                    aria-label="Selecione o status da tarefa"
                  >
                    <option value={TaskStatus.NOT_STARTED}>Não Iniciado</option>
                    <option value={TaskStatus.PENDING}>Pendente</option>
                    <option value={TaskStatus.IN_PROGRESS}>Em Andamento</option>
                    <option value={TaskStatus.COMPLETED}>Concluído</option>
                    <option value={TaskStatus.CANCELLED}>Cancelado</option>
                  </Select>
                </FormControl>
              </HStack>

              <HStack width="100%" spacing={4}>
                <FormControl>
                  <FormLabel>Custo Estimado (R$)</FormLabel>
                  <Input
                    type="number"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                    placeholder="0.00"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Tempo Estimado (horas)</FormLabel>
                  <Input
                    type="number"
                    value={estimatedTime}
                    onChange={(e) => setEstimatedTime(e.target.value)}
                    placeholder="0"
                  />
                </FormControl>
              </HStack>

              <Box width="100%">
                <FormLabel>Recorrência</FormLabel>
                <HStack spacing={4}>
                  <Select
                    value={recurrenceType}
                    onChange={(e) => setRecurrenceType(e.target.value as TaskRecurrence)}
                    aria-label="Selecione o tipo de recorrência da tarefa"
                  >
                    <option value={TaskRecurrence.NONE}>Nenhuma</option>
                    <option value={TaskRecurrence.DAILY}>Diária</option>
                    <option value={TaskRecurrence.WEEKLY}>Semanal</option>
                    <option value={TaskRecurrence.MONTHLY}>Mensal</option>
                    <option value={TaskRecurrence.YEARLY}>Anual</option>
                  </Select>

                  {recurrenceType !== TaskRecurrence.NONE && (
                    <>
                      <Input
                        type="number"
                        value={recurrenceInterval}
                        onChange={(e) => setRecurrenceInterval(e.target.value)}
                        placeholder="Intervalo"
                        width="100px"
                      />
                      <Input
                        type="date"
                        value={recurrenceEndDate}
                        onChange={(e) => setRecurrenceEndDate(e.target.value)}
                        placeholder="Data Final"
                      />
                    </>
                  )}
                </HStack>
              </Box>

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