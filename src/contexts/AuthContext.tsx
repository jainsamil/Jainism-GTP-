import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, googleProvider, auth, db } from '../firebase';
import { User, signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  role: 'admin' | 'teacher' | 'user' | 'developer' | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'admin' | 'teacher' | 'user' | 'developer' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Process redirect result for mobile/fallback redirect login flow
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          console.log("Successfully logged in via redirect:", result.user);
        }
      } catch (error: any) {
        console.error("Redirect login handling error:", error);
        if (error.code === 'auth/unauthorized-domain') {
          alert("Domain Unauthorized: Please add your Vercel domain (e.g., jinismgpt.vercel.app) to Firebase Console > Authentication > Settings > Authorized Domains. / कृपया अपना Vercel डोमेन Firebase Console में Authorized Domains में जोड़ें।");
        } else {
          alert("Login via Redirect failed / लॉगिन विफल: " + error.message);
        }
      }
    };
    handleRedirectResult();

    // 2. Auth state observer
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Check role in Firestore
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        } else {
          // Create user doc if not exists
          const defaultRole = currentUser.email === 'samiljain0111@gmail.com' ? 'developer' : (currentUser.email === 'admin@jainism.com' ? 'admin' : 'user');
          await setDoc(doc(db, 'users', currentUser.uid), {
            uid: currentUser.uid,
            name: currentUser.displayName || '',
            email: currentUser.email || '',
            photoURL: currentUser.photoURL || '',
            role: defaultRole,
            isPublic: true,
            instagram: '',
            whatsapp: '',
            createdAt: serverTimestamp()
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
    // Detect mobile device or in-app browser / webview where popups fail or are blocked
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

    if (isMobile) {
      try {
        console.log("Mobile/WebView detected. Initiating signInWithRedirect...");
        await signInWithRedirect(auth, googleProvider);
      } catch (error: any) {
        console.error('Redirect login initiation error:', error);
        if (error.code === 'auth/unauthorized-domain') {
          alert("Domain Unauthorized: Please add your Vercel domain (e.g., jinismgpt.vercel.app) to Firebase Console > Authentication > Settings > Authorized Domains. / कृपया अपना Vercel डोमेन Firebase Console में Authorized Domains में जोड़ें।");
        } else {
          alert("Redirect login failed / लॉगिन विफल: " + error.message);
        }
      }
    } else {
      try {
        console.log("Desktop detected. Initiating signInWithPopup...");
        await signInWithPopup(auth, googleProvider);
      } catch (error: any) {
        console.error('Popup login error:', error);
        if (error.code === 'auth/popup-blocked') {
          try {
            console.log("Popup blocked. Falling back to signInWithRedirect...");
            await signInWithRedirect(auth, googleProvider);
          } catch (redirectError: any) {
            console.error('Redirect fallback login error:', redirectError);
          }
        } else if (error.code === 'auth/unauthorized-domain') {
          alert("Domain Unauthorized: Please add your Vercel domain (e.g., jinismgpt.vercel.app) to Firebase Console > Authentication > Settings > Authorized Domains. / कृपया अपना Vercel डोमेन Firebase Console में Authorized Domains में जोड़ें।");
        } else if (error.code !== 'auth/popup-closed-by-user') {
          alert("Login failed / लॉगिन विफल: " + error.message);
        }
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout }}>
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
