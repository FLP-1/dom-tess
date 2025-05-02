import {
  maskCPF,
  maskCNPJ,
  maskPhone,
  maskDate,
  maskCurrency,
  maskPercentage,
  maskZipCode,
  maskTime,
  maskCreditCard,
  maskOnlyNumbers,
  maskOnlyLetters,
  maskOnlyLettersAndNumbers,
  maskRemoveAccents,
  maskToUpperCase,
  maskToLowerCase,
  maskCapitalize,
} from './masks';

export type MaskType = 
  | 'cpf'
  | 'cnpj'
  | 'phone'
  | 'date'
  | 'currency'
  | 'percentage'
  | 'zipcode'
  | 'time'
  | 'creditcard'
  | 'numbers'
  | 'letters'
  | 'lettersAndNumbers'
  | 'removeAccents'
  | 'uppercase'
  | 'lowercase'
  | 'capitalize';

export const maskFunctions: Record<MaskType, (value: string) => string> = {
  cpf: maskCPF,
  cnpj: maskCNPJ,
  phone: maskPhone,
  date: maskDate,
  currency: maskCurrency,
  percentage: maskPercentage,
  zipcode: maskZipCode,
  time: maskTime,
  creditcard: maskCreditCard,
  numbers: maskOnlyNumbers,
  letters: maskOnlyLetters,
  lettersAndNumbers: maskOnlyLettersAndNumbers,
  removeAccents: maskRemoveAccents,
  uppercase: maskToUpperCase,
  lowercase: maskToLowerCase,
  capitalize: maskCapitalize,
}; 