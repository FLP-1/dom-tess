'use client';

import { Box, Container, Heading, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { DocumentUpload } from '@/components/DocumentUpload';
import { DocumentList } from '@/components/DocumentList';
import { useAuth } from '@/hooks/useAuth';

export default function DocumentsPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <Container maxW="container.lg" py={8}>
      <Heading mb={8}>Gerenciamento de Documentos</Heading>
      
      <Tabs>
        <TabList>
          <Tab>Upload de Documento</Tab>
          <Tab>Meus Documentos</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Box bg="white" p={6} borderRadius="md" shadow="sm">
              <DocumentUpload userId={user.id} />
            </Box>
          </TabPanel>
          
          <TabPanel>
            <Box bg="white" p={6} borderRadius="md" shadow="sm">
              <DocumentList userId={user.id} />
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
} 