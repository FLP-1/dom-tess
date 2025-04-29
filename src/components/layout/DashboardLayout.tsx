import React from 'react';
import {
  Box,
  Flex,
  IconButton,
  useColorModeValue,
  Drawer,
  DrawerContent,
  useDisclosure,
  VStack,
  HStack,
  Icon,
  Text,
  Link,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorMode,
} from '@chakra-ui/react';
import {
  FiMenu,
  FiHome,
  FiUsers,
  FiCalendar,
  FiSettings,
  FiLogOut,
  FiSun,
  FiMoon,
  FiCheckSquare,
  FiBarChart2,
} from 'react-icons/fi';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, signOut } = useAuth();
  const router = useRouter();

  const menuItems = [
    { name: 'Dashboard', icon: FiHome, path: '/dashboard' },
    { name: 'Tarefas', icon: FiCheckSquare, path: '/dashboard/tasks' },
    { name: 'Relatórios', icon: FiBarChart2, path: '/dashboard/tasks/reports' },
    { name: 'Configurações de Tarefas', icon: FiSettings, path: '/dashboard/tasks/settings' },
    { name: 'Funcionários', icon: FiUsers, path: '/dashboard/employees' },
    { name: 'Calendário', icon: FiCalendar, path: '/dashboard/calendar' },
    { name: 'Configurações', icon: FiSettings, path: '/dashboard/settings' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent
        onClose={onClose}
        display={{ base: 'none', md: 'block' }}
        menuItems={menuItems}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} menuItems={menuItems} />
        </DrawerContent>
      </Drawer>
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
};

interface SidebarContentProps {
  onClose: () => void;
  menuItems: Array<{
    name: string;
    icon: any;
    path: string;
  }>;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ onClose, menuItems }) => {
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Logo
        </Text>
      </Flex>
      <VStack spacing={4} align="stretch" mt={4}>
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            style={{ textDecoration: 'none' }}
            _focus={{ boxShadow: 'none' }}
          >
            <Flex
              align="center"
              p="4"
              mx="4"
              borderRadius="lg"
              role="group"
              cursor="pointer"
              _hover={{
                bg: 'cyan.400',
                color: 'white',
              }}
              bg={router.pathname === item.path ? 'cyan.400' : 'transparent'}
              color={router.pathname === item.path ? 'white' : 'inherit'}
            >
              <Icon
                mr="4"
                fontSize="16"
                as={item.icon}
                _groupHover={{
                  color: 'white',
                }}
              />
              {item.name}
            </Flex>
          </Link>
        ))}
      </VStack>
    </Box>
  );
};

interface MobileNavProps {
  onOpen: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ onOpen }) => {
  const { user } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <HStack spacing={{ base: '0', md: '6' }}>
        <TaskNotifications />
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="toggle color mode"
          icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
          onClick={toggleColorMode}
        />
        <Flex alignItems="center">
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}
            >
              <HStack>
                <Avatar
                  size="sm"
                  name={user?.displayName || 'Usuário'}
                  src={user?.photoURL || undefined}
                />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">{user?.displayName || 'Usuário'}</Text>
                  <Text fontSize="xs" color="gray.600">
                    {user?.email}
                  </Text>
                </VStack>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
              <MenuItem icon={<FiLogOut />} onClick={handleSignOut}>
                Sair
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
}; 