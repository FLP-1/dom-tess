import { IBaseEntity, EStatus } from './common';
import { IFirebaseAuthUser } from './firebase';

// Tipos de autenticação
export type TLoginType = 'email' | 'cpf' | 'phone';
export type TAuthProvider = 'email' | 'google' | 'facebook' | 'apple';

// Tipos de erros de autenticação
export type TAuthError = {
  code: string;
  message: string;
  details?: any;
};

// Interfaces para autenticação
export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface IRegisterData {
  email: string;
  password: string;
  name: string;
  role: 'employer' | 'employee';
  cpf: string;
  phone?: string;
}

export interface IUserData extends IBaseEntity {
  email: string;
  name: string;
  role: 'employer' | 'employee';
  cpf: string;
  phone?: string;
  lastLogin?: Date;
  status: EStatus;
}

export interface IUserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  emailFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
}

export interface IAuthResponse {
  user: IUserData;
  token: string;
}

export interface IVerificationData {
  code: string;
  email: string;
}

export interface IResetPasswordData {
  email: string;
  code: string;
  newPassword: string;
}

export interface IUpdatePasswordData {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

export interface IUpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  preferences?: Partial<IUserPreferences>;
  metadata?: Record<string, unknown>;
}

export interface ISession extends IBaseEntity {
  userId: string;
  deviceId?: string;
  ipAddress?: string;
  userAgent?: string;
  lastActivity: Date;
  isValid: boolean;
}

export interface IToken extends IBaseEntity {
  userId: string;
  type: 'access' | 'refresh' | 'verification' | 'resetPassword';
  token: string;
  expiresAt: Date;
  isRevoked: boolean;
  metadata?: Record<string, unknown>;
}

export interface ILoginAttempt extends IBaseEntity {
  userId?: string;
  identifier: string;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  error?: TAuthError;
  provider?: TAuthProvider;
}

export interface IAuthConfig {
  maxLoginAttempts: number;
  lockoutDuration: number;
  tokenExpiration: {
    access: number;
    refresh: number;
    verification: number;
    resetPassword: number;
  };
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    preventReuse: number;
  };
  providers: {
    [key in TAuthProvider]: {
      enabled: boolean;
      clientId?: string;
      clientSecret?: string;
      scopes?: string[];
    };
  };
}

export interface ITAuthErrorInfo {
  label: string;
  descricao: string;
  color: string;
  icon: string;
}

export function isValidTAuthError(error: unknown): error is TAuthError {
  if (!error || typeof error !== 'object') return false;
  const authError = error as TAuthError;
  return (
    typeof authError.code === 'string' &&
    typeof authError.message === 'string' &&
    (authError.details === undefined || typeof authError.details === 'object')
  );
}

export function getTAuthErrorLabel(error: TAuthError): string | undefined {
  const labels: Record<string, string> = {
    'invalid_credentials': 'Credenciais inválidas',
    'email_already_exists': 'E-mail já cadastrado',
    'weak_password': 'Senha fraca',
    'invalid_verification_code': 'Código de verificação inválido',
    'too_many_attempts': 'Muitas tentativas',
    'user_not_found': 'Usuário não encontrado',
    'user_disabled': 'Usuário desativado',
    'invalid_email': 'E-mail inválido',
    'operation_not_allowed': 'Operação não permitida',
    'network_request_failed': 'Falha na rede',
    'requires_recent_login': 'Requer login recente',
    'expired_action_code': 'Código expirado',
    'invalid_action_code': 'Código inválido',
    'missing_action_code': 'Código ausente',
    'invalid_verification_id': 'ID de verificação inválido',
    'code_expired': 'Código expirado',
    'credential_already_in_use': 'Credencial já em uso',
    'email_change_needs_verification': 'Mudança de e-mail requer verificação',
    'invalid_credential': 'Credencial inválida',
    'missing_verification_code': 'Código de verificação ausente',
    'missing_verification_id': 'ID de verificação ausente',
    'phone_number_already_in_use': 'Número de telefone já em uso',
    'provider_already_linked': 'Provedor já vinculado',
    'unauthorized_domain': 'Domínio não autorizado'
  };

  return isValidTAuthError(error) ? labels[error.code] : undefined;
}

export function getTAuthErrorInfo(error: TAuthError): ITAuthErrorInfo | undefined {
  const info: Record<string, ITAuthErrorInfo> = {
    'invalid_credentials': {
      label: 'Credenciais inválidas',
      descricao: 'O e-mail ou senha fornecidos estão incorretos',
      color: 'error',
      icon: 'error'
    },
    'email_already_exists': {
      label: 'E-mail já cadastrado',
      descricao: 'Este e-mail já está cadastrado no sistema',
      color: 'error',
      icon: 'email'
    },
    'weak_password': {
      label: 'Senha fraca',
      descricao: 'A senha fornecida é muito fraca',
      color: 'error',
      icon: 'lock'
    },
    'invalid_verification_code': {
      label: 'Código de verificação inválido',
      descricao: 'O código de verificação fornecido é inválido',
      color: 'error',
      icon: 'code'
    },
    'too_many_attempts': {
      label: 'Muitas tentativas',
      descricao: 'Muitas tentativas de login. Tente novamente mais tarde',
      color: 'error',
      icon: 'block'
    },
    'user_not_found': {
      label: 'Usuário não encontrado',
      descricao: 'Nenhuma conta encontrada com este e-mail',
      color: 'error',
      icon: 'person_off'
    },
    'user_disabled': {
      label: 'Usuário desativado',
      descricao: 'Esta conta foi desativada',
      color: 'error',
      icon: 'person_off'
    },
    'invalid_email': {
      label: 'E-mail inválido',
      descricao: 'O e-mail fornecido não é válido',
      color: 'error',
      icon: 'email'
    },
    'operation_not_allowed': {
      label: 'Operação não permitida',
      descricao: 'Esta operação não é permitida',
      color: 'error',
      icon: 'block'
    },
    'network_request_failed': {
      label: 'Falha na rede',
      descricao: 'Falha na conexão com o servidor',
      color: 'error',
      icon: 'wifi_off'
    },
    'requires_recent_login': {
      label: 'Requer login recente',
      descricao: 'Esta operação requer um login recente',
      color: 'warning',
      icon: 'login'
    },
    'expired_action_code': {
      label: 'Código expirado',
      descricao: 'O código de ação expirou',
      color: 'error',
      icon: 'schedule'
    },
    'invalid_action_code': {
      label: 'Código inválido',
      descricao: 'O código de ação é inválido',
      color: 'error',
      icon: 'code'
    },
    'missing_action_code': {
      label: 'Código ausente',
      descricao: 'O código de ação está ausente',
      color: 'error',
      icon: 'code'
    },
    'invalid_verification_id': {
      label: 'ID de verificação inválido',
      descricao: 'O ID de verificação é inválido',
      color: 'error',
      icon: 'badge'
    },
    'code_expired': {
      label: 'Código expirado',
      descricao: 'O código de verificação expirou',
      color: 'error',
      icon: 'schedule'
    },
    'credential_already_in_use': {
      label: 'Credencial já em uso',
      descricao: 'Esta credencial já está em uso',
      color: 'error',
      icon: 'badge'
    },
    'email_change_needs_verification': {
      label: 'Mudança de e-mail requer verificação',
      descricao: 'A mudança de e-mail requer verificação',
      color: 'warning',
      icon: 'email'
    },
    'invalid_credential': {
      label: 'Credencial inválida',
      descricao: 'A credencial fornecida é inválida',
      color: 'error',
      icon: 'badge'
    },
    'missing_verification_code': {
      label: 'Código de verificação ausente',
      descricao: 'O código de verificação está ausente',
      color: 'error',
      icon: 'code'
    },
    'missing_verification_id': {
      label: 'ID de verificação ausente',
      descricao: 'O ID de verificação está ausente',
      color: 'error',
      icon: 'badge'
    },
    'phone_number_already_in_use': {
      label: 'Número de telefone já em uso',
      descricao: 'Este número de telefone já está em uso',
      color: 'error',
      icon: 'phone'
    },
    'provider_already_linked': {
      label: 'Provedor já vinculado',
      descricao: 'Este provedor já está vinculado à conta',
      color: 'error',
      icon: 'link'
    },
    'unauthorized_domain': {
      label: 'Domínio não autorizado',
      descricao: 'Este domínio não está autorizado',
      color: 'error',
      icon: 'domain'
    }
  };

  return isValidTAuthError(error) ? info[error.code] : undefined;
}

export interface ITLoginTypeInfo {
  label: string;
  descricao: string;
  icon: string;
}

export function isValidTLoginType(tipo: unknown): tipo is TLoginType {
  const validTypes: TLoginType[] = ['email', 'cpf', 'phone'];
  return typeof tipo === 'string' && validTypes.includes(tipo as TLoginType);
}

export function getTLoginTypeLabel(tipo: TLoginType): string | undefined {
  const labels: Record<TLoginType, string> = {
    'email': 'E-mail',
    'cpf': 'CPF',
    'phone': 'Telefone'
  };

  return isValidTLoginType(tipo) ? labels[tipo] : undefined;
}

export function getTLoginTypeInfo(tipo: TLoginType): ITLoginTypeInfo | undefined {
  const info: Record<TLoginType, ITLoginTypeInfo> = {
    'email': {
      label: 'E-mail',
      descricao: 'Login utilizando e-mail e senha',
      icon: 'email'
    },
    'cpf': {
      label: 'CPF',
      descricao: 'Login utilizando CPF e senha',
      icon: 'badge'
    },
    'phone': {
      label: 'Telefone',
      descricao: 'Login utilizando número de telefone',
      icon: 'phone'
    }
  };

  return isValidTLoginType(tipo) ? info[tipo] : undefined;
}

export interface ITAuthProviderInfo {
  label: string;
  descricao: string;
  icon: string;
  color: string;
}

export function isValidTAuthProvider(tipo: unknown): tipo is TAuthProvider {
  const validTypes: TAuthProvider[] = ['email', 'google', 'facebook', 'apple'];
  return typeof tipo === 'string' && validTypes.includes(tipo as TAuthProvider);
}

export function getTAuthProviderLabel(tipo: TAuthProvider): string | undefined {
  const labels: Record<TAuthProvider, string> = {
    'email': 'E-mail',
    'google': 'Google',
    'facebook': 'Facebook',
    'apple': 'Apple'
  };

  return isValidTAuthProvider(tipo) ? labels[tipo] : undefined;
}

export function getTAuthProviderInfo(tipo: TAuthProvider): ITAuthProviderInfo | undefined {
  const info: Record<TAuthProvider, ITAuthProviderInfo> = {
    'email': {
      label: 'E-mail',
      descricao: 'Autenticação por e-mail e senha',
      icon: 'email',
      color: 'primary'
    },
    'google': {
      label: 'Google',
      descricao: 'Autenticação com conta Google',
      icon: 'google',
      color: 'error'
    },
    'facebook': {
      label: 'Facebook',
      descricao: 'Autenticação com conta Facebook',
      icon: 'facebook',
      color: 'info'
    },
    'apple': {
      label: 'Apple',
      descricao: 'Autenticação com conta Apple',
      icon: 'apple',
      color: 'default'
    }
  };

  return isValidTAuthProvider(tipo) ? info[tipo] : undefined;
} 