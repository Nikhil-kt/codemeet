import { firestore, isLiveFirebaseConfigured, hasFirebaseAdminCredentials } from './firebase';
import { config } from '../config';

export class FirestoreSync {
  /**
   * Persist a document to Cloud Firestore
   * Uses Firebase Admin SDK if service account is active, or falls back to Firestore REST API
   * Supports user auth Bearer token for client-level permission authentication
   */
  public static async setDoc(collectionName: string, docId: string, data: any, userToken?: string): Promise<boolean> {
    // 1. Direct Firebase Admin SDK if service account credentials are provided
    if (firestore && hasFirebaseAdminCredentials()) {
      try {
        await firestore.collection(collectionName).doc(docId).set(data, { merge: true });
        return true;
      } catch (err: any) {
        console.warn(`[FirestoreSync] Admin write note for '${collectionName}/${docId}':`, err.message);
      }
    }

    // 2. Fallback to Firebase REST API using Project ID & Web API Key (with optional user token)
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBnRD3hU_5uYk_lqnv9JBz47mrPIgQtaws';
    const projectId = config.firebase.projectId || 'timepass-fe09d';

    if (projectId && apiKey) {
      try {
        const fields = FirestoreSync.convertToFirestoreFields(data);
        const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collectionName}/${docId}?key=${apiKey}`;
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        // Only forward token to Google API if it is an authentic Firebase RS256 token, NOT an internal HS256 JWT
        const isGoogleFirebaseToken = userToken && (userToken.includes('eyJhbGciOiJSUzI1Ni') || userToken.startsWith('Bearer eyJhbGciOiJSUzI1Ni'));
        if (isGoogleFirebaseToken) {
          headers['Authorization'] = userToken.startsWith('Bearer ') ? userToken : `Bearer ${userToken}`;
        }

        const res = await fetch(url, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ fields }),
        });

        if (res.ok) {
          return true;
        } else {
          const errData: any = await res.json().catch(() => ({}));
          const errMsg = errData?.error?.message || res.statusText;
          if (res.status === 403) {
            console.warn(`[FirestoreSync] Note: Firestore collection '${collectionName}' write requires service account or Firestore rules in test mode:`, errMsg);
          } else {
            console.warn(`[FirestoreSync] REST API write to '${collectionName}' failed:`, errMsg);
          }
        }
      } catch (e: any) {
        console.warn(`[FirestoreSync] REST API connection error:`, e.message);
      }
    }

    return false;
  }

  /**
   * Retrieve a document from Cloud Firestore
   */
  public static async getDoc(collectionName: string, docId: string): Promise<any | null> {
    if (firestore && hasFirebaseAdminCredentials()) {
      try {
        const snap = await firestore.collection(collectionName).doc(docId).get();
        if (snap.exists) return snap.data();
      } catch (e) {}
    }
    return null;
  }

  /**
   * Formats a standard JavaScript object into Firestore REST API Value types
   */
  private static convertToFirestoreFields(data: any): Record<string, any> {
    const fields: Record<string, any> = {};
    if (!data || typeof data !== 'object') return fields;

    for (const [key, value] of Object.entries(data)) {
      if (value === null || value === undefined) {
        fields[key] = { nullValue: null };
      } else if (typeof value === 'string') {
        fields[key] = { stringValue: value };
      } else if (typeof value === 'boolean') {
        fields[key] = { booleanValue: value };
      } else if (typeof value === 'number') {
        if (Number.isInteger(value)) {
          fields[key] = { integerValue: value.toString() };
        } else {
          fields[key] = { doubleValue: value };
        }
      } else if (Array.isArray(value)) {
        fields[key] = {
          arrayValue: {
            values: value.map(v => {
              if (typeof v === 'string') return { stringValue: v };
              if (typeof v === 'number') return { integerValue: v.toString() };
              if (typeof v === 'boolean') return { booleanValue: v };
              return { stringValue: JSON.stringify(v) };
            })
          }
        };
      } else if (typeof value === 'object') {
        fields[key] = { stringValue: JSON.stringify(value) };
      }
    }
    return fields;
  }
}

