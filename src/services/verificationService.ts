import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface VerificationCode {
  code: string;
  expiresAt: Date;
  attempts: number;
}

interface VerificationResult {
  success: boolean;
  message: string;
}

export class VerificationService {
  private static readonly MAX_ATTEMPTS = 3;
  private static readonly CODE_EXPIRATION_MINUTES = 10;
  private static readonly VERIFICATION_CODES = new Map<string, VerificationCode>();

  private static generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private static generateExpirationDate(): Date {
    const date = new Date();
    date.setMinutes(date.getMinutes() + this.CODE_EXPIRATION_MINUTES);
    return date;
  }

  private static async getUserByCPF(cpf: string) {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('cpf', '==', cpf.replace(/\D/g, '')));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error('Usuário não encontrado');
    }

    return querySnapshot.docs[0];
  }

  private static async verifyContactInfo(userDoc: any, contactInfo: string, type: 'email' | 'phone'): Promise<boolean> {
    const userData = userDoc.data();
    return userData[type] === contactInfo;
  }

  private static async updateUserVerificationStatus(userDoc: any, verified: boolean) {
    const userRef = doc(db, 'users', userDoc.id);
    await updateDoc(userRef, {
      [`${verified ? 'email' : 'phone'}Verified`]: verified,
      [`${verified ? 'email' : 'phone'}VerificationDate`]: new Date()
    });
  }

  public static async sendVerificationCode(cpf: string, contactInfo: string, type: 'email' | 'phone'): Promise<VerificationResult> {
    try {
      const userDoc = await this.getUserByCPF(cpf);
      
      if (!await this.verifyContactInfo(userDoc, contactInfo, type)) {
        return {
          success: false,
          message: `${type === 'email' ? 'Email' : 'Celular'} não corresponde ao cadastrado`
        };
      }

      const code = this.generateCode();
      const expiresAt = this.generateExpirationDate();

      this.VERIFICATION_CODES.set(`${cpf}-${type}`, {
        code,
        expiresAt,
        attempts: 0
      });

      if (type === 'email') {
        await sendPasswordResetEmail(auth, contactInfo);
        console.log(`Código de verificação enviado para ${contactInfo}: ${code}`);
      } else {
        // Simulação de envio de SMS
        console.log(`SMS enviado para ${contactInfo}: ${code}`);
      }

      return {
        success: true,
        message: `Código de verificação enviado para seu ${type === 'email' ? 'email' : 'celular'}`
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Erro ao enviar código de verificação'
      };
    }
  }

  public static async verifyCode(cpf: string, type: 'email' | 'phone', code: string): Promise<VerificationResult> {
    try {
      const key = `${cpf}-${type}`;
      const verification = this.VERIFICATION_CODES.get(key);

      if (!verification) {
        return {
          success: false,
          message: 'Código não encontrado ou expirado'
        };
      }

      if (verification.attempts >= this.MAX_ATTEMPTS) {
        this.VERIFICATION_CODES.delete(key);
        return {
          success: false,
          message: 'Número máximo de tentativas excedido'
        };
      }

      if (new Date() > verification.expiresAt) {
        this.VERIFICATION_CODES.delete(key);
        return {
          success: false,
          message: 'Código expirado'
        };
      }

      if (verification.code !== code) {
        verification.attempts++;
        this.VERIFICATION_CODES.set(key, verification);
        return {
          success: false,
          message: 'Código inválido'
        };
      }

      const userDoc = await this.getUserByCPF(cpf);
      await this.updateUserVerificationStatus(userDoc, true);
      this.VERIFICATION_CODES.delete(key);

      return {
        success: true,
        message: 'Código verificado com sucesso'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Erro ao verificar código'
      };
    }
  }

  public static async resendCode(cpf: string, type: 'email' | 'phone', contactInfo: string): Promise<VerificationResult> {
    try {
      const key = `${cpf}-${type}`;
      const verification = this.VERIFICATION_CODES.get(key);

      if (verification && new Date() < verification.expiresAt) {
        const timeLeft = Math.ceil((verification.expiresAt.getTime() - new Date().getTime()) / 1000 / 60);
        return {
          success: false,
          message: `Aguarde ${timeLeft} minutos para solicitar um novo código`
        };
      }

      return await this.sendVerificationCode(cpf, contactInfo, type);
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Erro ao reenviar código'
      };
    }
  }
} 