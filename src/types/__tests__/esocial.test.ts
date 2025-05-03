import { 
  isValidTipoCertificado, 
  getTipoCertificadoLabel, 
  getTipoCertificadoInfo,
  isValidTipoConta,
  getTipoContaLabel,
  getTipoContaInfo,
  isValidTipoBanco,
  getTipoBancoLabel,
  getTipoBancoInfo,
  isValidTipoImovel,
  getTipoImovelLabel,
  getTipoImovelInfo,
  isValidTipoVinculo,
  getTipoVinculoLabel,
  getTipoVinculoInfo
} from '../esocial';

describe('TipoCertificado', () => {
  describe('isValidTipoCertificado', () => {
    it('deve retornar true para tipos válidos', () => {
      expect(isValidTipoCertificado('e-CPF')).toBe(true);
      expect(isValidTipoCertificado('e-CNPJ')).toBe(true);
      expect(isValidTipoCertificado('NF-e')).toBe(true);
    });

    it('deve retornar false para tipos inválidos', () => {
      expect(isValidTipoCertificado('invalid')).toBe(false);
      expect(isValidTipoCertificado('')).toBe(false);
      expect(isValidTipoCertificado(null)).toBe(false);
      expect(isValidTipoCertificado(undefined)).toBe(false);
      expect(isValidTipoCertificado(123)).toBe(false);
    });
  });

  describe('getTipoCertificadoLabel', () => {
    it('deve retornar o label correto para cada tipo', () => {
      expect(getTipoCertificadoLabel('e-CPF')).toBe('e-CPF');
      expect(getTipoCertificadoLabel('e-CNPJ')).toBe('e-CNPJ');
      expect(getTipoCertificadoLabel('NF-e')).toBe('NF-e');
    });

    it('deve retornar undefined para tipos inválidos', () => {
      expect(getTipoCertificadoLabel('invalid' as any)).toBeUndefined();
    });
  });

  describe('getTipoCertificadoInfo', () => {
    it('deve retornar informações completas para cada tipo', () => {
      const eCPFInfo = getTipoCertificadoInfo('e-CPF');
      expect(eCPFInfo).toEqual({
        label: 'e-CPF',
        descricao: 'Certificado digital para pessoa física',
        icon: 'badge'
      });

      const eCNPJInfo = getTipoCertificadoInfo('e-CNPJ');
      expect(eCNPJInfo).toEqual({
        label: 'e-CNPJ',
        descricao: 'Certificado digital para pessoa jurídica',
        icon: 'business'
      });

      const NFeInfo = getTipoCertificadoInfo('NF-e');
      expect(NFeInfo).toEqual({
        label: 'NF-e',
        descricao: 'Certificado digital para emissão de notas fiscais eletrônicas',
        icon: 'receipt'
      });
    });

    it('deve retornar undefined para tipos inválidos', () => {
      expect(getTipoCertificadoInfo('invalid' as any)).toBeUndefined();
    });
  });
});

describe('TipoConta', () => {
  describe('isValidTipoConta', () => {
    it('deve retornar true para tipos válidos', () => {
      expect(isValidTipoConta('corrente')).toBe(true);
      expect(isValidTipoConta('poupanca')).toBe(true);
      expect(isValidTipoConta('salario')).toBe(true);
    });

    it('deve retornar false para tipos inválidos', () => {
      expect(isValidTipoConta('invalid')).toBe(false);
      expect(isValidTipoConta('')).toBe(false);
      expect(isValidTipoConta(null)).toBe(false);
      expect(isValidTipoConta(undefined)).toBe(false);
      expect(isValidTipoConta(123)).toBe(false);
    });
  });

  describe('getTipoContaLabel', () => {
    it('deve retornar o label correto para cada tipo', () => {
      expect(getTipoContaLabel('corrente')).toBe('Conta Corrente');
      expect(getTipoContaLabel('poupanca')).toBe('Conta Poupança');
      expect(getTipoContaLabel('salario')).toBe('Conta Salário');
    });

    it('deve retornar undefined para tipos inválidos', () => {
      expect(getTipoContaLabel('invalid' as any)).toBeUndefined();
    });
  });

  describe('getTipoContaInfo', () => {
    it('deve retornar informações completas para cada tipo', () => {
      const correnteInfo = getTipoContaInfo('corrente');
      expect(correnteInfo).toEqual({
        label: 'Conta Corrente',
        descricao: 'Conta corrente para movimentações financeiras',
        icon: 'account_balance'
      });

      const poupancaInfo = getTipoContaInfo('poupanca');
      expect(poupancaInfo).toEqual({
        label: 'Conta Poupança',
        descricao: 'Conta poupança para investimentos',
        icon: 'savings'
      });

      const salarioInfo = getTipoContaInfo('salario');
      expect(salarioInfo).toEqual({
        label: 'Conta Salário',
        descricao: 'Conta específica para recebimento de salário',
        icon: 'payments'
      });
    });

    it('deve retornar undefined para tipos inválidos', () => {
      expect(getTipoContaInfo('invalid' as any)).toBeUndefined();
    });
  });
});

describe('TipoBanco', () => {
  describe('isValidTipoBanco', () => {
    it('deve retornar true para tipos válidos', () => {
      expect(isValidTipoBanco('banco')).toBe(true);
      expect(isValidTipoBanco('cooperativa')).toBe(true);
      expect(isValidTipoBanco('caixa')).toBe(true);
    });

    it('deve retornar false para tipos inválidos', () => {
      expect(isValidTipoBanco('invalid')).toBe(false);
      expect(isValidTipoBanco('')).toBe(false);
      expect(isValidTipoBanco(null)).toBe(false);
      expect(isValidTipoBanco(undefined)).toBe(false);
      expect(isValidTipoBanco(123)).toBe(false);
    });
  });

  describe('getTipoBancoLabel', () => {
    it('deve retornar o label correto para cada tipo', () => {
      expect(getTipoBancoLabel('banco')).toBe('Banco');
      expect(getTipoBancoLabel('cooperativa')).toBe('Cooperativa');
      expect(getTipoBancoLabel('caixa')).toBe('Caixa Econômica');
    });

    it('deve retornar undefined para tipos inválidos', () => {
      expect(getTipoBancoLabel('invalid' as any)).toBeUndefined();
    });
  });

  describe('getTipoBancoInfo', () => {
    it('deve retornar informações completas para cada tipo', () => {
      const bancoInfo = getTipoBancoInfo('banco');
      expect(bancoInfo).toEqual({
        label: 'Banco',
        descricao: 'Instituição financeira tradicional',
        icon: 'account_balance'
      });

      const cooperativaInfo = getTipoBancoInfo('cooperativa');
      expect(cooperativaInfo).toEqual({
        label: 'Cooperativa',
        descricao: 'Instituição financeira cooperativa',
        icon: 'groups'
      });

      const caixaInfo = getTipoBancoInfo('caixa');
      expect(caixaInfo).toEqual({
        label: 'Caixa Econômica',
        descricao: 'Instituição financeira pública',
        icon: 'account_balance'
      });
    });

    it('deve retornar undefined para tipos inválidos', () => {
      expect(getTipoBancoInfo('invalid' as any)).toBeUndefined();
    });
  });
});

describe('TipoImovel', () => {
  describe('isValidTipoImovel', () => {
    it('deve retornar true para tipos válidos', () => {
      expect(isValidTipoImovel('casa')).toBe(true);
      expect(isValidTipoImovel('apartamento')).toBe(true);
      expect(isValidTipoImovel('terreno')).toBe(true);
      expect(isValidTipoImovel('comercial')).toBe(true);
    });

    it('deve retornar false para tipos inválidos', () => {
      expect(isValidTipoImovel('invalid')).toBe(false);
      expect(isValidTipoImovel('')).toBe(false);
      expect(isValidTipoImovel(null)).toBe(false);
      expect(isValidTipoImovel(undefined)).toBe(false);
      expect(isValidTipoImovel(123)).toBe(false);
    });
  });

  describe('getTipoImovelLabel', () => {
    it('deve retornar o label correto para cada tipo', () => {
      expect(getTipoImovelLabel('casa')).toBe('Casa');
      expect(getTipoImovelLabel('apartamento')).toBe('Apartamento');
      expect(getTipoImovelLabel('terreno')).toBe('Terreno');
      expect(getTipoImovelLabel('comercial')).toBe('Imóvel Comercial');
    });

    it('deve retornar undefined para tipos inválidos', () => {
      expect(getTipoImovelLabel('invalid' as any)).toBeUndefined();
    });
  });

  describe('getTipoImovelInfo', () => {
    it('deve retornar informações completas para cada tipo', () => {
      const casaInfo = getTipoImovelInfo('casa');
      expect(casaInfo).toEqual({
        label: 'Casa',
        descricao: 'Imóvel residencial unifamiliar',
        icon: 'home'
      });

      const apartamentoInfo = getTipoImovelInfo('apartamento');
      expect(apartamentoInfo).toEqual({
        label: 'Apartamento',
        descricao: 'Unidade residencial em condomínio',
        icon: 'apartment'
      });

      const terrenoInfo = getTipoImovelInfo('terreno');
      expect(terrenoInfo).toEqual({
        label: 'Terreno',
        descricao: 'Lote de terra sem edificação',
        icon: 'grass'
      });

      const comercialInfo = getTipoImovelInfo('comercial');
      expect(comercialInfo).toEqual({
        label: 'Imóvel Comercial',
        descricao: 'Imóvel destinado a atividades comerciais',
        icon: 'store'
      });
    });

    it('deve retornar undefined para tipos inválidos', () => {
      expect(getTipoImovelInfo('invalid' as any)).toBeUndefined();
    });
  });
});

describe('TipoVinculo', () => {
  describe('isValidTipoVinculo', () => {
    it('deve retornar true para tipos válidos', () => {
      expect(isValidTipoVinculo('empregado_domestico')).toBe(true);
      expect(isValidTipoVinculo('trabalhador_temporario')).toBe(true);
      expect(isValidTipoVinculo('aprendiz')).toBe(true);
    });

    it('deve retornar false para tipos inválidos', () => {
      expect(isValidTipoVinculo('invalid')).toBe(false);
      expect(isValidTipoVinculo('')).toBe(false);
      expect(isValidTipoVinculo(null)).toBe(false);
      expect(isValidTipoVinculo(undefined)).toBe(false);
      expect(isValidTipoVinculo(123)).toBe(false);
    });
  });

  describe('getTipoVinculoLabel', () => {
    it('deve retornar o label correto para cada tipo', () => {
      expect(getTipoVinculoLabel('empregado_domestico')).toBe('Empregado Doméstico');
      expect(getTipoVinculoLabel('trabalhador_temporario')).toBe('Trabalhador Temporário');
      expect(getTipoVinculoLabel('aprendiz')).toBe('Aprendiz');
    });

    it('deve retornar undefined para tipos inválidos', () => {
      expect(getTipoVinculoLabel('invalid' as any)).toBeUndefined();
    });
  });

  describe('getTipoVinculoInfo', () => {
    it('deve retornar informações completas para cada tipo', () => {
      const empregadoInfo = getTipoVinculoInfo('empregado_domestico');
      expect(empregadoInfo).toEqual({
        label: 'Empregado Doméstico',
        descricao: 'Trabalhador que presta serviços domésticos',
        icon: 'cleaning_services'
      });

      const temporarioInfo = getTipoVinculoInfo('trabalhador_temporario');
      expect(temporarioInfo).toEqual({
        label: 'Trabalhador Temporário',
        descricao: 'Trabalhador contratado por tempo determinado',
        icon: 'work'
      });

      const aprendizInfo = getTipoVinculoInfo('aprendiz');
      expect(aprendizInfo).toEqual({
        label: 'Aprendiz',
        descricao: 'Jovem em processo de aprendizagem profissional',
        icon: 'school'
      });
    });

    it('deve retornar undefined para tipos inválidos', () => {
      expect(getTipoVinculoInfo('invalid' as any)).toBeUndefined();
    });
  });
}); 