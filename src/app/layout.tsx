'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { AuthenticatedLayout } from '@/components/AuthenticatedLayout';
import { usePathname } from 'next/navigation';
import "./globals.css";

const publicPaths = ['/login', '/register'];

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
          {isPublicPath ? (
            children
          ) : (
            <AuthenticatedLayout>{children}</AuthenticatedLayout>
          )}
        </ChakraProvider>
      </body>
    </html>
  );
}
