import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getStorage, Storage } from 'firebase-admin/storage';
import { config } from '../config';

let app: App | null = null;
let firebaseAuth: Auth | null = null;
let firestore: Firestore | null = null;
let firebaseStorage: Storage | null = null;

const hasAdminCredentials = Boolean(config.firebase.clientEmail && config.firebase.privateKey);

try {
  if (getApps().length === 0) {
    if (hasAdminCredentials) {
      app = initializeApp({
        credential: cert({
          projectId: config.firebase.projectId,
          clientEmail: config.firebase.clientEmail,
          privateKey: config.firebase.privateKey,
        }),
        storageBucket: config.firebase.storageBucket,
      });
    } else if (config.firebase.projectId) {
      app = initializeApp({
        projectId: config.firebase.projectId,
        storageBucket: config.firebase.storageBucket,
      });
    }
  } else {
    app = getApps()[0];
  }

  if (app) {
    firebaseAuth = getAuth(app);
    // Firestore and Storage admin clients require service account credentials to prevent gRPC ADC crashes
    if (hasAdminCredentials) {
      firestore = getFirestore(app);
      firebaseStorage = getStorage(app);
    } else {
      firestore = null;
      firebaseStorage = null;
    }
  }
} catch (err: any) {
  console.warn('[Firebase Admin] Note: initialization deferred or in offline store mode:', err.message);
}

export { app as firebaseAdminApp, firebaseAuth, firestore, firebaseStorage };

export const isLiveFirebaseConfigured = (): boolean => {
  return Boolean(app && config.firebase.projectId);
};

export const hasFirebaseAdminCredentials = (): boolean => {
  return hasAdminCredentials;
};
