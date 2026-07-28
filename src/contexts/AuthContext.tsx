import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult, 
  signOut, 
  googleProvider, 
  auth, 
  db, 
  isWebView 
} from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: any;
  role: 'admin' | 'teacher' | 'user' | null;
  loading: boolean;
  login: () => Promise<void>;
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

  // Sync user profile with Firestore database
  const syncUserProfile = async (currentUser: any) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        setRole(userDoc.data().role);
      } else {
        const defaultRole = (currentUser.email === 'samiljain0111@gmail.com' || currentUser.email === 'admin@jainism.com') ? 'admin' : 'user';
        await setDoc(doc(db, 'users', currentUser.uid), {
          email: currentUser.email,
          displayName: currentUser.displayName,
          role: defaultRole
        });
        setRole(defaultRole);
      }
    } catch (e) {
      console.error('Error fetching/creating user profile:', e);
    }
  };

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

    // Process redirect result if coming back from OAuth redirect (e.g., inside Android WebView)
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          setUser(result.user);
          await syncUserProfile(result.user);
        }
      })
      .catch((err) => {
        console.error('Redirect auth result error:', err);
        if (err?.code === 'auth/unauthorized-domain' || (err?.message && err.message.includes('unauthorized-domain'))) {
          setError(`unauthorized-domain: The domain '${window.location.hostname}' is not authorized in your Firebase project. Please add it in your Firebase Console (Authentication > Settings > Authorized Domains).`);
        } else if (err?.code !== 'auth/popup-closed-by-user') {
          setError(err?.message || 'Authentication failed. Please try again.');
        }
      });

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // If a demo user is already set, do not override it with a null auth state on reload
      const isDemoActive = localStorage.getItem('jainism_demo_user');
      if (isDemoActive) {
        setLoading(false);
        return;
      }

      setUser(currentUser);
      if (currentUser) {
        await syncUserProfile(currentUser);
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
      if (isWebView()) {
        // WebView mode: Use redirect flow to avoid popup window sessionStorage isolation
        await signInWithRedirect(auth, googleProvider);
      } else {
        // Standard browser mode: Use popup flow
        await signInWithPopup(auth, googleProvider);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err?.code === 'auth/unauthorized-domain' || (err?.message && err.message.includes('unauthorized-domain'))) {
        setError(`unauthorized-domain: The domain '${window.location.hostname}' is not authorized in your Firebase project. Please add it in your Firebase Console (Authentication > Settings > Authorized Domains).`);
      } else {
        setError(err?.message || 'Authentication failed. Please try again.');
      }
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
    <AuthContext.Provider value={{ user, role, loading, login, loginAsDemo, logout, error, setError }}>
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
