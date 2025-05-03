'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  deleteUser
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, deleteDoc, collection, query, where, getDocs, getDoc } from 'firebase/firestore';
import { identifyLoginType, LoginType } from '@/utils/auth';
import { AUTH_ERRORS } from '@/constants/errors';

interface User {
  uid: string;
  email: string;
  name: string;
  role: 'employer' | 'employee' | 'user';
  cpf: string;
  phone?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  id: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: 'employer' | 'employee', cpf: string, phone?: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkEmployerExists: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: userData.name || '',
            role: userData.role || 'user',
            cpf: userData.cpf || '',
            phone: userData.phone,
            emailVerified: true,
            phoneVerified: true,
            id: firebaseUser.uid
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Iniciando signIn com email:', email);
      
      if (!email || !password) {
        console.error('Email ou senha não fornecidos');
        throw new Error('Email e senha são obrigatórios');
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login Firebase bem sucedido:', userCredential.user.uid);

      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (!userDoc.exists()) {
        console.error('Documento do usuário não encontrado no Firestore');
        throw new Error('Usuário não encontrado');
      }

      const userData = userDoc.data();
      console.log('Dados do usuário recuperados:', { ...userData, uid: userCredential.user.uid });

      // Obtém o token do Firebase
      const idToken = await userCredential.user.getIdToken();
      console.log('Token obtido com sucesso');

      // Configura o cookie de sessão
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: idToken }),
      });

      if (!response.ok) {
        console.error('Erro ao configurar sessão:', response.status);
        throw new Error('Falha ao configurar a sessão');
      }

      console.log('Sessão configurada com sucesso');

      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email || '',
        name: userData.name || '',
        role: userData.role || 'user',
        cpf: userData.cpf || '',
        phone: userData.phone,
        emailVerified: true,
        phoneVerified: true,
        id: userCredential.user.uid
      });

      console.log('Estado do usuário atualizado com sucesso');
    } catch (error: any) {
      console.error('Erro detalhado no signIn:', error);
      
      if (error.code === 'auth/wrong-password') {
        throw new Error('Senha incorreta');
      } else if (error.code === 'auth/user-not-found') {
        throw new Error('Usuário não encontrado');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Muitas tentativas. Tente novamente mais tarde');
      }
      throw new Error(error.message || 'Erro ao fazer login');
    }
  };

  const signUp = async (email: string, password: string, name: string, role: 'employer' | 'employee', cpf: string, phone?: string) => {
    try {
      console.log('Iniciando processo de registro no AuthContext:', { email, name, role, cpf, phone });
      
      // Verifica se já existe usuário com o mesmo CPF
      const cpfQuery = query(collection(db, 'users'), where('cpf', '==', cpf));
      const cpfSnapshot = await getDocs(cpfQuery);
      console.log('Resultado da verificação de CPF:', cpfSnapshot.size, 'documentos encontrados');

      if (!cpfSnapshot.empty) {
        console.error('CPF já cadastrado');
        throw new Error('CPF já cadastrado');
      }

      console.log('Criando usuário no Firebase Auth...');
      // Cria o usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Usuário criado no Firebase Auth:', userCredential.user.uid);
      
      // Atualiza o perfil com o nome
      console.log('Atualizando perfil do usuário...');
      await updateProfile(userCredential.user, {
        displayName: name
      });
      console.log('Perfil atualizado com sucesso');

      console.log('Criando documento do usuário no Firestore...');
      // Cria o documento do usuário no Firestore com retry
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            name,
            email,
            role,
            cpf,
            phone,
            is_email_verified: true,
            is_phone_verified: true,
            created_at: new Date()
          });
          console.log('Documento do usuário criado no Firestore com sucesso');
          break;
        } catch (error) {
          console.error(`Tentativa ${retryCount + 1} falhou:`, error);
          retryCount++;
          if (retryCount === maxRetries) {
            throw error;
          }
          // Espera um pouco antes de tentar novamente
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      setUser({
        uid: userCredential.user.uid,
        email,
        name,
        role,
        cpf,
        phone,
        emailVerified: true,
        phoneVerified: true,
        id: userCredential.user.uid
      });
      
      console.log('Registro concluído com sucesso');
      return userCredential.user;
    } catch (error: any) {
      console.error('Erro detalhado durante o registro:', error);
      
      // Se o usuário foi criado no Auth mas falhou no Firestore, tenta deletar o usuário
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Email já cadastrado');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Email inválido');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      } else if (error.code === 'auth/network-request-failed') {
        throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
      }
      
      throw new Error(error.message || 'Erro ao criar conta');
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao fazer logout');
    }
  };

  const checkEmployerExists = async () => {
    try {
      const employerQuery = query(
        collection(db, 'users'),
        where('role', '==', 'employer')
      );
      const snapshot = await getDocs(employerQuery);
      console.log('Resultado da busca de empregador (AuthContext):', snapshot.size, snapshot.docs.map(doc => doc.data()));
      return !snapshot.empty;
    } catch (error) {
      console.error('Erro ao verificar existência de empregador:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, checkEmployerExists }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 