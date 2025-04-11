// Re-export from firebase/config.ts
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// Configurazione Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

// Inizializza Firebase solo se non è già stato inizializzato e solo lato client
let app;
let auth: Auth;
let db: Firestore;
let functions = null;

// Verifica se siamo in ambiente browser
const isBrowser = typeof window !== 'undefined';

// Per evitare errori durante il rendering server-side o problemi di build
const safeInitializeFirebase = () => {
  try {
    if (isBrowser) {
      // Verifica se Firebase è già stato inizializzato
      if (!getApps().length) {
        app = initializeApp(firebaseConfig);
        console.log('Firebase inizializzato con successo lato client');
      } else {
        app = getApps()[0];
        console.log('Firebase già inizializzato lato client');
      }

      // Inizializza i servizi
      auth = getAuth(app);
      db = getFirestore(app);
      functions = getFunctions(app);
    } else {
      console.log('Firebase non inizializzato lato server');
    }
  } catch (error) {
    console.error('Errore durante l\'inizializzazione di Firebase:', error);
  }
};

// Tenta l'inizializzazione solo lato client
safeInitializeFirebase();

export { app, auth, db, functions }; 