interface EnderecoViaCEP {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export class CEPService {
  private static readonly CEP_REGEX = /^\d{5}-?\d{3}$/;
  private static readonly CEP_LENGTH = 8;
  private static readonly DEBOUNCE_TIME = 500;
  private static lastRequestTime = 0;

  static async buscarEndereco(cep: string): Promise<EnderecoViaCEP> {
    try {
      const cepLimpo = this.limparCEP(cep);
      
      if (!this.validarFormatoCEP(cepLimpo)) {
        throw new Error('Formato de CEP inválido');
      }

      // Implementa debounce
      const now = Date.now();
      if (now - this.lastRequestTime < this.DEBOUNCE_TIME) {
        await new Promise(resolve => setTimeout(resolve, this.DEBOUNCE_TIME));
      }
      this.lastRequestTime = Date.now();

      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar CEP. Tente novamente mais tarde.');
      }

      const data = await response.json();

      if (data.erro) {
        throw new Error('CEP não encontrado');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao buscar CEP. Tente novamente mais tarde.');
    }
  }

  static formatarCEP(cep: string): string {
    const cepLimpo = this.limparCEP(cep);
    if (cepLimpo.length === this.CEP_LENGTH) {
      return cepLimpo.replace(/^(\d{5})(\d{3})$/, '$1-$2');
    }
    return cep;
  }

  static validarFormatoCEP(cep: string): boolean {
    return this.CEP_REGEX.test(cep);
  }

  static limparCEP(cep: string): string {
    return cep.replace(/\D/g, '');
  }

  static async buscarEnderecoComRetry(cep: string, maxRetries = 3): Promise<EnderecoViaCEP> {
    let lastError: Error | null = null;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await this.buscarEndereco(cep);
      } catch (error) {
        lastError = error as Error;
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
      }
    }
    
    throw lastError || new Error('Falha ao buscar CEP após várias tentativas');
  }
} 