'use client';

import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Select,
} from '@chakra-ui/react';

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  error?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  name: string;
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  isRequired,
  isDisabled,
  name,
}: SelectFieldProps) {
  return (
    <FormControl isInvalid={!!error} isRequired={isRequired}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        isDisabled={isDisabled}
        placeholder={placeholder}
        aria-label={label}
        title={label}
        variant={error ? 'outline' : undefined}
        focusBorderColor={error ? 'red.500' : 'blue.500'}
        errorBorderColor="red.500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
} 