import { FormControl, FormLabel } from '@chakra-ui/react';
'use client';

import React, { useCallback, useState, forwardRef } from 'react';
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
import { FormSelectProps } from '@/types/form';

export interface Option {
  value: string | number;
  label: string;
  group?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, FormSelectProps>((props, ref) => {
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
    options,
    isClearable,
    isSearchable,
    isMulti,
    closeMenuOnSelect,
    noOptionsMessage,
    loadingMessage,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedby,
    'aria-labelledby': ariaLabelledby,
    title,
    role,
    _placeholder,
    ...rest
  } = props;

  const generatedId = useId();
  const inputId = id || name || generatedId;
  const labelId = `${inputId}-label`;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    if (onBlur) {
      onBlur(e.target.value);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
    if (onFocus) {
      onFocus(e.target.value);
    }
  };

  const renderOptions = () => {
    if (!options) return null;

    const groupedOptions: Record<string, typeof options> = {};
    const ungroupedOptions: typeof options = [];

    options.forEach(option => {
      if (option.group) {
        if (!groupedOptions[option.group]) {
          groupedOptions[option.group] = [];
        }
        groupedOptions[option.group].push(option);
      } else {
        ungroupedOptions.push(option);
      }
    });

    return (
      <>
        {_placeholder && (
          <option value="" disabled>
            {_placeholder}
          </option>
        )}
        {ungroupedOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        {Object.entries(groupedOptions).map(([group, options]) => (
          <optgroup key={group} label={group}>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </optgroup>
        ))}
      </>
    );
  };

  const accessibleName = label || _placeholder || 'Campo de seleção';

  return (
    <FormControl
      isInvalid={!!error}
      isRequired={isRequired}
      isDisabled={isDisabled}
      width={width}
    >
      {label && <FormLabel htmlFor={inputId} id={labelId}>{label}</FormLabel>}
      <Select
        ref={ref}
        id={inputId}
        name={name}
        size={size}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        aria-label={ariaLabel || accessibleName}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        aria-labelledby={ariaLabelledby || labelId}
        aria-invalid={!!error}
        aria-required={isRequired}
        aria-busy={isLoading}
        title={title || accessibleName}
        role={role || 'combobox'}
        aria-expanded="true"
        {...rest}
      >
        {renderOptions()}
      </Select>
      {error && <FormErrorMessage id={errorId}>{error}</FormErrorMessage>}
      {helperText && !error && <FormHelperText id={helperId}>{helperText}</FormHelperText>}
    </FormControl>
  );
});

SelectField.displayName = 'SelectField';

export const SelectFieldWithAccessibility = withAccessibility(SelectField); 