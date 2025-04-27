import axios, { AxiosInstance } from 'axios';
import { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  VerificationData,
  ResetPasswordData
} from '../types/auth';

class AuthService {
  private api: AxiosInstance;
  private static instance: AuthService;

  private constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/login', credentials);
    this.setAuthToken(response.data.token);
    return response.data;
  }

  public async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/register', data);
    this.setAuthToken(response.data.token);
    return response.data;
  }

  public async verifyCode(data: VerificationData): Promise<void> {
    await this.api.post('/auth/verify', data);
  }

  public async requestPasswordReset(identifier: string): Promise<void> {
    await this.api.post('/auth/request-reset', { identifier });
  }

  public async resetPassword(data: ResetPasswordData): Promise<void> {
    await this.api.post('/auth/reset-password', data);
  }

  public setAuthToken(token: string): void {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('authToken', token);
  }

  public removeAuthToken(): void {
    delete this.api.defaults.headers.common['Authorization'];
    localStorage.removeItem('authToken');
  }

  public getStoredToken(): string | null {
    return localStorage.getItem('authToken');
  }

  public isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }
}

export default AuthService.getInstance(); 