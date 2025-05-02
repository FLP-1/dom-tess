'use client';

import React, { useCallback, useState } from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Select,
  FormHelperText,
  Box,
  SelectProps,
  useId,
} from '@chakra-ui/react';
import { ValidationRule } from '../../utils/validations';
import { BaseSelectProps } from '../../types/common';
import { withAccessibility } from '../../hocs/withAccessibility';

export interface Option {
  value: string | number;
  label: string;
  group?: string;
}

export interface SelectFieldProps extends BaseSelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  validationRules?: ValidationRule<string>[];
  isRequired?: boolean;
  isDisabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  width?: string | number;
  isLoading?: boolean;
}

const BaseSelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
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
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(value);

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

    const groupedOptions = options.reduce((acc, option) => {
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
    }, {} as Record<string, Option[]>);

    return (
      <Select
        ref={ref}
        id={id}
        name={name}
        value={internalValue}
        onChange={handleChange}
        onBlur={(e) => onBlur?.(e.target.value)}
        placeholder={placeholder}
        size={size}
        width={width}
        isDisabled={isDisabled || isLoading}
        isRequired={isRequired}
        variant={props.error ? 'outline' : undefined}
        focusBorderColor={props.error ? 'red.500' : 'blue.500'}
        errorBorderColor="red.500"
        role="combobox"
        title={label || name || placeholder || 'Select field'}
        {...props}
      >
        {Object.entries(groupedOptions).map(([group, groupOptions]) => (
          <optgroup key={group} label={group === 'default' ? undefined : group}>
            {groupOptions.map((option) => (
              <option 
                key={option.value} 
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </optgroup>
        ))}
      </Select>
    );
  }
);

BaseSelectField.displayName = 'BaseSelectField';

export const SelectField = withAccessibility(BaseSelectField); 