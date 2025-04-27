import { AUTH_ERRORS } from '../constants/errors';

export type LoginType = 'email' | 'cpf';

export type AuthErrorKey = keyof typeof AUTH_ERRORS;

export interface LoginCredentials {
  identifier: string;
  password: string;
  loginType: LoginType;
}

export interface RegisterData extends Omit<LoginCredentials, 'loginType'> {
  name: string;
  email: string;
  cpf: string;
  phone?: string;
  passwordConfirmation: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: UserData;
}

export interface VerificationData {
  code: string;
  identifier: string;
}

export interface ResetPasswordData {
  code: string;
  identifier: string;
  password: string;
  passwordConfirmation: string;
}

export type AuthError = keyof typeof AUTH_ERRORS; 