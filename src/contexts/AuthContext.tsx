import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, googleProvider, auth, db } from '../firebase';
import { User, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  role: 'admin' | 'teacher' | 'user' | null;
  loading: boolean;
  login: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'admin' | 'teacher' | 'user' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Check role in Firestore
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        let userDisplayName = currentUser.displayName;
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
          if (!userDisplayName) {
            userDisplayName = userDoc.data().displayName;
          }
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

        // Also record/sync the user to the jain_community directory
        try {
          const communityRef = doc(db, 'jain_community', currentUser.uid);
          const communityDoc = await getDoc(communityRef);
          const isDev = currentUser.email === 'samiljain0111@gmail.com';
          const finalDisplayName = userDisplayName || currentUser.displayName || 'Jain Soul';
          
          if (communityDoc.exists()) {
            await setDoc(communityRef, {
              uid: currentUser.uid,
              displayName: finalDisplayName,
              photoURL: currentUser.photoURL || communityDoc.data().photoURL || '',
              email: currentUser.email || '',
              isDeveloper: isDev,
              updatedAt: Date.now()
            }, { merge: true });
          } else {
            await setDoc(communityRef, {
              uid: currentUser.uid,
              displayName: finalDisplayName,
              photoURL: currentUser.photoURL || '',
              email: currentUser.email || '',
              whatsapp: '',
              instagram: '',
              isDeveloper: isDev,
              updatedAt: Date.now()
            });
          }
        } catch (err) {
          console.error("Error updating jain_community:", err);
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Email login error:', error);
      throw error;
    }
  };

  const registerWithEmail = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
        
        const defaultRole = (email === 'samiljain0111@gmail.com' || email === 'admin@jainism.com') ? 'admin' : 'user';
        
        // Create user document in firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email,
          displayName,
          role: defaultRole
        });

        // Explicitly create/update jain_community document with correct displayName
        const isDev = email === 'samiljain0111@gmail.com';
        await setDoc(doc(db, 'jain_community', userCredential.user.uid), {
          uid: userCredential.user.uid,
          displayName: displayName,
          photoURL: '',
          email: email,
          whatsapp: '',
          instagram: '',
          isDeveloper: isDev,
          updatedAt: Date.now()
        });
      }
    } catch (error) {
      console.error('Email registration error:', error);
      throw error;
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
    <AuthContext.Provider value={{ user, role, loading, login, loginWithEmail, registerWithEmail, logout }}>
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
