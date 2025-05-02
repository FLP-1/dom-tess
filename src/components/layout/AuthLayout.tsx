import { Box, Heading, Text, VStack } from '@chakra-ui/react';

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <>
      {children}
    </>
  );
} 