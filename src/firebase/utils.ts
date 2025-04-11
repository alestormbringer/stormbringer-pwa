import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';
import type { UserData, ProfileData } from '../types/firebase';

// Funzioni per la gestione degli utenti
export const createUserDocument = async (userData: UserData) => {
  const userRef = doc(db, 'users', userData.uid);
  await setDoc(userRef, {
    ...userData,
    createdAt: Timestamp.fromDate(userData.createdAt),
    updatedAt: Timestamp.fromDate(userData.updatedAt)
  });
};

export const updateUserDocument = async (uid: string, data: Partial<UserData>) => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    ...data,
    updatedAt: Timestamp.fromDate(new Date())
  });
};

export const getUserDocument = async (uid: string) => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
};

// Funzioni per la gestione dei profili
export const createProfileDocument = async (profileData: ProfileData) => {
  const profileRef = doc(db, 'profiles', profileData.uid);
  await setDoc(profileRef, {
    ...profileData,
    createdAt: Timestamp.fromDate(profileData.createdAt),
    updatedAt: Timestamp.fromDate(profileData.updatedAt)
  });
};

export const updateProfileDocument = async (uid: string, data: Partial<ProfileData>) => {
  const profileRef = doc(db, 'profiles', uid);
  await updateDoc(profileRef, {
    ...data,
    updatedAt: Timestamp.fromDate(new Date())
  });
};

export const getProfileDocument = async (uid: string) => {
  const profileRef = doc(db, 'profiles', uid);
  const profileSnap = await getDoc(profileRef);
  return profileSnap.exists() ? profileSnap.data() : null;
};

// Funzioni di utilità
export const timestampToDate = (timestamp: any) => {
  return timestamp?.toDate() || null;
};

export const dateToTimestamp = (date: Date) => {
  return Timestamp.fromDate(date);
}; 