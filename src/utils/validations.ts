'use client';

import { logger } from './logger';
import { ValidationRule } from '../types/common';

export function createValidationRule<T>(
  validate: (value: T) => boolean,
  message: string
): ValidationRule<T> {
  return (value: T) => validate(value) ? undefined : message;
}

export const validateRequired = <T>(message = 'Campo obrigatório'): ValidationRule<T> =>
  createValidationRule<T>(
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

export const validateCPF = (message = 'CPF inválido'): ValidationRule<string> =>
  createValidationRule<string>(
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

export const validateEmail = (message = 'Email inválido'): ValidationRule<string> =>
  createValidationRule<string>(
    (value) => {
      if (!value) return false;
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(value);
    },
    message
  );

export const validatePhone = (message = 'Telefone inválido'): ValidationRule<string> =>
  createValidationRule<string>(
    (value) => {
      if (!value) return false;
      const phone = value.replace(/\D/g, '');
      return phone.length >= 10 && phone.length <= 11;
    },
    message
  );

export const validateDate = (message = 'Data inválida', options?: { min?: Date; max?: Date }) =>
  createValidationRule<string | Date>(
    (value) => {
      if (!value) return false;
      const date = value instanceof Date ? value : new Date(value);
      if (isNaN(date.getTime())) return false;
      
      if (options?.min && date < options.min) return false;
      if (options?.max && date > options.max) return false;
      
      return true;
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
): ValidationRule<string | number> =>
  createValidationRule<string | number>(
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

export const validateLength = (
  options: {
    min?: number;
    max?: number;
    exact?: number;
  },
  message?: string
): ValidationRule<string | any[]> =>
  createValidationRule<string | any[]>(
    (value) => {
      if (!value) return false;
      const length = Array.isArray(value) ? value.length : value.toString().length;
      
      if (options.exact !== undefined) return length === options.exact;
      if (options.min !== undefined && length < options.min) return false;
      if (options.max !== undefined && length > options.max) return false;
      
      return true;
    },
    message || `Deve ter ${options.exact !== undefined ? 'exatamente ' + options.exact : 
      options.min !== undefined && options.max !== undefined ? 'entre ' + options.min + ' e ' + options.max :
      options.min !== undefined ? 'no mínimo ' + options.min :
      'no máximo ' + options.max} caracteres`
  );

export const validateRegex = (
  regex: RegExp,
  message = 'Formato inválido'
): ValidationRule<string> =>
  createValidationRule<string>(
    (value) => {
      if (!value) return false;
      return regex.test(value);
    },
    message
  );

export const validatePassword = (message = 'Senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais') =>
  createValidationRule<string>(
    (value) => {
      if (!value) return false;
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return passwordRegex.test(value);
    },
    message
  );

export const validateConfirmPassword = (password: string, message = 'As senhas não conferem') =>
  createValidationRule<string>(
    (value) => value === password,
    message
  );

export const validateURL = (message = 'URL inválida'): ValidationRule<string> =>
  createValidationRule<string>(
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
  createValidationRule<File>(
    (file) => {
      if (!file) return false;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      return file.size <= maxSizeInBytes;
    },
    message
  );

export const validateFileType = (allowedTypes: string[], message = `Tipo de arquivo não permitido. Tipos permitidos: ${allowedTypes.join(', ')}`) =>
  createValidationRule<File>(
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

export type ValidationRule = (value: any) => string | undefined;

export const required = (message = 'Campo obrigatório'): ValidationRule => {
  return (value) => {
    if (value === undefined || value === null || value === '') {
      return message;
    }
    return undefined;
  };
};

export const minLength = (min: number, message = `Mínimo de ${min} caracteres`): ValidationRule => {
  return (value) => {
    if (value && value.length < min) {
      return message;
    }
    return undefined;
  };
};

export const maxLength = (max: number, message = `Máximo de ${max} caracteres`): ValidationRule => {
  return (value) => {
    if (value && value.length > max) {
      return message;
    }
    return undefined;
  };
};

export const email = (message = 'E-mail inválido'): ValidationRule => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return (value) => {
    if (value && !emailRegex.test(value)) {
      return message;
    }
    return undefined;
  };
};

export const cpf = (message = 'CPF inválido'): ValidationRule => {
  return (value) => {
    if (!value) return undefined;

    const cpf = value.replace(/[^\d]/g, '');
    if (cpf.length !== 11) return message;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return message;

    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit > 9) digit = 0;
    if (digit !== parseInt(cpf.charAt(9))) return message;

    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit > 9) digit = 0;
    if (digit !== parseInt(cpf.charAt(10))) return message;

    return undefined;
  };
};

export const cnpj = (message = 'CNPJ inválido'): ValidationRule => {
  return (value) => {
    if (!value) return undefined;

    const cnpj = value.replace(/[^\d]/g, '');
    if (cnpj.length !== 14) return message;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{13}$/.test(cnpj)) return message;

    // Validação do primeiro dígito verificador
    let sum = 0;
    const weights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cnpj.charAt(i)) * weights[i];
    }
    let digit = 11 - (sum % 11);
    if (digit > 9) digit = 0;
    if (digit !== parseInt(cnpj.charAt(12))) return message;

    // Validação do segundo dígito verificador
    sum = 0;
    weights.unshift(6);
    for (let i = 0; i < 13; i++) {
      sum += parseInt(cnpj.charAt(i)) * weights[i];
    }
    digit = 11 - (sum % 11);
    if (digit > 9) digit = 0;
    if (digit !== parseInt(cnpj.charAt(13))) return message;

    return undefined;
  };
};

export const phone = (message = 'Telefone inválido'): ValidationRule => {
  return (value) => {
    if (!value) return undefined;

    const phone = value.replace(/[^\d]/g, '');
    if (phone.length < 10 || phone.length > 11) return message;

    return undefined;
  };
};

export const date = (message = 'Data inválida'): ValidationRule => {
  return (value) => {
    if (!value) return undefined;

    const date = new Date(value);
    if (isNaN(date.getTime())) return message;

    return undefined;
  };
};

export const minDate = (min: Date, message = `Data deve ser posterior a ${min.toLocaleDateString()}`): ValidationRule => {
  return (value) => {
    if (!value) return undefined;

    const date = new Date(value);
    if (isNaN(date.getTime())) return undefined;
    if (date < min) return message;

    return undefined;
  };
};

export const maxDate = (max: Date, message = `Data deve ser anterior a ${max.toLocaleDateString()}`): ValidationRule => {
  return (value) => {
    if (!value) return undefined;

    const date = new Date(value);
    if (isNaN(date.getTime())) return undefined;
    if (date > max) return message;

    return undefined;
  };
};

export const number = (message = 'Valor deve ser um número'): ValidationRule => {
  return (value) => {
    if (value && isNaN(Number(value))) {
      return message;
    }
    return undefined;
  };
};

export const min = (min: number, message = `Valor mínimo: ${min}`): ValidationRule => {
  return (value) => {
    if (value && Number(value) < min) {
      return message;
    }
    return undefined;
  };
};

export const max = (max: number, message = `Valor máximo: ${max}`): ValidationRule => {
  return (value) => {
    if (value && Number(value) > max) {
      return message;
    }
    return undefined;
  };
};

export const pattern = (regex: RegExp, message = 'Formato inválido'): ValidationRule => {
  return (value) => {
    if (value && !regex.test(value)) {
      return message;
    }
    return undefined;
  };
};

export const custom = (validator: (value: any) => string | undefined): ValidationRule => {
  return validator;
};

export const validateCEP = (message = 'CEP inválido'): ValidationRule<string> =>
  createValidationRule<string>(
    (value) => {
      if (!value) return false;
      const cep = value.replace(/\D/g, '');
      return cep.length === 8 && /^\d{8}$/.test(cep);
    },
    message
  );

export const validateCreditCard = (message = 'Cartão de crédito inválido'): ValidationRule<string> =>
  createValidationRule<string>(
    (value) => {
      if (!value) return false;
      const card = value.replace(/\D/g, '');
      if (card.length < 13 || card.length > 19) return false;
      
      // Algoritmo de Luhn
      let sum = 0;
      let isEven = false;
      for (let i = card.length - 1; i >= 0; i--) {
        let digit = parseInt(card.charAt(i));
        if (isEven) {
          digit *= 2;
          if (digit > 9) digit -= 9;
        }
        sum += digit;
        isEven = !isEven;
      }
      return sum % 10 === 0;
    },
    message
  );

export const validateStrongPassword = (
  options?: {
    minLength?: number;
    requireNumbers?: boolean;
    requireLowercase?: boolean;
    requireUppercase?: boolean;
    requireSpecial?: boolean;
  },
  message?: string
): ValidationRule<string> =>
  createValidationRule<string>(
    (value) => {
      if (!value) return false;
      
      const minLength = options?.minLength || 8;
      if (value.length < minLength) return false;
      
      if (options?.requireNumbers && !/\d/.test(value)) return false;
      if (options?.requireLowercase && !/[a-z]/.test(value)) return false;
      if (options?.requireUppercase && !/[A-Z]/.test(value)) return false;
      if (options?.requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(value)) return false;
      
      return true;
    },
    message || 'A senha deve ter pelo menos ' + (options?.minLength || 8) + ' caracteres e conter ' +
      [
        options?.requireNumbers && 'números',
        options?.requireLowercase && 'letras minúsculas',
        options?.requireUppercase && 'letras maiúsculas',
        options?.requireSpecial && 'caracteres especiais'
      ].filter(Boolean).join(', ')
  );

export const validateEquals = <T>(
  compareValue: T,
  message = 'Valores não correspondem'
): ValidationRule<T> =>
  createValidationRule<T>(
    (value) => value === compareValue,
    message
  );

export const validateCustom = <T>(
  validator: (value: T) => boolean,
  message: string
): ValidationRule<T> =>
  createValidationRule<T>(validator, message);

export const composeValidations = <T>(...validations: ValidationRule<T>[]): ValidationRule<T> => {
  return (value: T) => {
    for (const validation of validations) {
      const error = validation(value);
      if (error) return error;
    }
    return undefined;
  };
}; 