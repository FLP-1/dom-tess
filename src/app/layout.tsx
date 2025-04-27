'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { Roboto } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import theme from '@/styles/theme';
import "./globals.css";

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={roboto.className}>
        <ChakraProvider theme={theme}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}
