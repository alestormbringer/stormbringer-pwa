import { User } from 'firebase/auth';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

export type FirebaseUser = User;
export type FirebaseDocument = DocumentData;
export type FirebaseQueryDocument = QueryDocumentSnapshot<DocumentData>;

// Tipi per i dati dell'utente
export interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Tipi per i dati del profilo
export interface ProfileData {
  uid: string;
  username: string;
  bio?: string;
  avatar?: string;
  socialLinks?: {
    website?: string;
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  createdAt: Date;
  updatedAt: Date;
} 