'use client';

import { Box, Container } from '@chakra-ui/react';
import { Navbar } from '@/components/layout/Navbar';

export default function EmpregadosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box>
      <Navbar />
      <Container maxW="container.xl" py={8}>
        {children}
      </Container>
    </Box>
  );
} 