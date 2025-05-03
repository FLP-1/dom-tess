'use client';

import { logger } from './logger';

// Definição local de ValidationRule
export type ValidationRule = (value: any) => string | undefined;

export function createValidationRule(
  validate: (value: any) => boolean,
  message: string
): ValidationRule {
  return (value: any) => validate(value) ? undefined : message;
}

export const validateRequired = (message = 'Campo obrigatório'): ValidationRule =>
  createValidationRule(
    (value) => {
      if (value === undefined || value === null) return false;
      if (typeof value === 'string') return value.trim() !== '';
      if (typeof value === 'number') return true;
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object') return Object.keys(value).length > 0;
      return Boolean(value);
    },
    message
  );

export const validateCPF = (message = 'CPF inválido'): ValidationRule =>
  createValidationRule(
    (value) => {
      if (!value) return false;
      const cpf = value.replace(/\D/g, '');
      if (cpf.length !== 11) return false;
      if (/^(\d)\1{10}$/.test(cpf)) return false;

      let sum = 0;
      let remainder;

      for (let i = 1; i <= 9; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
      }

      remainder = (sum * 10) % 11;
      if (remainder === 10 || remainder === 11) remainder = 0;
      if (remainder !== parseInt(cpf.substring(9, 10))) return false;

      sum = 0;
      for (let i = 1; i <= 10; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
      }

      remainder = (sum * 10) % 11;
      if (remainder === 10 || remainder === 11) remainder = 0;
      if (remainder !== parseInt(cpf.substring(10, 11))) return false;

      return true;
    },
    message
  );

export const validateEmail = (message = 'Email inválido'): ValidationRule =>
  createValidationRule(
    (value) => {
      if (!value) return false;
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(value);
    },
    message
  );

export const validatePhone = (message = 'Telefone inválido'): ValidationRule =>
  createValidationRule(
    (value) => {
      if (!value) return false;
      const phone = value.replace(/\D/g, '');
      return phone.length >= 10 && phone.length <= 11;
    },
    message
  );

export const validateDate = (message = 'Data inválida', options?: { min?: string; max?: string }) =>
  createValidationRule(
    (value) => {
      if (!value) return false;
      try {
        const date = new Date(value);
        if (isNaN(date.getTime())) return false;
        
        if (options?.min && date < new Date(options.min)) return false;
        if (options?.max && date > new Date(options.max)) return false;
        
        return true;
      } catch {
        return false;
      }
    },
    message
  );

export const validateNumber = (
  message = 'Número inválido',
  options?: {
    min?: number;
    max?: number;
    integer?: boolean;
    positive?: boolean;
    negative?: boolean;
  }
): ValidationRule =>
  createValidationRule(
    (value) => {
      if (value === undefined || value === null) return false;
      const num = typeof value === 'string' ? Number(value) : value;
      if (isNaN(num)) return false;
      
      if (options?.integer && !Number.isInteger(num)) return false;
      if (options?.min !== undefined && num < options.min) return false;
      if (options?.max !== undefined && num > options.max) return false;
      if (options?.positive && num <= 0) return false;
      if (options?.negative && num >= 0) return false;
      
      return true;
    },
    message
  );

export const validateLength = (min: number, max: number, message?: string): ValidationRule =>
  createValidationRule(
    (value) => {
      if (!value) return false;
      const length = String(value).length;
      return length >= min && length <= max;
    },
    message || `Deve ter entre ${min} e ${max} caracteres`
  );

export const validateMinLength = (min: number, message?: string): ValidationRule =>
  createValidationRule(
    (value) => {
      if (!value) return false;
      return String(value).length >= min;
    },
    message || `Deve ter no mínimo ${min} caracteres`
  );

export const validateMaxLength = (max: number, message?: string): ValidationRule =>
  createValidationRule(
    (value) => {
      if (!value) return false;
      return String(value).length <= max;
    },
    message || `Deve ter no máximo ${max} caracteres`
  );

export const validateExactLength = (length: number, message?: string): ValidationRule =>
  createValidationRule(
    (value) => {
      if (!value) return false;
      return String(value).length === length;
    },
    message || `Deve ter exatamente ${length} caracteres`
  );

export const validateRegex = (
  regex: RegExp,
  message = 'Formato inválido'
): ValidationRule =>
  createValidationRule(
    (value) => {
      if (!value) return false;
      return regex.test(value);
    },
    message
  );

export const validatePassword = (message = 'Senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais') =>
  createValidationRule(
    (value) => {
      if (!value) return false;
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return passwordRegex.test(value);
    },
    message
  );

export const validateConfirmPassword = (password: string, message = 'As senhas não conferem') =>
  createValidationRule(
    (value) => value === password,
    message
  );

export const validateURL = (message = 'URL inválida'): ValidationRule =>
  createValidationRule(
    (value) => {
      if (!value) return false;
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    message
  );

export const validateFileSize = (maxSizeInMB: number, message = `Arquivo deve ter no máximo ${maxSizeInMB}MB`) =>
  createValidationRule(
    (file) => {
      if (!file) return false;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      return file.size <= maxSizeInBytes;
    },
    message
  );

export const validateFileType = (allowedTypes: string[], message = `Tipo de arquivo não permitido. Tipos permitidos: ${allowedTypes.join(', ')}`) =>
  createValidationRule(
    (file) => {
      if (!file) return false;
      return allowedTypes.includes(file.type);
    },
    message
  );

// Funções de formatação
export const formatCPF = (cpf: string): string => {
  const cleanCPF = cpf.replace(/[^\d]/g, '');
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const formatPhone = (phone: string): string => {
  const cleanPhone = phone.replace(/[^\d]/g, '');
  if (cleanPhone.length === 11) {
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
};

export const formatCurrency = (value: string | number): string => {
  const numericValue = typeof value === 'string' ? value.replace(/[^\d]/g, '') : Math.round(value * 100).toString();
  const floatValue = parseFloat(numericValue) / 100;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(floatValue);
};

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR');
};

export const generateDefaultEmail = (cpf: string): string => {
  const cleanCPF = cpf.replace(/[^\d]/g, '');
  return `${cleanCPF}@dom.com.br`;
};

export const required = (value: any): string | undefined => {
  if (value === undefined || value === null || value === '') {
    return 'Este campo é obrigatório';
  }
  return undefined;
};

export const email = (value: string): string | undefined => {
  if (!value) return undefined;
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!emailRegex.test(value)) {
    return 'Email inválido';
  }
  return undefined;
};

export const minLength = (min: number) => (value: string): string | undefined => {
  if (!value) return undefined;
  if (value.length < min) {
    return `Deve ter no mínimo ${min} caracteres`;
  }
  return undefined;
};

export const maxLength = (max: number) => (value: string): string | undefined => {
  if (!value) return undefined;
  if (value.length > max) {
    return `Deve ter no máximo ${max} caracteres`;
  }
  return undefined;
};

export const pattern = (regex: RegExp, message: string) => (value: string): string | undefined => {
  if (!value) return undefined;
  if (!regex.test(value)) {
    return message;
  }
  return undefined;
};

export const numeric = (value: string): string | undefined => {
  if (!value) return undefined;
  if (!/^\d+$/.test(value)) {
    return 'Deve conter apenas números';
  }
  return undefined;
};

export const cpf = (value: string): string | undefined => {
  if (!value) return undefined;
  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  if (!cpfRegex.test(value)) {
    return 'CPF inválido';
  }
  return undefined;
};

export const phone = (value: string): string | undefined => {
  if (!value) return undefined;
  const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
  if (!phoneRegex.test(value)) {
    return 'Telefone inválido';
  }
  return undefined;
};

export const cep = (value: string): string | undefined => {
  if (!value) return undefined;
  const cepRegex = /^\d{5}-\d{3}$/;
  if (!cepRegex.test(value)) {
    return 'CEP inválido';
  }
  return undefined;
};

export const date = (value: string): string | undefined => {
  if (!value) return undefined;
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!dateRegex.test(value)) {
    return 'Data inválida';
  }
  return undefined;
};

export const currency = (value: string): string | undefined => {
  if (!value) return undefined;
  const currencyRegex = /^R\$ \d{1,3}(\.\d{3})*,\d{2}$/;
  if (!currencyRegex.test(value)) {
    return 'Valor inválido';
  }
  return undefined;
};

export const composeValidations = (...validations: ValidationRule[]) => (value: any): string | undefined => {
  for (const validate of validations) {
    const result = validate(value);
    if (result) return result;
  }
  return undefined;
}; 