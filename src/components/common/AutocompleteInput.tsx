import React, { useCallback, useState, useRef, useEffect } from 'react';
import {
  Input,
  List,
  ListItem,
  Box,
  useOutsideClick,
  Spinner,
} from '@chakra-ui/react';
import { BaseAutocompleteProps } from '../../types/common';
import { withAccessibility } from '../../hocs/withAccessibility';
import { MaskType, maskFunctions } from '../../utils/maskTypes';

export interface AutocompleteInputProps extends BaseAutocompleteProps {
  mask?: MaskType;
}

const BaseAutocompleteInput = React.forwardRef<HTMLInputElement, AutocompleteInputProps>(
  (
    {
      value = '',
      options = [],
      mask,
      onChange,
      onSelect,
      onBlur,
      isLoading,
      minCharsToSearch = 2,
      id,
      name,
      placeholder,
      size,
      width,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(value);
    const [isOpen, setIsOpen] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState(options);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);

    useOutsideClick({
      ref: containerRef,
      handler: () => setIsOpen(false),
    });

    useEffect(() => {
      if (internalValue.length >= minCharsToSearch) {
        const filtered = options.filter(option =>
          option.label.toLowerCase().includes(internalValue.toLowerCase())
        );
        setFilteredOptions(filtered);
        setIsOpen(filtered.length > 0);
      } else {
        setFilteredOptions([]);
        setIsOpen(false);
      }
    }, [internalValue, options, minCharsToSearch, setFilteredOptions, setIsOpen]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = e.target.value;

        if (mask && maskFunctions[mask]) {
          newValue = maskFunctions[mask](newValue);
        }

        setInternalValue(newValue);
        setHighlightedIndex(-1);

        if (onChange) {
          onChange(newValue);
        }
      },
      [mask, onChange]
    );

    const handleSelect = useCallback(
      (option: { value: string; label: string }) => {
        setInternalValue(option.label);
        setIsOpen(false);
        setHighlightedIndex(-1);

        if (onSelect) {
          onSelect(option);
        }
      },
      [onSelect]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen) return;

        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            setHighlightedIndex(prev =>
              prev < filteredOptions.length - 1 ? prev + 1 : prev
            );
            break;
          case 'ArrowUp':
            e.preventDefault();
            setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
            break;
          case 'Enter':
            e.preventDefault();
            if (highlightedIndex >= 0) {
              handleSelect(filteredOptions[highlightedIndex]);
            }
            break;
          case 'Escape':
            e.preventDefault();
            setIsOpen(false);
            setHighlightedIndex(-1);
            break;
        }
      },
      [isOpen, filteredOptions, highlightedIndex, handleSelect]
    );

    return (
      <Box ref={containerRef} position="relative">
        <Input
          ref={ref}
          id={id}
          name={name}
          value={internalValue}
          onChange={handleChange}
          onBlur={() => onBlur?.(internalValue)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          size={size}
          width={width}
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={isOpen ? `${id}-listbox` : undefined}
          aria-activedescendant={
            highlightedIndex >= 0 ? `${id}-option-${highlightedIndex}` : undefined
          }
          {...props}
        />
        
        {isLoading && (
          <Box position="absolute" right="8px" top="50%" transform="translateY(-50%)">
            <Spinner size="sm" />
          </Box>
        )}
        
        {isOpen && (
          <List
            id={`${id}-listbox`}
            position="absolute"
            top="100%"
            left={0}
            right={0}
            mt={1}
            bg="white"
            borderWidth={1}
            borderColor="gray.200"
            borderRadius="md"
            maxH="200px"
            overflowY="auto"
            zIndex={1}
            role="listbox"
          >
            {filteredOptions.map((option, index) => (
              <ListItem
                key={option.value}
                id={`${id}-option-${index}`}
                p={2}
                cursor="pointer"
                bg={highlightedIndex === index ? 'gray.100' : 'transparent'}
                _hover={{ bg: 'gray.100' }}
                onClick={() => handleSelect(option)}
                role="option"
                aria-selected={highlightedIndex === index}
              >
                {option.label}
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    );
  }
);

BaseAutocompleteInput.displayName = 'BaseAutocompleteInput';

export const AutocompleteInput = withAccessibility(BaseAutocompleteInput); 