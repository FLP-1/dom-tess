'use client';

import { useState, useRef } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
  Image,
  Progress,
  Text,
  Flex,
  IconButton
} from '@chakra-ui/react';
import { documentService } from '@/services/documentService';
import { ErrorMessage } from './ErrorMessage';
import { FiX } from 'react-icons/fi';
import imageCompression from 'browser-image-compression';
import { SelectField } from './SelectField';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = '.pdf,.doc,.docx,.jpg,.jpeg,.png';

const documentTypes = [
  { value: 'contrato', label: 'Contrato' },
  { value: 'rg', label: 'Documento de Identidade' },
  { value: 'cpf', label: 'CPF' },
  { value: 'atestado', label: 'Atestado Médico' },
  { value: 'outro', label: 'Outro' }
];

interface DocumentUploadProps {
  userId: string;
  onUploadComplete?: () => void;
}

export function DocumentUpload({ userId, onUploadComplete }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      if (selectedFile.size > MAX_FILE_SIZE) {
        setError('O arquivo excede o tamanho máximo permitido de 10MB');
        return;
      }

      if (selectedFile.type.startsWith('image/')) {
        try {
          const compressedFile = await imageCompression(selectedFile, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true
          });
          setFile(compressedFile);
          setPreview(URL.createObjectURL(compressedFile));
        } catch (error) {
          console.error('Erro ao comprimir imagem:', error);
          setFile(selectedFile);
          setPreview(URL.createObjectURL(selectedFile));
        }
      } else {
        setFile(selectedFile);
        setPreview(null);
      }
      
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!file || !type || !title) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const progressCallback = (progress: number) => {
        setUploadProgress(progress);
      };

      await documentService.uploadDocument(
        file,
        type,
        title,
        userId,
        expiresAt ? new Date(expiresAt) : undefined,
        progressCallback
      );

      toast({
        title: 'Documento enviado com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Limpar formulário
      setFile(null);
      setPreview(null);
      setType('');
      setTitle('');
      setExpiresAt('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error) {
      console.error('Erro ao enviar documento:', error);
      setError('Erro ao enviar documento. Por favor, tente novamente.');
      
      toast({
        title: 'Erro ao enviar documento',
        description: 'Por favor, tente novamente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>Arquivo</FormLabel>
          <Input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_FILE_TYPES}
            onChange={handleFileChange}
            aria-label="Selecione um arquivo"
          />
          <Text fontSize="sm" color="gray.500" mt={1}>
            Tamanho máximo: 10MB. Formatos aceitos: PDF, DOC, DOCX, JPG, JPEG, PNG
          </Text>
        </FormControl>

        {preview && (
          <Box position="relative">
            <Image
              src={preview}
              alt="Preview do documento"
              maxH="200px"
              objectFit="contain"
            />
            <IconButton
              aria-label="Remover arquivo"
              icon={<FiX />}
              position="absolute"
              top={2}
              right={2}
              onClick={handleRemoveFile}
              colorScheme="red"
              size="sm"
            />
          </Box>
        )}

        {isUploading && (
          <Box>
            <Progress value={uploadProgress} size="sm" colorScheme="blue" />
            <Text fontSize="sm" textAlign="center" mt={2}>
              {uploadProgress}% concluído
            </Text>
          </Box>
        )}

        <SelectField
          label="Tipo de Documento"
          options={documentTypes}
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="Selecione o tipo"
          isRequired
        />

        <FormControl isRequired>
          <FormLabel>Título</FormLabel>
          <Input
            placeholder="Digite o título do documento"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Data de Expiração</FormLabel>
          <Input
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
          />
        </FormControl>

        {error && <ErrorMessage description={error} />}

        <Button
          type="submit"
          colorScheme="blue"
          isLoading={isUploading}
          isDisabled={!file || !type || !title}
        >
          Enviar Documento
        </Button>
      </VStack>
    </Box>
  );
} 