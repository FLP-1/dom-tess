'use client';

import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  Text,
  useDisclosure,
  Spinner,
} from '@chakra-ui/react';

interface DocumentViewerProps {
  documentUrl: string;
  documentName: string;
}

export function DocumentViewer({ documentUrl, documentName }: DocumentViewerProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(true);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = documentUrl;
    link.download = documentName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="blue" size="sm">
        Visualizar
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text>{documentName}</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isLoading && (
              <Box display="flex" justifyContent="center" alignItems="center" h="100%">
                <Spinner size="xl" />
              </Box>
            )}
            <Box
              as="iframe"
              src={documentUrl}
              width="100%"
              height="100%"
              minH="80vh"
              onLoad={() => setIsLoading(false)}
              display={isLoading ? 'none' : 'block'}
            />
          </ModalBody>
          <Box p={4} display="flex" justifyContent="flex-end">
            <Button onClick={handleDownload} colorScheme="blue" mr={2}>
              Download
            </Button>
            <Button onClick={onClose}>Fechar</Button>
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
} 