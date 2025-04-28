'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Select,
  Flex,
  Button,
  Icon,
  useToast,
  Badge,
  Text,
  Spinner,
  useDisclosure,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { FiSearch, FiDownload, FiEdit, FiTrash, FiEye } from 'react-icons/fi';
import { usePermissions } from '@/hooks/usePermissions';
import { DocumentViewer } from './DocumentViewer';

interface Document {
  id: string;
  name: string;
  uploadDate: Date;
  expirationDate: Date;
  responsible: string;
  accessLevel: string;
  category: string;
  size: number;
  url: string;
}

export function DocumentList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('name');
  const [category, setCategory] = useState('all');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const { canEdit, canDelete, isLoading: isLoadingPermissions } = usePermissions();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents');
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar documentos',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const searchValue = searchTerm.toLowerCase();
    const matchesSearch = doc.name.toLowerCase().includes(searchValue) ||
      doc.responsible.toLowerCase().includes(searchValue) ||
      doc.uploadDate.toISOString().includes(searchValue);

    const matchesCategory = category === 'all' || doc.category === category;

    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (documentId: string) => {
    try {
      const response = await fetch(`/api/documents?id=${documentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir documento');
      }

      setDocuments(documents.filter(doc => doc.id !== documentId));
      toast({
        title: 'Sucesso',
        description: 'Documento excluído com sucesso',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir documento',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading || isLoadingPermissions) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="200px">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box>
      <Flex mb={4} gap={4} flexWrap="wrap">
        <Input
          placeholder="Pesquisar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          maxW="300px"
        />
        <FormControl>
          <FormLabel id="label-filtro" htmlFor="filtro">Filtrar por</FormLabel>
          <Select
            id="filtro"
            aria-labelledby="label-filtro"
            aria-label="Filtrar por"
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            maxW="200px"
          >
            <option value="name">Nome</option>
            <option value="responsible">Responsável</option>
            <option value="date">Data</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel id="label-categoria" htmlFor="categoria">Categoria</FormLabel>
          <Select
            id="categoria"
            aria-labelledby="label-categoria"
            aria-label="Categoria"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            maxW="200px"
          >
            <option value="all">Todas as categorias</option>
            <option value="contrato">Contratos</option>
            <option value="fiscal">Documentos Fiscais</option>
            <option value="rh">RH</option>
            <option value="outros">Outros</option>
          </Select>
        </FormControl>
      </Flex>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Nome do Documento</Th>
              <Th>Tamanho</Th>
              <Th>Data de Upload</Th>
              <Th>Data de Validade</Th>
              <Th>Responsável</Th>
              <Th>Categoria</Th>
              <Th>Acesso</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredDocuments.map((doc) => (
              <Tr key={doc.id}>
                <Td>{doc.name}</Td>
                <Td>{formatFileSize(doc.size)}</Td>
                <Td>{new Date(doc.uploadDate).toLocaleDateString()}</Td>
                <Td>{new Date(doc.expirationDate).toLocaleDateString()}</Td>
                <Td>{doc.responsible}</Td>
                <Td>
                  <Badge colorScheme="purple">{doc.category}</Badge>
                </Td>
                <Td>
                  <Badge
                    colorScheme={
                      doc.accessLevel === 'all'
                        ? 'green'
                        : doc.accessLevel === 'admin'
                        ? 'blue'
                        : 'purple'
                    }
                  >
                    {doc.accessLevel === 'all'
                      ? 'Todos'
                      : doc.accessLevel === 'admin'
                      ? 'Administradores'
                      : 'Específico'}
                  </Badge>
                </Td>
                <Td>
                  <Flex gap={2}>
                    <DocumentViewer documentUrl={doc.url} documentName={doc.name} />
                    <Button
                      size="sm"
                      colorScheme="blue"
                      leftIcon={<Icon as={FiDownload} />}
                      onClick={() => window.open(doc.url, '_blank')}
                    >
                      Download
                    </Button>
                    {canEdit && (
                      <Button
                        size="sm"
                        colorScheme="yellow"
                        leftIcon={<Icon as={FiEdit} />}
                      >
                        Editar
                      </Button>
                    )}
                    {canDelete && (
                      <Button
                        size="sm"
                        colorScheme="red"
                        leftIcon={<Icon as={FiTrash} />}
                        onClick={() => handleDelete(doc.id)}
                      >
                        Excluir
                      </Button>
                    )}
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
} 