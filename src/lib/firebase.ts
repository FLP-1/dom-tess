import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCaFOj55WERh1uc2Jtt_TM4voz8-BEPPBU",
  authDomain: "dom-v2-300b5.firebaseapp.com",
  projectId: "dom-v2-300b5",
  storageBucket: "dom-v2-300b5.firebasestorage.app",
  messagingSenderId: "658346734595",
  appId: "1:658346734595:web:526ab40724d8bcc8860a36"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

// Initialize Firestore with basic configuration
const db = getFirestore(app);

export { app, auth, db }; 