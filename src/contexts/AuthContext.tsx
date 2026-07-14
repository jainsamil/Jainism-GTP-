import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, googleProvider, auth, db } from '../firebase';
import { User, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: any;
  role: 'admin' | 'teacher' | 'user' | null;
  loading: boolean;
  login: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  loginAsDemo: () => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<'admin' | 'teacher' | 'user' | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if demo user was active
    const savedDemo = localStorage.getItem('jainism_demo_user');
    if (savedDemo) {
      try {
        const mockUser = JSON.parse(savedDemo);
        setUser(mockUser);
        setRole('admin');
        setLoading(false);
        return;
      } catch (e) {
        localStorage.removeItem('jainism_demo_user');
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // If a demo user is already set, do not override it with a null auth state on reload
      const isDemoActive = localStorage.getItem('jainism_demo_user');
      if (isDemoActive) {
        setLoading(false);
        return;
      }

      setUser(currentUser);
      if (currentUser) {
        // Check role in Firestore
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        } else {
          // Create user doc if not exists
          const defaultRole = (currentUser.email === 'samiljain0111@gmail.com' || currentUser.email === 'admin@jainism.com') ? 'admin' : 'user';
          await setDoc(doc(db, 'users', currentUser.uid), {
            email: currentUser.email,
            displayName: currentUser.displayName,
            role: defaultRole
          });
          setRole(defaultRole);
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Login error:', err);
      const isWebView = /wv|WebView|Android.*Version\/[0-9.]+/i.test(navigator.userAgent);
      const isMissingState = err?.message && (err.message.includes('initial state') || err.message.includes('storage') || err.message.includes('popup') || err.message.includes('closed') || err.message.includes('cancelled'));
      
      if (err?.code === 'auth/unauthorized-domain' || (err?.message && err.message.includes('unauthorized-domain'))) {
        setError(`unauthorized-domain: The domain '${window.location.hostname}' is not authorized in your Firebase project. Please add it in your Firebase Console (Authentication > Settings > Authorized Domains), or use the Pathshala username/password login below.`);
      } else if (isWebView || isMissingState || err?.code === 'auth/web-storage-unsupported' || err?.code === 'auth/operation-not-supported-in-this-environment') {
        setError(`PWA/WebView App Alert: आप APK (app24creator) या इन-ऐप WebView का उपयोग कर रहे हैं। Google Sign-In सुरक्षा कारणों से APK/WebView के अंदर सीधे काम नहीं करता है।
👉 समाधान: कृपया Pathshala में जाकर अपना अकाउंट (Email/Password) रजिस्टर/लॉगिन करें, या फिर ऐप को सामान्य मोबाइल ब्राउज़र (जैसे Google Chrome) में खोलकर Google Sign-In का उपयोग करें।
(You are in an APK/WebView. Google Auth is blocked here. Please use Pathshala Email/Password login instead, or open in Chrome/Safari browser.)`);
      } else {
        setError(err?.message || 'Authentication failed. Please try again.');
      }
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error('Email login error:', err);
      if (err?.code === 'auth/wrong-password' || err?.code === 'auth/user-not-found' || err?.code === 'auth/invalid-credential') {
        setError('Incorrect email or password. Please try again.');
      } else {
        setError(err?.message || 'Invalid email or password.');
      }
      throw err;
    }
  };

  const registerWithEmail = async (email: string, password: string, displayName: string) => {
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
        // Create user doc in firestore
        const defaultRole = (email === 'samiljain0111@gmail.com' || email === 'admin@jainism.com') ? 'admin' : 'user';
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email,
          displayName,
          role: defaultRole
        });
        setRole(defaultRole);
        setUser({ ...userCredential.user, displayName });
      }
    } catch (err: any) {
      console.error('Email registration error:', err);
      if (err?.code === 'auth/email-already-in-use') {
        setError('This email address is already registered. Please sign in instead.');
      } else if (err?.code === 'auth/weak-password') {
        setError('The password is too weak. Please choose a password with at least 6 characters.');
      } else {
        setError(err?.message || 'Registration failed. Please try again.');
      }
      throw err;
    }
  };

  const loginAsDemo = async () => {
    setError(null);
    const mockUser = {
      uid: 'demo_samil_jain_admin_uid_999',
      email: 'samiljain0111@gmail.com',
      displayName: 'Samil Jain',
      photoURL: 'https://i.ibb.co/Myg19RW6/1000539584.jpg',
      emailVerified: true,
    };
    setUser(mockUser);
    setRole('admin');
    localStorage.setItem('jainism_demo_user', JSON.stringify(mockUser));
  };

  const logout = async () => {
    try {
      localStorage.removeItem('jainism_demo_user');
      await signOut(auth);
      setUser(null);
      setRole(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, loginWithEmail, registerWithEmail, loginAsDemo, logout, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
