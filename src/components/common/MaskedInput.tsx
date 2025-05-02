import React, { useCallback, useState } from 'react';
import { Input } from '@chakra-ui/react';
import { BaseMaskedInputProps } from '../../types/common';
import { withAccessibility } from '../../hocs/withAccessibility';
import { MaskType, maskFunctions } from '../../utils/maskTypes';

export interface MaskedInputProps extends BaseMaskedInputProps {
  mask?: MaskType;
}

const BaseMaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  (
    {
      value = '',
      onChange,
      onBlur,
      mask,
      id,
      name,
      placeholder,
      size,
      width,
      isDisabled,
      isRequired,
      isLoading,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(value);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = e.target.value;

        if (mask && maskFunctions[mask]) {
          newValue = maskFunctions[mask](newValue);
        }

        setInternalValue(newValue);

        if (onChange) {
          onChange(newValue);
        }
      },
      [mask, onChange]
    );

    return (
      <Input
        ref={ref}
        id={id}
        name={name}
        value={internalValue}
        onChange={handleChange}
        onBlur={(e) => onBlur?.(e.target.value)}
        placeholder={placeholder}
        size={size}
        width={width}
        isDisabled={isDisabled}
        isRequired={isRequired}
        isInvalid={!!props.error}
        {...props}
      />
    );
  }
);

BaseMaskedInput.displayName = 'BaseMaskedInput';

export const MaskedInput = withAccessibility(BaseMaskedInput);

// Funções de máscara comuns
export const masks = {
  cep: (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  },
  
  phone: (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  },
  
  cpf: (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  },
  
  rg: (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
    if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}-${numbers.slice(8, 9)}`;
  },
  
  pis: (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 8) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 10) return `${numbers.slice(0, 3)}.${numbers.slice(3, 8)}.${numbers.slice(8)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 8)}.${numbers.slice(8, 10)}-${numbers.slice(10, 11)}`;
  }
}; 