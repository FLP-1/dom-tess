import { Container, Box, VStack, Heading, Text } from '@chakra-ui/react';

interface PageContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxContentWidth?: string;
}

export function PageContainer({ 
  title, 
  subtitle, 
  children, 
  maxContentWidth = "500px" 
}: PageContainerProps) {
  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <Heading as="h1" size="2xl" color="brand.blue" mb={4}>
            {title}
          </Heading>
          {subtitle && (
            <Text fontSize="xl" color="brand.gray" mb={8}>
              {subtitle}
            </Text>
          )}
        </Box>

        {/* Content */}
        <Box 
          mx="auto" 
          w="100%" 
          maxW={maxContentWidth}
          p={8} 
          borderRadius="lg" 
          boxShadow="lg"
          bg="white"
        >
          {children}
        </Box>
      </VStack>
    </Container>
  );
} 