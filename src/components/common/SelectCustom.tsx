import { Select as ChakraSelect, SelectProps, FormControl, FormLabel, FormErrorMessage, FormHelperText, useId } from '@chakra-ui/react';
import { forwardRef } from 'react';

export interface Option {
  value: string | number;
  label: string;
  group?: string;
}

export interface SelectCustomProps extends Omit<SelectProps, 'children'> {
  options: Option[];
  label?: string;
  error?: string;
  helperText?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  width?: string | number;
  isInvalid?: boolean;
}

export const SelectCustom = forwardRef<HTMLSelectElement, SelectCustomProps>((props, ref) => {
  const {
    options,
    label,
    error,
    helperText,
    isRequired,
    isDisabled,
    isLoading,
    width = '100%',
    isInvalid,
    ...selectProps
  } = props;

  const uniqueId = useId();
  const fieldId = selectProps.id || uniqueId;
  const labelId = `${fieldId}-label`;
  const helperId = `${fieldId}-helper`;
  const errorId = `${fieldId}-error`;

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

  const accessibleName = label || selectProps.placeholder || 'Campo de seleção';

  return (
    <FormControl
      isInvalid={isInvalid || !!error}
      isRequired={isRequired}
      isDisabled={isDisabled || isLoading}
      width={width}
    >
      {label && (
        <FormLabel id={labelId} htmlFor={fieldId} mb={1}>
          {label}
        </FormLabel>
      )}

      <ChakraSelect
        ref={ref}
        id={fieldId}
        {...selectProps}
        focusBorderColor="blue.500"
        errorBorderColor="red.500"
        size="md"
        variant="outline"
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={
          [helperText ? helperId : null, error ? errorId : null]
            .filter(Boolean)
            .join(' ') || undefined
        }
        aria-invalid={isInvalid || !!error}
        title={accessibleName}
        aria-label={accessibleName}
        name={accessibleName}
      >
        {selectProps.placeholder && (
          <option value="" disabled={isRequired}>
            {selectProps.placeholder}
          </option>
        )}
        {Object.entries(groupedOptions).map(([group, groupOptions]) =>
          group === 'default' ? (
            groupOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          ) : (
            <optgroup key={group} label={group}>
              {groupOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </optgroup>
          )
        )}
      </ChakraSelect>

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
});

SelectCustom.displayName = 'SelectCustom'; 