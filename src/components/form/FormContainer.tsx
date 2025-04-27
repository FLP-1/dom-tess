import { Box, VStack } from '@chakra-ui/react';

interface FormContainerProps {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
}

export function FormContainer({ 
  children, 
  onSubmit 
}: FormContainerProps) {
  return (
    <Box 
      as="form" 
      onSubmit={onSubmit}
      width="100%" 
      maxW="400px"
      margin="0 auto"
    >
      <VStack spacing="md">
        {children}
      </VStack>
    </Box>
  );
} 