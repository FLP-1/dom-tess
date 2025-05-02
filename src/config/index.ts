interface Config {
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  api: {
    baseUrl: string;
    timeout: number;
  };
  auth: {
    tokenKey: string;
    sessionDuration: number; // em minutos
    maxLoginAttempts: number;
    verificationCodeExpiry: number; // em minutos
  };
  ui: {
    toastDuration: number; // em milissegundos
    maxFileSize: number; // em bytes
    allowedFileTypes: string[];
  };
}

const config: Config = {
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCaFOj55WERh1uc2Jtt_TM4voz8-BEPPBU",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "dom-v2-300b5.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "dom-v2-300b5",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "dom-v2-300b5.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "658346734595",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:658346734595:web:526ab40724d8bcc8860a36"
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    timeout: 30000 // 30 segundos
  },
  auth: {
    tokenKey: 'authToken',
    sessionDuration: 60 * 24, // 24 horas
    maxLoginAttempts: 5,
    verificationCodeExpiry: 30 // 30 minutos
  },
  ui: {
    toastDuration: 5000, // 5 segundos
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedFileTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
  }
};

export default config; 