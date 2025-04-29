'use client';

import { Box, Container, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { RegistroPonto } from '@/components/ponto/RegistroPonto';
import { HorarioTrabalho } from '@/components/ponto/HorarioTrabalho';
import { RelatoriosPonto } from '@/components/ponto/RelatoriosPonto';
import { NotificacoesLista } from '@/components/notificacoes/NotificacoesLista';
import { useAuth } from '@/contexts/AuthContext';

export default function PontoPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Box bg="white" borderRadius="lg" boxShadow="md" p={6}>
        <Tabs variant="enclosed">
          <TabList>
            <Tab>Registro de Ponto</Tab>
            <Tab>Horários de Trabalho</Tab>
            <Tab>Relatórios</Tab>
            <Tab>Notificações</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <RegistroPonto userId={user.uid} />
            </TabPanel>
            <TabPanel>
              <HorarioTrabalho userId={user.uid} />
            </TabPanel>
            <TabPanel>
              <RelatoriosPonto userId={user.uid} />
            </TabPanel>
            <TabPanel>
              <NotificacoesLista userId={user.uid} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
} 