import { describe, it, expect } from 'vitest';
import {
  ETipoEmpregador,
  ETipoConta,
  ETipoImovel,
  isValidTipoEmpregador,
  getTipoEmpregadorLabel,
  getTipoEmpregadorInfo,
  isValidTipoConta,
  getTipoContaLabel,
  getTipoContaInfo,
  isValidTipoImovel,
  getTipoImovelLabel,
  getTipoImovelInfo,
  validateCamposImovel,
  getDocumentosImovel,
  calcularValorAluguel,
  IEmpregador,
  IEmpregadorPF,
  IEmpregadorPJ
} from '../empregador';

describe('Tipos do Empregador', () => {
  describe('Estrutura do Empregador', () => {
    it('deve permitir criar empregador PF com CPF', () => {
      const empregadorPF: IEmpregadorPF = {
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        nome: 'João Silva',
        tipo: ETipoEmpregador.PF,
        cpf: '123.456.789-00',
        email: 'joao@email.com',
        telefone: '11999999999',
        documentos: [],
        status: 'active'
      };

      expect(empregadorPF.tipo).toBe(ETipoEmpregador.PF);
      expect(empregadorPF.cpf).toBe('123.456.789-00');
    });

    it('deve permitir criar empregador PJ com CNPJ', () => {
      const empregadorPJ: IEmpregadorPJ = {
        id: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
        nome: 'Empresa XYZ',
        tipo: ETipoEmpregador.PJ,
        cnpj: '12.345.678/0001-90',
        email: 'contato@empresa.com',
        telefone: '11999999999',
        documentos: [],
        status: 'active'
      };

      expect(empregadorPJ.tipo).toBe(ETipoEmpregador.PJ);
      expect(empregadorPJ.cnpj).toBe('12.345.678/0001-90');
    });

    it('não deve permitir empregador PF com CNPJ', () => {
      // @ts-expect-error - Testando erro de tipo
      const empregadorPF: IEmpregadorPF = {
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        nome: 'João Silva',
        tipo: ETipoEmpregador.PF,
        cpf: '123.456.789-00',
        cnpj: '12.345.678/0001-90', // Não deve permitir
        email: 'joao@email.com',
        telefone: '11999999999',
        documentos: [],
        status: 'active'
      };
    });

    it('não deve permitir empregador PJ com CPF', () => {
      // @ts-expect-error - Testando erro de tipo
      const empregadorPJ: IEmpregadorPJ = {
        id: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
        nome: 'Empresa XYZ',
        tipo: ETipoEmpregador.PJ,
        cnpj: '12.345.678/0001-90',
        cpf: '123.456.789-00', // Não deve permitir
        email: 'contato@empresa.com',
        telefone: '11999999999',
        documentos: [],
        status: 'active'
      };
    });

    it('deve permitir usar IEmpregador como tipo união', () => {
      const empregadorPF: IEmpregador = {
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        nome: 'João Silva',
        tipo: ETipoEmpregador.PF,
        cpf: '123.456.789-00',
        email: 'joao@email.com',
        telefone: '11999999999',
        documentos: [],
        status: 'active'
      };

      const empregadorPJ: IEmpregador = {
        id: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
        nome: 'Empresa XYZ',
        tipo: ETipoEmpregador.PJ,
        cnpj: '12.345.678/0001-90',
        email: 'contato@empresa.com',
        telefone: '11999999999',
        documentos: [],
        status: 'active'
      };

      expect(empregadorPF.tipo).toBe(ETipoEmpregador.PF);
      expect(empregadorPJ.tipo).toBe(ETipoEmpregador.PJ);
    });
  });

  describe('TipoEmpregador', () => {
    it('deve ter os valores corretos', () => {
      expect(ETipoEmpregador.PF).toBe('pf');
      expect(ETipoEmpregador.PJ).toBe('pj');
    });

    it('deve validar tipos corretamente', () => {
      expect(isValidTipoEmpregador('pf')).toBe(true);
      expect(isValidTipoEmpregador('pj')).toBe(true);
      expect(isValidTipoEmpregador('invalid')).toBe(false);
      expect(isValidTipoEmpregador(123)).toBe(false);
      expect(isValidTipoEmpregador(null)).toBe(false);
      expect(isValidTipoEmpregador(undefined)).toBe(false);
    });

    it('deve retornar labels corretos', () => {
      expect(getTipoEmpregadorLabel(ETipoEmpregador.PF)).toBe('Pessoa Física');
      expect(getTipoEmpregadorLabel(ETipoEmpregador.PJ)).toBe('Pessoa Jurídica');
      expect(getTipoEmpregadorLabel('invalid' as ETipoEmpregador)).toBeUndefined();
    });

    it('deve retornar informações completas', () => {
      const infoPF = getTipoEmpregadorInfo(ETipoEmpregador.PF);
      expect(infoPF).toEqual({
        label: 'Pessoa Física',
        descricao: 'Empregador individual',
        icon: 'person'
      });

      const infoPJ = getTipoEmpregadorInfo(ETipoEmpregador.PJ);
      expect(infoPJ).toEqual({
        label: 'Pessoa Jurídica',
        descricao: 'Empresa ou organização',
        icon: 'business'
      });

      expect(getTipoEmpregadorInfo('invalid' as ETipoEmpregador)).toBeUndefined();
    });
  });

  describe('TipoImovel', () => {
    it('deve ter os valores corretos', () => {
      expect(ETipoImovel.PROPRIO).toBe('proprio');
      expect(ETipoImovel.ALUGADO).toBe('alugado');
      expect(ETipoImovel.CEDIDO).toBe('cedido');
    });

    it('deve validar tipos corretamente', () => {
      expect(isValidTipoImovel('proprio')).toBe(true);
      expect(isValidTipoImovel('alugado')).toBe(true);
      expect(isValidTipoImovel('cedido')).toBe(true);
      expect(isValidTipoImovel('invalid')).toBe(false);
      expect(isValidTipoImovel(123)).toBe(false);
      expect(isValidTipoImovel(null)).toBe(false);
      expect(isValidTipoImovel(undefined)).toBe(false);
    });

    it('deve retornar labels corretos', () => {
      expect(getTipoImovelLabel(ETipoImovel.PROPRIO)).toBe('Próprio');
      expect(getTipoImovelLabel(ETipoImovel.ALUGADO)).toBe('Alugado');
      expect(getTipoImovelLabel(ETipoImovel.CEDIDO)).toBe('Cedido');
      expect(getTipoImovelLabel('invalid' as ETipoImovel)).toBeUndefined();
    });

    it('deve retornar informações completas', () => {
      const infoProprio = getTipoImovelInfo(ETipoImovel.PROPRIO);
      expect(infoProprio).toEqual({
        label: 'Próprio',
        descricao: 'Imóvel de propriedade do empregador',
        icon: 'home'
      });

      const infoAlugado = getTipoImovelInfo(ETipoImovel.ALUGADO);
      expect(infoAlugado).toEqual({
        label: 'Alugado',
        descricao: 'Imóvel alugado de terceiros',
        icon: 'apartment'
      });

      const infoCedido = getTipoImovelInfo(ETipoImovel.CEDIDO);
      expect(infoCedido).toEqual({
        label: 'Cedido',
        descricao: 'Imóvel cedido por terceiros',
        icon: 'house'
      });

      expect(getTipoImovelInfo('invalid' as ETipoImovel)).toBeUndefined();
    });
  });

  describe('Validação de Campos do Imóvel', () => {
    it('deve validar campos obrigatórios para imóvel próprio', () => {
      const dados: Partial<IEmpregador['imovel']> = {
        tipo: ETipoImovel.PROPRIO,
        endereco: {
          cep: '12345-678',
          logradouro: 'Rua Teste',
          numero: '123',
          bairro: 'Centro',
          cidade: 'São Paulo',
          estado: 'SP'
        }
      };

      expect(validateCamposImovel(ETipoImovel.PROPRIO, dados)).toEqual([]);
    });

    it('deve validar campos obrigatórios para imóvel alugado', () => {
      const dados: Partial<IEmpregador['imovel']> = {
        tipo: ETipoImovel.ALUGADO,
        endereco: {
          cep: '12345-678',
          logradouro: 'Rua Teste',
          numero: '123',
          bairro: 'Centro',
          cidade: 'São Paulo',
          estado: 'SP'
        },
        valorAluguel: 1000,
        dataInicio: new Date()
      };

      expect(validateCamposImovel(ETipoImovel.ALUGADO, dados)).toEqual([]);
    });

    it('deve retornar campos faltantes', () => {
      const dados: Partial<IEmpregador['imovel']> = {
        tipo: ETipoImovel.PROPRIO
      };

      const camposFaltantes = validateCamposImovel(ETipoImovel.PROPRIO, dados);
      expect(camposFaltantes).toContain('endereco');
    });
  });

  describe('Documentos do Imóvel', () => {
    it('deve retornar documentos para imóvel próprio', () => {
      const docs = getDocumentosImovel(ETipoImovel.PROPRIO);
      expect(docs).toContain('escritura');
      expect(docs).toContain('iptu');
      expect(docs).toContain('registro_imovel');
    });

    it('deve retornar documentos para imóvel alugado', () => {
      const docs = getDocumentosImovel(ETipoImovel.ALUGADO);
      expect(docs).toContain('escritura');
      expect(docs).toContain('iptu');
      expect(docs).toContain('contrato_aluguel');
    });

    it('deve retornar documentos para imóvel cedido', () => {
      const docs = getDocumentosImovel(ETipoImovel.CEDIDO);
      expect(docs).toContain('escritura');
      expect(docs).toContain('iptu');
      expect(docs).toContain('termo_cessao');
    });
  });

  describe('Cálculo de Valor do Aluguel', () => {
    it('deve calcular valor do aluguel corretamente', () => {
      expect(calcularValorAluguel(ETipoImovel.ALUGADO, 100, 3)).toBeGreaterThan(0);
      expect(calcularValorAluguel(ETipoImovel.ALUGADO, 50, 5)).toBeGreaterThan(0);
    });

    it('deve retornar 0 para imóveis não alugados', () => {
      expect(calcularValorAluguel(ETipoImovel.PROPRIO, 100, 3)).toBe(0);
      expect(calcularValorAluguel(ETipoImovel.CEDIDO, 100, 3)).toBe(0);
    });

    it('deve validar período do aluguel', () => {
      const valor1 = calcularValorAluguel(ETipoImovel.ALUGADO, 100, 0);
      const valor2 = calcularValorAluguel(ETipoImovel.ALUGADO, 100, 6);
      const valor3 = calcularValorAluguel(ETipoImovel.ALUGADO, 100, 3);

      expect(valor1).toBe(0);
      expect(valor2).toBeGreaterThan(valor3);
    });
  });

  describe('TipoConta', () => {
    it('deve ter os valores corretos', () => {
      expect(ETipoConta.CORRENTE).toBe('corrente');
      expect(ETipoConta.POUPANCA).toBe('poupanca');
      expect(ETipoConta.SALARIO).toBe('salario');
    });

    it('deve validar tipos corretamente', () => {
      expect(isValidTipoConta('corrente')).toBe(true);
      expect(isValidTipoConta('poupanca')).toBe(true);
      expect(isValidTipoConta('salario')).toBe(true);
      expect(isValidTipoConta('invalid')).toBe(false);
      expect(isValidTipoConta(123)).toBe(false);
      expect(isValidTipoConta(null)).toBe(false);
      expect(isValidTipoConta(undefined)).toBe(false);
    });

    it('deve retornar labels corretos', () => {
      expect(getTipoContaLabel(ETipoConta.CORRENTE)).toBe('Conta Corrente');
      expect(getTipoContaLabel(ETipoConta.POUPANCA)).toBe('Conta Poupança');
      expect(getTipoContaLabel(ETipoConta.SALARIO)).toBe('Conta Salário');
      expect(getTipoContaLabel('invalid' as ETipoConta)).toBeUndefined();
    });

    it('deve retornar informações completas', () => {
      const infoCorrente = getTipoContaInfo(ETipoConta.CORRENTE);
      expect(infoCorrente).toEqual({
        label: 'Conta Corrente',
        descricao: 'Conta para movimentações diárias',
        icon: 'account_balance'
      });

      const infoPoupanca = getTipoContaInfo(ETipoConta.POUPANCA);
      expect(infoPoupanca).toEqual({
        label: 'Conta Poupança',
        descricao: 'Conta para investimentos e rendimentos',
        icon: 'savings'
      });

      const infoSalario = getTipoContaInfo(ETipoConta.SALARIO);
      expect(infoSalario).toEqual({
        label: 'Conta Salário',
        descricao: 'Conta específica para recebimento de salário',
        icon: 'payments'
      });

      expect(getTipoContaInfo('invalid' as ETipoConta)).toBeUndefined();
    });
  });
}); 