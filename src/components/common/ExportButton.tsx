import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  Text,
  Progress,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import { FaFileExport } from 'react-icons/fa';
import { useState } from 'react';

interface ExportButtonProps {
  onExport: (format: 'csv' | 'pdf' | 'xlsx') => Promise<void>;
  isLoading?: boolean;
  'aria-label'?: string;
}

export function ExportButton({ onExport, isLoading, 'aria-label': ariaLabel }: ExportButtonProps) {
  const [progresso, setProgresso] = useState(0);
  const toast = useToast();

  const handleExport = async (format: 'csv' | 'pdf' | 'xlsx') => {
    try {
      await onExport(format);
      setProgresso(0);
    } catch (error) {
      toast({
        title: 'Erro na exportação',
        description: 'Ocorreu um erro ao exportar os dados. Por favor, tente novamente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Menu>
      <Tooltip label="Exportar dados" hasArrow>
        <MenuButton
          as={Button}
          leftIcon={<Icon as={FaFileExport} />}
          isLoading={isLoading}
          loadingText="Exportando..."
          aria-label={ariaLabel || 'Exportar dados'}
          variant="outline"
          colorScheme="blue"
          size="sm"
        >
          Exportar
        </MenuButton>
      </Tooltip>
      <MenuList>
        <MenuItem
          onClick={() => handleExport('csv')}
          aria-label="Exportar para CSV"
          isDisabled={isLoading}
        >
          <Text>CSV</Text>
        </MenuItem>
        <MenuItem
          onClick={() => handleExport('pdf')}
          aria-label="Exportar para PDF"
          isDisabled={isLoading}
        >
          <Text>PDF</Text>
        </MenuItem>
        <MenuItem
          onClick={() => handleExport('xlsx')}
          aria-label="Exportar para Excel"
          isDisabled={isLoading}
        >
          <Text>Excel</Text>
        </MenuItem>
      </MenuList>
      {isLoading && (
        <Progress
          value={progresso}
          size="xs"
          colorScheme="blue"
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          borderRadius="md"
        />
      )}
    </Menu>
  );
} 