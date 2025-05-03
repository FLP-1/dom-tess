import {
  isValidTFirebaseErrorCode,
  getTFirebaseErrorCodeLabel,
  getTFirebaseErrorCodeInfo
} from '../firebase';

describe('TFirebaseErrorCode', () => {
  describe('isValidTFirebaseErrorCode', () => {
    it('deve retornar true para tipos válidos', () => {
      expect(isValidTFirebaseErrorCode('auth/email-already-in-use')).toBe(true);
      expect(isValidTFirebaseErrorCode('auth/invalid-email')).toBe(true);
      expect(isValidTFirebaseErrorCode('auth/operation-not-allowed')).toBe(true);
      expect(isValidTFirebaseErrorCode('auth/weak-password')).toBe(true);
      expect(isValidTFirebaseErrorCode('auth/user-disabled')).toBe(true);
      expect(isValidTFirebaseErrorCode('auth/user-not-found')).toBe(true);
      expect(isValidTFirebaseErrorCode('auth/wrong-password')).toBe(true);
      expect(isValidTFirebaseErrorCode('auth/too-many-requests')).toBe(true);
      expect(isValidTFirebaseErrorCode('auth/network-request-failed')).toBe(true);
      expect(isValidTFirebaseErrorCode('auth/requires-recent-login')).toBe(true);
      expect(isValidTFirebaseErrorCode('auth/expired-action-code')).toBe(true);
      expect(isValidTFirebaseErrorCode('auth/invalid-action-code')).toBe(true);
      expect(isValidTFirebaseErrorCode('auth/missing-action-code')).toBe(true);
      expect(isValidTFirebaseErrorCode('auth/invalid-verification-code')).toBe(true);
      expect(isValidTFirebaseErrorCode('auth/invalid-verification-id')).toBe(true);
      expect(isValidTFirebaseErrorCode('auth/code-expired')).toBe(true);
      expect(isValidTFirebaseErrorCode('auth/credential-already-in-use')).toBe(true);
      expect(isValidTFirebaseErrorCode('auth/email-change-needs-verification')).toBe(true);
      expect(isValidTFirebaseErrorCode('auth/invalid-credential')).toBe(true);
      expect(isValidTFirebaseErrorCode('auth/missing-verification-code')).toBe(true);
      expect(isValidTFirebaseErrorCode('auth/missing-verification-id')).toBe(true);
      expect(isValidTFirebaseErrorCode('auth/phone-number-already-in-use')).toBe(true);
      expect(isValidTFirebaseErrorCode('auth/provider-already-linked')).toBe(true);
      expect(isValidTFirebaseErrorCode('auth/unauthorized-domain')).toBe(true);
    });

    it('deve retornar false para tipos inválidos', () => {
      expect(isValidTFirebaseErrorCode('invalid')).toBe(false);
      expect(isValidTFirebaseErrorCode('')).toBe(false);
      expect(isValidTFirebaseErrorCode(null)).toBe(false);
      expect(isValidTFirebaseErrorCode(undefined)).toBe(false);
      expect(isValidTFirebaseErrorCode(123)).toBe(false);
    });
  });

  describe('getTFirebaseErrorCodeLabel', () => {
    it('deve retornar o label correto para tipos válidos', () => {
      expect(getTFirebaseErrorCodeLabel('auth/email-already-in-use')).toBe('E-mail já está em uso');
      expect(getTFirebaseErrorCodeLabel('auth/invalid-email')).toBe('E-mail inválido');
      expect(getTFirebaseErrorCodeLabel('auth/operation-not-allowed')).toBe('Operação não permitida');
      expect(getTFirebaseErrorCodeLabel('auth/weak-password')).toBe('Senha fraca');
      expect(getTFirebaseErrorCodeLabel('auth/user-disabled')).toBe('Usuário desativado');
      expect(getTFirebaseErrorCodeLabel('auth/user-not-found')).toBe('Usuário não encontrado');
      expect(getTFirebaseErrorCodeLabel('auth/wrong-password')).toBe('Senha incorreta');
      expect(getTFirebaseErrorCodeLabel('auth/too-many-requests')).toBe('Muitas tentativas');
      expect(getTFirebaseErrorCodeLabel('auth/network-request-failed')).toBe('Falha na rede');
      expect(getTFirebaseErrorCodeLabel('auth/requires-recent-login')).toBe('Requer login recente');
      expect(getTFirebaseErrorCodeLabel('auth/expired-action-code')).toBe('Código expirado');
      expect(getTFirebaseErrorCodeLabel('auth/invalid-action-code')).toBe('Código inválido');
      expect(getTFirebaseErrorCodeLabel('auth/missing-action-code')).toBe('Código ausente');
      expect(getTFirebaseErrorCodeLabel('auth/invalid-verification-code')).toBe('Código de verificação inválido');
      expect(getTFirebaseErrorCodeLabel('auth/invalid-verification-id')).toBe('ID de verificação inválido');
      expect(getTFirebaseErrorCodeLabel('auth/code-expired')).toBe('Código expirado');
      expect(getTFirebaseErrorCodeLabel('auth/credential-already-in-use')).toBe('Credencial já em uso');
      expect(getTFirebaseErrorCodeLabel('auth/email-change-needs-verification')).toBe('Mudança de e-mail requer verificação');
      expect(getTFirebaseErrorCodeLabel('auth/invalid-credential')).toBe('Credencial inválida');
      expect(getTFirebaseErrorCodeLabel('auth/missing-verification-code')).toBe('Código de verificação ausente');
      expect(getTFirebaseErrorCodeLabel('auth/missing-verification-id')).toBe('ID de verificação ausente');
      expect(getTFirebaseErrorCodeLabel('auth/phone-number-already-in-use')).toBe('Número de telefone já em uso');
      expect(getTFirebaseErrorCodeLabel('auth/provider-already-linked')).toBe('Provedor já vinculado');
      expect(getTFirebaseErrorCodeLabel('auth/unauthorized-domain')).toBe('Domínio não autorizado');
    });

    it('deve retornar undefined para tipos inválidos', () => {
      expect(getTFirebaseErrorCodeLabel('invalid')).toBeUndefined();
      expect(getTFirebaseErrorCodeLabel('')).toBeUndefined();
      expect(getTFirebaseErrorCodeLabel(null)).toBeUndefined();
      expect(getTFirebaseErrorCodeLabel(undefined)).toBeUndefined();
      expect(getTFirebaseErrorCodeLabel(123)).toBeUndefined();
    });
  });

  describe('getTFirebaseErrorCodeInfo', () => {
    it('deve retornar informações completas para tipos válidos', () => {
      const info = getTFirebaseErrorCodeInfo('auth/email-already-in-use');
      expect(info).toEqual({
        label: 'E-mail já está em uso',
        descricao: 'O e-mail fornecido já está sendo usado por outra conta',
        icon: 'email',
        color: 'error'
      });

      const info2 = getTFirebaseErrorCodeInfo('auth/requires-recent-login');
      expect(info2).toEqual({
        label: 'Requer login recente',
        descricao: 'Esta operação requer um login recente',
        icon: 'login',
        color: 'warning'
      });
    });

    it('deve retornar undefined para tipos inválidos', () => {
      expect(getTFirebaseErrorCodeInfo('invalid')).toBeUndefined();
      expect(getTFirebaseErrorCodeInfo('')).toBeUndefined();
      expect(getTFirebaseErrorCodeInfo(null)).toBeUndefined();
      expect(getTFirebaseErrorCodeInfo(undefined)).toBeUndefined();
      expect(getTFirebaseErrorCodeInfo(123)).toBeUndefined();
    });
  });
}); 