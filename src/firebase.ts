import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup as fbSignInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Enable offline persistence with fallback for environments where IndexedDB is blocked
let firestoreInstance;
try {
  firestoreInstance = initializeFirestore(app, {
    localCache: persistentLocalCache({tabManager: persistentMultipleTabManager()})
  }, firebaseConfig.firestoreDatabaseId);
} catch (e) {
  console.warn("Offline persistence not supported in this browser environment, falling back to default.", e);
  firestoreInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId);
}
export const db = firestoreInstance;

export const googleProvider = new GoogleAuthProvider();

// Test connection
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

export const signInWithPopup = async (...args: Parameters<typeof fbSignInWithPopup>) => {
  try {
    return await fbSignInWithPopup(...args);
  } catch (error: any) {
    if (error && (error.code === 'auth/unauthorized-domain' || (error.message && error.message.includes('unauthorized-domain')))) {
      window.dispatchEvent(new CustomEvent('firebase-auth-unauthorized-domain', {
        detail: {
          domain: window.location.hostname,
          error: error.message || 'Unauthorized domain'
        }
      }));
    }
    throw error;
  }
};

export { signOut, onAuthStateChanged };
