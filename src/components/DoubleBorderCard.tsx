import { Box } from '@chakra-ui/react';

interface DoubleBorderCardProps {
  children: React.ReactNode;
  maxW?: string;
}

export function DoubleBorderCard({ children, maxW = '500px' }: DoubleBorderCardProps) {
  return (
    <Box
      p={8}
      border="2px solid"
      borderColor="gray.200"
      borderRadius="lg"
      boxShadow="md"
      bg="white"
      display="inline-block"
    >
      <Box
        mx="auto"
        w="100%"
        maxW={maxW}
        p={8}
        borderRadius="lg"
        border="1px solid"
        borderColor="gray.200"
        bg="white"
        textAlign="center"
      >
        {children}
      </Box>
    </Box>
  );
} 