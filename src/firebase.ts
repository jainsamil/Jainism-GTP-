import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import localFirebaseConfig from '../firebase-applet-config.json';

// Dynamically select Firebase config based on environment:
// - In AI Studio preview (run.app domains), use AI Studio's pre-configured database.
// - In Vercel deployment (vercel.app) or production, use your custom original-jainism-gpt database.
const isAiStudio = typeof window !== 'undefined' && window.location.hostname.includes('run.app');

const customConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDR81TMxBau6gZKv8wQ7M6j3H4xvnD1PuE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "original-jainism-gpt.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "original-jainism-gpt",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "original-jainism-gpt.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "359644941394",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:359644941394:web:b87fdc4abf726bec22e38b",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-3ZZWTR1DLZ",
};

const aiStudioConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || localFirebaseConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || localFirebaseConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || localFirebaseConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || localFirebaseConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || localFirebaseConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || localFirebaseConfig.appId,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || localFirebaseConfig.measurementId || "",
};

const firebaseConfig = isAiStudio ? aiStudioConfig : customConfig;

const firestoreDatabaseId = isAiStudio
  ? (import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || localFirebaseConfig.firestoreDatabaseId || "(default)")
  : (import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || "(default)");

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Enable offline persistence with fallback for environments where IndexedDB is blocked
let firestoreInstance;
try {
  firestoreInstance = initializeFirestore(app, {
    localCache: persistentLocalCache({tabManager: persistentMultipleTabManager()})
  }, firestoreDatabaseId);
} catch (e) {
  console.warn("Offline persistence not supported in this browser environment, falling back to default.", e);
  firestoreInstance = getFirestore(app, firestoreDatabaseId);
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

export { signInWithPopup, signOut, onAuthStateChanged };
