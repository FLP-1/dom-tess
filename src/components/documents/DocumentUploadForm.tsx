import { FormControl, FormLabel } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
'use client';

import { useState, useCallback } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Text,
  useToast,
  Flex,
  Icon,
  Badge,
  Textarea,
  Spinner,
} from '@chakra-ui/react';
import { FiUpload, FiX, FiCheck } from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';
import { DatePicker } from '@/components/form/DatePicker';
import { usePermissions } from '@/hooks/usePermissions';
import { useAppNotifications } from '@/hooks/useAppNotifications';
import { SelectCustom } from '../common/SelectCustom';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

export function DocumentUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [accessLevel, setAccessLevel] = useState('all');
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [responsible, setResponsible] = useState('');
  const [category, setCategory] = useState('outros');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const toast = useToast();
  const { canUpload, isLoading: isLoadingPermissions } = usePermissions();
  const notifications = useAppNotifications();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast({
        title: 'Erro',
        description: 'Tipo de arquivo não permitido',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'Erro',
        description: 'O arquivo excede o tamanho máximo permitido (5MB)',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setFile(file);
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxFiles: 1,
  });

  const handleSubmit = async () => {
    if (!file) {
      notifications.showError(
        'Erro',
        'Por favor, selecione um arquivo',
        { persistent: true }
      );
      return;
    }

    if (!expirationDate) {
      notifications.showError(
        'Erro',
        'Por favor, selecione uma data de validade',
        { persistent: true }
      );
      return;
    }

    if (expirationDate < new Date()) {
      notifications.showError(
        'Erro',
        'A data de validade deve ser futura',
        { persistent: true }
      );
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('metadata', JSON.stringify({
        expirationDate,
        responsible,
        accessLevel,
        category,
        description,
      }));

      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro ao fazer upload do documento');
      }

      notifications.showSuccess(
        'Sucesso',
        'Documento enviado com sucesso',
        { 
          persistent: true,
          pushNotification: true 
        }
      );

      // Limpar formulário
      setFile(null);
      setExpirationDate(null);
      setResponsible('');
      setDescription('');
    } catch (error) {
      notifications.showError(
        'Erro',
        'Erro ao fazer upload do documento',
        { persistent: true }
      );
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoadingPermissions) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="200px">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!canUpload) {
    return (
      <Box textAlign="center" p={6}>
        <Text>Você não tem permissão para fazer upload de documentos.</Text>
      </Box>
    );
  }

  return (
    <Box
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="md"
      bg="white"
      maxW="600px"
      mx="auto"
    >
      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel>Upload de Documento</FormLabel>
          <Box
            {...getRootProps()}
            p={6}
            border="2px dashed"
            borderColor={isDragActive ? 'blue.500' : 'gray.300'}
            borderRadius="md"
            textAlign="center"
            cursor="pointer"
            _hover={{ borderColor: 'blue.500' }}
          >
            <input {...getInputProps()} />
            <Icon as={FiUpload} w={8} h={8} color="gray.500" mb={2} />
            <Text>
              {isDragActive
                ? 'Solte o arquivo aqui'
                : 'Arraste e solte um arquivo aqui, ou clique para selecionar'}
            </Text>
            {file && (
              <Flex align="center" justify="center" mt={2}>
                <Icon as={FiCheck} color="green.500" mr={2} />
                <Text>{file.name}</Text>
                <Icon
                  as={FiX}
                  color="red.500"
                  ml={2}
                  cursor="pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                />
              </Flex>
            )}
          </Box>
        </FormControl>

        <FormControl>
          <FormLabel id="label-categoria" htmlFor="categoria">Categoria</FormLabel>
          <SelectCustom
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[
              { value: 'contrato', label: 'Contratos' },
              { value: 'fiscal', label: 'Documentos Fiscais' },
              { value: 'rh', label: 'RH' },
              { value: 'outros', label: 'Outros' },
            ]}
            placeholder="Selecione a categoria"
            isRequired
          />
        </FormControl>

        <FormControl>
          <FormLabel>Descrição</FormLabel>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva o conteúdo do documento"
          />
        </FormControl>

        <FormControl>
          <FormLabel id="label-acesso" htmlFor="acesso">Acesso</FormLabel>
          <Select
            id="acesso"
            aria-labelledby="label-acesso"
            aria-label="Acesso"
            value={accessLevel}
            onChange={(e) => setAccessLevel(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="admin">Apenas Administradores</option>
            <option value="specific">Usuários Específicos</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Data de Validade</FormLabel>
          <DatePicker
            selected={expirationDate}
            onChange={(date: Date) => setExpirationDate(date)}
            placeholderText="Selecione a data de validade"
            minDate={new Date()}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Responsável</FormLabel>
          <Input
            value={responsible}
            onChange={(e) => setResponsible(e.target.value)}
            placeholder="Nome do responsável"
          />
        </FormControl>

        <Button
          colorScheme="blue"
          onClick={handleSubmit}
          isDisabled={!file || isUploading}
          isLoading={isUploading}
          loadingText="Enviando..."
          mt={4}
        >
          Enviar Documento
        </Button>
      </VStack>
    </Box>
  );
} 