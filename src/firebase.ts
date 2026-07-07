import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import appletConfig from '../firebase-applet-config.json';

// Support production Vercel environment variables first, falling back to local applet config
const firebaseConfig = {
  apiKey: (import.meta.env.VITE_FIREBASE_API_KEY as string) || appletConfig.apiKey,
  authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string) || appletConfig.authDomain,
  projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID as string) || appletConfig.projectId,
  appId: (import.meta.env.VITE_FIREBASE_APP_ID as string) || appletConfig.appId,
  storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string) || appletConfig.storageBucket,
  messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string) || appletConfig.messagingSenderId,
  firestoreDatabaseId: (import.meta.env.VITE_FIREBASE_FIRESTORE_DB_ID as string) || appletConfig.firestoreDatabaseId
};

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
      console.warn("Please check your Firebase configuration.");
    }
  }
}
testConnection();

export { signInWithPopup, signOut, onAuthStateChanged };
