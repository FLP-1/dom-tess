import axios from 'axios';
import type { AxiosStatic } from 'axios';
import {
  ILoginCredentials,
  IRegisterData,
  IAuthResponse,
  IVerificationData,
  IResetPasswordData,
  IUserData
} from '../types/auth';
import { IBaseServiceResponse } from '@/types/common';

class AuthService {
  private api: ReturnType<typeof axios.create>;
  private static instance: AuthService;

  private constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Interceptor para tratamento de erros
    this.api.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          this.clearAuth();
        }
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async login(credentials: ILoginCredentials): Promise<IBaseServiceResponse<IUserData>> {
    try {
      const response = await this.api.post<IAuthResponse>('/auth/login', credentials);
      this.setAuthToken(response.data.accessToken);
      return {
        success: true,
        data: response.data.user,
        message: 'Login realizado com sucesso'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao realizar login',
        message: 'Falha ao realizar login'
      };
    }
  }

  public async register(data: IRegisterData): Promise<IBaseServiceResponse<IUserData>> {
    try {
      const response = await this.api.post<IAuthResponse>('/auth/register', data);
      this.setAuthToken(response.data.accessToken);
      return {
        success: true,
        data: response.data.user,
        message: 'Registro realizado com sucesso'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao realizar registro',
        message: 'Falha ao realizar registro'
      };
    }
  }

  public async requestPasswordReset(email: string): Promise<IBaseServiceResponse<void>> {
    try {
      await this.api.post('/auth/request-reset', { email });
      return {
        success: true,
        message: 'E-mail de redefinição enviado com sucesso'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao solicitar redefinição de senha',
        message: 'Falha ao solicitar redefinição de senha'
      };
    }
  }

  public async resetPassword(data: IResetPasswordData): Promise<IBaseServiceResponse<void>> {
    try {
      await this.api.post('/auth/reset-password', data);
      return {
        success: true,
        message: 'Senha redefinida com sucesso'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao redefinir senha',
        message: 'Falha ao redefinir senha'
      };
    }
  }

  public async verifyEmail(data: IVerificationData): Promise<IBaseServiceResponse<void>> {
    try {
      await this.api.post('/auth/verify-email', data);
      return {
        success: true,
        message: 'E-mail verificado com sucesso'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao verificar e-mail',
        message: 'Falha ao verificar e-mail'
      };
    }
  }

  public setAuthToken(token: string): void {
    if (!token) {
      throw new Error('Token é obrigatório');
    }
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  public getStoredToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  public isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }

  public clearAuth(): void {
    localStorage.removeItem('auth_token');
    delete this.api.defaults.headers.common['Authorization'];
  }

  public async logout(): Promise<IBaseServiceResponse<void>> {
    try {
      await this.api.post('/auth/logout');
      this.clearAuth();
      return {
        success: true,
        message: 'Logout realizado com sucesso'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao realizar logout',
        message: 'Falha ao realizar logout'
      };
    }
  }
}

export default AuthService; 