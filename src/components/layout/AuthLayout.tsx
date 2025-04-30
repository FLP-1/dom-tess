import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import { DoubleBorderCard } from '@/components/DoubleBorderCard';

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" minH="100vh" bg="gray.50">
      <DoubleBorderCard>
        <VStack spacing={4}>
          <Heading as="h1" size="2xl" color="brand.blue" mb={2} textAlign="center">
            DOM
          </Heading>
          <Text fontSize="lg" color="gray.600" textAlign="center">
            {title}
          </Text>
          {subtitle && (
            <Text fontSize="md" color="gray.500" textAlign="center">
              {subtitle}
            </Text>
          )}
          {children}
        </VStack>
      </DoubleBorderCard>
    </Box>
  );
} 