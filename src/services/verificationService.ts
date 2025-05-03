import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { BaseServiceResponse } from '@/types/common';

export interface VerificationCode {
  code: string;
  expiresAt: Date;
  attempts: number;
  userId: string;
  type: 'email' | 'phone' | 'password';
  identifier: string;
}

export class VerificationService {
  private static readonly MAX_ATTEMPTS = 3;
  private static readonly CODE_EXPIRATION_MINUTES = 10;
  private static readonly COLLECTION_NAME = 'verifications';

  private static generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private static generateExpirationDate(): Date {
    const date = new Date();
    date.setMinutes(date.getMinutes() + this.CODE_EXPIRATION_MINUTES);
    return date;
  }

  public async createVerification(
    userId: string,
    type: VerificationCode['type'],
    identifier: string
  ): Promise<BaseServiceResponse<VerificationCode>> {
    try {
      const code = VerificationService.generateCode();
      const expiresAt = VerificationService.generateExpirationDate();

      const verification: VerificationCode = {
        code,
        expiresAt,
        attempts: 0,
        userId,
        type,
        identifier
      };

      await setDoc(doc(db, VerificationService.COLLECTION_NAME, code), verification);

      return {
        success: true,
        data: verification,
        message: 'Código de verificação criado com sucesso'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao criar código de verificação',
        message: 'Falha ao criar código de verificação'
      };
    }
  }

  public async verifyCode(
    code: string,
    type: VerificationCode['type'],
    identifier: string
  ): Promise<BaseServiceResponse<boolean>> {
    try {
      const q = query(
        collection(db, VerificationService.COLLECTION_NAME),
        where('code', '==', code),
        where('type', '==', type),
        where('identifier', '==', identifier)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return {
          success: false,
          error: 'Código inválido',
          message: 'Código de verificação inválido'
        };
      }

      const verification = querySnapshot.docs[0].data() as VerificationCode;

      if (verification.attempts >= VerificationService.MAX_ATTEMPTS) {
        await this.deleteVerification(code);
        return {
          success: false,
          error: 'Número máximo de tentativas excedido',
          message: 'Número máximo de tentativas excedido'
        };
      }

      if (verification.expiresAt.getTime() < Date.now()) {
        await this.deleteVerification(code);
        return {
          success: false,
          error: 'Código expirado',
          message: 'Código de verificação expirado'
        };
      }

      await this.deleteVerification(code);
      return {
        success: true,
        data: true,
        message: 'Código verificado com sucesso'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao verificar código',
        message: 'Falha ao verificar código'
      };
    }
  }

  private async deleteVerification(code: string): Promise<BaseServiceResponse<void>> {
    try {
      await deleteDoc(doc(db, VerificationService.COLLECTION_NAME, code));
      return {
        success: true,
        message: 'Verificação excluída com sucesso'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao excluir verificação',
        message: 'Falha ao excluir verificação'
      };
    }
  }

  public async incrementAttempts(code: string): Promise<BaseServiceResponse<void>> {
    try {
      const docRef = doc(db, VerificationService.COLLECTION_NAME, code);
      await updateDoc(docRef, {
        attempts: (await getDocs(query(collection(db, VerificationService.COLLECTION_NAME), where('code', '==', code)))).docs[0].data().attempts + 1
      });
      return {
        success: true,
        message: 'Tentativas incrementadas com sucesso'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao incrementar tentativas',
        message: 'Falha ao incrementar tentativas'
      };
    }
  }

  public async sendPasswordResetEmail(email: string): Promise<BaseServiceResponse<void>> {
    try {
      await sendPasswordResetEmail(auth, email);
      return {
        success: true,
        message: 'E-mail de redefinição de senha enviado com sucesso'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao enviar e-mail de redefinição de senha',
        message: 'Falha ao enviar e-mail de redefinição de senha'
      };
    }
  }
}

export const verificationService = new VerificationService(); 