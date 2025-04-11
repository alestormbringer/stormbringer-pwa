'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  UserCredential,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { auth } from '@/lib/firebase.config';
import { createUserProfile } from '@/firebase/userUtils';

interface AuthContextType {
  user: User | null;
  signUp: (email: string, password: string, displayName?: string) => Promise<UserCredential | void>;
  signIn: (email: string, password: string) => Promise<UserCredential | void>;
  signInWithGoogle: () => Promise<UserCredential | void>;
  signOut: () => Promise<void>;
  updateUserName: (displayName: string) => Promise<void>;
  updateUserPhoto: (photoURL: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  signUp: async () => {},
  signIn: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
  updateUserName: async () => {},
  updateUserPhoto: async () => {},
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, displayName?: string): Promise<UserCredential> => {
    try {
      console.log(`Tentativo di registrazione per: ${email}`);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Se è stato fornito un displayName, aggiorna il profilo Firebase Auth
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }
      
      // Crea il documento utente in Firestore
      await createUserProfile(result.user.uid, {
        email,
        displayName: displayName || undefined,
      });
      
      console.log('Registrazione completata:', result.user.uid);
      return result;
    } catch (error) {
      console.error('Errore durante la registrazione:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string): Promise<UserCredential> => {
    try {
      console.log(`Tentativo di login per: ${email}`);
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login completato:', result.user.uid);
      return result;
    } catch (error) {
      console.error('Errore durante il login:', error);
      throw error;
    }
  };

  const signInWithGoogle = async (): Promise<UserCredential> => {
    try {
      console.log('Tentativo di login con Google');
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Crea o aggiorna il documento utente in Firestore
      await createUserProfile(result.user.uid, {
        email: result.user.email || '',
        displayName: result.user.displayName || undefined,
        photoURL: result.user.photoURL || undefined,
      });
      
      console.log('Login con Google completato:', result.user.uid);
      return result;
    } catch (error) {
      console.error('Errore durante il login con Google:', error);
      throw error;
    }
  };

  const updateUserName = async (displayName: string): Promise<void> => {
    if (!user) throw new Error('Utente non autenticato');
    
    try {
      await updateProfile(user, { displayName });
      
      // Aggiorna anche il documento Firestore
      await createUserProfile(user.uid, {
        email: user.email || '',
        displayName,
        photoURL: user.photoURL || undefined,
      });
      
      // Forza un aggiornamento dell'utente nel contesto
      setUser({ ...user });
    } catch (error) {
      console.error('Errore durante l\'aggiornamento del nome utente:', error);
      throw error;
    }
  };

  const updateUserPhoto = async (photoURL: string): Promise<void> => {
    if (!user) throw new Error('Utente non autenticato');
    
    try {
      await updateProfile(user, { photoURL });
      
      // Aggiorna anche il documento Firestore
      await createUserProfile(user.uid, {
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL,
      });
      
      // Forza un aggiornamento dell'utente nel contesto
      setUser({ ...user });
    } catch (error) {
      console.error('Errore durante l\'aggiornamento della foto profilo:', error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('Logout completato');
    } catch (error) {
      console.error('Errore durante il logout:', error);
      throw error;
    }
  };

  const value = {
    user,
    signUp,
    signIn,
    signInWithGoogle,
    signOut: handleSignOut,
    updateUserName,
    updateUserPhoto,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 