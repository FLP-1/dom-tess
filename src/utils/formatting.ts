export const formatCPF = (value: string) => {
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})?(\d{3})?(\d{2})?/);
  
  if (!match) return value;
  
  const formatted = match[1] + 
    (match[2] ? '.' + match[2] : '') + 
    (match[3] ? '.' + match[3] : '') + 
    (match[4] ? '-' + match[4] : '');
  
  return formatted;
};

export const validateCPF = (cpf: string) => {
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleaned)) return false;
  
  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  if (digit !== parseInt(cleaned.charAt(9))) return false;
  
  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  if (digit !== parseInt(cleaned.charAt(10))) return false;
  
  return true;
};

export const formatPhone = (value: string) => {
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})?(\d{5})?(\d{4})?/);
  
  if (!match) return value;
  
  const formatted = 
    (match[1] ? '(' + match[1] + ')' : '') + 
    (match[2] ? ' ' + match[2] : '') + 
    (match[3] ? '-' + match[3] : '');
  
  return formatted;
};

export const validatePhone = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 11;
};

export const formatSalary = (value: string) => {
  const cleaned = value.replace(/\D/g, '');
  const number = Number(cleaned) / 100;
  return number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};

export const validateSalary = (salary: string) => {
  const cleaned = salary.replace(/\D/g, '');
  const number = Number(cleaned) / 100;
  return number > 0;
};

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}; 