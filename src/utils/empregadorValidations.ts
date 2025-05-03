import {
  createValidationRule,
  validateRequired,
  validateCPF,
  validateEmail,
  validatePhone,
  validateLength,
  validateRegex,
  validateDate
} from './validations';
import { DadosEmpregador } from '../types/esocial';

type ValidationRule = (value: any, formData?: DadosEmpregador) => string | undefined;

const validateCNPJ = (): ValidationRule => (value: string) => {
  if (!value) return undefined;
  return /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/.test(value) && value.length === 18
    ? undefined
    : 'CNPJ deve estar no formato 00.000.000/0000-00';
};

const validateCEP = (): ValidationRule => (value: string) => {
  if (!value) return undefined;
  return /^\d{5}-\d{3}$/.test(value) && value.length === 9
    ? undefined
    : 'CEP deve estar no formato 00000-000';
};

const validateRG = (): ValidationRule => (value: string) => {
  if (!value) return undefined;
  return /^\d{2}\.\d{3}\.\d{3}-[\dX]$/.test(value)
    ? undefined
    : 'RG deve estar no formato 00.000.000-0';
};

const validateTelefoneFixo = (): ValidationRule => (value: string) => {
  if (!value) return undefined;
  return /^\(\d{2}\) \d{4}-\d{4}$/.test(value)
    ? undefined
    : 'Telefone fixo deve estar no formato (00) 0000-0000';
};

const validateCelular = (): ValidationRule => (value: string) => {
  if (!value) return undefined;
  return /^\(\d{2}\) \d{5}-\d{4}$/.test(value)
    ? undefined
    : 'Celular deve estar no formato (00) 00000-0000';
};

export const empregadorValidationRules: Partial<Record<keyof DadosEmpregador | string, ValidationRule[]>> = {
  nome: [
    validateRequired('Nome é obrigatório'),
    createValidationRule((value: string) => value.length >= 3 && value.length <= 100, 'Nome deve ter entre 3 e 100 caracteres'),
    createValidationRule((value: string) => /^[A-Za-zÀ-ÿ\s']+$/.test(value), 'Nome deve conter apenas letras e espaços')
  ],
  cpf: [
    validateRequired('CPF é obrigatório'),
    validateCPF()
  ],
  email: [
    validateRequired('E-mail é obrigatório'),
    validateEmail()
  ],
  telefone: [
    validateRequired('Telefone é obrigatório'),
    validateTelefoneFixo()
  ],
  dataNascimento: [
    validateRequired('Data de nascimento é obrigatória'),
    validateDate('Data de nascimento inválida')
  ],
  'dadosBancarios.banco': [
    validateRequired('Banco é obrigatório'),
    createValidationRule((value: string) => value.length >= 3 && value.length <= 100, 'Nome do banco deve ter entre 3 e 100 caracteres')
  ],
  'dadosBancarios.agencia': [
    validateRequired('Agência é obrigatória'),
    validateRegex(/^[0-9]{4}$/, 'Agência deve ter 4 dígitos')
  ],
  'dadosBancarios.conta': [
    validateRequired('Conta é obrigatória'),
    validateRegex(/^[0-9]{5}-[0-9]$/, 'Conta deve estar no formato 00000-0')
  ],
  'dadosBancarios.tipoConta': [
    validateRequired('Tipo de conta é obrigatório'),
    createValidationRule((value: string) => ['corrente', 'poupanca'].includes(value), 'Tipo de conta deve ser corrente ou poupança')
  ],
  'dadosImovel.tipoImovel': [
    validateRequired('Tipo de imóvel é obrigatório'),
    createValidationRule((value: string) => ['proprio', 'alugado', 'cedido'].includes(value), 'Tipo de imóvel deve ser próprio, alugado ou cedido')
  ],
  'dadosImovel.numeroEmpregados': [
    validateRequired('Número de empregados é obrigatório'),
    createValidationRule((value: number) => value > 0 && Number.isInteger(value), 'Número de empregados deve ser um número inteiro positivo')
  ],
  'endereco.logradouro': [
    validateRequired('Logradouro é obrigatório'),
    createValidationRule((value: string) => value.length >= 3 && value.length <= 200, 'Logradouro deve ter entre 3 e 200 caracteres')
  ],
  'endereco.numero': [
    validateRequired('Número é obrigatório'),
    createValidationRule((value: string) => value.length >= 1 && value.length <= 10, 'Número deve ter entre 1 e 10 caracteres')
  ],
  'endereco.complemento': [
    createValidationRule((value: string) => !value || value.length <= 50, 'Complemento deve ter no máximo 50 caracteres')
  ],
  'endereco.bairro': [
    validateRequired('Bairro é obrigatório'),
    createValidationRule((value: string) => value.length >= 3 && value.length <= 100, 'Bairro deve ter entre 3 e 100 caracteres')
  ],
  'endereco.cidade': [
    validateRequired('Cidade é obrigatória'),
    createValidationRule((value: string) => value.length >= 3 && value.length <= 100, 'Cidade deve ter entre 3 e 100 caracteres')
  ],
  'endereco.estado': [
    validateRequired('Estado é obrigatório'),
    validateRegex(/^[A-Z]{2}$/, 'Estado deve ter 2 letras maiúsculas')
  ],
  'endereco.cep': [
    validateRequired('CEP é obrigatório'),
    validateCEP()
  ],
  'dadosFamiliares.nomeMae': [
    validateRequired('Nome da mãe é obrigatório'),
    createValidationRule((value: string) => value.length >= 3 && value.length <= 100, 'Nome da mãe deve ter entre 3 e 100 caracteres')
  ],
  'dadosFamiliares.nomePai': [
    validateRequired('Nome do pai é obrigatório'),
    createValidationRule((value: string) => value.length >= 3 && value.length <= 100, 'Nome do pai deve ter entre 3 e 100 caracteres')
  ]
}; 