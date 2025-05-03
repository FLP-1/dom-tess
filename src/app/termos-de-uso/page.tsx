import { Button } from '@chakra-ui/react';
'use client';
import { Box, Heading, Text, Container, UnorderedList, ListItem, Button } from '@chakra-ui/react';
import { termosDeUso } from '../../constants/legalTexts';
import { useRouter } from 'next/navigation';

export default function TermosDeUsoPage() {
  const router = useRouter();
  return (
    <Container maxW="container.md" py={8}>
      <Button mb={4} variant="outline" onClick={() => router.back()}>
        Voltar
      </Button>
      <Box mb={8}>
        <Heading as="h1" size="xl" mb={2}>
          {termosDeUso.title}
        </Heading>
        <Text color="gray.500" mb={4}>
          {termosDeUso.lastUpdate} {new Date().toLocaleDateString('pt-BR')}
        </Text>
      </Box>
      {termosDeUso.sections.map((section, index) => (
        <Box key={index} mb={6}>
          <Heading as="h2" size="md" mb={2}>
            {section.title}
          </Heading>
          <Text mb={2}>{section.content}</Text>
          {section.items && (
            <UnorderedList mb={2}>
              {section.items.map((item, itemIndex) => (
                <ListItem key={itemIndex}>{item}</ListItem>
              ))}
            </UnorderedList>
          )}
        </Box>
      ))}
    </Container>
  );
} 