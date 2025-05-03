import { BaseVerificationService, VerificationResult } from './base/BaseVerificationService';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export class EmailVerificationService extends BaseVerificationService {
  public static async sendVerificationCode(cpf: string, email: string): Promise<VerificationResult> {
    try {
      const userDoc = await this.getUserByCPF(cpf);
      
      if (!await this.verifyContactInfo(userDoc, email, 'email')) {
        return {
          success: false,
          message: 'Email não corresponde ao cadastrado'
        };
      }

      const code = this.generateCode();
      const expiresAt = this.generateExpirationDate();

      await this.saveVerificationCode(`${cpf}-email`, code, expiresAt);

      await sendPasswordResetEmail(auth, email);
      console.log(`Código de verificação enviado para ${email}: ${code}`);

      return {
        success: true,
        message: 'Código de verificação enviado para seu email'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Erro ao enviar código de verificação'
      };
    }
  }

  public static async verifyCode(cpf: string, code: string): Promise<VerificationResult> {
    try {
      const result = await this.verifyCode(`${cpf}-email`, code);
      
      if (result.success) {
        const userDoc = await this.getUserByCPF(cpf);
        await this.updateUserVerificationStatus(userDoc, 'email');
      }

      return result;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Erro ao verificar código'
      };
    }
  }

  public static async resendCode(cpf: string, email: string): Promise<VerificationResult> {
    try {
      const key = `${cpf}-email`;
      const canResend = await this.canResendCode(key);
      
      if (canResend) {
        return canResend;
      }

      return await this.sendVerificationCode(cpf, email);
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Erro ao reenviar código'
      };
    }
  }
} 