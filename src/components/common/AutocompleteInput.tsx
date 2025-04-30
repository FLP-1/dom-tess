import {
  Input,
  InputProps,
  List,
  ListItem,
  Box,
  useOutsideClick,
  Spinner,
} from '@chakra-ui/react';
import { forwardRef, useState, useRef } from 'react';

interface AutocompleteInputProps extends InputProps {
  options: string[];
  onSelect?: (value: string) => void;
  isLoading?: boolean;
}

export const AutocompleteInput = forwardRef<HTMLInputElement, AutocompleteInputProps>(
  ({ options, onSelect, isLoading, onChange, value, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value as string);
    const containerRef = useRef<HTMLDivElement>(null);

    useOutsideClick({
      ref: containerRef,
      handler: () => setIsOpen(false),
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      onChange?.(e);
      setIsOpen(true);
    };

    const handleSelect = (option: string) => {
      setInputValue(option);
      onSelect?.(option);
      setIsOpen(false);
    };

    const filteredOptions = options.filter(option =>
      option.toLowerCase().includes(inputValue.toLowerCase())
    );

    return (
      <Box ref={containerRef} position="relative">
        <Input
          ref={ref}
          value={inputValue}
          onChange={handleChange}
          onFocus={() => setIsOpen(true)}
          {...props}
        />
        
        {isOpen && (filteredOptions.length > 0 || isLoading) && (
          <List
            position="absolute"
            top="100%"
            left={0}
            right={0}
            zIndex={1}
            bg="white"
            border="1px"
            borderColor="gray.200"
            borderRadius="md"
            boxShadow="md"
            maxH="200px"
            overflowY="auto"
            mt={1}
          >
            {isLoading ? (
              <ListItem p={2} display="flex" justifyContent="center">
                <Spinner size="sm" />
              </ListItem>
            ) : (
              filteredOptions.map((option, index) => (
                <ListItem
                  key={index}
                  p={2}
                  cursor="pointer"
                  _hover={{ bg: 'gray.100' }}
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </ListItem>
              ))
            )}
          </List>
        )}
      </Box>
    );
  }
);

AutocompleteInput.displayName = 'AutocompleteInput'; 