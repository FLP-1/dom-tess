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
  | 'capitalize'
  | 'cellphone'
  | 'cnae'
  | 'ncm';

export interface MaskOptions {
  type: MaskType;
  value: string;
}

export interface MaskResult {
  masked: string;
  unmasked: string;
} 