import { ValidationRule } from '@/types/common';

// Validações de texto
export const required: ValidationRule = (value: any) => {
  if (value === undefined || value === null || value === '') {
    return 'Campo obrigatório';
  }
  return undefined;
};

export const minLength = (min: number): ValidationRule => (value: string) => {
  if (value && value.length < min) {
    return `Mínimo de ${min} caracteres`;
  }
  return undefined;
};

export const maxLength = (max: number): ValidationRule => (value: string) => {
  if (value && value.length > max) {
    return `Máximo de ${max} caracteres`;
  }
  return undefined;
};

export const pattern = (regex: RegExp, message: string): ValidationRule => (value: string) => {
  if (value && !regex.test(value)) {
    return message;
  }
  return undefined;
};

export const email: ValidationRule = (value: string) => {
  if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
    return 'E-mail inválido';
  }
  return undefined;
};

// Validações de número
export const min = (min: number): ValidationRule => (value: number) => {
  if (value !== undefined && value !== null && value < min) {
    return `Valor mínimo: ${min}`;
  }
  return undefined;
};

export const max = (max: number): ValidationRule => (value: number) => {
  if (value !== undefined && value !== null && value > max) {
    return `Valor máximo: ${max}`;
  }
  return undefined;
};

export const integer: ValidationRule = (value: number) => {
  if (value !== undefined && value !== null && !Number.isInteger(value)) {
    return 'Deve ser um número inteiro';
  }
  return undefined;
};

export const positive: ValidationRule = (value: number) => {
  if (value !== undefined && value !== null && value <= 0) {
    return 'Deve ser um número positivo';
  }
  return undefined;
};

export const negative: ValidationRule = (value: number) => {
  if (value !== undefined && value !== null && value >= 0) {
    return 'Deve ser um número negativo';
  }
  return undefined;
};

// Validações de data
export const minDate = (min: Date): ValidationRule => (value: Date) => {
  if (value && value < min) {
    return `Data mínima: ${min.toLocaleDateString()}`;
  }
  return undefined;
};

export const maxDate = (max: Date): ValidationRule => (value: Date) => {
  if (value && value > max) {
    return `Data máxima: ${max.toLocaleDateString()}`;
  }
  return undefined;
};

export const futureDate: ValidationRule = (value: Date) => {
  if (value && value < new Date()) {
    return 'Deve ser uma data futura';
  }
  return undefined;
};

export const pastDate: ValidationRule = (value: Date) => {
  if (value && value > new Date()) {
    return 'Deve ser uma data passada';
  }
  return undefined;
};

// Validações de arquivo
export const maxFileSize = (maxSize: number): ValidationRule => (value: File) => {
  if (value && value.size > maxSize) {
    return `Tamanho máximo: ${maxSize / 1024 / 1024}MB`;
  }
  return undefined;
};

export const allowedFileTypes = (types: string[]): ValidationRule => (value: File) => {
  if (value && !types.includes(value.type)) {
    return `Tipos permitidos: ${types.join(', ')}`;
  }
  return undefined;
};

// Validações de documentos
export const cpf: ValidationRule = (value: string) => {
  if (!value) return undefined;

  const cleanValue = value.replace(/\D/g, '');
  if (cleanValue.length !== 11) {
    return 'CPF inválido';
  }

  let sum = 0;
  let rest;

  if (cleanValue === '00000000000') return 'CPF inválido';

  for (let i = 1; i <= 9; i++) {
    sum = sum + parseInt(cleanValue.substring(i - 1, i)) * (11 - i);
  }

  rest = (sum * 10) % 11;

  if ((rest === 10) || (rest === 11)) rest = 0;
  if (rest !== parseInt(cleanValue.substring(9, 10))) return 'CPF inválido';

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum = sum + parseInt(cleanValue.substring(i - 1, i)) * (12 - i);
  }

  rest = (sum * 10) % 11;

  if ((rest === 10) || (rest === 11)) rest = 0;
  if (rest !== parseInt(cleanValue.substring(10, 11))) return 'CPF inválido';

  return undefined;
};

export const cnpj: ValidationRule = (value: string) => {
  if (!value) return undefined;

  const cleanValue = value.replace(/\D/g, '');
  if (cleanValue.length !== 14) {
    return 'CNPJ inválido';
  }

  if (/^(\d)\1+$/.test(cleanValue)) {
    return 'CNPJ inválido';
  }

  let length = cleanValue.length - 2;
  let numbers = cleanValue.substring(0, length);
  const digits = cleanValue.substring(length);
  let sum = 0;
  let pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
  if (result !== parseInt(digits.charAt(0))) {
    return 'CNPJ inválido';
  }

  length = length + 1;
  numbers = cleanValue.substring(0, length);
  sum = 0;
  pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - sum % 11;
  if (result !== parseInt(digits.charAt(1))) {
    return 'CNPJ inválido';
  }

  return undefined;
};

export const cep: ValidationRule = (value: string) => {
  if (!value) return undefined;

  const cleanValue = value.replace(/\D/g, '');
  if (cleanValue.length !== 8) {
    return 'CEP inválido';
  }

  return undefined;
};

export const phone: ValidationRule = (value: string) => {
  if (!value) return undefined;

  const cleanValue = value.replace(/\D/g, '');
  if (cleanValue.length < 10 || cleanValue.length > 11) {
    return 'Telefone inválido';
  }

  if (cleanValue.length === 11 && parseInt(cleanValue.substring(2, 3)) !== 9) {
    return 'Telefone inválido';
  }

  for (let n = 0; n < 10; n++) {
    if (cleanValue === new Array(11).join(n.toString()) || cleanValue === new Array(12).join(n.toString())) {
      return 'Telefone inválido';
    }
  }

  return undefined;
};

// Validações compostas
export const compose = (...validations: ValidationRule[]): ValidationRule => (value: any) => {
  for (const validation of validations) {
    const result = validation(value);
    if (result) {
      return result;
    }
  }
  return undefined;
};

// Validações condicionais
export const when = (condition: boolean | (() => boolean), validation: ValidationRule): ValidationRule => (value: any) => {
  if (typeof condition === 'function' ? condition() : condition) {
    return validation(value);
  }
  return undefined;
};

// Validações personalizadas
export const custom = (validator: (value: any) => boolean, message: string): ValidationRule => (value: any) => {
  if (!validator(value)) {
    return message;
  }
  return undefined;
}; 