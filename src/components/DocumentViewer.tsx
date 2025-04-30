import {
  Box,
  Image,
  Link,
  Button,
  VStack,
  Text,
  Flex,
  IconButton,
  useToast,
  Tooltip
} from '@chakra-ui/react';
import { FiDownload, FiZoomIn, FiZoomOut, FiRotateCw, FiRotateCcw } from 'react-icons/fi';
import { Document } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';

interface DocumentViewerProps {
  document: Document;
}

export function DocumentViewer({ document }: DocumentViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const toast = useToast();

  const isImage = document.type === 'image/jpeg' || document.type === 'image/png';
  const isPdf = document.type === 'application/pdf';

  const handleZoomIn = () => {
    if (zoom < 3) {
      setZoom(zoom + 0.1);
    } else {
      toast({
        title: 'Zoom máximo atingido',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleZoomOut = () => {
    if (zoom > 0.5) {
      setZoom(zoom - 0.1);
    } else {
      toast({
        title: 'Zoom mínimo atingido',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleRotate = (direction: 'cw' | 'ccw') => {
    setRotation(rotation + (direction === 'cw' ? 90 : -90));
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
  };

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <Flex justify="space-between" align="center">
          <Text fontSize="lg" fontWeight="bold">
            {document.title}
          </Text>
          <Flex gap={2}>
            {(isImage || isPdf) && (
              <>
                <Tooltip label="Zoom In">
                  <IconButton
                    aria-label="Zoom in"
                    icon={<FiZoomIn />}
                    onClick={handleZoomIn}
                  />
                </Tooltip>
                <Tooltip label="Zoom Out">
                  <IconButton
                    aria-label="Zoom out"
                    icon={<FiZoomOut />}
                    onClick={handleZoomOut}
                  />
                </Tooltip>
                <Tooltip label="Rotacionar Horário">
                  <IconButton
                    aria-label="Rotacionar horário"
                    icon={<FiRotateCw />}
                    onClick={() => handleRotate('cw')}
                  />
                </Tooltip>
                <Tooltip label="Rotacionar Anti-horário">
                  <IconButton
                    aria-label="Rotacionar anti-horário"
                    icon={<FiRotateCcw />}
                    onClick={() => handleRotate('ccw')}
                  />
                </Tooltip>
                <Button
                  size="sm"
                  onClick={handleReset}
                >
                  Resetar
                </Button>
              </>
            )}
            <Link href={document.url} isExternal>
              <Button
                leftIcon={<FiDownload />}
                colorScheme="blue"
                size="sm"
              >
                Download
              </Button>
            </Link>
          </Flex>
        </Flex>

        <Text color="gray.500">
          Tipo: {document.type} | 
          Upload: {format(document.uploadedAt, 'dd/MM/yyyy HH:mm', { locale: ptBR })} | 
          {document.expiresAt && ` Expira: ${format(document.expiresAt, 'dd/MM/yyyy', { locale: ptBR })}`}
        </Text>

        <Box
          borderWidth="1px"
          borderRadius="md"
          p={4}
          bg="gray.50"
          minH="500px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          overflow="auto"
        >
          {isImage ? (
            <Image
              src={document.url}
              alt={document.title}
              maxH="500px"
              objectFit="contain"
              transform={`scale(${zoom}) rotate(${rotation}deg)`}
              transition="transform 0.2s"
            />
          ) : isPdf ? (
            <Box
              as="iframe"
              src={document.url}
              width="100%"
              height="500px"
              title={document.title}
              transform={`rotate(${rotation}deg)`}
              transition="transform 0.2s"
            />
          ) : (
            <Box
              as="a"
              href={document.url}
              target="_blank"
              rel="noopener noreferrer"
              display="block"
              p={4}
              borderWidth="1px"
              borderRadius="md"
              _hover={{ bg: 'gray.100' }}
            >
              <Text>Clique para baixar o documento</Text>
            </Box>
          )}
        </Box>
      </VStack>
    </Box>
  );
} 