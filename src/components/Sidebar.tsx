import { Box, VStack, Icon, Link as ChakraLink, Text } from '@chakra-ui/react';
import { FiHome, FiCheckSquare, FiFile, FiSettings } from 'react-icons/fi';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { label: 'Dashboard', href: '/dashboard', icon: FiHome },
  { label: 'Tarefas', href: '/tasks', icon: FiCheckSquare },
  { label: 'Documentos', href: '/documents', icon: FiFile },
  { label: 'Configurações', href: '/settings', icon: FiSettings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <Box
      as="nav"
      bg="white"
      h="100vh"
      w="64"
      py={8}
      px={4}
      shadow="md"
      position="fixed"
      left={0}
      top={0}
    >
      <VStack spacing={4} align="stretch">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link key={item.href} href={item.href} passHref>
              <ChakraLink
                display="flex"
                alignItems="center"
                px={4}
                py={3}
                borderRadius="md"
                bg={isActive ? 'blue.50' : 'transparent'}
                color={isActive ? 'blue.600' : 'gray.600'}
                _hover={{
                  bg: isActive ? 'blue.50' : 'gray.50',
                  color: isActive ? 'blue.600' : 'gray.800',
                  textDecoration: 'none',
                }}
              >
                <Icon as={item.icon} boxSize={5} mr={3} />
                <Text fontWeight={isActive ? 'medium' : 'normal'}>
                  {item.label}
                </Text>
              </ChakraLink>
            </Link>
          );
        })}
      </VStack>
    </Box>
  );
} 