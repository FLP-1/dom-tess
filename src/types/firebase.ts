import { DocumentData, Timestamp, QueryDocumentSnapshot, DocumentSnapshot } from 'firebase/firestore';
import { User as FirebaseUser } from 'firebase/auth';
import { IBaseEntity, IBaseDocument } from './common';

/**
 * Tipos base do Firebase
 */
export type TFirebaseTimestamp = Timestamp;
export type TFirebaseDocument = DocumentData;
export type TFirebaseUser = FirebaseUser;

/**
 * Interface para documentos do Firebase
 */
export interface IFirebaseDocument<T extends IBaseEntity> extends DocumentData {
  id: string;
  data: T;
  createdAt: TFirebaseTimestamp;
  updatedAt: TFirebaseTimestamp;
}

/**
 * Opções para consultas no Firebase
 */
export interface IFirebaseQueryOptions {
  limit?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  where?: Array<{
    field: string;
    operator: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'array-contains' | 'in' | 'not-in';
    value: unknown;
  }>;
}

/**
 * Opções para criação de documentos
 */
export interface IFirebaseCreateOptions {
  merge?: boolean;
  timestamp?: boolean;
}

/**
 * Opções para atualização de documentos
 */
export interface IFirebaseUpdateOptions {
  merge?: boolean;
  timestamp?: boolean;
}

/**
 * Códigos de erro do Firebase
 */
export type TFirebaseErrorCode =
  | 'auth/email-already-in-use'
  | 'auth/invalid-email'
  | 'auth/operation-not-allowed'
  | 'auth/weak-password'
  | 'auth/user-disabled'
  | 'auth/user-not-found'
  | 'auth/wrong-password'
  | 'auth/too-many-requests'
  | 'auth/network-request-failed'
  | 'auth/requires-recent-login'
  | 'auth/expired-action-code'
  | 'auth/invalid-action-code'
  | 'auth/missing-action-code'
  | 'auth/invalid-verification-code'
  | 'auth/invalid-verification-id'
  | 'auth/code-expired'
  | 'auth/credential-already-in-use'
  | 'auth/email-change-needs-verification'
  | 'auth/invalid-credential'
  | 'auth/invalid-verification-code'
  | 'auth/invalid-verification-id'
  | 'auth/missing-verification-code'
  | 'auth/missing-verification-id'
  | 'auth/phone-number-already-in-use'
  | 'auth/provider-already-linked'
  | 'auth/requires-recent-login'
  | 'auth/unauthorized-domain'
  | 'auth/user-disabled'
  | 'auth/user-not-found'
  | 'auth/wrong-password';

/**
 * Interface para erros do Firebase
 */
export interface IFirebaseError {
  code: TFirebaseErrorCode;
  message: string;
  stack?: string;
}

/**
 * Interface para usuários autenticados
 */
export interface IFirebaseAuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  phoneNumber: string | null;
  isAnonymous: boolean;
  metadata: {
    creationTime?: string;
    lastSignInTime?: string;
  };
  providerData: Array<{
    providerId: string;
    uid: string;
    displayName: string | null;
    email: string | null;
    phoneNumber: string | null;
    photoURL: string | null;
  }>;
  refreshToken: string;
  tenantId: string | null;
}

// Utilitários para conversão
export const convertFirebaseDocument = <T extends IBaseEntity>(
  doc: DocumentSnapshot | QueryDocumentSnapshot
): T => {
  const data = doc.data() as IFirebaseDocument<T>;
  return {
    ...data.data,
    id: doc.id,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate()
  };
};

export const convertToFirebaseDocument = <T extends IBaseEntity>(
  data: T
): IFirebaseDocument<T> => {
  return {
    id: data.id,
    data,
    createdAt: Timestamp.fromDate(data.createdAt),
    updatedAt: Timestamp.fromDate(data.updatedAt)
  };
};

export interface ITFirebaseErrorCodeInfo {
  label: string;
  descricao: string;
  icon: string;
  color: string;
}

export function isValidTFirebaseErrorCode(tipo: unknown): tipo is TFirebaseErrorCode {
  const validTypes: TFirebaseErrorCode[] = [
    'auth/email-already-in-use',
    'auth/invalid-email',
    'auth/operation-not-allowed',
    'auth/weak-password',
    'auth/user-disabled',
    'auth/user-not-found',
    'auth/wrong-password',
    'auth/too-many-requests',
    'auth/network-request-failed',
    'auth/requires-recent-login',
    'auth/expired-action-code',
    'auth/invalid-action-code',
    'auth/missing-action-code',
    'auth/invalid-verification-code',
    'auth/invalid-verification-id',
    'auth/code-expired',
    'auth/credential-already-in-use',
    'auth/email-change-needs-verification',
    'auth/invalid-credential',
    'auth/missing-verification-code',
    'auth/missing-verification-id',
    'auth/phone-number-already-in-use',
    'auth/provider-already-linked',
    'auth/unauthorized-domain'
  ];
  return typeof tipo === 'string' && validTypes.includes(tipo as TFirebaseErrorCode);
}

export function getTFirebaseErrorCodeLabel(tipo: TFirebaseErrorCode): string | undefined {
  const labels: Record<TFirebaseErrorCode, string> = {
    'auth/email-already-in-use': 'E-mail já está em uso',
    'auth/invalid-email': 'E-mail inválido',
    'auth/operation-not-allowed': 'Operação não permitida',
    'auth/weak-password': 'Senha fraca',
    'auth/user-disabled': 'Usuário desativado',
    'auth/user-not-found': 'Usuário não encontrado',
    'auth/wrong-password': 'Senha incorreta',
    'auth/too-many-requests': 'Muitas tentativas',
    'auth/network-request-failed': 'Falha na rede',
    'auth/requires-recent-login': 'Requer login recente',
    'auth/expired-action-code': 'Código expirado',
    'auth/invalid-action-code': 'Código inválido',
    'auth/missing-action-code': 'Código ausente',
    'auth/invalid-verification-code': 'Código de verificação inválido',
    'auth/invalid-verification-id': 'ID de verificação inválido',
    'auth/code-expired': 'Código expirado',
    'auth/credential-already-in-use': 'Credencial já em uso',
    'auth/email-change-needs-verification': 'Mudança de e-mail requer verificação',
    'auth/invalid-credential': 'Credencial inválida',
    'auth/missing-verification-code': 'Código de verificação ausente',
    'auth/missing-verification-id': 'ID de verificação ausente',
    'auth/phone-number-already-in-use': 'Número de telefone já em uso',
    'auth/provider-already-linked': 'Provedor já vinculado',
    'auth/unauthorized-domain': 'Domínio não autorizado'
  };

  return isValidTFirebaseErrorCode(tipo) ? labels[tipo] : undefined;
}

export function getTFirebaseErrorCodeInfo(tipo: TFirebaseErrorCode): ITFirebaseErrorCodeInfo | undefined {
  const info: Record<TFirebaseErrorCode, ITFirebaseErrorCodeInfo> = {
    'auth/email-already-in-use': {
      label: 'E-mail já está em uso',
      descricao: 'O e-mail fornecido já está sendo usado por outra conta',
      icon: 'email',
      color: 'error'
    },
    'auth/invalid-email': {
      label: 'E-mail inválido',
      descricao: 'O e-mail fornecido não é válido',
      icon: 'email',
      color: 'error'
    },
    'auth/operation-not-allowed': {
      label: 'Operação não permitida',
      descricao: 'Esta operação não é permitida',
      icon: 'block',
      color: 'error'
    },
    'auth/weak-password': {
      label: 'Senha fraca',
      descricao: 'A senha fornecida é muito fraca',
      icon: 'lock',
      color: 'error'
    },
    'auth/user-disabled': {
      label: 'Usuário desativado',
      descricao: 'Esta conta foi desativada',
      icon: 'person_off',
      color: 'error'
    },
    'auth/user-not-found': {
      label: 'Usuário não encontrado',
      descricao: 'Nenhuma conta encontrada com este e-mail',
      icon: 'person_off',
      color: 'error'
    },
    'auth/wrong-password': {
      label: 'Senha incorreta',
      descricao: 'A senha fornecida está incorreta',
      icon: 'lock',
      color: 'error'
    },
    'auth/too-many-requests': {
      label: 'Muitas tentativas',
      descricao: 'Muitas tentativas de login. Tente novamente mais tarde',
      icon: 'block',
      color: 'error'
    },
    'auth/network-request-failed': {
      label: 'Falha na rede',
      descricao: 'Falha na conexão com o servidor',
      icon: 'wifi_off',
      color: 'error'
    },
    'auth/requires-recent-login': {
      label: 'Requer login recente',
      descricao: 'Esta operação requer um login recente',
      icon: 'login',
      color: 'warning'
    },
    'auth/expired-action-code': {
      label: 'Código expirado',
      descricao: 'O código de ação expirou',
      icon: 'schedule',
      color: 'error'
    },
    'auth/invalid-action-code': {
      label: 'Código inválido',
      descricao: 'O código de ação é inválido',
      icon: 'code',
      color: 'error'
    },
    'auth/missing-action-code': {
      label: 'Código ausente',
      descricao: 'O código de ação está ausente',
      icon: 'code',
      color: 'error'
    },
    'auth/invalid-verification-code': {
      label: 'Código de verificação inválido',
      descricao: 'O código de verificação é inválido',
      icon: 'code',
      color: 'error'
    },
    'auth/invalid-verification-id': {
      label: 'ID de verificação inválido',
      descricao: 'O ID de verificação é inválido',
      icon: 'badge',
      color: 'error'
    },
    'auth/code-expired': {
      label: 'Código expirado',
      descricao: 'O código de verificação expirou',
      icon: 'schedule',
      color: 'error'
    },
    'auth/credential-already-in-use': {
      label: 'Credencial já em uso',
      descricao: 'Esta credencial já está em uso',
      icon: 'badge',
      color: 'error'
    },
    'auth/email-change-needs-verification': {
      label: 'Mudança de e-mail requer verificação',
      descricao: 'A mudança de e-mail requer verificação',
      icon: 'email',
      color: 'warning'
    },
    'auth/invalid-credential': {
      label: 'Credencial inválida',
      descricao: 'A credencial fornecida é inválida',
      icon: 'badge',
      color: 'error'
    },
    'auth/missing-verification-code': {
      label: 'Código de verificação ausente',
      descricao: 'O código de verificação está ausente',
      icon: 'code',
      color: 'error'
    },
    'auth/missing-verification-id': {
      label: 'ID de verificação ausente',
      descricao: 'O ID de verificação está ausente',
      icon: 'badge',
      color: 'error'
    },
    'auth/phone-number-already-in-use': {
      label: 'Número de telefone já em uso',
      descricao: 'Este número de telefone já está em uso',
      icon: 'phone',
      color: 'error'
    },
    'auth/provider-already-linked': {
      label: 'Provedor já vinculado',
      descricao: 'Este provedor já está vinculado à conta',
      icon: 'link',
      color: 'error'
    },
    'auth/unauthorized-domain': {
      label: 'Domínio não autorizado',
      descricao: 'Este domínio não está autorizado',
      icon: 'domain',
      color: 'error'
    }
  };

  return isValidTFirebaseErrorCode(tipo) ? info[tipo] : undefined;
} 