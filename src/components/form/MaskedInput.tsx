import { Input, InputProps, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

interface MaskedInputProps extends InputProps {
  label?: string;
  error?: string;
  mask: (value: string) => string;
  validate?: (value: string) => boolean;
}

export function MaskedInput({ label, error, mask, validate, value, onChange, ...props }: MaskedInputProps) {
  const [displayValue, setDisplayValue] = useState(value as string);

  useEffect(() => {
    if (value) {
      setDisplayValue(mask(value as string));
    }
  }, [value, mask, setDisplayValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setDisplayValue(newValue);
    
    if (onChange) {
      const event = {
        ...e,
        target: {
          ...e.target,
          value: newValue.replace(/\D/g, '')
        }
      };
      onChange(event);
    }
  };

  return (
    <FormControl isInvalid={!!error}>
      {label && <FormLabel>{label}</FormLabel>}
      <Input
        value={displayValue}
        onChange={handleChange}
        {...props}
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
} 