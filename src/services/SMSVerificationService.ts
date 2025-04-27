import { BaseVerificationService, VerificationResult } from './base/BaseVerificationService';

export class SMSVerificationService extends BaseVerificationService {
  public static async sendVerificationCode(cpf: string, phone: string): Promise<VerificationResult> {
    try {
      const userDoc = await this.getUserByCPF(cpf);
      
      if (!await this.verifyContactInfo(userDoc, phone, 'phone')) {
        return {
          success: false,
          message: 'Celular não corresponde ao cadastrado'
        };
      }

      const code = this.generateCode();
      const expiresAt = this.generateExpirationDate();

      await this.saveVerificationCode(`${cpf}-phone`, code, expiresAt);

      // Simulação de envio de SMS
      console.log(`SMS enviado para ${phone}: ${code}`);

      return {
        success: true,
        message: 'Código de verificação enviado para seu celular'
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
      const result = await this.verifyCode(`${cpf}-phone`, code);
      
      if (result.success) {
        const userDoc = await this.getUserByCPF(cpf);
        await this.updateUserVerificationStatus(userDoc, 'phone');
      }

      return result;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Erro ao verificar código'
      };
    }
  }

  public static async resendCode(cpf: string, phone: string): Promise<VerificationResult> {
    try {
      const key = `${cpf}-phone`;
      const canResend = this.canResendCode(key);
      
      if (canResend) {
        return canResend;
      }

      return await this.sendVerificationCode(cpf, phone);
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Erro ao reenviar código'
      };
    }
  }
} 