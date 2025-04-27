export function formatCPF(value: string): string {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 11) {
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
  }
  return numbers.slice(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
}

export function validateCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  const numbers = cpf.replace(/\D/g, '');

  // Verifica se tem 11 dígitos
  if (numbers.length !== 11) {
    return false;
  }

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(numbers)) {
    return false;
  }

  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(numbers.charAt(9))) {
    return false;
  }

  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(numbers.charAt(10))) {
    return false;
  }

  return true;
}

export function formatAndValidateCPF(value: string): { formattedCPF: string; isValid: boolean } {
  const formattedCPF = formatCPF(value);
  const isValid = validateCPF(value);
  return { formattedCPF, isValid };
} 