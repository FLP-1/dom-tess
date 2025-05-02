'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { AuthenticatedLayout } from '@/components/AuthenticatedLayout';
import { usePathname } from 'next/navigation';
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';

const publicPaths = ['/login', '/register', '/forgot-password', '/'];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPublicPath = publicPaths.includes(pathname);

  return (
    <html lang="pt-BR">
      <body>
        <ChakraProvider>
          <AuthProvider>
            {isPublicPath ? (
              children
            ) : (
              <AuthenticatedLayout>{children}</AuthenticatedLayout>
            )}
          </AuthProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}
