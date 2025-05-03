import { ReactNode, ChangeEvent, FocusEvent } from 'react';
import { FormikProps, FormikHelpers, FormikErrors, FormikTouched } from 'formik';
import { BaseFieldProps, BaseInputProps, BaseSelectProps, BaseAutocompleteProps, BaseMaskedInputProps, BaseFormProps, ErrorObject } from './common';
import { MaskType } from '@/types/mask';
import { FieldValues, UseFormReturn, FieldErrors } from 'react-hook-form';

// Tipo genérico para valores de formulário
export type FormValues<T = any> = {
  [K in keyof T]: T[K];
};

// Tipo para erros de formulário
export type FormErrors<T = any> = {
  [K in keyof T]?: string | string[] | FormikErrors<T[K]>;
};

// Tipo para campos tocados
export type FormTouched<T = any> = {
  [K in keyof T]?: boolean | FormikTouched<T[K]>;
};

// Props base para campos de formulário com validação
export interface ValidatedFieldProps<T = any> extends BaseFieldProps<T> {
  name: keyof T & string;
  value?: T[keyof T];
  error?: string | ErrorObject<string>;
  touched?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export interface FormInputProps extends BaseInputProps {
  mask?: MaskType;
  maskChar?: string;
  alwaysShowMask?: boolean;
  beforeMaskedStateChange?: (nextState: { value: string; selection: { start: number; end: number }; }) => { value: string; selection: { start: number; end: number }; };
  type?: string;
  touched?: boolean;
}

export interface FormSelectProps extends BaseSelectProps {}

export interface FormAutocompleteProps extends BaseAutocompleteProps {}

export interface FormProps<T> extends Omit<BaseFormProps<T>, 'children'> {
  validationSchema?: any;
  children: (formikProps: FormikProps<T>) => ReactNode;
}

// Props base para campos de arquivo com tipagem estrita
export interface FormFileProps extends BaseFieldProps {
  value?: File | null;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  minSize?: number;
  allowedTypes?: string[];
  preview?: boolean;
  previewSize?: number;
  previewType?: 'image' | 'icon';
  onDrop?: (files: File[]) => void;
  onDropRejected?: (files: File[]) => void;
  onDropAccepted?: (files: File[]) => void;
  error?: string;
  helperText?: string;
}

// Props base para campos de data com tipagem estrita
export interface FormDateProps extends BaseFieldProps {
  value?: Date | null;
  onChange?: (date: Date | null, event?: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  minDate?: Date;
  maxDate?: Date;
  dateFormat?: string;
  showTimeSelect?: boolean;
  showTimeSelectOnly?: boolean;
  timeIntervals?: number;
  timeCaption?: string;
  locale?: string;
  placeholderText?: string;
  isClearable?: boolean;
  showYearDropdown?: boolean;
  showMonthDropdown?: boolean;
  dropdownMode?: 'scroll' | 'select';
  error?: string;
  helperText?: string;
}

// Props base para campos de checkbox
export interface FormCheckboxProps extends BaseFieldProps {
  checked?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  indeterminate?: boolean;
  colorScheme?: string;
  size?: 'sm' | 'md' | 'lg';
  spacing?: number;
  isChecked?: boolean;
}

// Props base para campos de radio
export interface FormRadioProps extends BaseFieldProps {
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  options: Array<{ value: string | number; label: string }>;
  colorScheme?: string;
  size?: 'sm' | 'md' | 'lg';
  spacing?: number;
  isInline?: boolean;
}

// Props base para campos de textarea
export interface FormTextareaProps extends BaseFieldProps {
  value?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: FocusEvent<HTMLTextAreaElement>) => void;
  onFocus?: (e: FocusEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  cols?: number;
  maxLength?: number;
  minLength?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  readOnly?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
}

// Props base para campos de switch
export interface FormSwitchProps extends BaseFieldProps {
  isChecked?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  size?: 'sm' | 'md' | 'lg';
  colorScheme?: string;
  spacing?: number;
}

// Props base para campos de slider
export interface FormSliderProps extends BaseFieldProps {
  value?: number;
  onChange?: (value: number) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: number;
  marks?: Array<{ value: number; label: string }>;
  showMarks?: boolean;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  colorScheme?: string;
}

// Props base para campos de rating
export interface FormRatingProps extends BaseFieldProps {
  value?: number;
  onChange?: (value: number) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  colorScheme?: string;
  icon?: ReactNode;
  emptyIcon?: ReactNode;
}

// Props base para campos de editor de texto rico
export interface FormRichTextProps extends BaseFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: (e: FocusEvent<HTMLDivElement>) => void;
  onFocus?: (e: FocusEvent<HTMLDivElement>) => void;
  height?: string | number;
  toolbar?: string[];
  placeholder?: string;
  readOnly?: boolean;
  modules?: Record<string, any>;
  formats?: string[];
}

// Props base para campos de máscara monetária com tipagem estrita
export interface FormCurrencyProps extends Omit<BaseMaskedInputProps<string | number>, 'value' | 'onChange'> {
  value?: string | number;
  currency?: string;
  locale?: string;
  decimalScale?: number;
  fixedDecimalScale?: boolean;
  onChange?: (value: string | number, maskedValue: string) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  error?: string;
  helperText?: string;
}

// Props base para campos de máscara de telefone com tipagem estrita
export interface FormPhoneProps extends Omit<BaseMaskedInputProps<string>, 'onChange'> {
  value?: string;
  country?: string;
  preferredCountries?: string[];
  excludeCountries?: string[];
  onlyCountries?: string[];
  national?: boolean;
  enableSearch?: boolean;
  disableSearchIcon?: boolean;
  onChange?: (value: string, country: { dialCode: string; countryCode: string }) => void;
  error?: string;
  helperText?: string;
}

// Props base para campos de documento com tipagem estrita
export interface FormDocumentProps extends Omit<BaseMaskedInputProps<string>, 'onChange'> {
  type: 'cpf' | 'cnpj' | 'both';
  validate?: boolean;
  formatOnBlur?: boolean;
  onChange?: (value: string, isValid: boolean) => void;
  error?: string;
  helperText?: string;
}

// Props base para campos de CEP com tipagem estrita
export interface FormCepProps extends BaseMaskedInputProps {
  onComplete?: (cep: string, address?: AddressData) => void;
  validate?: boolean;
  formatOnBlur?: boolean;
  autoFetch?: boolean;
  error?: string;
  helperText?: string;
}

// Interface para dados de endereço
export interface AddressData {
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  pais?: string;
  latitude?: number;
  longitude?: number;
}

// Props base para campos de endereço com tipagem estrita
export interface FormAddressProps extends BaseFieldProps {
  value?: AddressData;
  onChange?: (address: AddressData) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  onCepComplete?: (cep: string, address?: AddressData) => void;
  showMap?: boolean;
  mapHeight?: string | number;
  mapZoom?: number;
  mapCenter?: { lat: number; lng: number };
  error?: string;
  helperText?: string;
}

// Tipos de campo de formulário
export type FieldType = 
  | 'text'
  | 'number'
  | 'email'
  | 'password'
  | 'tel'
  | 'date'
  | 'time'
  | 'datetime-local'
  | 'checkbox'
  | 'radio'
  | 'select'
  | 'textarea'
  | 'file'
  | 'hidden';

// Interface para opções de campo
export interface FieldOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

// Interface para validação de campo
export interface FieldValidation {
  required?: boolean | string;
  minLength?: number | { value: number; message: string };
  maxLength?: number | { value: number; message: string };
  min?: number | { value: number; message: string };
  max?: number | { value: number; message: string };
  pattern?: RegExp | { value: RegExp; message: string };
  validate?: Record<string, (value: any) => boolean | string>;
}

// Interface para campo de formulário
export interface FormField<T extends FieldValues = any> {
  name: keyof T & string;
  label: string;
  type: FieldType;
  placeholder?: string;
  defaultValue?: any;
  options?: FieldOption[];
  validation?: FieldValidation;
  disabled?: boolean;
  readOnly?: boolean;
  mask?: string;
  maskChar?: string;
  className?: string;
  helperText?: string;
  errorMessage?: string;
  icon?: ReactNode;
  dependsOn?: Array<keyof T>;
  transform?: {
    input?: (value: any) => any;
    output?: (value: any) => any;
  };
}

// Interface para seção de formulário
export interface FormSection<T extends FieldValues = any> {
  title: string;
  description?: string;
  fields: FormField<T>[];
  columns?: 1 | 2 | 3 | 4;
  condition?: (values: T) => boolean;
}

// Interface para configuração de formulário
export interface FormConfig<T extends FieldValues = any> {
  id: string;
  title: string;
  description?: string;
  sections: FormSection<T>[];
  onSubmit: (data: T) => Promise<void> | void;
  onError?: (errors: FieldErrors<T>) => void;
  submitLabel?: string;
  cancelLabel?: string;
  showReset?: boolean;
  resetLabel?: string;
}

// Interface para props de componente de formulário
export interface FormProps<T extends FieldValues = any> {
  config: FormConfig<T>;
  form?: UseFormReturn<T>;
  loading?: boolean;
  error?: string;
  className?: string;
  onCancel?: () => void;
}

// Interface para props de campo de formulário
export interface FormFieldProps<T extends FieldValues = any> {
  field: FormField<T>;
  form: UseFormReturn<T>;
  error?: string;
  className?: string;
}

// Interface para dados bancários
export interface BankData {
  banco: string;
  agencia: string;
  conta: string;
  digitoConta: string;
  tipoConta: 'corrente' | 'poupanca' | 'salario';
  titularConta: string;
  cpfTitular: string;
}

// Interface para dados pessoais
export interface PersonalData {
  nome: string;
  cpf: string;
  rg: string;
  orgaoEmissor: string;
  dataEmissao: Date;
  dataNascimento: Date;
  sexo: 'M' | 'F' | 'O';
  estadoCivil: 'solteiro' | 'casado' | 'divorciado' | 'viuvo' | 'outro';
  nacionalidade: string;
  email: string;
  telefone: string;
}

// Interface para dados profissionais
export interface ProfessionalData {
  cargo: string;
  salario: number;
  dataAdmissao: Date;
  jornadaTrabalho: number;
  intervalos: {
    inicio: string;
    fim: string;
  }[];
  diasTrabalho: string[];
  beneficios: {
    tipo: string;
    valor: number;
    descricao?: string;
  }[];
} 