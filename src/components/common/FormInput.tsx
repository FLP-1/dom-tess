import React, { useCallback, useState } from 'react';
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react';
import { BaseInputProps } from '../../types/common';
import { withAccessibility } from '../../hocs/withAccessibility';
import { Input, InputProps, FormControl, FormLabel, FormErrorMessage, FormHelperText, Select, Box } from '@chakra-ui/react';
import { useEffect, useId } from 'react';
import { formatCPF, formatCNPJ, formatPhone, formatCEP, formatCurrency, formatDate } from '../../utils/masks';

export interface FormInputProps extends BaseInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  touched?: boolean;
  validate?: (value: string) => string | undefined;
  onChange?: (value: string) => void;
  mask?: 'cpf' | 'cnpj' | 'phone' | 'cep' | 'currency' | 'date';
  as?: typeof Input | typeof Select;
  children?: React.ReactNode;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  isRequired?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
}

const BaseFormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      value = '',
      onChange,
      onBlur,
      id,
      name,
      placeholder,
      size,
      width,
      isDisabled,
      isRequired,
      isLoading,
      leftElement,
      rightElement,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(value);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInternalValue(newValue);

        if (onChange) {
          onChange(newValue);
        }
      },
      [onChange]
    );

    const inputProps = {
      ref,
      id,
      name,
      value: internalValue,
      onChange: handleChange,
      onBlur: (e: React.FocusEvent<HTMLInputElement>) => onBlur?.(e.target.value),
      placeholder,
      size,
      width,
      isDisabled,
      isRequired,
      isInvalid: !!props.error,
      ...props
    };

    if (leftElement || rightElement) {
      return (
        <InputGroup size={size}>
          {leftElement && <InputLeftElement>{leftElement}</InputLeftElement>}
          <Input {...inputProps} />
          {rightElement && <InputRightElement>{rightElement}</InputRightElement>}
        </InputGroup>
      );
    }

    return <Input {...inputProps} />;
  }
);

BaseFormInput.displayName = 'BaseFormInput';

export const FormInput = withAccessibility(BaseFormInput);

export const FormInputOld = ({
  label,
  error,
  helperText,
  touched,
  validate,
  onChange,
  mask,
  value,
  as: Component = Input,
  id,
  name,
  children,
  leftElement,
  rightElement,
  isRequired,
  isDisabled,
  isLoading,
  ...props
}: FormInputProps) => {
  const [displayValue, setDisplayValue] = useState<string>('');
  const [localError, setLocalError] = useState<string | undefined>(error);
  const generatedId = useId();
  const inputId = id || name || generatedId;
  const labelId = `${inputId}-label`;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const formatValue = useCallback((value: string): string => {
    if (!mask) return value;
    
    switch (mask) {
      case 'cpf':
        return formatCPF(value);
      case 'cnpj':
        return formatCNPJ(value);
      case 'phone':
        return formatPhone(value);
      case 'cep':
        return formatCEP(value);
      case 'currency':
        return formatCurrency(value);
      case 'date':
        return formatDate(value);
      default:
        return value;
    }
  }, [mask]);

  useEffect(() => {
    if (value !== undefined) {
      const formattedValue = formatValue(value.toString());
      setDisplayValue(formattedValue);
    }
  }, [value, formatValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newValue = e.target.value;
    const formattedValue = formatValue(newValue);
    setDisplayValue(formattedValue);

    if (validate) {
      const validationError = validate(formattedValue);
      setLocalError(validationError);
    }

    if (onChange) {
      onChange(formattedValue);
    }
  };

  const renderInput = () => {
    const inputProps = {
      id: inputId,
      name,
      value: displayValue,
      onChange: handleChange,
      'aria-labelledby': labelId,
      'aria-describedby': error ? errorId : helperText ? helperId : undefined,
      'aria-invalid': touched && !!localError,
      'aria-required': isRequired,
      'aria-busy': isLoading,
      role: Component === Select ? 'combobox' : 'textbox',
      'aria-expanded': Component === Select ? 'true' : undefined,
      isDisabled: isDisabled || isLoading,
      ...props
    };

    if (leftElement || rightElement) {
      return (
        <InputGroup>
          {leftElement && <InputLeftElement>{leftElement}</InputLeftElement>}
          <Component {...inputProps}>
            {children}
          </Component>
          {rightElement && <InputRightElement>{rightElement}</InputRightElement>}
        </InputGroup>
      );
    }

    return (
      <Component {...inputProps}>
        {children}
      </Component>
    );
  };

  return (
    <FormControl 
      isInvalid={touched && !!localError}
      isRequired={isRequired}
      isDisabled={isDisabled}
      role="group"
      aria-labelledby={label ? labelId : undefined}
    >
      {label && (
        <FormLabel 
          id={labelId}
          htmlFor={inputId}
          mb={1}
        >
          {label}
          {isRequired && (
            <Box as="span" color="red.500" ml={1} aria-hidden="true">
              *
            </Box>
          )}
        </FormLabel>
      )}
      {renderInput()}
      {touched && localError && (
        <FormErrorMessage 
          id={errorId}
          role="alert"
        >
          {localError}
        </FormErrorMessage>
      )}
      {helperText && !localError && (
        <FormHelperText id={helperId}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
}; 