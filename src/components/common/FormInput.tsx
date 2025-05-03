import { FormControl, FormLabel } from '@chakra-ui/react';
import React, { useCallback, useState, useEffect, useId, forwardRef } from 'react';
import {
  Input,
  InputProps,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Select,
  Box,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react';
import { BaseInputProps } from '../../types/common';
import { withAccessibility } from '../../hocs/withAccessibility';
import { formatCPF, formatCNPJ, formatPhone, formatCEP, formatCurrency, formatDate } from '../../utils/masks';
import { MaskType } from '@/utils/maskTypes';
import { FormInputProps } from '@/types/form';

const BaseFormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      value = '',
      onChange,
      onBlur,
      id,
      name,
      _placeholder,
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
    const stringValue = value instanceof Date ? value.toISOString().split('T')[0] : value?.toString() || '';
    const [internalValue, setInternalValue] = useState(stringValue);

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
      _placeholder,
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

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>((props, ref) => {
  const {
    label,
    error,
    helperText,
    isRequired,
    isDisabled,
    isLoading,
    id,
    name,
    width,
    size = 'md',
    value,
    onChange,
    onBlur,
    onFocus,
    onKeyDown,
    onKeyUp,
    onKeyPress,
    maxLength,
    minLength,
    pattern,
    readOnly,
    autoComplete,
    autoFocus,
    inputMode,
    mask,
    maskChar,
    alwaysShowMask,
    beforeMaskedStateChange,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedby,
    'aria-labelledby': ariaLabelledby,
    title,
    role,
    _placeholder,
    ...rest
  } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (onBlur) {
      onBlur(e.target.value);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (onFocus) {
      onFocus(e.target.value);
    }
  };

  return (
    <FormControl
      isInvalid={!!error}
      isRequired={isRequired}
      isDisabled={isDisabled}
      width={width}
    >
      {label && <FormLabel htmlFor={id}>{label}</FormLabel>}
      <Input
        ref={ref}
        id={id}
        name={name}
        size={size}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onKeyPress={onKeyPress}
        maxLength={maxLength}
        minLength={minLength}
        pattern={pattern}
        readOnly={readOnly}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        inputMode={inputMode}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedby}
        aria-labelledby={ariaLabelledby}
        title={title}
        role={role}
        placeholder={_placeholder}
        {...rest}
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
      {helperText && !error && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
});

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
  }, [value, formatValue, setDisplayValue]);

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

    return <Component {...inputProps}>{children}</Component>;
  };

  return (
    <FormControl
      isInvalid={touched && !!localError}
      isRequired={isRequired}
      isDisabled={isDisabled}
    >
      {label && (
        <FormLabel htmlFor={inputId} id={labelId}>
          {label}
        </FormLabel>
      )}
      {renderInput()}
      {touched && localError && (
        <FormErrorMessage id={errorId}>{localError}</FormErrorMessage>
      )}
      {helperText && !localError && (
        <FormHelperText id={helperId}>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
}; 