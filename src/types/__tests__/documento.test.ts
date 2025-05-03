import { 
  isValidTTipoDocumento, 
  getTTipoDocumentoLabel, 
  getTTipoDocumentoInfo,
  isValidTTipoAlerta,
  getTTipoAlertaLabel,
  getTTipoAlertaInfo,
  isValidTPrioridadeAlerta,
  getTPrioridadeAlertaLabel,
  getTPrioridadeAlertaInfo,
  isValidTStatusAlerta,
  getTStatusAlertaLabel,
  getTStatusAlertaInfo
} from '../documento';

import { EStatus } from '../common';

describe('TTipoDocumento', () => {
  describe('isValidTTipoDocumento', () => {
    it('deve retornar true para tipos válidos', () => {
      expect(isValidTTipoDocumento('certificado_digital')).toBe(true);
      expect(isValidTTipoDocumento('rg')).toBe(true);
      expect(isValidTTipoDocumento('cpf')).toBe(true);
      expect(isValidTTipoDocumento('ctps')).toBe(true);
      expect(isValidTTipoDocumento('titulo_eleitor')).toBe(true);
      expect(isValidTTipoDocumento('certificado_reservista')).toBe(true);
      expect(isValidTTipoDocumento('comprovante_residencia')).toBe(true);
      expect(isValidTTipoDocumento('atestado_medico')).toBe(true);
      expect(isValidTTipoDocumento('contrato_trabalho')).toBe(true);
      expect(isValidTTipoDocumento('termo_rescisao')).toBe(true);
      expect(isValidTTipoDocumento('outros')).toBe(true);
    });

    it('deve retornar false para tipos inválidos', () => {
      expect(isValidTTipoDocumento('invalid')).toBe(false);
      expect(isValidTTipoDocumento('')).toBe(false);
      expect(isValidTTipoDocumento(null)).toBe(false);
      expect(isValidTTipoDocumento(undefined)).toBe(false);
      expect(isValidTTipoDocumento(123)).toBe(false);
    });
  });

  describe('getTTipoDocumentoLabel', () => {
    it('deve retornar o label correto para cada tipo', () => {
      expect(getTTipoDocumentoLabel('certificado_digital')).toBe('Certificado Digital');
      expect(getTTipoDocumentoLabel('rg')).toBe('RG');
      expect(getTTipoDocumentoLabel('cpf')).toBe('CPF');
      expect(getTTipoDocumentoLabel('ctps')).toBe('CTPS');
      expect(getTTipoDocumentoLabel('titulo_eleitor')).toBe('Título de Eleitor');
      expect(getTTipoDocumentoLabel('certificado_reservista')).toBe('Certificado de Reservista');
      expect(getTTipoDocumentoLabel('comprovante_residencia')).toBe('Comprovante de Residência');
      expect(getTTipoDocumentoLabel('atestado_medico')).toBe('Atestado Médico');
      expect(getTTipoDocumentoLabel('contrato_trabalho')).toBe('Contrato de Trabalho');
      expect(getTTipoDocumentoLabel('termo_rescisao')).toBe('Termo de Rescisão');
      expect(getTTipoDocumentoLabel('outros')).toBe('Outros');
    });

    it('deve retornar undefined para tipos inválidos', () => {
      expect(getTTipoDocumentoLabel('invalid' as any)).toBeUndefined();
    });
  });

  describe('getTTipoDocumentoInfo', () => {
    it('deve retornar informações completas para cada tipo', () => {
      const certificadoInfo = getTTipoDocumentoInfo('certificado_digital');
      expect(certificadoInfo).toEqual({
        label: 'Certificado Digital',
        descricao: 'Certificado digital para assinatura eletrônica',
        icon: 'badge'
      });

      const rgInfo = getTTipoDocumentoInfo('rg');
      expect(rgInfo).toEqual({
        label: 'RG',
        descricao: 'Registro Geral de Identidade',
        icon: 'badge'
      });

      const cpfInfo = getTTipoDocumentoInfo('cpf');
      expect(cpfInfo).toEqual({
        label: 'CPF',
        descricao: 'Cadastro de Pessoa Física',
        icon: 'badge'
      });

      const ctpsInfo = getTTipoDocumentoInfo('ctps');
      expect(ctpsInfo).toEqual({
        label: 'CTPS',
        descricao: 'Carteira de Trabalho e Previdência Social',
        icon: 'work'
      });

      const tituloInfo = getTTipoDocumentoInfo('titulo_eleitor');
      expect(tituloInfo).toEqual({
        label: 'Título de Eleitor',
        descricao: 'Documento de identificação eleitoral',
        icon: 'how_to_vote'
      });

      const reservistaInfo = getTTipoDocumentoInfo('certificado_reservista');
      expect(reservistaInfo).toEqual({
        label: 'Certificado de Reservista',
        descricao: 'Documento militar de reservista',
        icon: 'military_tech'
      });

      const residenciaInfo = getTTipoDocumentoInfo('comprovante_residencia');
      expect(residenciaInfo).toEqual({
        label: 'Comprovante de Residência',
        descricao: 'Documento que comprova endereço',
        icon: 'home'
      });

      const atestadoInfo = getTTipoDocumentoInfo('atestado_medico');
      expect(atestadoInfo).toEqual({
        label: 'Atestado Médico',
        descricao: 'Documento médico com informações de saúde',
        icon: 'medical_services'
      });

      const contratoInfo = getTTipoDocumentoInfo('contrato_trabalho');
      expect(contratoInfo).toEqual({
        label: 'Contrato de Trabalho',
        descricao: 'Documento que formaliza a relação de trabalho',
        icon: 'description'
      });

      const rescisaoInfo = getTTipoDocumentoInfo('termo_rescisao');
      expect(rescisaoInfo).toEqual({
        label: 'Termo de Rescisão',
        descricao: 'Documento que formaliza o término do contrato',
        icon: 'description'
      });

      const outrosInfo = getTTipoDocumentoInfo('outros');
      expect(outrosInfo).toEqual({
        label: 'Outros',
        descricao: 'Outros tipos de documentos',
        icon: 'description'
      });
    });

    it('deve retornar undefined para tipos inválidos', () => {
      expect(getTTipoDocumentoInfo('invalid' as any)).toBeUndefined();
    });
  });
});

describe('TTipoAlerta', () => {
  describe('isValidTTipoAlerta', () => {
    it('deve retornar true para tipos válidos', () => {
      expect(isValidTTipoAlerta('vencimento')).toBe(true);
      expect(isValidTTipoAlerta('atualizacao')).toBe(true);
      expect(isValidTTipoAlerta('pendencia')).toBe(true);
      expect(isValidTTipoAlerta('rejeicao')).toBe(true);
    });

    it('deve retornar false para tipos inválidos', () => {
      expect(isValidTTipoAlerta('invalid')).toBe(false);
      expect(isValidTTipoAlerta('')).toBe(false);
      expect(isValidTTipoAlerta(null)).toBe(false);
      expect(isValidTTipoAlerta(undefined)).toBe(false);
      expect(isValidTTipoAlerta(123)).toBe(false);
    });
  });

  describe('getTTipoAlertaLabel', () => {
    it('deve retornar o label correto para cada tipo', () => {
      expect(getTTipoAlertaLabel('vencimento')).toBe('Vencimento');
      expect(getTTipoAlertaLabel('atualizacao')).toBe('Atualização');
      expect(getTTipoAlertaLabel('pendencia')).toBe('Pendência');
      expect(getTTipoAlertaLabel('rejeicao')).toBe('Rejeição');
    });

    it('deve retornar undefined para tipos inválidos', () => {
      expect(getTTipoAlertaLabel('invalid' as any)).toBeUndefined();
    });
  });

  describe('getTTipoAlertaInfo', () => {
    it('deve retornar informações completas para cada tipo', () => {
      const vencimentoInfo = getTTipoAlertaInfo('vencimento');
      expect(vencimentoInfo).toEqual({
        label: 'Vencimento',
        descricao: 'Alerta de vencimento de documento',
        icon: 'event_busy'
      });

      const atualizacaoInfo = getTTipoAlertaInfo('atualizacao');
      expect(atualizacaoInfo).toEqual({
        label: 'Atualização',
        descricao: 'Alerta para atualização de documento',
        icon: 'update'
      });

      const pendenciaInfo = getTTipoAlertaInfo('pendencia');
      expect(pendenciaInfo).toEqual({
        label: 'Pendência',
        descricao: 'Alerta de pendência em documento',
        icon: 'warning'
      });

      const rejeicaoInfo = getTTipoAlertaInfo('rejeicao');
      expect(rejeicaoInfo).toEqual({
        label: 'Rejeição',
        descricao: 'Alerta de rejeição de documento',
        icon: 'cancel'
      });
    });

    it('deve retornar undefined para tipos inválidos', () => {
      expect(getTTipoAlertaInfo('invalid' as any)).toBeUndefined();
    });
  });
});

describe('TPrioridadeAlerta', () => {
  describe('isValidTPrioridadeAlerta', () => {
    it('deve retornar true para tipos válidos', () => {
      expect(isValidTPrioridadeAlerta('baixa')).toBe(true);
      expect(isValidTPrioridadeAlerta('media')).toBe(true);
      expect(isValidTPrioridadeAlerta('alta')).toBe(true);
    });

    it('deve retornar false para tipos inválidos', () => {
      expect(isValidTPrioridadeAlerta('invalid')).toBe(false);
      expect(isValidTPrioridadeAlerta('')).toBe(false);
      expect(isValidTPrioridadeAlerta(null)).toBe(false);
      expect(isValidTPrioridadeAlerta(undefined)).toBe(false);
      expect(isValidTPrioridadeAlerta(123)).toBe(false);
    });
  });

  describe('getTPrioridadeAlertaLabel', () => {
    it('deve retornar o label correto para cada tipo', () => {
      expect(getTPrioridadeAlertaLabel('baixa')).toBe('Baixa');
      expect(getTPrioridadeAlertaLabel('media')).toBe('Média');
      expect(getTPrioridadeAlertaLabel('alta')).toBe('Alta');
    });

    it('deve retornar undefined para tipos inválidos', () => {
      expect(getTPrioridadeAlertaLabel('invalid' as any)).toBeUndefined();
    });
  });

  describe('getTPrioridadeAlertaInfo', () => {
    it('deve retornar informações completas para cada tipo', () => {
      const baixaInfo = getTPrioridadeAlertaInfo('baixa');
      expect(baixaInfo).toEqual({
        label: 'Baixa',
        descricao: 'Prioridade baixa para o alerta',
        icon: 'arrow_downward',
        color: 'success'
      });

      const mediaInfo = getTPrioridadeAlertaInfo('media');
      expect(mediaInfo).toEqual({
        label: 'Média',
        descricao: 'Prioridade média para o alerta',
        icon: 'arrow_forward',
        color: 'warning'
      });

      const altaInfo = getTPrioridadeAlertaInfo('alta');
      expect(altaInfo).toEqual({
        label: 'Alta',
        descricao: 'Prioridade alta para o alerta',
        icon: 'arrow_upward',
        color: 'error'
      });
    });

    it('deve retornar undefined para tipos inválidos', () => {
      expect(getTPrioridadeAlertaInfo('invalid' as any)).toBeUndefined();
    });
  });
});

describe('TStatusAlerta', () => {
  describe('isValidTStatusAlerta', () => {
    it('deve retornar true para tipos válidos', () => {
      expect(isValidTStatusAlerta(EStatus.PENDING)).toBe(true);
      expect(isValidTStatusAlerta(EStatus.ACTIVE)).toBe(true);
      expect(isValidTStatusAlerta(EStatus.INACTIVE)).toBe(true);
    });

    it('deve retornar false para tipos inválidos', () => {
      expect(isValidTStatusAlerta('invalid')).toBe(false);
      expect(isValidTStatusAlerta('')).toBe(false);
      expect(isValidTStatusAlerta(null)).toBe(false);
      expect(isValidTStatusAlerta(undefined)).toBe(false);
      expect(isValidTStatusAlerta(123)).toBe(false);
    });
  });

  describe('getTStatusAlertaLabel', () => {
    it('deve retornar o label correto para cada tipo', () => {
      expect(getTStatusAlertaLabel(EStatus.PENDING)).toBe('Pendente');
      expect(getTStatusAlertaLabel(EStatus.ACTIVE)).toBe('Ativo');
      expect(getTStatusAlertaLabel(EStatus.INACTIVE)).toBe('Inativo');
    });

    it('deve retornar undefined para tipos inválidos', () => {
      expect(getTStatusAlertaLabel('invalid' as any)).toBeUndefined();
    });
  });

  describe('getTStatusAlertaInfo', () => {
    it('deve retornar informações completas para cada tipo', () => {
      const pendingInfo = getTStatusAlertaInfo(EStatus.PENDING);
      expect(pendingInfo).toEqual({
        label: 'Pendente',
        descricao: 'Alerta pendente de processamento',
        icon: 'schedule',
        color: 'warning'
      });

      const activeInfo = getTStatusAlertaInfo(EStatus.ACTIVE);
      expect(activeInfo).toEqual({
        label: 'Ativo',
        descricao: 'Alerta ativo e sendo monitorado',
        icon: 'check_circle',
        color: 'success'
      });

      const inactiveInfo = getTStatusAlertaInfo(EStatus.INACTIVE);
      expect(inactiveInfo).toEqual({
        label: 'Inativo',
        descricao: 'Alerta inativo ou resolvido',
        icon: 'cancel',
        color: 'error'
      });
    });

    it('deve retornar undefined para tipos inválidos', () => {
      expect(getTStatusAlertaInfo('invalid' as any)).toBeUndefined();
    });
  });
}); 