import { Box, Flex, VStack, Heading, Text } from '@chakra-ui/react';
import { FiHome, FiTool, FiShoppingCart, FiFileText, FiMessageCircle, FiCheckSquare, FiUserPlus, FiUsers } from 'react-icons/fi';
import Link from 'next/link';

const menuItems = [
  { icon: FiHome, label: 'Dashboard', href: '/dashboard' },
  { icon: FiCheckSquare, label: 'Tarefas', href: '/dashboard/tasks' },
  { icon: FiShoppingCart, label: 'Compras', href: '/dashboard/compras' },
  { icon: FiUserPlus, label: 'Cadastrar Empregado', href: '/dashboard/register-employee' },
  { icon: FiUsers, label: 'Cadastrar Familiar', href: '/dashboard/register-family' },
  { icon: FiTool, label: 'Massa de Teste', href: '/devtools/massa-teste' },
  { icon: FiFileText, label: 'Documentos', href: '/documents' },
  { icon: FiMessageCircle, label: 'Comunicação', href: '/communication' },
  // Adicione mais itens conforme necessário
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Menu fixo para desktop, expansível para mobile (pode ser melhorado depois)
  return (
    <Flex minH="100vh">
      {/* Sidebar */}
      <Box
        bg="blue.700"
        color="white"
        w={{ base: '60px', md: '220px' }}
        p={4}
        minH="100vh"
      >
        <VStack spacing={6} align="stretch">
          <Heading size="md" textAlign="center">DOM</Heading>
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} passHref legacyBehavior>
              <Box as="a" textDecoration="none">
                <Flex
                  align="center"
                  p={2}
                  borderRadius="md"
                  _hover={{ bg: 'blue.600' }}
                  gap={3}
                  justifyContent={{ base: 'center', md: 'flex-start' }}
                >
                  <item.icon size={22} />
                  <Text display={{ base: 'none', md: 'block' }}>{item.label}</Text>
                </Flex>
              </Box>
            </Link>
          ))}
        </VStack>
      </Box>
      {/* Main Content */}
      <Box flex={1} bg="gray.50">
        <Box p={6}>{children}</Box>
      </Box>
    </Flex>
  );
} 