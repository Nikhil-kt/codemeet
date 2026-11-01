import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBnRD3hU_5uYk_lqnv9JBz47mrPIgQtaws",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "timepass-fe09d.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "timepass-fe09d",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "timepass-fe09d.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "960444975278",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:960444975278:web:f366c1d7599e63e095853f"
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const isLiveFirebaseFrontend = (): boolean => {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
};

