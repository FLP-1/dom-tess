import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';

export interface VerificationCode {
  code: string;
  expiresAt: Date;
  attempts: number;
}

export interface VerificationResult {
  success: boolean;
  message: string;
}

export abstract class BaseVerificationService {
  protected static readonly MAX_ATTEMPTS = 3;
  protected static readonly CODE_EXPIRATION_MINUTES = 10;

  protected static generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  protected static generateExpirationDate(): Date {
    const date = new Date();
    date.setMinutes(date.getMinutes() + this.CODE_EXPIRATION_MINUTES);
    return date;
  }

  // Funções auxiliares para Firestore
  protected static async saveVerificationCode(key: string, code: string, expiresAt: Date) {
    await setDoc(doc(db, 'verificationCodes', key), {
      code,
      expiresAt: expiresAt.toISOString(),
      attempts: 0
    });
  }

  protected static async getVerificationCode(key: string): Promise<VerificationCode | null> {
    const docSnap = await getDocs(query(collection(db, 'verificationCodes'), where('__name__', '==', key)));
    if (docSnap.empty) return null;
    const data = docSnap.docs[0].data();
    return {
      code: data.code,
      expiresAt: new Date(data.expiresAt),
      attempts: data.attempts
    };
  }

  protected static async updateAttempts(key: string, attempts: number) {
    await updateDoc(doc(db, 'verificationCodes', key), { attempts });
  }

  protected static async deleteVerificationCode(key: string) {
    await deleteDoc(doc(db, 'verificationCodes', key));
  }

  protected static async getUserByCPF(cpf: string) {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('cpf', '==', cpf.replace(/\D/g, '')));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error('Usuário não encontrado');
    }

    return querySnapshot.docs[0];
  }

  protected static async verifyContactInfo(userDoc: any, contactInfo: string, type: string): Promise<boolean> {
    const userData = userDoc.data();
    return userData[type] === contactInfo;
  }

  protected static async updateUserVerificationStatus(userDoc: any, type: string) {
    const userRef = doc(db, 'users', userDoc.id);
    await updateDoc(userRef, {
      [`${type}Verified`]: true,
      [`${type}VerificationDate`]: new Date()
    });
  }

  protected static async verifyCode(key: string, code: string): Promise<VerificationResult> {
    const verification = await this.getVerificationCode(key);

    if (!verification) {
      return {
        success: false,
        message: 'O código expirou ou não foi encontrado. Solicite um novo código.'
      };
    }

    if (verification.attempts >= this.MAX_ATTEMPTS) {
      await this.deleteVerificationCode(key);
      return {
        success: false,
        message: 'Você excedeu o número máximo de tentativas. Solicite um novo código.'
      };
    }

    if (new Date() > verification.expiresAt) {
      await this.deleteVerificationCode(key);
      return {
        success: false,
        message: 'O código expirou. Solicite um novo código.'
      };
    }

    if (verification.code !== code) {
      await this.updateAttempts(key, verification.attempts + 1);
      return {
        success: false,
        message: 'O código informado está incorreto. Tente novamente.'
      };
    }

    await this.deleteVerificationCode(key);
    return {
      success: true,
      message: 'Código verificado com sucesso'
    };
  }

  protected static async canResendCode(key: string): Promise<VerificationResult | null> {
    const verification = await this.getVerificationCode(key);

    if (verification && new Date() < verification.expiresAt) {
      const timeLeft = Math.ceil((verification.expiresAt.getTime() - new Date().getTime()) / 1000 / 60);
      return {
        success: false,
        message: `Aguarde ${timeLeft} minutos para solicitar um novo código`
      };
    }

    return null;
  }
} 