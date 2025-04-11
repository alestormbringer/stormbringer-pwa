import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  Timestamp,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from './config';
import { updateProfile } from 'firebase/auth';
import { UserData } from '@/types/firebase';

// Crea o aggiorna il documento utente
export const createUserProfile = async (
  userId: string, 
  data: { 
    email: string; 
    displayName?: string; 
    photoURL?: string;
  }
) => {
  const userRef = doc(db, 'users', userId);
  const now = new Date();
  
  const userData: UserData = {
    uid: userId,
    email: data.email,
    displayName: data.displayName || data.email.split('@')[0], // Se non c'è displayName, usa la prima parte dell'email
    photoURL: data.photoURL || '',
    createdAt: now,
    updatedAt: now,
  };
  
  try {
    await setDoc(userRef, {
      ...userData,
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
    });
    
    console.log('Profilo utente creato/aggiornato con successo');
    return userData;
  } catch (error) {
    console.error('Errore durante la creazione/aggiornamento del profilo utente:', error);
    throw error;
  }
};

// Aggiorna il displayName dell'utente
export const updateUserDisplayName = async (userId: string, displayName: string, authUser: any) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    // Aggiorna il profilo Firebase Auth se l'oggetto auth user è fornito
    if (authUser) {
      await updateProfile(authUser, { displayName });
    }
    
    // Aggiorna il documento Firestore
    await updateDoc(userRef, { 
      displayName, 
      updatedAt: Timestamp.fromDate(new Date()) 
    });
    
    console.log('Nome utente aggiornato con successo');
    return true;
  } catch (error) {
    console.error('Errore durante l\'aggiornamento del nome utente:', error);
    throw error;
  }
};

// Ottieni i dati dell'utente
export const getUserProfile = async (userId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as UserData;
    }
    
    console.log('Profilo utente non trovato');
    return null;
  } catch (error) {
    console.error('Errore durante il recupero del profilo utente:', error);
    throw error;
  }
};

// Ottieni i dati di più utenti
export const getUserProfiles = async (userIds: string[]) => {
  try {
    const userProfiles: Record<string, UserData> = {};
    
    // Se non ci sono ID da cercare, restituisci un oggetto vuoto
    if (userIds.length === 0) {
      return userProfiles;
    }
    
    // Per piccoli set di dati, è più efficiente fare singole query
    if (userIds.length <= 10) {
      const promises = userIds.map(async (uid) => {
        const userProfile = await getUserProfile(uid);
        if (userProfile) {
          userProfiles[uid] = userProfile;
        }
      });
      
      await Promise.all(promises);
    } else {
      // Per set più grandi, ottiene tutti i documenti e filtra in memoria
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      
      querySnapshot.forEach((doc) => {
        const userData = doc.data() as UserData;
        if (userIds.includes(userData.uid)) {
          userProfiles[userData.uid] = userData;
        }
      });
    }
    
    return userProfiles;
  } catch (error) {
    console.error('Errore durante il recupero dei profili utenti:', error);
    throw error;
  }
}; 