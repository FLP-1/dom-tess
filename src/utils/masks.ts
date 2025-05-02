// Funções auxiliares
const cleanValue = (value: string): string => value.replace(/\D/g, '');

const applyMask = (value: string, pattern: string, placeholder = '#'): string => {
  const cleanedValue = cleanValue(value);
  let result = pattern;
  let valueIndex = 0;

  for (let i = 0; i < pattern.length && valueIndex < cleanedValue.length; i++) {
    if (pattern[i] === placeholder) {
      result = result.substring(0, i) + cleanedValue[valueIndex] + result.substring(i + 1);
      valueIndex++;
    }
  }

  // Remove caracteres extras do padrão se não houver valor suficiente
  while (result.indexOf(placeholder) !== -1) {
    const placeholderIndex = result.indexOf(placeholder);
    result = result.substring(0, placeholderIndex);
  }

  return result;
};

// Máscaras de documentos
export const maskCPF = (value: string): string => {
  return applyMask(value, '###.###.###-##');
};

export const maskCNPJ = (value: string): string => {
  return applyMask(value, '##.###.###/####-##');
};

export const maskRG = (value: string): string => {
  return applyMask(value, '##.###.###-#');
};

export const maskPIS = (value: string): string => {
  return applyMask(value, '###.#####.##-#');
};

// Máscaras de contato
export const maskPhone = (value: string): string => {
  const cleaned = cleanValue(value);
  if (cleaned.length <= 10) {
    return applyMask(cleaned, '(##) ####-####');
  }
  return applyMask(cleaned, '(##) #####-####');
};

export const maskCellPhone = (value: string): string => {
  return applyMask(value, '(##) #####-####');
};

export const maskLandline = (value: string): string => {
  return applyMask(value, '(##) ####-####');
};

// Máscaras de endereço
export const maskCEP = (value: string): string => {
  return applyMask(value, '#####-###');
};

// Máscaras de data e hora
export const maskDate = (value: string): string => {
  return applyMask(value, '##/##/####');
};

export const maskTime = (value: string): string => {
  return applyMask(value, '##:##');
};

export const maskDateTime = (value: string): string => {
  return applyMask(value, '##/##/#### ##:##');
};

// Máscaras financeiras
export const maskCurrency = (value: string): string => {
  const cleaned = cleanValue(value);
  if (cleaned === '') return '';
  
  const number = parseInt(cleaned) / 100;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

export const maskPercentage = (value: string): string => {
  const cleaned = cleanValue(value);
  if (cleaned === '') return '';
  
  const number = parseInt(cleaned) / 100;
  return number.toLocaleString('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Máscaras de cartão
export const maskCreditCard = (value: string): string => {
  return applyMask(value, '#### #### #### ####');
};

export const maskCardExpiry = (value: string): string => {
  return applyMask(value, '##/##');
};

export const maskCVV = (value: string): string => {
  return applyMask(value, '###');
};

// Máscaras de formatação
export const maskOnlyNumbers = (value: string): string => {
  return cleanValue(value);
};

export const maskOnlyLetters = (value: string): string => {
  return value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
};

export const maskOnlyLettersAndNumbers = (value: string): string => {
  return value.replace(/[^a-zA-ZÀ-ÿ0-9\s]/g, '');
};

export const maskRemoveAccents = (value: string): string => {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export const maskToUpperCase = (value: string): string => {
  return value.toUpperCase();
};

export const maskToLowerCase = (value: string): string => {
  return value.toLowerCase();
};

export const maskCapitalize = (value: string): string => {
  return value
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Máscaras de números
export const maskInteger = (value: string): string => {
  return value.replace(/\D/g, '');
};

export const maskDecimal = (value: string, decimals = 2): string => {
  const cleaned = cleanValue(value);
  if (cleaned === '') return '';
  
  const number = parseInt(cleaned) / Math.pow(10, decimals);
  return number.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

// Máscaras personalizadas
export const maskCustomPattern = (value: string, pattern: string): string => {
  return applyMask(value, pattern);
};

export const maskCustomRegex = (value: string, regex: RegExp): string => {
  return value.replace(regex, '');
};

// Exporta todas as máscaras em um objeto
export const masks = {
  // Documentos
  cpf: maskCPF,
  cnpj: maskCNPJ,
  rg: maskRG,
  pis: maskPIS,
  
  // Contato
  phone: maskPhone,
  cellPhone: maskCellPhone,
  landline: maskLandline,
  
  // Endereço
  cep: maskCEP,
  
  // Data e hora
  date: maskDate,
  time: maskTime,
  dateTime: maskDateTime,
  
  // Financeiro
  currency: maskCurrency,
  percentage: maskPercentage,
  
  // Cartão
  creditCard: maskCreditCard,
  cardExpiry: maskCardExpiry,
  cvv: maskCVV,
  
  // Formatação
  numbers: maskOnlyNumbers,
  letters: maskOnlyLetters,
  lettersAndNumbers: maskOnlyLettersAndNumbers,
  removeAccents: maskRemoveAccents,
  uppercase: maskToUpperCase,
  lowercase: maskToLowerCase,
  capitalize: maskCapitalize,
  
  // Números
  integer: maskInteger,
  decimal: maskDecimal,
  
  // Personalizadas
  pattern: maskCustomPattern,
  regex: maskCustomRegex,
}; 