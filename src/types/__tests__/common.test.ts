import { describe, it, expect } from 'vitest';
import {
  EStatusValues,
  isValidStatus,
  TEntityId,
  createEntityId,
  isValidEntityId,
  BaseEntitySchema,
  validateField,
  createPaginationLimit,
  PAGINATION_LIMITS,
  isValidPaginationPage,
  TValidationError,
  TServiceError,
  IBaseEvent,
  TEventType,
  IUserPermission,
  TPermission,
  ILogEntry,
  TLogLevel,
  IAppConfig,
  IBaseMessage,
  INotification,
  IAlert,
  IMessage,
  createErrorObject,
  isValidErrorObject,
  createValidationRule,
  EErrorCode,
  EErrorSeverity,
  parseEntityId,
  ValidationRules,
  isValidErrorSeverity,
  compareErrorSeverity,
  getHighestSeverity,
  StatusGroups,
  isStatusInGroup,
  getNextStatus,
  isValidStatusTransition,
  EStatus,
  getStatusLabel,
  getStatusInfo,
  isValidErrorCode,
  getErrorCodeLabel,
  getErrorCodeInfo,
  getErrorSeverityLabel,
  getErrorSeverityInfo,
  isValidEventType,
  getEventTypeLabel,
  getEventTypeInfo,
  isValidPermission,
  getPermissionLabel,
  getPermissionInfo,
  TNotificationType,
  isValidNotificationType,
  getNotificationTypeLabel,
  getNotificationTypeInfo,
  TAlertType,
  isValidAlertType,
  getAlertTypeLabel,
  getAlertTypeInfo,
  isValidValidationRule,
  getValidationRuleLabel,
  getValidationRuleInfo,
  isValidCallbackFunction,
  getCallbackFunctionLabel,
  getCallbackFunctionInfo,
  isValidTHttpStatus,
  getTHttpStatusLabel,
  getTHttpStatusInfo,
  isValidTFilterOperator,
  getTFilterOperatorLabel,
  getTFilterOperatorInfo,
  isValidMessageType,
  getMessageTypeLabel,
  getMessageTypeInfo
} from '../common';

describe('Tipos Base', () => {
  describe('EStatus', () => {
    it('deve ter os status corretos', () => {
      expect(EStatus.ACTIVE).toBe('active');
      expect(EStatus.INACTIVE).toBe('inactive');
      expect(EStatus.PENDING).toBe('pending');
      expect(EStatus.COMPLETED).toBe('completed');
      expect(EStatus.FAILED).toBe('failed');
      expect(EStatus.CANCELLED).toBe('cancelled');
      expect(EStatus.INVALID).toBe('invalid');
      expect(EStatus.NOT_STARTED).toBe('not_started');
      expect(EStatus.IN_PROGRESS).toBe('in_progress');
      expect(EStatus.DELETED).toBe('deleted');
      expect(EStatus.VALID).toBe('valid');
      expect(EStatus.EXPIRED).toBe('expired');
      expect(EStatus.ON_VACATION).toBe('on_vacation');
      expect(EStatus.ON_LEAVE).toBe('on_leave');
      expect(EStatus.DISMISSED).toBe('dismissed');
      expect(EStatus.INCOMPLETE).toBe('incomplete');
    });

    it('deve ter todos os valores como strings', () => {
      Object.values(EStatus).forEach(value => {
        expect(typeof value).toBe('string');
      });
    });

    it('deve ter valores únicos', () => {
      const values = Object.values(EStatus);
      const uniqueValues = new Set(values);
      expect(values.length).toBe(uniqueValues.size);
    });

    describe('StatusGroups', () => {
      it('deve ter grupos de status definidos corretamente', () => {
        expect(StatusGroups.BASIC).toContain(EStatusValues.ACTIVE);
        expect(StatusGroups.BASIC).toContain(EStatusValues.INACTIVE);
        expect(StatusGroups.BASIC).toContain(EStatusValues.PENDING);
        
        expect(StatusGroups.PROGRESS).toContain(EStatusValues.NOT_STARTED);
        expect(StatusGroups.PROGRESS).toContain(EStatusValues.IN_PROGRESS);
        expect(StatusGroups.PROGRESS).toContain(EStatusValues.COMPLETED);
        
        expect(StatusGroups.ABSENCE).toContain(EStatusValues.ON_VACATION);
        expect(StatusGroups.ABSENCE).toContain(EStatusValues.ON_LEAVE);
        
        expect(StatusGroups.TERMINATION).toContain(EStatusValues.DISMISSED);
        expect(StatusGroups.TERMINATION).toContain(EStatusValues.CANCELLED);
        
        expect(StatusGroups.VALIDITY).toContain(EStatusValues.VALID);
        expect(StatusGroups.VALIDITY).toContain(EStatusValues.INVALID);
        expect(StatusGroups.VALIDITY).toContain(EStatusValues.EXPIRED);
      });
    });

    describe('isStatusInGroup', () => {
      it('deve validar se um status pertence a um grupo', () => {
        expect(isStatusInGroup('active', 'BASIC')).toBe(true);
        expect(isStatusInGroup('not_started', 'PROGRESS')).toBe(true);
        expect(isStatusInGroup('on_vacation', 'ABSENCE')).toBe(true);
        expect(isStatusInGroup('dismissed', 'TERMINATION')).toBe(true);
        expect(isStatusInGroup('valid', 'VALIDITY')).toBe(true);
        
        expect(isStatusInGroup('active', 'PROGRESS')).toBe(false);
        expect(isStatusInGroup('not_started', 'BASIC')).toBe(false);
        expect(isStatusInGroup('invalid', 'ABSENCE')).toBe(false);
      });
    });

    describe('getNextStatus', () => {
      it('deve retornar o próximo status válido', () => {
        expect(getNextStatus('not_started', 'PROGRESS')).toBe('in_progress');
        expect(getNextStatus('in_progress', 'PROGRESS')).toBe('completed');
        expect(getNextStatus('completed', 'PROGRESS')).toBeUndefined();
        
        expect(getNextStatus('active', 'BASIC')).toBe('inactive');
        expect(getNextStatus('inactive', 'BASIC')).toBe('pending');
        expect(getNextStatus('pending', 'BASIC')).toBeUndefined();
      });

      it('deve retornar undefined para status inválidos', () => {
        expect(getNextStatus('invalid_status', 'PROGRESS')).toBeUndefined();
        expect(getNextStatus('not_started', 'INVALID_GROUP' as any)).toBeUndefined();
      });
    });

    describe('isValidStatusTransition', () => {
      it('deve validar transições de status corretamente', () => {
        expect(isValidStatusTransition('not_started', 'in_progress', 'PROGRESS')).toBe(true);
        expect(isValidStatusTransition('in_progress', 'completed', 'PROGRESS')).toBe(true);
        expect(isValidStatusTransition('not_started', 'completed', 'PROGRESS')).toBe(false);
        
        expect(isValidStatusTransition('active', 'inactive', 'BASIC')).toBe(true);
        expect(isValidStatusTransition('inactive', 'pending', 'BASIC')).toBe(true);
        expect(isValidStatusTransition('active', 'pending', 'BASIC')).toBe(false);
      });

      it('deve permitir transições para o mesmo status', () => {
        expect(isValidStatusTransition('active', 'active', 'BASIC')).toBe(true);
        expect(isValidStatusTransition('not_started', 'not_started', 'PROGRESS')).toBe(true);
      });

      it('deve retornar false para status inválidos', () => {
        expect(isValidStatusTransition('invalid_status', 'active', 'BASIC')).toBe(false);
        expect(isValidStatusTransition('active', 'invalid_status', 'BASIC')).toBe(false);
        expect(isValidStatusTransition('active', 'inactive', 'INVALID_GROUP' as any)).toBe(false);
      });
    });
  });

  describe('isValidStatus', () => {
    it('deve validar status corretamente', () => {
      expect(isValidStatus('active')).toBe(true);
      expect(isValidStatus('inactive')).toBe(true);
      expect(isValidStatus('pending')).toBe(true);
      expect(isValidStatus('completed')).toBe(true);
      expect(isValidStatus('failed')).toBe(true);
      expect(isValidStatus('cancelled')).toBe(true);
      expect(isValidStatus('invalid')).toBe(true);
      expect(isValidStatus('not_started')).toBe(true);
      expect(isValidStatus('in_progress')).toBe(true);
      expect(isValidStatus('deleted')).toBe(true);
      expect(isValidStatus('valid')).toBe(true);
      expect(isValidStatus('expired')).toBe(true);
      expect(isValidStatus('on_vacation')).toBe(true);
      expect(isValidStatus('on_leave')).toBe(true);
      expect(isValidStatus('dismissed')).toBe(true);
      expect(isValidStatus('incomplete')).toBe(true);
      expect(isValidStatus('unknown')).toBe(false);
      expect(isValidStatus(123)).toBe(false);
      expect(isValidStatus(null)).toBe(false);
      expect(isValidStatus(undefined)).toBe(false);
    });
  });

  describe('getStatusLabel', () => {
    it('deve retornar os labels corretos', () => {
      expect(getStatusLabel(EStatus.ACTIVE)).toBe('Ativo');
      expect(getStatusLabel(EStatus.INACTIVE)).toBe('Inativo');
      expect(getStatusLabel(EStatus.PENDING)).toBe('Pendente');
      expect(getStatusLabel(EStatus.COMPLETED)).toBe('Concluído');
      expect(getStatusLabel(EStatus.FAILED)).toBe('Falhou');
      expect(getStatusLabel(EStatus.CANCELLED)).toBe('Cancelado');
      expect(getStatusLabel(EStatus.INVALID)).toBe('Inválido');
      expect(getStatusLabel(EStatus.NOT_STARTED)).toBe('Não iniciado');
      expect(getStatusLabel(EStatus.IN_PROGRESS)).toBe('Em progresso');
      expect(getStatusLabel(EStatus.DELETED)).toBe('Excluído');
      expect(getStatusLabel(EStatus.VALID)).toBe('Válido');
      expect(getStatusLabel(EStatus.EXPIRED)).toBe('Expirado');
      expect(getStatusLabel(EStatus.ON_VACATION)).toBe('Em férias');
      expect(getStatusLabel(EStatus.ON_LEAVE)).toBe('Em licença');
      expect(getStatusLabel(EStatus.DISMISSED)).toBe('Demitido');
      expect(getStatusLabel(EStatus.INCOMPLETE)).toBe('Incompleto');
    });

    it('deve retornar undefined para valores inválidos', () => {
      expect(getStatusLabel('unknown' as EStatus)).toBeUndefined();
    });
  });

  describe('getStatusInfo', () => {
    it('deve retornar informações completas para cada status', () => {
      const infoActive = getStatusInfo(EStatus.ACTIVE);
      expect(infoActive).toBeDefined();
      expect(infoActive?.label).toBe('Ativo');
      expect(infoActive?.descricao).toBe('Registro ativo e em uso');

      const infoInactive = getStatusInfo(EStatus.INACTIVE);
      expect(infoInactive).toBeDefined();
      expect(infoInactive?.label).toBe('Inativo');
      expect(infoInactive?.descricao).toBe('Registro inativo, mas mantido no sistema');

      const infoPending = getStatusInfo(EStatus.PENDING);
      expect(infoPending).toBeDefined();
      expect(infoPending?.label).toBe('Pendente');
      expect(infoPending?.descricao).toBe('Aguardando processamento ou aprovação');

      const infoNotStarted = getStatusInfo(EStatus.NOT_STARTED);
      expect(infoNotStarted).toBeDefined();
      expect(infoNotStarted?.label).toBe('Não iniciado');
      expect(infoNotStarted?.descricao).toBe('Processo ainda não iniciado');

      const infoInProgress = getStatusInfo(EStatus.IN_PROGRESS);
      expect(infoInProgress).toBeDefined();
      expect(infoInProgress?.label).toBe('Em progresso');
      expect(infoInProgress?.descricao).toBe('Processo em andamento');

      const infoDeleted = getStatusInfo(EStatus.DELETED);
      expect(infoDeleted).toBeDefined();
      expect(infoDeleted?.label).toBe('Excluído');
      expect(infoDeleted?.descricao).toBe('Registro excluído do sistema');

      const infoValid = getStatusInfo(EStatus.VALID);
      expect(infoValid).toBeDefined();
      expect(infoValid?.label).toBe('Válido');
      expect(infoValid?.descricao).toBe('Registro válido e atual');

      const infoExpired = getStatusInfo(EStatus.EXPIRED);
      expect(infoExpired).toBeDefined();
      expect(infoExpired?.label).toBe('Expirado');
      expect(infoExpired?.descricao).toBe('Registro expirado e não mais válido');

      const infoOnVacation = getStatusInfo(EStatus.ON_VACATION);
      expect(infoOnVacation).toBeDefined();
      expect(infoOnVacation?.label).toBe('Em férias');
      expect(infoOnVacation?.descricao).toBe('Registro em férias');

      const infoOnLeave = getStatusInfo(EStatus.ON_LEAVE);
      expect(infoOnLeave).toBeDefined();
      expect(infoOnLeave?.label).toBe('Em licença');
      expect(infoOnLeave?.descricao).toBe('Registro em licença');

      const infoDismissed = getStatusInfo(EStatus.DISMISSED);
      expect(infoDismissed).toBeDefined();
      expect(infoDismissed?.label).toBe('Demitido');
      expect(infoDismissed?.descricao).toBe('Registro demitido do sistema');

      const infoIncomplete = getStatusInfo(EStatus.INCOMPLETE);
      expect(infoIncomplete).toBeDefined();
      expect(infoIncomplete?.label).toBe('Incompleto');
      expect(infoIncomplete?.descricao).toBe('Registro com informações incompletas');
    });

    it('deve retornar undefined para status inválido', () => {
      expect(getStatusInfo('unknown' as EStatus)).toBeUndefined();
    });
  });

  describe('TEntityId', () => {
    it('deve criar IDs válidos sem opções', () => {
      const id = createEntityId();
      expect(isValidEntityId(id)).toBe(true);
      const info = parseEntityId(id);
      expect(info.uuid).toBe(id);
      expect(info.prefix).toBeUndefined();
      expect(info.namespace).toBeUndefined();
      expect(info.timestamp).toBeUndefined();
    });

    it('deve criar IDs com prefixo e namespace', () => {
      const id = createEntityId({
        prefix: 'USER',
        namespace: 'admin'
      });
      expect(isValidEntityId(id)).toBe(true);
      const info = parseEntityId(id);
      expect(info.prefix).toBe('USER');
      expect(info.namespace).toBe('admin');
      expect(isValidUUID(info.uuid)).toBe(true);
    });

    it('deve criar IDs com timestamp', () => {
      const id = createEntityId({ timestamp: true });
      expect(isValidEntityId(id)).toBe(true);
      const info = parseEntityId(id);
      expect(info.timestamp).toBeDefined();
      expect(typeof info.timestamp).toBe('number');
      expect(info.timestamp).toBeLessThanOrEqual(Date.now());
    });

    it('deve criar IDs com todas as opções', () => {
      const id = createEntityId({
        prefix: 'DOC',
        namespace: 'contract',
        timestamp: true
      });
      expect(isValidEntityId(id)).toBe(true);
      const info = parseEntityId(id);
      expect(info.prefix).toBe('DOC');
      expect(info.namespace).toBe('contract');
      expect(isValidUUID(info.uuid)).toBe(true);
      expect(info.timestamp).toBeDefined();
    });

    it('deve validar IDs corretamente', () => {
      const validId1 = createEntityId();
      const validId2 = createEntityId({ prefix: 'TEST' });
      const invalidId1 = '123';
      const invalidId2 = '';
      const invalidId3 = 'not-a-uuid';
      const invalidId4 = 'PREFIX_not-a-uuid';

      expect(isValidEntityId(validId1)).toBe(true);
      expect(isValidEntityId(validId2)).toBe(true);
      expect(isValidEntityId(invalidId1)).toBe(false);
      expect(isValidEntityId(invalidId2)).toBe(false);
      expect(isValidEntityId(invalidId3)).toBe(false);
      expect(isValidEntityId(invalidId4)).toBe(false);
      expect(isValidEntityId(null)).toBe(false);
      expect(isValidEntityId(undefined)).toBe(false);
    });

    it('deve normalizar prefixos e namespaces', () => {
      const id = createEntityId({
        prefix: 'test',
        namespace: 'ADMIN'
      });
      const info = parseEntityId(id);
      expect(info.prefix).toBe('TEST');
      expect(info.namespace).toBe('admin');
    });
  });

  describe('BaseEntitySchema', () => {
    it('deve validar entidades corretamente', () => {
      const validEntity = {
        id: '123',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active'
      };

      const invalidEntity = {
        id: '',
        createdAt: 'invalid',
        updatedAt: 'invalid',
        status: 'unknown'
      };

      expect(BaseEntitySchema.safeParse(validEntity).success).toBe(true);
      expect(BaseEntitySchema.safeParse(invalidEntity).success).toBe(false);
    });
  });

  describe('validateField', () => {
    it('deve validar campos obrigatórios', () => {
      const rules = [ValidationRules.required()];
      expect(validateField('teste', rules).isValid).toBe(true);
      expect(validateField('', rules).isValid).toBe(false);
      expect(validateField(null, rules).isValid).toBe(false);
      expect(validateField(undefined, rules).isValid).toBe(false);
    });

    it('deve validar campos opcionais', () => {
      const rules = [ValidationRules.email()];
      expect(validateField('', rules).isValid).toBe(true);
      expect(validateField(null, rules).isValid).toBe(true);
      expect(validateField('test@example.com', rules).isValid).toBe(true);
      expect(validateField('invalid-email', rules).isValid).toBe(false);
    });

    it('deve validar comprimento de strings', () => {
      const rules = [
        ValidationRules.minLength(3),
        ValidationRules.maxLength(10)
      ];
      expect(validateField('ab', rules).isValid).toBe(false);
      expect(validateField('abc', rules).isValid).toBe(true);
      expect(validateField('abcdefghij', rules).isValid).toBe(true);
      expect(validateField('abcdefghijk', rules).isValid).toBe(false);
    });

    it('deve validar números', () => {
      const rules = [
        ValidationRules.number(),
        ValidationRules.min(0),
        ValidationRules.max(100)
      ];
      expect(validateField(50, rules).isValid).toBe(true);
      expect(validateField(-1, rules).isValid).toBe(false);
      expect(validateField(101, rules).isValid).toBe(false);
      expect(validateField('50', rules).isValid).toBe(false);
    });

    it('deve validar datas', () => {
      const rules = [ValidationRules.date()];
      expect(validateField(new Date(), rules).isValid).toBe(true);
      expect(validateField('2023-01-01', rules).isValid).toBe(false);
      expect(validateField(new Date('invalid'), rules).isValid).toBe(false);
    });

    it('deve validar datas futuras e passadas', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      expect(validateField(futureDate, [ValidationRules.future()]).isValid).toBe(true);
      expect(validateField(pastDate, [ValidationRules.future()]).isValid).toBe(false);
      
      expect(validateField(pastDate, [ValidationRules.past()]).isValid).toBe(true);
      expect(validateField(futureDate, [ValidationRules.past()]).isValid).toBe(false);
    });

    it('deve validar expressões regulares', () => {
      const rules = [ValidationRules.pattern(/^[A-Z]{2}\d{4}$/, 'Formato: XX9999')];
      expect(validateField('AB1234', rules).isValid).toBe(true);
      expect(validateField('A12345', rules).isValid).toBe(false);
      expect(validateField('abc123', rules).isValid).toBe(false);
    });

    it('deve permitir validações customizadas', () => {
      const rules = [
        ValidationRules.custom(
          (value) => Array.isArray(value) && value.length > 0,
          'Array não pode estar vazio'
        )
      ];
      expect(validateField([1, 2, 3], rules).isValid).toBe(true);
      expect(validateField([], rules).isValid).toBe(false);
      expect(validateField('not-array', rules).isValid).toBe(false);
    });

    it('deve retornar mensagens de erro apropriadas', () => {
      const rules = [
        ValidationRules.required('Campo é obrigatório'),
        ValidationRules.email('Email está inválido')
      ];
      
      const result1 = validateField('', rules);
      expect(result1.isValid).toBe(false);
      expect(result1.message).toBe('Campo é obrigatório');
      
      const result2 = validateField('invalid-email', rules);
      expect(result2.isValid).toBe(false);
      expect(result2.message).toBe('Email está inválido');
      
      const result3 = validateField('test@example.com', rules);
      expect(result3.isValid).toBe(true);
      expect(result3.message).toBeUndefined();
    });
  });

  describe('createPaginationLimit', () => {
    it('deve criar limites de paginação válidos', () => {
      expect(createPaginationLimit(10)).toBe(10);
      expect(createPaginationLimit(25)).toBe(25);
      expect(createPaginationLimit(50)).toBe(50);
      expect(createPaginationLimit(100)).toBe(100);
      expect(createPaginationLimit(15)).toBe(10);
    });

    it('deve lançar erro para limites inválidos', () => {
      expect(() => createPaginationLimit(0)).toThrow('O limite deve estar entre 1 e 100');
      expect(() => createPaginationLimit(-1)).toThrow('O limite deve estar entre 1 e 100');
      expect(() => createPaginationLimit(101)).toThrow('O limite deve estar entre 1 e 100');
    });
  });

  describe('isValidPaginationPage', () => {
    it('deve validar páginas corretamente', () => {
      expect(isValidPaginationPage(1)).toBe(true);
      expect(isValidPaginationPage(10)).toBe(true);
      expect(isValidPaginationPage(0)).toBe(false);
      expect(isValidPaginationPage(-1)).toBe(false);
      expect(isValidPaginationPage('1')).toBe(false);
      expect(isValidPaginationPage(null)).toBe(false);
      expect(isValidPaginationPage(undefined)).toBe(false);
    });
  });

  describe('Tipos de Erro', () => {
    it('deve permitir criar erros de validação', () => {
      const validationError: TValidationError = {
        field: 'email',
        message: 'Email inválido',
        code: 'INVALID_EMAIL'
      };

      expect(validationError.field).toBe('email');
      expect(validationError.message).toBe('Email inválido');
      expect(validationError.code).toBe('INVALID_EMAIL');
    });

    it('deve permitir criar erros de serviço', () => {
      const serviceError: TServiceError = {
        code: 'SERVICE_ERROR',
        message: 'Erro ao processar requisição',
        details: { reason: 'timeout' },
        validationErrors: [{
          field: 'email',
          message: 'Email inválido',
          code: 'INVALID_EMAIL'
        }]
      };

      expect(serviceError.code).toBe('SERVICE_ERROR');
      expect(serviceError.message).toBe('Erro ao processar requisição');
      expect(serviceError.validationErrors).toHaveLength(1);
    });
  });

  describe('Eventos', () => {
    it('deve permitir criar eventos', () => {
      const event: IBaseEvent = {
        type: 'create',
        entityId: createEntityId(),
        timestamp: new Date(),
        userId: 'user123',
        metadata: { source: 'web' }
      };

      expect(event.type).toBe('create');
      expect(isValidEntityId(event.entityId)).toBe(true);
      expect(event.userId).toBe('user123');
    });
  });

  describe('Permissões', () => {
    it('deve permitir criar permissões de usuário', () => {
      const permission: IUserPermission = {
        userId: 'user123',
        permissions: ['read', 'write'],
        resources: ['documents', 'users']
      };

      expect(permission.userId).toBe('user123');
      expect(permission.permissions).toContain('read');
      expect(permission.resources).toContain('documents');
    });
  });

  describe('Logs', () => {
    it('deve permitir criar entradas de log', () => {
      const log: ILogEntry = {
        level: 'info',
        message: 'Usuário logado',
        timestamp: new Date(),
        context: { userId: 'user123' }
      };

      expect(log.level).toBe('info');
      expect(log.message).toBe('Usuário logado');
      expect(log.context?.userId).toBe('user123');
    });
  });

  describe('Configurações', () => {
    it('deve permitir criar configurações de aplicação', () => {
      const config: IAppConfig = {
        environment: 'development',
        apiUrl: 'http://localhost:3000',
        timeout: 5000,
        retryAttempts: 3
      };

      expect(config.environment).toBe('development');
      expect(config.apiUrl).toBe('http://localhost:3000');
      expect(config.timeout).toBe(5000);
    });
  });

  describe('Notificações, Alertas e Mensagens', () => {
    it('deve permitir criar notificações', () => {
      const notification: INotification = {
        type: 'success',
        message: 'Operação realizada com sucesso',
        duration: 5000,
        action: {
          label: 'Ver detalhes',
          onClick: () => {}
        }
      };

      expect(notification.type).toBe('success');
      expect(notification.message).toBe('Operação realizada com sucesso');
      expect(notification.duration).toBe(5000);
    });

    it('deve permitir criar alertas', () => {
      const alert: IAlert = {
        type: 'warning',
        message: 'Atenção: dados não salvos',
        title: 'Alerta',
        dismissible: true,
        onDismiss: () => {}
      };

      expect(alert.type).toBe('warning');
      expect(alert.message).toBe('Atenção: dados não salvos');
      expect(alert.dismissible).toBe(true);
    });

    it('deve permitir criar mensagens', () => {
      const message: IMessage = {
        type: 'info',
        message: 'Bem-vindo ao sistema',
        title: 'Boas-vindas',
        icon: 'welcome',
        metadata: { version: '1.0.0' }
      };

      expect(message.type).toBe('info');
      expect(message.message).toBe('Bem-vindo ao sistema');
      expect(message.icon).toBe('welcome');
    });
  });

  describe('TErrorObject', () => {
    it('deve criar um objeto de erro válido com valores padrão', () => {
      const error = createErrorObject(EErrorCode.VALIDATION, 'Mensagem de teste');
      expect(isValidErrorObject(error)).toBe(true);
      expect(error.code).toBe(EErrorCode.VALIDATION);
      expect(error.message).toBe('Mensagem de teste');
      expect(error.timestamp).toBeInstanceOf(Date);
      expect(typeof error.stack).toBe('string');
      expect(error.severity).toBe(EErrorSeverity.MEDIUM);
    });

    it('deve criar um objeto de erro com todas as opções', () => {
      const error = createErrorObject(
        EErrorCode.NOT_FOUND,
        'Recurso não encontrado',
        {
          details: { id: '123' },
          severity: EErrorSeverity.HIGH,
          source: 'UserService'
        }
      );

      expect(error.code).toBe(EErrorCode.NOT_FOUND);
      expect(error.details).toEqual({ id: '123' });
      expect(error.severity).toBe(EErrorSeverity.HIGH);
      expect(error.source).toBe('UserService');
    });

    it('deve validar objetos de erro corretamente', () => {
      const validError = createErrorObject(EErrorCode.INTERNAL, 'Erro interno');
      const invalidError1 = { code: 'INVALID_CODE', message: 'teste' };
      const invalidError2 = { code: EErrorCode.VALIDATION, message: 123 };
      const invalidError3 = {
        code: EErrorCode.VALIDATION,
        message: 'teste',
        severity: 'invalid'
      };

      expect(isValidErrorObject(validError)).toBe(true);
      expect(isValidErrorObject(invalidError1)).toBe(false);
      expect(isValidErrorObject(invalidError2)).toBe(false);
      expect(isValidErrorObject(invalidError3)).toBe(false);
      expect(isValidErrorObject(null)).toBe(false);
      expect(isValidErrorObject(undefined)).toBe(false);
    });

    it('deve permitir diferentes níveis de severidade', () => {
      const lowError = createErrorObject(EErrorCode.VALIDATION, 'Erro leve', {
        severity: EErrorSeverity.LOW
      });
      const criticalError = createErrorObject(EErrorCode.INTERNAL, 'Erro crítico', {
        severity: EErrorSeverity.CRITICAL
      });

      expect(lowError.severity).toBe(EErrorSeverity.LOW);
      expect(criticalError.severity).toBe(EErrorSeverity.CRITICAL);
    });
  });

  describe('EErrorSeverity', () => {
    it('deve ter os valores corretos', () => {
      expect(EErrorSeverity.LOW).toBe('low');
      expect(EErrorSeverity.MEDIUM).toBe('medium');
      expect(EErrorSeverity.HIGH).toBe('high');
      expect(EErrorSeverity.CRITICAL).toBe('critical');
    });

    it('deve validar severidades corretamente', () => {
      expect(isValidErrorSeverity(EErrorSeverity.LOW)).toBe(true);
      expect(isValidErrorSeverity(EErrorSeverity.MEDIUM)).toBe(true);
      expect(isValidErrorSeverity(EErrorSeverity.HIGH)).toBe(true);
      expect(isValidErrorSeverity(EErrorSeverity.CRITICAL)).toBe(true);
      expect(isValidErrorSeverity('unknown')).toBe(false);
      expect(isValidErrorSeverity(null)).toBe(false);
      expect(isValidErrorSeverity(undefined)).toBe(false);
    });

    it('deve comparar severidades corretamente', () => {
      expect(compareErrorSeverity(EErrorSeverity.LOW, EErrorSeverity.MEDIUM)).toBeLessThan(0);
      expect(compareErrorSeverity(EErrorSeverity.MEDIUM, EErrorSeverity.LOW)).toBeGreaterThan(0);
      expect(compareErrorSeverity(EErrorSeverity.HIGH, EErrorSeverity.HIGH)).toBe(0);
      expect(compareErrorSeverity(EErrorSeverity.CRITICAL, EErrorSeverity.HIGH)).toBeGreaterThan(0);
    });

    it('deve retornar a maior severidade', () => {
      expect(getHighestSeverity(EErrorSeverity.LOW, EErrorSeverity.MEDIUM)).toBe(EErrorSeverity.MEDIUM);
      expect(getHighestSeverity(EErrorSeverity.HIGH, EErrorSeverity.MEDIUM)).toBe(EErrorSeverity.HIGH);
      expect(getHighestSeverity(EErrorSeverity.CRITICAL, EErrorSeverity.HIGH)).toBe(EErrorSeverity.CRITICAL);
    });

    describe('getErrorSeverityLabel', () => {
      it('deve retornar os labels corretos', () => {
        expect(getErrorSeverityLabel(EErrorSeverity.LOW)).toBe('Baixa');
        expect(getErrorSeverityLabel(EErrorSeverity.MEDIUM)).toBe('Média');
        expect(getErrorSeverityLabel(EErrorSeverity.HIGH)).toBe('Alta');
        expect(getErrorSeverityLabel(EErrorSeverity.CRITICAL)).toBe('Crítica');
      });

      it('deve retornar undefined para valores inválidos', () => {
        expect(getErrorSeverityLabel('unknown' as EErrorSeverity)).toBeUndefined();
      });
    });

    describe('getErrorSeverityInfo', () => {
      it('deve retornar informações completas para cada severidade', () => {
        const infoLow = getErrorSeverityInfo(EErrorSeverity.LOW);
        expect(infoLow).toBeDefined();
        expect(infoLow?.label).toBe('Baixa');
        expect(infoLow?.descricao).toBe('Erro com impacto mínimo no sistema');
        expect(infoLow?.color).toBe('yellow');

        const infoMedium = getErrorSeverityInfo(EErrorSeverity.MEDIUM);
        expect(infoMedium).toBeDefined();
        expect(infoMedium?.label).toBe('Média');
        expect(infoMedium?.descricao).toBe('Erro que pode afetar funcionalidades secundárias');
        expect(infoMedium?.color).toBe('orange');

        const infoHigh = getErrorSeverityInfo(EErrorSeverity.HIGH);
        expect(infoHigh).toBeDefined();
        expect(infoHigh?.label).toBe('Alta');
        expect(infoHigh?.descricao).toBe('Erro que afeta funcionalidades principais');
        expect(infoHigh?.color).toBe('red');

        const infoCritical = getErrorSeverityInfo(EErrorSeverity.CRITICAL);
        expect(infoCritical).toBeDefined();
        expect(infoCritical?.label).toBe('Crítica');
        expect(infoCritical?.descricao).toBe('Erro que compromete o funcionamento do sistema');
        expect(infoCritical?.color).toBe('purple');
      });

      it('deve retornar undefined para valores inválidos', () => {
        expect(getErrorSeverityInfo('unknown' as EErrorSeverity)).toBeUndefined();
      });
    });
  });

  describe('EErrorCode', () => {
    it('deve ter os códigos de erro corretos', () => {
      expect(EErrorCode.VALIDATION).toBe('VALIDATION_ERROR');
      expect(EErrorCode.NOT_FOUND).toBe('NOT_FOUND');
      expect(EErrorCode.UNAUTHORIZED).toBe('UNAUTHORIZED');
      expect(EErrorCode.FORBIDDEN).toBe('FORBIDDEN');
      expect(EErrorCode.CONFLICT).toBe('CONFLICT');
      expect(EErrorCode.INTERNAL).toBe('INTERNAL_ERROR');
      expect(EErrorCode.BAD_REQUEST).toBe('BAD_REQUEST');
      expect(EErrorCode.INVALID_INPUT).toBe('INVALID_INPUT');
    });

    it('deve ter todos os valores como strings', () => {
      Object.values(EErrorCode).forEach(value => {
        expect(typeof value).toBe('string');
      });
    });

    it('deve ter valores únicos', () => {
      const values = Object.values(EErrorCode);
      const uniqueValues = new Set(values);
      expect(values.length).toBe(uniqueValues.size);
    });

    describe('isValidErrorCode', () => {
      it('deve validar códigos de erro corretamente', () => {
        expect(isValidErrorCode('VALIDATION_ERROR')).toBe(true);
        expect(isValidErrorCode('NOT_FOUND')).toBe(true);
        expect(isValidErrorCode('UNAUTHORIZED')).toBe(true);
        expect(isValidErrorCode('FORBIDDEN')).toBe(true);
        expect(isValidErrorCode('CONFLICT')).toBe(true);
        expect(isValidErrorCode('INTERNAL_ERROR')).toBe(true);
        expect(isValidErrorCode('BAD_REQUEST')).toBe(true);
        expect(isValidErrorCode('INVALID_INPUT')).toBe(true);
        expect(isValidErrorCode('unknown')).toBe(false);
        expect(isValidErrorCode(123)).toBe(false);
        expect(isValidErrorCode(null)).toBe(false);
        expect(isValidErrorCode(undefined)).toBe(false);
      });
    });

    describe('getErrorCodeLabel', () => {
      it('deve retornar os labels corretos', () => {
        expect(getErrorCodeLabel(EErrorCode.VALIDATION)).toBe('Erro de Validação');
        expect(getErrorCodeLabel(EErrorCode.NOT_FOUND)).toBe('Não Encontrado');
        expect(getErrorCodeLabel(EErrorCode.UNAUTHORIZED)).toBe('Não Autorizado');
        expect(getErrorCodeLabel(EErrorCode.FORBIDDEN)).toBe('Acesso Negado');
        expect(getErrorCodeLabel(EErrorCode.CONFLICT)).toBe('Conflito');
        expect(getErrorCodeLabel(EErrorCode.INTERNAL)).toBe('Erro Interno');
        expect(getErrorCodeLabel(EErrorCode.BAD_REQUEST)).toBe('Requisição Inválida');
        expect(getErrorCodeLabel(EErrorCode.INVALID_INPUT)).toBe('Entrada Inválida');
      });

      it('deve retornar undefined para valores inválidos', () => {
        expect(getErrorCodeLabel('unknown' as EErrorCode)).toBeUndefined();
      });
    });

    describe('getErrorCodeInfo', () => {
      it('deve retornar informações completas para cada código de erro', () => {
        const infoValidation = getErrorCodeInfo(EErrorCode.VALIDATION);
        expect(infoValidation).toBeDefined();
        expect(infoValidation?.label).toBe('Erro de Validação');
        expect(infoValidation?.descricao).toBe('Erro na validação dos dados fornecidos');

        const infoNotFound = getErrorCodeInfo(EErrorCode.NOT_FOUND);
        expect(infoNotFound).toBeDefined();
        expect(infoNotFound?.label).toBe('Não Encontrado');
        expect(infoNotFound?.descricao).toBe('O recurso solicitado não foi encontrado');

        const infoUnauthorized = getErrorCodeInfo(EErrorCode.UNAUTHORIZED);
        expect(infoUnauthorized).toBeDefined();
        expect(infoUnauthorized?.label).toBe('Não Autorizado');
        expect(infoUnauthorized?.descricao).toBe('Usuário não está autorizado a realizar esta ação');

        const infoForbidden = getErrorCodeInfo(EErrorCode.FORBIDDEN);
        expect(infoForbidden).toBeDefined();
        expect(infoForbidden?.label).toBe('Acesso Negado');
        expect(infoForbidden?.descricao).toBe('Acesso negado ao recurso solicitado');

        const infoConflict = getErrorCodeInfo(EErrorCode.CONFLICT);
        expect(infoConflict).toBeDefined();
        expect(infoConflict?.label).toBe('Conflito');
        expect(infoConflict?.descricao).toBe('Conflito com o estado atual do recurso');

        const infoInternal = getErrorCodeInfo(EErrorCode.INTERNAL);
        expect(infoInternal).toBeDefined();
        expect(infoInternal?.label).toBe('Erro Interno');
        expect(infoInternal?.descricao).toBe('Erro interno do servidor');

        const infoBadRequest = getErrorCodeInfo(EErrorCode.BAD_REQUEST);
        expect(infoBadRequest).toBeDefined();
        expect(infoBadRequest?.label).toBe('Requisição Inválida');
        expect(infoBadRequest?.descricao).toBe('A requisição contém dados inválidos');

        const infoInvalidInput = getErrorCodeInfo(EErrorCode.INVALID_INPUT);
        expect(infoInvalidInput).toBeDefined();
        expect(infoInvalidInput?.label).toBe('Entrada Inválida');
        expect(infoInvalidInput?.descricao).toBe('Os dados fornecidos são inválidos');
      });

      it('deve retornar undefined para códigos de erro inválidos', () => {
        expect(getErrorCodeInfo('unknown' as EErrorCode)).toBeUndefined();
      });
    });
  });

  describe('TEventType', () => {
    it('deve ter os valores corretos', () => {
      const validTypes: TEventType[] = ['create', 'update', 'delete', 'status_change'];
      expect(validTypes).toHaveLength(4);
    });

    it('deve validar tipos de evento corretamente', () => {
      expect(isValidEventType('create')).toBe(true);
      expect(isValidEventType('update')).toBe(true);
      expect(isValidEventType('delete')).toBe(true);
      expect(isValidEventType('status_change')).toBe(true);
      expect(isValidEventType('unknown')).toBe(false);
      expect(isValidEventType(null)).toBe(false);
      expect(isValidEventType(undefined)).toBe(false);
    });

    describe('getEventTypeLabel', () => {
      it('deve retornar os labels corretos', () => {
        expect(getEventTypeLabel('create')).toBe('Criação');
        expect(getEventTypeLabel('update')).toBe('Atualização');
        expect(getEventTypeLabel('delete')).toBe('Exclusão');
        expect(getEventTypeLabel('status_change')).toBe('Mudança de Status');
      });

      it('deve retornar undefined para valores inválidos', () => {
        expect(getEventTypeLabel('unknown' as TEventType)).toBeUndefined();
      });
    });

    describe('getEventTypeInfo', () => {
      it('deve retornar informações completas para cada tipo de evento', () => {
        const infoCreate = getEventTypeInfo('create');
        expect(infoCreate).toBeDefined();
        expect(infoCreate?.label).toBe('Criação');
        expect(infoCreate?.descricao).toBe('Evento de criação de um novo registro');
        expect(infoCreate?.icon).toBe('add');

        const infoUpdate = getEventTypeInfo('update');
        expect(infoUpdate).toBeDefined();
        expect(infoUpdate?.label).toBe('Atualização');
        expect(infoUpdate?.descricao).toBe('Evento de atualização de um registro existente');
        expect(infoUpdate?.icon).toBe('edit');

        const infoDelete = getEventTypeInfo('delete');
        expect(infoDelete).toBeDefined();
        expect(infoDelete?.label).toBe('Exclusão');
        expect(infoDelete?.descricao).toBe('Evento de exclusão de um registro');
        expect(infoDelete?.icon).toBe('delete');

        const infoStatusChange = getEventTypeInfo('status_change');
        expect(infoStatusChange).toBeDefined();
        expect(infoStatusChange?.label).toBe('Mudança de Status');
        expect(infoStatusChange?.descricao).toBe('Evento de alteração do status de um registro');
        expect(infoStatusChange?.icon).toBe('sync');
      });

      it('deve retornar undefined para valores inválidos', () => {
        expect(getEventTypeInfo('unknown' as TEventType)).toBeUndefined();
      });
    });
  });

  describe('TPermission', () => {
    describe('isValidPermission', () => {
      it('deve retornar true para permissões válidas', () => {
        expect(isValidPermission('read')).toBe(true);
        expect(isValidPermission('write')).toBe(true);
        expect(isValidPermission('delete')).toBe(true);
        expect(isValidPermission('admin')).toBe(true);
      });

      it('deve retornar false para permissões inválidas', () => {
        expect(isValidPermission('invalid')).toBe(false);
        expect(isValidPermission('')).toBe(false);
        expect(isValidPermission(null)).toBe(false);
        expect(isValidPermission(undefined)).toBe(false);
        expect(isValidPermission(123)).toBe(false);
      });
    });

    describe('getPermissionLabel', () => {
      it('deve retornar o label correto para cada permissão', () => {
        expect(getPermissionLabel('read')).toBe('Leitura');
        expect(getPermissionLabel('write')).toBe('Escrita');
        expect(getPermissionLabel('delete')).toBe('Exclusão');
        expect(getPermissionLabel('admin')).toBe('Administrador');
      });

      it('deve retornar undefined para permissões inválidas', () => {
        expect(getPermissionLabel('invalid' as TPermission)).toBeUndefined();
      });
    });

    describe('getPermissionInfo', () => {
      it('deve retornar informações completas para cada permissão', () => {
        const readInfo = getPermissionInfo('read');
        expect(readInfo).toEqual({
          label: 'Leitura',
          descricao: 'Permissão para visualizar recursos',
          icon: 'visibility'
        });

        const writeInfo = getPermissionInfo('write');
        expect(writeInfo).toEqual({
          label: 'Escrita',
          descricao: 'Permissão para criar e editar recursos',
          icon: 'edit'
        });

        const deleteInfo = getPermissionInfo('delete');
        expect(deleteInfo).toEqual({
          label: 'Exclusão',
          descricao: 'Permissão para excluir recursos',
          icon: 'delete'
        });

        const adminInfo = getPermissionInfo('admin');
        expect(adminInfo).toEqual({
          label: 'Administrador',
          descricao: 'Permissão total sobre todos os recursos',
          icon: 'admin_panel_settings'
        });
      });

      it('deve retornar undefined para permissões inválidas', () => {
        expect(getPermissionInfo('invalid' as TPermission)).toBeUndefined();
      });
    });
  });

  describe('TLogLevel', () => {
    describe('isValidLogLevel', () => {
      it('deve retornar true para níveis de log válidos', () => {
        expect(isValidLogLevel('debug')).toBe(true);
        expect(isValidLogLevel('info')).toBe(true);
        expect(isValidLogLevel('warn')).toBe(true);
        expect(isValidLogLevel('error')).toBe(true);
      });

      it('deve retornar false para níveis de log inválidos', () => {
        expect(isValidLogLevel('invalid')).toBe(false);
        expect(isValidLogLevel('')).toBe(false);
        expect(isValidLogLevel(null)).toBe(false);
        expect(isValidLogLevel(undefined)).toBe(false);
        expect(isValidLogLevel(123)).toBe(false);
      });
    });

    describe('getLogLevelLabel', () => {
      it('deve retornar o label correto para cada nível de log', () => {
        expect(getLogLevelLabel('debug')).toBe('Depuração');
        expect(getLogLevelLabel('info')).toBe('Informação');
        expect(getLogLevelLabel('warn')).toBe('Aviso');
        expect(getLogLevelLabel('error')).toBe('Erro');
      });

      it('deve retornar undefined para níveis de log inválidos', () => {
        expect(getLogLevelLabel('invalid' as TLogLevel)).toBeUndefined();
      });
    });

    describe('getLogLevelInfo', () => {
      it('deve retornar informações completas para cada nível de log', () => {
        const debugInfo = getLogLevelInfo('debug');
        expect(debugInfo).toEqual({
          label: 'Depuração',
          descricao: 'Mensagens de depuração para desenvolvimento',
          color: 'gray',
          icon: 'bug_report'
        });

        const infoInfo = getLogLevelInfo('info');
        expect(infoInfo).toEqual({
          label: 'Informação',
          descricao: 'Mensagens informativas sobre o sistema',
          color: 'blue',
          icon: 'info'
        });

        const warnInfo = getLogLevelInfo('warn');
        expect(warnInfo).toEqual({
          label: 'Aviso',
          descricao: 'Avisos sobre situações que podem precisar de atenção',
          color: 'orange',
          icon: 'warning'
        });

        const errorInfo = getLogLevelInfo('error');
        expect(errorInfo).toEqual({
          label: 'Erro',
          descricao: 'Erros que precisam de atenção imediata',
          color: 'red',
          icon: 'error'
        });
      });

      it('deve retornar undefined para níveis de log inválidos', () => {
        expect(getLogLevelInfo('invalid' as TLogLevel)).toBeUndefined();
      });
    });
  });

  describe('TNotificationType', () => {
    describe('isValidNotificationType', () => {
      it('deve retornar true para tipos de notificação válidos', () => {
        expect(isValidNotificationType('success')).toBe(true);
        expect(isValidNotificationType('error')).toBe(true);
        expect(isValidNotificationType('warning')).toBe(true);
        expect(isValidNotificationType('info')).toBe(true);
      });

      it('deve retornar false para tipos de notificação inválidos', () => {
        expect(isValidNotificationType('invalid')).toBe(false);
        expect(isValidNotificationType('')).toBe(false);
        expect(isValidNotificationType(null)).toBe(false);
        expect(isValidNotificationType(undefined)).toBe(false);
        expect(isValidNotificationType(123)).toBe(false);
      });
    });

    describe('getNotificationTypeLabel', () => {
      it('deve retornar o label correto para cada tipo de notificação', () => {
        expect(getNotificationTypeLabel('success')).toBe('Sucesso');
        expect(getNotificationTypeLabel('error')).toBe('Erro');
        expect(getNotificationTypeLabel('warning')).toBe('Aviso');
        expect(getNotificationTypeLabel('info')).toBe('Informação');
      });

      it('deve retornar undefined para tipos de notificação inválidos', () => {
        expect(getNotificationTypeLabel('invalid' as TNotificationType)).toBeUndefined();
      });
    });

    describe('getNotificationTypeInfo', () => {
      it('deve retornar informações completas para cada tipo de notificação', () => {
        const successInfo = getNotificationTypeInfo('success');
        expect(successInfo).toEqual({
          label: 'Sucesso',
          descricao: 'Operação realizada com sucesso',
          color: 'green',
          icon: 'check_circle'
        });

        const errorInfo = getNotificationTypeInfo('error');
        expect(errorInfo).toEqual({
          label: 'Erro',
          descricao: 'Ocorreu um erro durante a operação',
          color: 'red',
          icon: 'error'
        });

        const warningInfo = getNotificationTypeInfo('warning');
        expect(warningInfo).toEqual({
          label: 'Aviso',
          descricao: 'Atenção: situação que requer cuidado',
          color: 'orange',
          icon: 'warning'
        });

        const infoInfo = getNotificationTypeInfo('info');
        expect(infoInfo).toEqual({
          label: 'Informação',
          descricao: 'Mensagem informativa',
          color: 'blue',
          icon: 'info'
        });
      });

      it('deve retornar undefined para tipos de notificação inválidos', () => {
        expect(getNotificationTypeInfo('invalid' as TNotificationType)).toBeUndefined();
      });
    });
  });

  describe('TAlertType', () => {
    describe('isValidAlertType', () => {
      it('deve retornar true para tipos de alerta válidos', () => {
        expect(isValidAlertType('success')).toBe(true);
        expect(isValidAlertType('error')).toBe(true);
        expect(isValidAlertType('warning')).toBe(true);
        expect(isValidAlertType('info')).toBe(true);
      });

      it('deve retornar false para tipos de alerta inválidos', () => {
        expect(isValidAlertType('invalid')).toBe(false);
        expect(isValidAlertType('')).toBe(false);
        expect(isValidAlertType(null)).toBe(false);
        expect(isValidAlertType(undefined)).toBe(false);
        expect(isValidAlertType(123)).toBe(false);
      });
    });

    describe('getAlertTypeLabel', () => {
      it('deve retornar o label correto para cada tipo de alerta', () => {
        expect(getAlertTypeLabel('success')).toBe('Sucesso');
        expect(getAlertTypeLabel('error')).toBe('Erro');
        expect(getAlertTypeLabel('warning')).toBe('Aviso');
        expect(getAlertTypeLabel('info')).toBe('Informação');
      });

      it('deve retornar undefined para tipos de alerta inválidos', () => {
        expect(getAlertTypeLabel('invalid' as TAlertType)).toBeUndefined();
      });
    });

    describe('getAlertTypeInfo', () => {
      it('deve retornar informações completas para cada tipo de alerta', () => {
        const successInfo = getAlertTypeInfo('success');
        expect(successInfo).toEqual({
          label: 'Sucesso',
          descricao: 'Operação realizada com sucesso',
          color: 'green',
          icon: 'check_circle'
        });

        const errorInfo = getAlertTypeInfo('error');
        expect(errorInfo).toEqual({
          label: 'Erro',
          descricao: 'Ocorreu um erro durante a operação',
          color: 'red',
          icon: 'error'
        });

        const warningInfo = getAlertTypeInfo('warning');
        expect(warningInfo).toEqual({
          label: 'Aviso',
          descricao: 'Atenção: situação que requer cuidado',
          color: 'orange',
          icon: 'warning'
        });

        const infoInfo = getAlertTypeInfo('info');
        expect(infoInfo).toEqual({
          label: 'Informação',
          descricao: 'Mensagem informativa',
          color: 'blue',
          icon: 'info'
        });
      });

      it('deve retornar undefined para tipos de alerta inválidos', () => {
        expect(getAlertTypeInfo('invalid' as TAlertType)).toBeUndefined();
      });
    });
  });

  describe('TValidationRule', () => {
    describe('isValidValidationRule', () => {
      it('deve retornar true para funções de validação válidas', () => {
      });
    });
  });

  describe('TCallbackFunction', () => {
    describe('isValidCallbackFunction', () => {
      it('deve retornar true para funções de callback válidas', () => {
        const validCallbacks = [
          () => {},
          function onSuccess() {},
          function onError() {},
          function onComplete() {},
          function onChange() {},
          function onSubmit() {},
          function onClick() {},
          function onFocus() {},
          function onBlur() {},
          function onKeyDown() {},
          function onKeyUp() {},
          function onMouseEnter() {},
          function onMouseLeave() {},
          function onScroll() {},
          function onResize() {},
          function onLoad() {},
          function onUnload() {}
        ];

        validCallbacks.forEach(callback => {
          expect(isValidCallbackFunction(callback)).toBe(true);
        });
      });

      it('deve retornar false para valores inválidos', () => {
        const invalidCallbacks = [
          null,
          undefined,
          123,
          'string',
          {},
          { name: 'onSuccess' },
          function() {},
          function named() {},
          function withParams(a: number) {}
        ];

        invalidCallbacks.forEach(callback => {
          expect(isValidCallbackFunction(callback)).toBe(false);
        });
      });
    });

    describe('getCallbackFunctionLabel', () => {
      it('deve retornar o label correto para cada tipo de callback', () => {
        const callbacks = {
          onSuccess: 'Sucesso',
          onError: 'Erro',
          onComplete: 'Completo',
          onChange: 'Mudança',
          onSubmit: 'Submeter',
          onClick: 'Clique',
          onFocus: 'Foco',
          onBlur: 'Desfocar',
          onKeyDown: 'Tecla Pressionada',
          onKeyUp: 'Tecla Liberada',
          onMouseEnter: 'Mouse Entrou',
          onMouseLeave: 'Mouse Saiu',
          onScroll: 'Rolagem',
          onResize: 'Redimensionar',
          onLoad: 'Carregar',
          onUnload: 'Descarregar'
        };

        Object.entries(callbacks).forEach(([name, expectedLabel]) => {
          const callback = new Function(name, '');
          expect(getCallbackFunctionLabel(callback)).toBe(expectedLabel);
        });
      });

      it('deve retornar "Callback Personalizado" para callbacks não padronizados', () => {
        const customCallback = new Function('customCallback', '');
        expect(getCallbackFunctionLabel(customCallback)).toBe('Callback Personalizado');
      });

      it('deve retornar undefined para valores inválidos', () => {
        const invalidCallbacks = [
          null,
          undefined,
          123,
          'string',
          {},
          { name: 'onSuccess' }
        ];

        invalidCallbacks.forEach(callback => {
          expect(getCallbackFunctionLabel(callback as any)).toBeUndefined();
        });
      });
    });

    describe('getCallbackFunctionInfo', () => {
      it('deve retornar informações completas para cada tipo de callback', () => {
        const callbacks = {
          onSuccess: {
            label: 'Sucesso',
            descricao: 'Função chamada quando a operação é bem-sucedida',
            icon: 'check_circle'
          },
          onError: {
            label: 'Erro',
            descricao: 'Função chamada quando ocorre um erro',
            icon: 'error'
          },
          onComplete: {
            label: 'Completo',
            descricao: 'Função chamada quando a operação é concluída',
            icon: 'done_all'
          },
          onChange: {
            label: 'Mudança',
            descricao: 'Função chamada quando o valor é alterado',
            icon: 'edit'
          },
          onSubmit: {
            label: 'Submeter',
            descricao: 'Função chamada quando o formulário é submetido',
            icon: 'send'
          },
          onClick: {
            label: 'Clique',
            descricao: 'Função chamada quando o elemento é clicado',
            icon: 'touch_app'
          },
          onFocus: {
            label: 'Foco',
            descricao: 'Função chamada quando o elemento recebe foco',
            icon: 'center_focus_strong'
          },
          onBlur: {
            label: 'Desfocar',
            descricao: 'Função chamada quando o elemento perde foco',
            icon: 'center_focus_weak'
          },
          onKeyDown: {
            label: 'Tecla Pressionada',
            descricao: 'Função chamada quando uma tecla é pressionada',
            icon: 'keyboard'
          },
          onKeyUp: {
            label: 'Tecla Liberada',
            descricao: 'Função chamada quando uma tecla é liberada',
            icon: 'keyboard_return'
          },
          onMouseEnter: {
            label: 'Mouse Entrou',
            descricao: 'Função chamada quando o mouse entra no elemento',
            icon: 'mouse'
          },
          onMouseLeave: {
            label: 'Mouse Saiu',
            descricao: 'Função chamada quando o mouse sai do elemento',
            icon: 'mouse'
          },
          onScroll: {
            label: 'Rolagem',
            descricao: 'Função chamada quando ocorre rolagem',
            icon: 'swap_vert'
          },
          onResize: {
            label: 'Redimensionar',
            descricao: 'Função chamada quando o elemento é redimensionado',
            icon: 'aspect_ratio'
          },
          onLoad: {
            label: 'Carregar',
            descricao: 'Função chamada quando o elemento é carregado',
            icon: 'file_download'
          },
          onUnload: {
            label: 'Descarregar',
            descricao: 'Função chamada quando o elemento é descarregado',
            icon: 'file_upload'
          }
        };

        Object.entries(callbacks).forEach(([name, expectedInfo]) => {
          const callback = new Function(name, '');
          const info = getCallbackFunctionInfo(callback);
          expect(info).toEqual(expectedInfo);
        });
      });

      it('deve retornar informações padrão para callbacks não padronizados', () => {
        const customCallback = new Function('customCallback', '');
        const expectedInfo = {
          label: 'Callback Personalizado',
          descricao: 'Função de callback personalizada',
          icon: 'functions'
        };
        expect(getCallbackFunctionInfo(customCallback)).toEqual(expectedInfo);
      });

      it('deve retornar undefined para valores inválidos', () => {
        const invalidCallbacks = [
          null,
          undefined,
          123,
          'string',
          {},
          { name: 'onSuccess' }
        ];

        invalidCallbacks.forEach(callback => {
          expect(getCallbackFunctionInfo(callback as any)).toBeUndefined();
        });
      });
    });
  });
});

describe('THttpStatus', () => {
  describe('isValidTHttpStatus', () => {
    it('deve retornar true para status válidos', () => {
      expect(isValidTHttpStatus(200)).toBe(true);
      expect(isValidTHttpStatus(201)).toBe(true);
      expect(isValidTHttpStatus(202)).toBe(true);
      expect(isValidTHttpStatus(204)).toBe(true);
      expect(isValidTHttpStatus(400)).toBe(true);
      expect(isValidTHttpStatus(401)).toBe(true);
      expect(isValidTHttpStatus(403)).toBe(true);
      expect(isValidTHttpStatus(404)).toBe(true);
      expect(isValidTHttpStatus(409)).toBe(true);
      expect(isValidTHttpStatus(422)).toBe(true);
      expect(isValidTHttpStatus(500)).toBe(true);
      expect(isValidTHttpStatus(502)).toBe(true);
      expect(isValidTHttpStatus(503)).toBe(true);
      expect(isValidTHttpStatus(504)).toBe(true);
    });

    it('deve retornar false para status inválidos', () => {
      expect(isValidTHttpStatus(100)).toBe(false);
      expect(isValidTHttpStatus(300)).toBe(false);
      expect(isValidTHttpStatus(405)).toBe(false);
      expect(isValidTHttpStatus(501)).toBe(false);
      expect(isValidTHttpStatus('200')).toBe(false);
      expect(isValidTHttpStatus(null)).toBe(false);
      expect(isValidTHttpStatus(undefined)).toBe(false);
    });
  });

  describe('getTHttpStatusLabel', () => {
    it('deve retornar o label correto para status válidos', () => {
      expect(getTHttpStatusLabel(200)).toBe('OK');
      expect(getTHttpStatusLabel(201)).toBe('Criado');
      expect(getTHttpStatusLabel(202)).toBe('Aceito');
      expect(getTHttpStatusLabel(204)).toBe('Sem Conteúdo');
      expect(getTHttpStatusLabel(400)).toBe('Requisição Inválida');
      expect(getTHttpStatusLabel(401)).toBe('Não Autorizado');
      expect(getTHttpStatusLabel(403)).toBe('Acesso Negado');
      expect(getTHttpStatusLabel(404)).toBe('Não Encontrado');
      expect(getTHttpStatusLabel(409)).toBe('Conflito');
      expect(getTHttpStatusLabel(422)).toBe('Entidade Não Processável');
      expect(getTHttpStatusLabel(500)).toBe('Erro Interno do Servidor');
      expect(getTHttpStatusLabel(502)).toBe('Bad Gateway');
      expect(getTHttpStatusLabel(503)).toBe('Serviço Indisponível');
      expect(getTHttpStatusLabel(504)).toBe('Gateway Timeout');
    });

    it('deve retornar undefined para status inválidos', () => {
      expect(getTHttpStatusLabel(100)).toBeUndefined();
      expect(getTHttpStatusLabel(300)).toBeUndefined();
      expect(getTHttpStatusLabel(405)).toBeUndefined();
      expect(getTHttpStatusLabel(501)).toBeUndefined();
      expect(getTHttpStatusLabel('200')).toBeUndefined();
      expect(getTHttpStatusLabel(null)).toBeUndefined();
      expect(getTHttpStatusLabel(undefined)).toBeUndefined();
    });
  });

  describe('getTHttpStatusInfo', () => {
    it('deve retornar informações completas para status válidos', () => {
      const info = getTHttpStatusInfo(200);
      expect(info).toEqual({
        label: 'OK',
        descricao: 'A requisição foi bem-sucedida',
        color: 'success',
        icon: 'check_circle'
      });

      const info2 = getTHttpStatusInfo(404);
      expect(info2).toEqual({
        label: 'Não Encontrado',
        descricao: 'O recurso solicitado não foi encontrado',
        color: 'error',
        icon: 'search_off'
      });
    });

    it('deve retornar undefined para status inválidos', () => {
      expect(getTHttpStatusInfo(100)).toBeUndefined();
      expect(getTHttpStatusInfo(300)).toBeUndefined();
      expect(getTHttpStatusInfo(405)).toBeUndefined();
      expect(getTHttpStatusInfo(501)).toBeUndefined();
      expect(getTHttpStatusInfo('200')).toBeUndefined();
      expect(getTHttpStatusInfo(null)).toBeUndefined();
      expect(getTHttpStatusInfo(undefined)).toBeUndefined();
    });
  });
});

describe('TFilterOperator', () => {
  describe('isValidTFilterOperator', () => {
    it('deve retornar true para operadores válidos', () => {
      expect(isValidTFilterOperator('eq')).toBe(true);
      expect(isValidTFilterOperator('neq')).toBe(true);
      expect(isValidTFilterOperator('gt')).toBe(true);
      expect(isValidTFilterOperator('gte')).toBe(true);
      expect(isValidTFilterOperator('lt')).toBe(true);
      expect(isValidTFilterOperator('lte')).toBe(true);
      expect(isValidTFilterOperator('contains')).toBe(true);
      expect(isValidTFilterOperator('startsWith')).toBe(true);
      expect(isValidTFilterOperator('endsWith')).toBe(true);
      expect(isValidTFilterOperator('in')).toBe(true);
      expect(isValidTFilterOperator('nin')).toBe(true);
      expect(isValidTFilterOperator('exists')).toBe(true);
      expect(isValidTFilterOperator('notExists')).toBe(true);
    });

    it('deve retornar false para operadores inválidos', () => {
      expect(isValidTFilterOperator('invalid')).toBe(false);
      expect(isValidTFilterOperator('')).toBe(false);
      expect(isValidTFilterOperator(null)).toBe(false);
      expect(isValidTFilterOperator(undefined)).toBe(false);
      expect(isValidTFilterOperator(123)).toBe(false);
    });
  });

  describe('getTFilterOperatorLabel', () => {
    it('deve retornar o label correto para operadores válidos', () => {
      expect(getTFilterOperatorLabel('eq')).toBe('Igual a');
      expect(getTFilterOperatorLabel('neq')).toBe('Diferente de');
      expect(getTFilterOperatorLabel('gt')).toBe('Maior que');
      expect(getTFilterOperatorLabel('gte')).toBe('Maior ou igual a');
      expect(getTFilterOperatorLabel('lt')).toBe('Menor que');
      expect(getTFilterOperatorLabel('lte')).toBe('Menor ou igual a');
      expect(getTFilterOperatorLabel('contains')).toBe('Contém');
      expect(getTFilterOperatorLabel('startsWith')).toBe('Começa com');
      expect(getTFilterOperatorLabel('endsWith')).toBe('Termina com');
      expect(getTFilterOperatorLabel('in')).toBe('Está em');
      expect(getTFilterOperatorLabel('nin')).toBe('Não está em');
      expect(getTFilterOperatorLabel('exists')).toBe('Existe');
      expect(getTFilterOperatorLabel('notExists')).toBe('Não existe');
    });

    it('deve retornar undefined para operadores inválidos', () => {
      expect(getTFilterOperatorLabel('invalid')).toBeUndefined();
      expect(getTFilterOperatorLabel('')).toBeUndefined();
      expect(getTFilterOperatorLabel(null)).toBeUndefined();
      expect(getTFilterOperatorLabel(undefined)).toBeUndefined();
      expect(getTFilterOperatorLabel(123)).toBeUndefined();
    });
  });

  describe('getTFilterOperatorInfo', () => {
    it('deve retornar informações completas para operadores válidos', () => {
      const info = getTFilterOperatorInfo('eq');
      expect(info).toEqual({
        label: 'Igual a',
        descricao: 'O valor é igual ao valor fornecido',
        icon: 'equal',
        symbol: '='
      });

      const info2 = getTFilterOperatorInfo('contains');
      expect(info2).toEqual({
        label: 'Contém',
        descricao: 'O valor contém o valor fornecido',
        icon: 'search',
        symbol: '⊃'
      });
    });

    it('deve retornar undefined para operadores inválidos', () => {
      expect(getTFilterOperatorInfo('invalid')).toBeUndefined();
      expect(getTFilterOperatorInfo('')).toBeUndefined();
      expect(getTFilterOperatorInfo(null)).toBeUndefined();
      expect(getTFilterOperatorInfo(undefined)).toBeUndefined();
      expect(getTFilterOperatorInfo(123)).toBeUndefined();
    });
  });
});

describe('TMessageType', () => {
  describe('isValidMessageType', () => {
    it('deve retornar true para tipos válidos', () => {
      expect(isValidMessageType('success')).toBe(true);
      expect(isValidMessageType('error')).toBe(true);
      expect(isValidMessageType('warning')).toBe(true);
      expect(isValidMessageType('info')).toBe(true);
    });

    it('deve retornar false para tipos inválidos', () => {
      expect(isValidMessageType('invalid')).toBe(false);
      expect(isValidMessageType('')).toBe(false);
      expect(isValidMessageType(null)).toBe(false);
      expect(isValidMessageType(undefined)).toBe(false);
      expect(isValidMessageType(123)).toBe(false);
    });
  });

  describe('getMessageTypeLabel', () => {
    it('deve retornar o label correto para cada tipo', () => {
      expect(getMessageTypeLabel('success')).toBe('Sucesso');
      expect(getMessageTypeLabel('error')).toBe('Erro');
      expect(getMessageTypeLabel('warning')).toBe('Alerta');
      expect(getMessageTypeLabel('info')).toBe('Informação');
    });

    it('deve retornar undefined para tipos inválidos', () => {
      expect(getMessageTypeLabel('invalid' as any)).toBeUndefined();
    });
  });

  describe('getMessageTypeInfo', () => {
    it('deve retornar informações completas para cada tipo', () => {
      const successInfo = getMessageTypeInfo('success');
      expect(successInfo).toEqual({
        label: 'Sucesso',
        descricao: 'Mensagem de sucesso',
        color: 'green',
        icon: 'check_circle'
      });

      const errorInfo = getMessageTypeInfo('error');
      expect(errorInfo).toEqual({
        label: 'Erro',
        descricao: 'Mensagem de erro',
        color: 'red',
        icon: 'error'
      });

      const warningInfo = getMessageTypeInfo('warning');
      expect(warningInfo).toEqual({
        label: 'Alerta',
        descricao: 'Mensagem de alerta',
        color: 'orange',
        icon: 'warning'
      });

      const infoInfo = getMessageTypeInfo('info');
      expect(infoInfo).toEqual({
        label: 'Informação',
        descricao: 'Mensagem informativa',
        color: 'blue',
        icon: 'info'
      });
    });

    it('deve retornar undefined para tipos inválidos', () => {
      expect(getMessageTypeInfo('invalid' as any)).toBeUndefined();
    });
  });
});

describe('ValidationRules', () => {
  describe('email', () => {
    it('deve validar emails corretamente', () => {
      const rule = ValidationRules.email();
      expect(rule.rule('test@example.com')).toBe(true);
      expect(rule.rule('test.name@example.com')).toBe(true);
      expect(rule.rule('test+name@example.com')).toBe(true);
      expect(rule.rule('test@sub.example.com')).toBe(true);
    });

    it('deve rejeitar emails inválidos', () => {
      const rule = ValidationRules.email();
      expect(rule.rule('invalid')).toBe(false);
      expect(rule.rule('@example.com')).toBe(false);
      expect(rule.rule('test@')).toBe(false);
      expect(rule.rule('test@.com')).toBe(false);
      expect(rule.rule('test@example..com')).toBe(false);
      expect(rule.rule('test@example.com.')).toBe(false);
      expect(rule.rule('test@example.com' + 'a'.repeat(255))).toBe(false);
    });
  });

  describe('date', () => {
    it('deve validar datas corretamente', () => {
      const rule = ValidationRules.date();
      expect(rule.rule(new Date())).toBe(true);
      expect(rule.rule(new Date('2023-01-01'))).toBe(true);
      expect(rule.rule(new Date(2000, 0, 1))).toBe(true);
    });

    it('deve rejeitar datas inválidas', () => {
      const rule = ValidationRules.date();
      expect(rule.rule(new Date('invalid'))).toBe(false);
      expect(rule.rule(new Date(999))).toBe(false);
      expect(rule.rule(new Date(10000))).toBe(false);
      expect(rule.rule('2023-01-01')).toBe(false);
      expect(rule.rule(null)).toBe(false);
      expect(rule.rule(undefined)).toBe(false);
    });
  });

  describe('future', () => {
    it('deve validar datas futuras corretamente', () => {
      const rule = ValidationRules.future();
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      expect(rule.rule(futureDate)).toBe(true);
    });

    it('deve rejeitar datas passadas', () => {
      const rule = ValidationRules.future();
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      expect(rule.rule(pastDate)).toBe(false);
      expect(rule.rule(new Date(2000, 0, 1))).toBe(false);
    });
  });

  describe('past', () => {
    it('deve validar datas passadas corretamente', () => {
      const rule = ValidationRules.past();
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      expect(rule.rule(pastDate)).toBe(true);
      expect(rule.rule(new Date(2000, 0, 1))).toBe(true);
    });

    it('deve rejeitar datas futuras', () => {
      const rule = ValidationRules.past();
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      expect(rule.rule(futureDate)).toBe(false);
    });
  });
}); 