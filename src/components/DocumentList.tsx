import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Link,
  Text,
  Spinner,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  Select,
  Flex,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  FormControl,
  FormLabel
} from '@chakra-ui/react';
import { FiDownload, FiTrash2, FiEye, FiChevronDown, FiSearch, FiFilter } from 'react-icons/fi';
import { useDocuments } from '@/hooks/useDocuments';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ErrorMessage } from './ErrorMessage';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';
import { DocumentViewer } from './DocumentViewer';
import { useState, useMemo } from 'react';
import { Document } from '@/types';
import { SelectField } from './SelectField';

interface DocumentListProps {
  userId: string;
}

type SortField = 'title' | 'type' | 'uploadedAt' | 'expiresAt';
type SortOrder = 'asc' | 'desc';

const documentTypes = [
  { value: 'contrato', label: 'Contrato' },
  { value: 'rg', label: 'Documento de Identidade' },
  { value: 'cpf', label: 'CPF' },
  { value: 'atestado', label: 'Atestado Médico' },
  { value: 'outro', label: 'Outro' }
];

export function DocumentList({ userId }: DocumentListProps) {
  const { documents, loading, error, deleteDocument } = useDocuments(userId);
  const toast = useToast();
  const { isOpen: isDeleteDialogOpen, onOpen: onDeleteDialogOpen, onClose: onDeleteDialogClose } = useDisclosure();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('uploadedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const handleDeleteClick = (document: Document) => {
    setSelectedDocument(document);
    onDeleteDialogOpen();
  };

  const handleViewClick = (document: Document) => {
    setSelectedDocument(document);
    onOpen();
  };

  const handleDeleteConfirm = async () => {
    if (selectedDocument) {
      await deleteDocument(selectedDocument.id);
      toast({
        title: 'Documento excluído com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
    onDeleteDialogClose();
  };

  const filteredAndSortedDocuments = useMemo(() => {
    let result = [...documents];

    // Aplicar filtro de busca
    if (searchTerm) {
      result = result.filter(doc => 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar filtro de tipo
    if (selectedType) {
      result = result.filter(doc => doc.type === selectedType);
    }

    // Aplicar ordenação
    result.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (sortField === 'uploadedAt' || sortField === 'expiresAt') {
        return sortOrder === 'asc' 
          ? new Date(aValue).getTime() - new Date(bValue).getTime()
          : new Date(bValue).getTime() - new Date(aValue).getTime();
      }
      
      return sortOrder === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

    return result;
  }, [documents, searchTerm, selectedType, sortField, sortOrder]);

  const paginatedDocuments = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredAndSortedDocuments.slice(start, start + pageSize);
  }, [filteredAndSortedDocuments, page]);

  const totalPages = Math.ceil(filteredAndSortedDocuments.length / pageSize);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <Spinner />
      </Box>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        title="Erro ao carregar documentos"
        description="Não foi possível carregar a lista de documentos. Por favor, tente novamente mais tarde."
      />
    );
  }

  if (documents.length === 0) {
    return (
      <Box p={4} textAlign="center">
        <Text>Nenhum documento encontrado</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Flex mb={4} gap={4} flexWrap="wrap">
        <Input
          placeholder="Buscar por título..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          maxW="300px"
          leftElement={<Icon as={FiSearch} color="gray.500" />}
        />
        
        <SelectField
          label="Filtrar por tipo"
          options={documentTypes}
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          placeholder="Filtrar por tipo"
          formControlProps={{ maxW: "200px" }}
        />

        <Menu>
          <MenuButton as={Button} rightIcon={<FiChevronDown />}>
            Ordenar por
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => handleSort('title')}>
              Título {sortField === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
            </MenuItem>
            <MenuItem onClick={() => handleSort('type')}>
              Tipo {sortField === 'type' && (sortOrder === 'asc' ? '↑' : '↓')}
            </MenuItem>
            <MenuItem onClick={() => handleSort('uploadedAt')}>
              Data de Upload {sortField === 'uploadedAt' && (sortOrder === 'asc' ? '↑' : '↓')}
            </MenuItem>
            <MenuItem onClick={() => handleSort('expiresAt')}>
              Data de Expiração {sortField === 'expiresAt' && (sortOrder === 'asc' ? '↑' : '↓')}
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Título</Th>
              <Th>Tipo</Th>
              <Th>Data de Upload</Th>
              <Th>Data de Expiração</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedDocuments.map((doc) => (
              <Tr key={doc.id}>
                <Td>{doc.title}</Td>
                <Td>{doc.type}</Td>
                <Td>
                  {format(doc.uploadedAt, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </Td>
                <Td>
                  {doc.expiresAt
                    ? format(doc.expiresAt, 'dd/MM/yyyy', { locale: ptBR })
                    : '-'}
                </Td>
                <Td>
                  <IconButton
                    aria-label="Visualizar documento"
                    icon={<FiEye />}
                    size="sm"
                    mr={2}
                    onClick={() => handleViewClick(doc)}
                  />
                  <Link href={doc.url} isExternal>
                    <IconButton
                      aria-label="Download documento"
                      icon={<FiDownload />}
                      size="sm"
                      mr={2}
                    />
                  </Link>
                  <IconButton
                    aria-label="Excluir documento"
                    icon={<FiTrash2 />}
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleDeleteClick(doc)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {totalPages > 1 && (
        <Flex justify="center" mt={4}>
          <HStack spacing={2}>
            <Button
              onClick={() => setPage(1)}
              isDisabled={page === 1}
            >
              Primeira
            </Button>
            <Button
              onClick={() => setPage(page - 1)}
              isDisabled={page === 1}
            >
              Anterior
            </Button>
            <Text>
              Página {page} de {totalPages}
            </Text>
            <Button
              onClick={() => setPage(page + 1)}
              isDisabled={page === totalPages}
            >
              Próxima
            </Button>
            <Button
              onClick={() => setPage(totalPages)}
              isDisabled={page === totalPages}
            >
              Última
            </Button>
          </HStack>
        </Flex>
      )}

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={onDeleteDialogClose}
        onConfirm={handleDeleteConfirm}
        title="Excluir Documento"
        description="Tem certeza que deseja excluir este documento? Esta ação não pode ser desfeita."
      />

      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody pb={6}>
            {selectedDocument && <DocumentViewer document={selectedDocument} />}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
} 