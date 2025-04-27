import axios from 'axios';
import { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  VerificationData,
  ResetPasswordData 
} from '../types/auth';
import { AUTH_ERRORS } from '../constants/errors';
import { auth, db } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail
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
  serverTimestamp
} from 'firebase/firestore';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
});

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Primeiro busca o usuário pelo CPF
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('cpf', '==', credentials.cpf.replace(/\D/g, '')));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('CPF não encontrado.');
      }

      // Pega o email do usuário encontrado
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      const email = userData.email;

      // Tenta fazer login com email e senha
      const userCredential = await signInWithEmailAndPassword(auth, email, credentials.password);

      // Retorna os dados do usuário
      return {
        user: {
          id: userDoc.id,
          email: email,
          cpf: credentials.cpf
        },
        token: await userCredential.user.getIdToken()
      };
    } catch (error: any) {
      if (error.code === 'auth/wrong-password') {
        throw new Error('Senha incorreta.');
      } else if (error.code === 'auth/user-not-found') {
        throw new Error('Usuário não encontrado.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Muitas tentativas. Tente novamente mais tarde.');
      }
      throw new Error(AUTH_ERRORS.UNKNOWN_ERROR);
    }
  }

  static async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Verifica se já existe usuário com o mesmo CPF
      const cpfExists = await this.checkExistingUser(data.cpf, data.email);
      if (cpfExists.exists) {
        throw new Error(cpfExists.reason);
      }

      // Cria o usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // Cria o documento do usuário no Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: data.email,
        cpf: data.cpf,
        phone: data.phone,
        is_email_verified: false,
        is_phone_verified: false,
        created_at: serverTimestamp()
      });

      // Envia email de verificação
      await sendEmailVerification(user);

      return {
        user: {
          id: user.uid,
          email: data.email,
          cpf: data.cpf
        },
        token: await user.getIdToken()
      };
    } catch (error: any) {
      throw new Error(error.message || AUTH_ERRORS.UNKNOWN_ERROR);
    }
  }

  static async verifyCode(data: VerificationData): Promise<void> {
    try {
      const codesRef = collection(db, 'verification_codes');
      const q = query(
        codesRef,
        where('code', '==', data.code),
        where('type', '==', data.type),
        where('used', '==', false)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('Código inválido ou expirado');
      }

      const codeDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, 'verification_codes', codeDoc.id), {
        used: true,
        verified_at: serverTimestamp()
      });
    } catch (error: any) {
      throw new Error(error.message || AUTH_ERRORS.UNKNOWN_ERROR);
    }
  }

  static async requestPasswordReset(identifier: string): Promise<void> {
    try {
      // Busca o email do usuário se for CPF
      if (identifier.match(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('cpf', '==', identifier.replace(/\D/g, '')));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          throw new Error('CPF não encontrado');
        }

        identifier = querySnapshot.docs[0].data().email;
      }

      await sendPasswordResetEmail(auth, identifier);
    } catch (error: any) {
      throw new Error(error.message || AUTH_ERRORS.UNKNOWN_ERROR);
    }
  }

  static setAuthToken(token: string): void {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  static removeAuthToken(): void {
    delete api.defaults.headers.common['Authorization'];
  }
}

export async function checkExistingUser(cpf: string, email: string) {
  try {
    // Verifica CPF
    const cpfQuery = query(collection(db, 'users'), where('cpf', '==', cpf));
    const cpfSnapshot = await getDocs(cpfQuery);

    if (!cpfSnapshot.empty) {
      return { exists: true, reason: 'CPF já cadastrado' };
    }

    // Verifica email
    const emailQuery = query(collection(db, 'users'), where('email', '==', email));
    const emailSnapshot = await getDocs(emailQuery);

    if (!emailSnapshot.empty) {
      return { exists: true, reason: 'Email já cadastrado' };
    }

    return { exists: false, reason: null };
  } catch (error) {
    console.error('Erro ao verificar usuário existente:', error);
    throw new Error('Erro ao verificar usuário existente');
  }
}

export async function sendEmailVerificationCode(email: string) {
  try {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // TODO: Implementar envio real de email
    console.log('Código de verificação enviado para', email, ':', code);
    
    // Armazena o código no Firestore
    await addDoc(collection(db, 'verification_codes'), {
      email,
      code,
      type: 'email',
      used: false,
      expires_at: new Date(Date.now() + 30 * 60 * 1000), // 30 minutos
      created_at: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Erro ao enviar código de verificação:', error);
    throw new Error('Erro ao enviar código de verificação');
  }
}

export async function sendPhoneVerificationCode(phone: string) {
  try {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // TODO: Implementar envio real de SMS/WhatsApp
    console.log('Código de verificação enviado para', phone, ':', code);
    
    // Armazena o código no Firestore
    await addDoc(collection(db, 'verification_codes'), {
      phone,
      code,
      type: 'phone',
      used: false,
      expires_at: new Date(Date.now() + 30 * 60 * 1000), // 30 minutos
      created_at: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Erro ao enviar código de verificação:', error);
    throw new Error('Erro ao enviar código de verificação');
  }
}

export async function verifyCode(type: 'email' | 'phone', contact: string, code: string) {
  try {
    const codesRef = collection(db, 'verification_codes');
    const q = query(
      codesRef,
      where(type, '==', contact),
      where('code', '==', code),
      where('type', '==', type),
      where('used', '==', false)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error('Código inválido ou expirado');
    }

    const codeDoc = querySnapshot.docs[0];
    const codeData = codeDoc.data();

    if (new Date(codeData.expires_at.toDate()) < new Date()) {
      throw new Error('Código expirado');
    }

    // Marca o código como usado
    await updateDoc(doc(db, 'verification_codes', codeDoc.id), {
      used: true,
      verified_at: serverTimestamp()
    });

    return true;
  } catch (error) {
    console.error('Erro ao verificar código:', error);
    throw new Error('Erro ao verificar código');
  }
}

export async function createUser(userData: {
  cpf: string;
  email: string;
  phone: string;
  password: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
}) {
  try {
    // Cria o usuário no Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
    const user = userCredential.user;

    // Cria o documento do usuário no Firestore
    await setDoc(doc(db, 'users', user.uid), {
      cpf: userData.cpf,
      email: userData.email,
      phone: userData.phone,
      is_email_verified: userData.isEmailVerified,
      is_phone_verified: userData.isPhoneVerified,
      created_at: serverTimestamp()
    });

    return true;
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw new Error('Erro ao criar usuário');
  }
} 