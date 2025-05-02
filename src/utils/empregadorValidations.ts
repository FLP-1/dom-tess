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
import { DadosEmpregador, TipoEmpregador, EstadoCivil } from '../types/empregador';

const validateCNPJ = () => createValidationRule<string>(
  (value) => /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/.test(value) && value.length === 18,
  'CNPJ deve estar no formato 00.000.000/0000-00'
);

const validateCEP = () => createValidationRule<string>(
  (value) => /^\d{5}-\d{3}$/.test(value) && value.length === 9,
  'CEP deve estar no formato 00000-000'
);

const validateRG = () => createValidationRule<string>(
  (value) => /^\d{2}\.\d{3}\.\d{3}-[\dX]$/.test(value),
  'RG deve estar no formato 00.000.000-0'
);

const validateTelefoneFixo = () => createValidationRule<string>(
  (value) => /^\(\d{2}\) \d{4}-\d{4}$/.test(value),
  'Telefone fixo deve estar no formato (00) 0000-0000'
);

const validateCelular = () => createValidationRule<string>(
  (value) => /^\(\d{2}\) \d{5}-\d{4}$/.test(value),
  'Celular deve estar no formato (00) 00000-0000'
);

export const empregadorValidationRules = {
  tipoEmpregador: [
    validateRequired('Tipo de empregador é obrigatório'),
    createValidationRule<TipoEmpregador>(
      (value) => ['PF', 'PJ'].includes(value),
      'Tipo de empregador deve ser PF ou PJ'
    )
  ],
  nome: [
    validateRequired('Nome é obrigatório'),
    validateLength(3, 100, 'Nome deve ter entre 3 e 100 caracteres'),
    createValidationRule<string>(
      (value) => /^[A-Za-zÀ-ÿ\s']+$/.test(value),
      'Nome deve conter apenas letras e espaços'
    )
  ],
  cpf: [
    (value, formData: DadosEmpregador) => 
      formData.tipoEmpregador === 'PF' ? validateRequired('CPF é obrigatório')(value) : undefined,
    validateCPF()
  ],
  razaoSocial: [
    (value, formData: DadosEmpregador) =>
      formData.tipoEmpregador === 'PJ' ? validateRequired('Razão social é obrigatória')(value) : undefined,
    validateLength(3, 100, 'Razão social deve ter entre 3 e 100 caracteres')
  ],
  cnpj: [
    (value, formData: DadosEmpregador) =>
      formData.tipoEmpregador === 'PJ' ? validateRequired('CNPJ é obrigatório')(value) : undefined,
    validateCNPJ()
  ],
  email: [
    validateRequired('E-mail é obrigatório'),
    validateEmail()
  ],
  telefone: [
    validateRequired('Telefone é obrigatório'),
    validateTelefoneFixo()
  ],
  celular: [
    validateCelular()
  ],
  dataNascimento: [
    (value, formData: DadosEmpregador) =>
      formData.tipoEmpregador === 'PF' ? validateRequired('Data de nascimento é obrigatória')(value) : undefined,
    validateDate('Data de nascimento inválida')
  ],
  dadosBancarios: {
    banco: [
      validateRequired('Banco é obrigatório'),
      validateLength(3, 100, 'Nome do banco deve ter entre 3 e 100 caracteres')
    ],
    agencia: [
      validateRequired('Agência é obrigatória'),
      validateRegex(/^\d{4}$/, 'Agência deve ter 4 dígitos')
    ],
    conta: [
      validateRequired('Conta é obrigatória'),
      validateRegex(/^\d{5}-\d$/, 'Conta deve estar no formato 00000-0')
    ],
    tipoConta: [
      validateRequired('Tipo de conta é obrigatório'),
      createValidationRule<string>(
        (value) => ['corrente', 'poupanca'].includes(value),
        'Tipo de conta deve ser corrente ou poupança'
      )
    ]
  },
  dadosImovel: {
    tipoImovel: [
      validateRequired('Tipo de imóvel é obrigatório'),
      createValidationRule<string>(
        (value) => ['proprio', 'alugado', 'cedido'].includes(value),
        'Tipo de imóvel deve ser próprio, alugado ou cedido'
      )
    ],
    numeroEmpregados: [
      validateRequired('Número de empregados é obrigatório'),
      createValidationRule<number>(
        (value) => value > 0 && Number.isInteger(value),
        'Número de empregados deve ser um número inteiro positivo'
      )
    ],
    endereco: [
      validateRequired('Endereço é obrigatório'),
      validateLength(3, 200, 'Endereço deve ter entre 3 e 200 caracteres')
    ],
    numero: [
      validateRequired('Número é obrigatório'),
      validateLength(1, 10, 'Número deve ter entre 1 e 10 caracteres')
    ],
    complemento: [
      validateLength(0, 50, 'Complemento deve ter no máximo 50 caracteres')
    ],
    bairro: [
      validateRequired('Bairro é obrigatório'),
      validateLength(3, 100, 'Bairro deve ter entre 3 e 100 caracteres')
    ],
    cidade: [
      validateRequired('Cidade é obrigatória'),
      validateLength(3, 100, 'Cidade deve ter entre 3 e 100 caracteres')
    ],
    estado: [
      validateRequired('Estado é obrigatório'),
      validateRegex(/^[A-Z]{2}$/, 'Estado deve ter 2 letras maiúsculas')
    ],
    cep: [
      validateRequired('CEP é obrigatório'),
      validateCEP()
    ]
  },
  dadosFamiliares: {
    nomeMae: [
      validateRequired('Nome da mãe é obrigatório'),
      validateLength(3, 100, 'Nome da mãe deve ter entre 3 e 100 caracteres')
    ],
    nomePai: [
      validateRequired('Nome do pai é obrigatório'),
      validateLength(3, 100, 'Nome do pai deve ter entre 3 e 100 caracteres')
    ],
    estadoCivil: [
      validateRequired('Estado civil é obrigatório'),
      createValidationRule<EstadoCivil>(
        (value) => ['solteiro', 'casado', 'divorciado', 'viuvo', 'uniao_estavel'].includes(value),
        'Estado civil inválido'
      )
    ],
    conjuge: {
      nome: [
        (value, formData: DadosEmpregador) =>
          ['casado', 'uniao_estavel'].includes(formData.dadosFamiliares.estadoCivil)
            ? validateRequired('Nome do cônjuge é obrigatório')(value)
            : undefined,
        validateLength(3, 100, 'Nome do cônjuge deve ter entre 3 e 100 caracteres')
      ],
      cpf: [
        (value, formData: DadosEmpregador) =>
          ['casado', 'uniao_estavel'].includes(formData.dadosFamiliares.estadoCivil)
            ? validateRequired('CPF do cônjuge é obrigatório')(value)
            : undefined,
        validateCPF()
      ],
      rg: [
        (value, formData: DadosEmpregador) =>
          ['casado', 'uniao_estavel'].includes(formData.dadosFamiliares.estadoCivil)
            ? validateRequired('RG do cônjuge é obrigatório')(value)
            : undefined,
        validateRG()
      ],
      dataNascimento: [
        (value, formData: DadosEmpregador) =>
          ['casado', 'uniao_estavel'].includes(formData.dadosFamiliares.estadoCivil)
            ? validateRequired('Data de nascimento do cônjuge é obrigatória')(value)
            : undefined,
        validateDate('Data de nascimento do cônjuge inválida')
      ]
    }
  }
}; 