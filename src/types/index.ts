// Exportações de tipos comuns
export * from './common';

// Exportações específicas de autenticação
export * from './auth';

// Exportações específicas do Firebase
export type {
  TFirebaseErrorCode,
  TFirebaseUser,
  IFirebaseAuthUser,
  TFirebaseDocument,
  TFirebaseTimestamp
} from './firebase';

// Exportações de documentos
export type {
  IDocument,
  TDocumentType,
  TDocumentStatus
} from './document';

// Exportações de empregado e empregador
export type {
  IEmployee,
  IEmployer,
  TEmployeeStatus,
  TEmployerStatus
} from './empregado';

// Exportações de tipos do eSocial
export * from './esocial';

// Exportações de formulários
export * from './form';

// Exportações de tipos de mensagem
export type {
  TMessageType,
  IMessageTypeInfo,
  IBaseMessage
} from './common';

// Exportações de tipos de validação
export type {
  TValidationRule,
  TValidationError,
  TValidationResult
} from './common';

// Exportações de tipos de documento
export type {
  IDocumento,
  IAlertaDocumento,
  IValidacaoDocumento,
  TStatusDocumento,
  TStatusAlerta
} from './documento';

// Exportações de tipos de empregador
export type {
  ETipoEmpregador,
  ETipoConta,
  ETipoImovel,
  ITipoEmpregadorInfo,
  ITipoContaInfo,
  ITipoImovelInfo,
  IEmpregador
} from './empregador';

// Exportações de funções de validação
export {
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
  calcularValorAluguel
} from './empregador';

// Exportações base
export * from './common';

// Exportações específicas de domínio
export * from './task';
export * from './user';
export * from './auth';
export * from './firebase';
export * from './documento';

// Exportações de enums
export { ETaskStatus, ETaskPriority } from './task';

export type {
  TFirebaseDocument,
  TFirebaseTimestamp
} from './firebase';

// Exportações de interfaces
export { IDocument } from './document';

// Interfaces específicas do domínio
export interface IAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
}

export interface IDaySchedule {
  start: string; // formato HH:mm
  end: string; // formato HH:mm
  breakStart?: string;
  breakEnd?: string;
}

export interface IWorkSchedule {
  sunday?: IDaySchedule;
  monday?: IDaySchedule;
  tuesday?: IDaySchedule;
  wednesday?: IDaySchedule;
  thursday?: IDaySchedule;
  friday?: IDaySchedule;
  saturday?: IDaySchedule;
}

export interface IEmployerPreferences {
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  locationValidation: boolean;
  wifiValidation: boolean;
  autoApproveTimesheet: boolean;
}

export interface IEmployee extends IBaseEntity {
  userId: string;
  employers: string[]; // IDs dos empregadores
  address: IAddress;
  documents: IDocument[];
  contractStart: Date;
  contractEnd?: Date;
  salary: number;
  workSchedule: IWorkSchedule;
  status: EStatus;
}

export interface IEmployer extends IBaseEntity {
  userId: string;
  employees: string[]; // IDs dos empregados
  address: IAddress;
  preferences: IEmployerPreferences;
}

// Exportações base
export * from './common';

// Exportações específicas de tipos
export type {
  ILoginCredentials,
  IRegisterData,
  IAuthResponse,
  IVerificationData,
  IResetPasswordData,
  IUserData,
  TAuthError
} from './auth';

export type {
  IDocumento,
  IAlertaDocumento,
  IValidacaoDocumento,
  TStatusDocumento,
  TStatusAlerta
} from './documento';

export type {
  TFirebaseDocument,
  TFirebaseTimestamp
} from './firebase';

export type {
  IDocumento,
  IAlertaDocumento,
  IValidacaoDocumento,
  TStatusDocumento,
  TStatusAlerta
} from './documento';

// Interfaces específicas do domínio
export interface IAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
}

export interface IDaySchedule {
  start: string; // formato HH:mm
  end: string; // formato HH:mm
  breakStart?: string;
  breakEnd?: string;
}

export interface IWorkSchedule {
  sunday?: IDaySchedule;
  monday?: IDaySchedule;
  tuesday?: IDaySchedule;
  wednesday?: IDaySchedule;
  thursday?: IDaySchedule;
  friday?: IDaySchedule;
  saturday?: IDaySchedule;
}

export interface IEmployerPreferences {
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  locationValidation: boolean;
  wifiValidation: boolean;
  autoApproveTimesheet: boolean;
}

export interface IEmployee extends IBaseEntity {
  userId: string;
  employers: string[]; // IDs dos empregadores
  address: IAddress;
  documents: IDocument[];
  contractStart: Date;
  contractEnd?: Date;
  salary: number;
  workSchedule: IWorkSchedule;
  status: EStatus;
}

export interface IEmployer extends IBaseEntity {
  userId: string;
  employees: string[]; // IDs dos empregados
  address: IAddress;
  preferences: IEmployerPreferences;
} 