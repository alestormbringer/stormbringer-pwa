import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getAnalytics } from 'firebase/analytics';
import { getPerformance } from 'firebase/performance';
import { getStorage } from 'firebase/storage';

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

// Inizializza Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let functions = null;
let analytics = null;
let performance = null;
let storage = null;

// Inizializza con valori di default per evitare errori di tipo
try {
  // Verifica se Firebase è già inizializzato
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  console.log("Firebase inizializzato con successo");
  
  // Inizializza i servizi
  auth = getAuth(app);
  db = getFirestore(app);
  functions = getFunctions(app);
  storage = getStorage(app);
  
  // Inizializza Analytics e Performance solo lato client
  if (typeof window !== 'undefined') {
    try {
      analytics = getAnalytics(app);
      console.log("Analytics inizializzato con successo");
    } catch (error) {
      console.error('Errore durante l\'inizializzazione di Analytics:', error);
    }
  
    try {
      performance = getPerformance(app);
      console.log("Performance inizializzato con successo");
    } catch (error) {
      console.error('Errore durante l\'inizializzazione di Performance:', error);
    }
  }
} catch (error) {
  console.error("Errore durante l'inizializzazione di Firebase:", error);
  try {
    app = initializeApp(firebaseConfig, "stormbringer-app");
    console.log("Firebase inizializzato con app alternativa");
    
    // Inizializza i servizi
    auth = getAuth(app);
    db = getFirestore(app);
    functions = getFunctions(app);
    storage = getStorage(app);
  } catch (e) {
    console.error("Errore fatale nell'inizializzazione di Firebase:", e);
    throw new Error("Impossibile inizializzare Firebase");
  }
}

// Verifica che i servizi principali siano stati inizializzati correttamente
console.log("Stato servizi Firebase:", { 
  appInitialized: !!app, 
  authInitialized: !!auth, 
  dbInitialized: !!db 
});

// Esporta i servizi
export { app, auth, db, functions, analytics, performance, storage }; 