import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import config from '../config';

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(config.firebase) : getApps()[0];
const auth = getAuth(app);

// Initialize Firestore with basic configuration
const db = getFirestore(app);

export { app, auth, db }; 