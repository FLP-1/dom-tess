'use client';

import { Box } from '@chakra-ui/react';
import { Sidebar } from './Sidebar';
import { LoadingSpinner } from './LoadingSpinner';
import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
if (!loading && !user) {
      router.push('/login');
    }
}, [loading, user, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return (
    <Box display="flex">
      <Sidebar />
      <Box
        as="main"
        flex={1}
        ml="64"
        minH="100vh"
        bg="gray.50"
      >
        {children}
      </Box>
    </Box>
  );
} 