declare global {
  interface Window {
    PublicKeyCredential?: {
      isUserVerifyingPlatformAuthenticatorAvailable(): Promise<boolean>;
    };
  }
}

export async function isBiometricAvailable(): Promise<boolean> {
  if (!window.PublicKeyCredential) {
    return false;
  }

  return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
}

export async function registerBiometric(userId: string, username: string): Promise<Credential | null> {
  try {
    const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
      challenge: Uint8Array.from(
        window.crypto.getRandomValues(new Uint8Array(32))
      ),
      rp: {
        name: "DOM - Gestão Doméstica",
        id: window.location.hostname
      },
      user: {
        id: Uint8Array.from(userId, c => c.charCodeAt(0)),
        name: username,
        displayName: username
      },
      pubKeyCredParams: [{
        type: "public-key",
        alg: -7 // ES256
      }],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "required",
        residentKey: "required"
      },
      timeout: 60000,
      attestation: "direct"
    };

    const credential = await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions
    });

    return credential;
  } catch (error) {
    console.error('Erro ao registrar biometria:', error);
    throw error;
  }
}

export async function authenticateWithBiometric(): Promise<Credential | null> {
  try {
    const challenge = window.crypto.getRandomValues(new Uint8Array(32));
    
    const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
      challenge,
      timeout: 60000,
      userVerification: "required",
      rpId: window.location.hostname,
    };

    const assertion = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions
    });

    return assertion;
  } catch (error) {
    console.error('Erro na autenticação biométrica:', error);
    throw error;
  }
} 