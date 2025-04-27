export function generateEmail(cpf: string): string {
  const cleanCPF = cpf.replace(/\D/g, '');
  return `${cleanCPF}@domservicos.com.br`;
}

export function isCPFEmail(email: string): boolean {
  return email.endsWith('@domservicos.com.br');
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length <= 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return cleaned.slice(0, 11).replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
}

export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 11;
}

export type LoginType = 'email' | 'cpf';

export function identifyLoginType(identifier: string): LoginType {
  // Remove caracteres especiais do CPF
  const cleanIdentifier = identifier.replace(/\D/g, '');
  
  // Verifica se é um CPF (11 dígitos numéricos)
  if (cleanIdentifier.length === 11 && /^\d+$/.test(cleanIdentifier)) {
    return 'cpf';
  }
  
  // Se não for CPF, assume que é email
  return 'email';
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  // Remove todos os caracteres não numéricos
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Verifica se o número tem entre 10 e 11 dígitos (com ou sem DDD)
  return cleanPhone.length >= 10 && cleanPhone.length <= 11;
}

export function formatCPF(cpf: string): string {
  const cpfLimpo = cpf.replace(/\D/g, '');
  if (cpfLimpo.length <= 3) return cpfLimpo;
  if (cpfLimpo.length <= 6) return cpfLimpo.replace(/(\d{3})(\d{0,3})/, '$1.$2');
  if (cpfLimpo.length <= 9) return cpfLimpo.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
  return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
}

export function validateCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  const cpfLimpo = cpf.replace(/\D/g, '');

  // Verifica se tem 11 dígitos
  if (cpfLimpo.length !== 11) {
    console.log('CPF inválido: não tem 11 dígitos');
    return false;
  }

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpfLimpo)) {
    console.log('CPF inválido: todos os dígitos são iguais');
    return false;
  }

  // Lista de CPFs inválidos conhecidos
  const invalidCPFs = [
    '00000000000',
    '11111111111',
    '22222222222',
    '33333333333',
    '44444444444',
    '55555555555',
    '66666666666',
    '77777777777',
    '88888888888',
    '99999999999',
    '12345678909'
  ];

  if (invalidCPFs.includes(cpfLimpo)) {
    console.log('CPF inválido: sequência conhecida');
    return false;
  }

  try {
    // Validação do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digitoVerificador1 = resto > 9 ? 0 : resto;
    
    if (digitoVerificador1 !== parseInt(cpfLimpo.charAt(9))) {
      console.log('CPF inválido: primeiro dígito verificador incorreto');
      return false;
    }

    // Validação do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digitoVerificador2 = resto > 9 ? 0 : resto;
    
    if (digitoVerificador2 !== parseInt(cpfLimpo.charAt(10))) {
      console.log('CPF inválido: segundo dígito verificador incorreto');
      return false;
    }

    console.log('CPF válido:', cpfLimpo);
    return true;
  } catch (error) {
    console.error('Erro ao validar CPF:', error);
    return false;
  }
}

export function removeCPFFormatting(cpf: string): string {
  return cpf.replace(/\D/g, '');
} 