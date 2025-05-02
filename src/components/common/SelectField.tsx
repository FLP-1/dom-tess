'use client';

import React, { useCallback, useState } from 'react';
import {
  Select,
  SelectProps as ChakraSelectProps,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  useId,
  VisuallyHidden,
} from '@chakra-ui/react';
import { ValidationRule } from '../../utils/validations';
import { BaseSelectProps } from '../../types/common';
import { withAccessibility } from '../../hocs/withAccessibility';

export interface Option {
  value: string | number;
  label: string;
  group?: string;
}

type SelectFieldBaseProps = {
  options: Option[];
  value?: string | number;
  onChange?: (value: string) => void;
  onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLSelectElement>) => void;
  label?: string;
  error?: string;
  helperText?: string;
  validationRules?: ValidationRule[];
  isRequired?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  id?: string;
  name?: string;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  width?: string | number;
};

export type SelectFieldProps = SelectFieldBaseProps & Omit<ChakraSelectProps, keyof SelectFieldBaseProps>;

export const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  (
    {
      value = '',
      options = [],
      onChange,
      onBlur,
      id,
      name,
      placeholder,
      size = 'md',
      width = '100%',
      isDisabled,
      isRequired,
      isLoading,
      label,
      error,
      helperText,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState<string | number>(value);
    const uniqueId = useId();
    const fieldId = id || uniqueId;
    const labelId = `${fieldId}-label`;
    const helperId = `${fieldId}-helper`;
    const errorId = `${fieldId}-error`;

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value;
        setInternalValue(newValue);

        if (onChange) {
          onChange(newValue);
        }
      },
      [onChange]
    );

    const groupedOptions = options.reduce<Record<string, Option[]>>((acc, option) => {
      if (option.group) {
        if (!acc[option.group]) {
          acc[option.group] = [];
        }
        acc[option.group].push(option);
      } else {
        if (!acc.default) {
          acc.default = [];
        }
        acc.default.push(option);
      }
      return acc;
    }, {});

    const accessibleName = label || name || placeholder || 'Campo de seleção';

    return (
      <FormControl
        isInvalid={!!error}
        isRequired={isRequired}
        isDisabled={isDisabled}
        width={width}
      >
        {label && (
          <FormLabel
            id={labelId}
            htmlFor={fieldId}
            mb={1}
          >
            {label}
          </FormLabel>
        )}

        <Select
          as="select"
          ref={ref}
          id={fieldId}
          name={name}
          value={internalValue}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={placeholder}
          size={size}
          width="100%"
          isDisabled={isDisabled || isLoading}
          isRequired={isRequired}
          variant={error ? 'outline' : undefined}
          focusBorderColor={error ? 'red.500' : 'blue.500'}
          errorBorderColor="red.500"
          aria-label={accessibleName}
          aria-labelledby={label ? labelId : undefined}
          aria-describedby={
            [
              helperText ? helperId : null,
              error ? errorId : null
            ].filter(Boolean).join(' ') || undefined
          }
          aria-invalid={!!error}
          data-testid={`select-${name || fieldId}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled={isRequired}>
              {placeholder}
            </option>
          )}
          {Object.entries(groupedOptions).map(([group, groupOptions]) => (
            group === 'default' ? (
              groupOptions.map((option) => (
                <option 
                  key={option.value} 
                  value={option.value}
                >
                  {option.label}
                </option>
              ))
            ) : (
              <optgroup 
                key={group} 
                label={group}
              >
                {groupOptions.map((option) => (
                  <option 
                    key={option.value} 
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </optgroup>
            )
          ))}
        </Select>

        {error && (
          <FormErrorMessage id={errorId}>
            {error}
          </FormErrorMessage>
        )}
        
        {helperText && !error && (
          <FormHelperText id={helperId}>
            {helperText}
          </FormHelperText>
        )}
      </FormControl>
    );
  }
);

SelectField.displayName = 'SelectField';

export const SelectFieldWithAccessibility = withAccessibility(SelectField); 