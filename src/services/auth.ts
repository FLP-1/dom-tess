import axios from 'axios';
import {
  ILoginCredentials,
  IRegisterData,
  IAuthResponse,
  IVerificationData,
  IResetPasswordData,
  IUserData,
  TAuthError
} from '../types/auth';
import { AUTH_ERRORS } from '../constants/errors';
import { auth, db } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  User as FirebaseUser,
  updateProfile,
  updatePassword
} from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc,
  doc,
  setDoc,
  serverTimestamp,
  DocumentData,
  getDoc,
  QueryConstraint,
  Query
} from 'firebase/firestore';
import { IBaseServiceResponse } from '@/types/common';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
});

export class AuthService {
  private static readonly USERS_COLLECTION = 'users';
  private static readonly LOGIN_ATTEMPTS_COLLECTION = 'login_attempts';
  private static readonly MAX_LOGIN_ATTEMPTS = 5;
  private static readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutos

  static async login(credentials: ILoginCredentials): Promise<IBaseServiceResponse<IAuthResponse>> {
    try {
      const { email, password } = credentials;

      // Verifica tentativas de login
      if (await this.isUserLockedOut(email)) {
        return {
          success: false,
          error: 'too_many_attempts',
          message: 'Muitas tentativas de login. Tente novamente mais tarde.',
          statusCode: 429
        };
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userData = await this.getUserData(userCredential.user.uid);

      if (!userData) {
        throw new Error('Dados do usuário não encontrados');
      }

      // Limpa tentativas de login
      await this.clearLoginAttempts(email);

      return {
        success: true,
        data: {
          accessToken: await userCredential.user.getIdToken(),
          refreshToken: userCredential.user.refreshToken,
          expiresIn: 3600,
          tokenType: 'Bearer',
          user: userData
        },
        message: 'Login realizado com sucesso'
      };
    } catch (error) {
      // Registra tentativa de login falha
      await this.recordLoginAttempt(credentials.email, false);

      return {
        success: false,
        error: this.mapFirebaseError(error),
        message: 'Falha ao realizar login',
        statusCode: 401
      };
    }
  }

  static async register(data: IRegisterData): Promise<IBaseServiceResponse<IAuthResponse>> {
    try {
      const { email, password, nome, cpf } = data;

      // Verifica se o CPF já está cadastrado
      const cpfExists = await this.checkCPFExists(cpf);
      if (cpfExists) {
        return {
          success: false,
          error: 'cpf_already_exists',
          message: 'CPF já cadastrado',
          statusCode: 409
        };
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: nome });
      await sendEmailVerification(userCredential.user);

      const userData: IUserData = {
        id: userCredential.user.uid,
        email,
        nome,
        cpf,
        telefone: data.telefone,
        tipo: 'empregador',
        status: 'pendente',
        emailVerificado: false,
        telefoneVerificado: false,
        dataCriacao: new Date(),
        dataAtualizacao: new Date(),
        preferences: {
          theme: 'light',
          language: 'pt-BR',
          timezone: 'America/Sao_Paulo',
          notifications: {
            email: true,
            push: true,
            sms: true
          },
          emailFrequency: 'daily'
        }
      };

      await setDoc(doc(db, this.USERS_COLLECTION, userCredential.user.uid), {
        ...userData,
        dataCriacao: serverTimestamp(),
        dataAtualizacao: serverTimestamp()
      });

      return {
        success: true,
        data: {
          accessToken: await userCredential.user.getIdToken(),
          refreshToken: userCredential.user.refreshToken,
          expiresIn: 3600,
          tokenType: 'Bearer',
          user: userData
        },
        message: 'Registro realizado com sucesso'
      };
    } catch (error) {
      return {
        success: false,
        error: this.mapFirebaseError(error),
        message: 'Falha ao realizar registro',
        statusCode: 400
      };
    }
  }

  static async resetPassword(data: IResetPasswordData): Promise<IBaseServiceResponse<void>> {
    try {
      await sendPasswordResetEmail(auth, data.email);
      return {
        success: true,
        message: 'Email de redefinição de senha enviado com sucesso'
      };
    } catch (error) {
      return {
        success: false,
        error: this.mapFirebaseError(error),
        message: 'Falha ao enviar email de redefinição de senha',
        statusCode: 400
      };
    }
  }

  static async logout(): Promise<IBaseServiceResponse<void>> {
    try {
      await signOut(auth);
      return {
        success: true,
        message: 'Logout realizado com sucesso'
      };
    } catch (error) {
      return {
        success: false,
        error: this.mapFirebaseError(error),
        message: 'Falha ao realizar logout',
        statusCode: 500
      };
    }
  }

  private static async getUserData(userId: string): Promise<IUserData | null> {
    const userDoc = await getDoc(doc(db, this.USERS_COLLECTION, userId));
    return userDoc.exists() ? userDoc.data() as IUserData : null;
  }

  private static async checkCPFExists(cpf: string): Promise<boolean> {
    const querySnapshot = await getDoc(doc(db, 'cpf_index', cpf));
    return querySnapshot.exists();
  }

  private static async isUserLockedOut(email: string): Promise<boolean> {
    const attempts = await this.getLoginAttempts(email);
    if (attempts.length >= this.MAX_LOGIN_ATTEMPTS) {
      const lastAttempt = attempts[attempts.length - 1];
      const timeSinceLastAttempt = Date.now() - lastAttempt.timestamp;
      return timeSinceLastAttempt < this.LOCKOUT_DURATION;
    }
    return false;
  }

  private static async getLoginAttempts(email: string): Promise<Array<{ timestamp: number }>> {
    const attemptsDoc = await getDoc(doc(db, this.LOGIN_ATTEMPTS_COLLECTION, email));
    return attemptsDoc.exists() ? attemptsDoc.data().attempts : [];
  }

  private static async recordLoginAttempt(email: string, success: boolean): Promise<void> {
    const attemptsRef = doc(db, this.LOGIN_ATTEMPTS_COLLECTION, email);
    const attemptsDoc = await getDoc(attemptsRef);
    
    const attempts = attemptsDoc.exists() 
      ? attemptsDoc.data().attempts.filter((attempt: { timestamp: number }) => 
          Date.now() - attempt.timestamp < this.LOCKOUT_DURATION
        )
      : [];

    attempts.push({ timestamp: Date.now(), success });

    await setDoc(attemptsRef, { attempts }, { merge: true });
  }

  private static async clearLoginAttempts(email: string): Promise<void> {
    await setDoc(doc(db, this.LOGIN_ATTEMPTS_COLLECTION, email), { attempts: [] });
  }

  private static mapFirebaseError(error: any): TAuthError {
    const errorCode = error.code as string;
    switch (errorCode) {
      case 'auth/invalid-email':
      case 'auth/user-disabled':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'invalid_credentials';
      case 'auth/email-already-in-use':
        return 'email_already_exists';
      case 'auth/weak-password':
        return 'weak_password';
      case 'auth/invalid-verification-code':
        return 'invalid_verification_code';
      case 'auth/too-many-requests':
        return 'too_many_attempts';
      default:
        return 'invalid_credentials';
    }
  }

  static async verify(data: IVerificationData): Promise<boolean> {
    if (!data.cpf || !data.code) {
      throw new Error('CPF e código de verificação são obrigatórios');
    }

    const usersRef = collection(db, this.USERS_COLLECTION);
    const q = query(
      usersRef,
      where('cpf', '==', data.cpf.replace(/\D/g, '')),
      where('verificationCode', '==', data.code)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return false;
    }

    const userDoc = querySnapshot.docs[0];
    await setDoc(
      doc(db, this.USERS_COLLECTION, userDoc.id),
      { verified: true },
      { merge: true }
    );

    return true;
  }

  static setAuthToken(token: string): void {
    if (!token) {
      throw new Error('Token é obrigatório');
    }

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  static removeAuthToken(): void {
    delete api.defaults.headers.common['Authorization'];
  }

  static async checkExistingUser(cpf: string, email: string): Promise<{ exists: boolean; reason: string | null }> {
    if (!cpf && !email) {
      throw new Error('CPF ou email são obrigatórios');
    }

    const usersRef = collection(db, this.USERS_COLLECTION);
    const constraints: QueryConstraint[] = [];

    if (cpf) {
      constraints.push(where('cpf', '==', cpf.replace(/\D/g, '')));
    }
    if (email) {
      constraints.push(where('email', '==', email));
    }

    const q = query(usersRef, ...constraints);
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { exists: false, reason: null };
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();

    if (cpf && data.cpf === cpf.replace(/\D/g, '')) {
      return { exists: true, reason: 'CPF já cadastrado' };
    }
    if (email && data.email === email) {
      return { exists: true, reason: 'Email já cadastrado' };
    }

    return { exists: false, reason: null };
  }

  static async createUser(userData: {
    cpf: string;
    email: string;
    phone: string;
    password: string;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
  }): Promise<IUserData> {
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
    const newUserData: IUserData = {
      id: userCredential.user.uid,
      email: userData.email,
      name: '',
      roles: [],
      cpf: userData.cpf,
      phone: userData.phone,
      isEmailVerified: userData.isEmailVerified,
      isPhoneVerified: userData.isPhoneVerified,
      status: UserStatus.ACTIVE,
      permissions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: userCredential.user.uid,
      updatedBy: userCredential.user.uid
    };

    await setDoc(doc(db, this.USERS_COLLECTION, userCredential.user.uid), newUserData);
    return newUserData;
  }
}

export async function sendEmailVerificationCode(email: string): Promise<void> {
  if (!email) {
    throw new Error('Email é obrigatório');
  }

  const user = auth.currentUser;
  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  await sendEmailVerification(user);
}

export async function sendPhoneVerificationCode(phone: string): Promise<void> {
  if (!phone) {
    throw new Error('Telefone é obrigatório');
  }

  // Implementação do envio de código de verificação por SMS
  // Aqui você pode integrar com um serviço de SMS como Twilio
}

export async function verifyCode(type: 'email' | 'phone', contact: string, code: string): Promise<boolean> {
  if (!type || !contact || !code) {
    throw new Error('Tipo, contato e código são obrigatórios');
  }

  // Implementação da verificação do código
  // Aqui você pode validar o código recebido
  return true;
} 