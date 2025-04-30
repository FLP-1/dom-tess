import {
  FormControl,
  FormLabel,
  Select,
  SelectProps,
  FormControlProps
} from '@chakra-ui/react';

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps extends Omit<SelectProps, 'id'> {
  label: string;
  options: Option[];
  formControlProps?: FormControlProps;
}

export function SelectField({ 
  label, 
  options, 
  formControlProps,
  ...selectProps 
}: SelectFieldProps) {
  // Gera um ID único para o campo baseado no label
  const id = label.toLowerCase().replace(/\s+/g, '-');
  const labelId = `${id}-label`;

  return (
    <FormControl {...formControlProps}>
      <FormLabel id={labelId} htmlFor={id}>
        {label}
      </FormLabel>
      <Select
        id={id}
        aria-labelledby={labelId}
        {...selectProps}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </FormControl>
  );
} 