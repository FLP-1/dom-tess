'use client';

import {
  Box,
  Flex,
  Icon,
  Link,
  Text,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import { FaHome, FaClock, FaUser, FaChartBar, FaBell } from 'react-icons/fa';
import { NotificacoesBadge } from '../notificacoes/NotificacoesBadge';
import { useAuth } from '@/contexts/AuthContext';

interface MenuItemProps {
  href: string;
  icon: any;
  children: React.ReactNode;
}

function MenuItem({ href, icon, children }: MenuItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const bgColor = useColorModeValue('gray.100', 'gray.700');

  return (
    <Link
      href={href}
      display="flex"
      alignItems="center"
      p={3}
      borderRadius="md"
      bg={isActive ? bgColor : 'transparent'}
      _hover={{ bg: bgColor }}
    >
      <Icon as={icon} mr={3} />
      <Text>{children}</Text>
    </Link>
  );
}

export function Menu() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <Box
      as="nav"
      position="fixed"
      left={0}
      top={0}
      bottom={0}
      width="250px"
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow="md"
      p={4}
    >
      <Flex direction="column" height="100%">
        <Box mb={8}>
          <Text fontSize="xl" fontWeight="bold" color="brand.blue">
            DOM
          </Text>
        </Box>

        <Flex direction="column" flex={1}>
          <MenuItem href="/dashboard" icon={FaHome}>
            Dashboard
          </MenuItem>
          <MenuItem href="/ponto" icon={FaClock}>
            Ponto Eletrônico
          </MenuItem>
          <MenuItem href="/funcionarios" icon={FaUser}>
            Funcionários
          </MenuItem>
          <MenuItem href="/relatorios" icon={FaChartBar}>
            Relatórios
          </MenuItem>
        </Flex>

        <HStack spacing={4} align="center">
          <NotificacoesBadge userId={user.uid} />
          <Text fontSize="sm" color="gray.500">
            {user.email}
          </Text>
        </HStack>
      </Flex>
    </Box>
  );
} 