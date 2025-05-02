import { InputProps, SelectProps as ChakraSelectProps } from '@chakra-ui/react';

// Tipo para regras de validação
export type ValidationRule = (value: any) => string | undefined;

// Props base para todos os campos
export interface BaseFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  id?: string;
  name?: string;
  width?: string | number;
  size?: 'sm' | 'md' | 'lg';
  validationRules?: ValidationRule[];
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-labelledby'?: string;
  title?: string;
  role?: string;
}

// Props base para campos de entrada
export interface BaseInputProps extends BaseFieldProps {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  onFocus?: (value: string) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  readOnly?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  inputMode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';
}

// Props base para campos de seleção
export interface BaseSelectProps extends Omit<ChakraSelectProps, keyof BaseFieldProps>, BaseFieldProps {
  options: Array<{ value: string | number; label: string; group?: string }>;
  value?: string | number;
  placeholder?: string;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  onFocus?: (value: string) => void;
  isClearable?: boolean;
  isSearchable?: boolean;
  isMulti?: boolean;
  closeMenuOnSelect?: boolean;
  noOptionsMessage?: string;
  loadingMessage?: string;
}

// Props base para campos de autocompletar
export interface BaseAutocompleteProps extends BaseInputProps {
  options: Array<{ value: string; label: string }>;
  onSelect?: (option: { value: string; label: string }) => void;
  minCharsToSearch?: number;
  loadOptions?: (inputValue: string) => Promise<Array<{ value: string; label: string }>>;
  isAsync?: boolean;
  debounceTime?: number;
  filterOption?: (option: { value: string; label: string }, inputValue: string) => boolean;
  formatOptionLabel?: (option: { value: string; label: string }) => React.ReactNode;
}

// Props base para campos com máscara
export interface BaseMaskedInputProps extends BaseInputProps {
  mask?: MaskType;
  maskChar?: string;
  alwaysShowMask?: boolean;
  beforeMaskedStateChange?: (state: { value: string; selection: { start: number; end: number } }) => { value: string; selection: { start: number; end: number } };
}

// Tipos de máscara disponíveis
export type MaskType =
  // Documentos
  | 'cpf'
  | 'cnpj'
  | 'rg'
  | 'pis'
  
  // Contato
  | 'phone'
  | 'cellPhone'
  | 'landline'
  
  // Endereço
  | 'cep'
  
  // Data e hora
  | 'date'
  | 'time'
  | 'dateTime'
  
  // Financeiro
  | 'currency'
  | 'percentage'
  | 'decimal'
  | 'integer'
  
  // Cartão
  | 'creditCard'
  | 'cardExpiry'
  | 'cvv'
  
  // Formatação
  | 'numbers'
  | 'letters'
  | 'lettersAndNumbers'
  | 'removeAccents'
  | 'uppercase'
  | 'lowercase'
  | 'capitalize';

// Props base para formulários
export interface BaseFormProps {
  onSubmit: (values: Record<string, any>) => Promise<void> | void;
  onReset?: () => void;
  initialValues: Record<string, any>;
  validationRules?: Record<string, ValidationRule[]>;
  isLoading?: boolean;
  isDisabled?: boolean;
  width?: string | number;
  maxWidth?: string | number;
  spacing?: number;
  direction?: 'row' | 'column';
  submitLabel?: string;
  resetLabel?: string;
  showReset?: boolean;
  children?: React.ReactNode;
} 