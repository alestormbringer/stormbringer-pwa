import { db } from '@/firebase/config';
import { 
  collection, 
  getDocs, 
  addDoc, 
  Timestamp, 
  query, 
  where,
  onSnapshot,
  DocumentData
} from 'firebase/firestore';

/**
 * Utility di debug per Firestore da richiamare dalla console
 * 
 * Uso: 
 * 1. Importa in console:
 *    import * as FirestoreDebug from './debug.ts'
 * 
 * 2. Esegui i test:
 *    FirestoreDebug.testConnection()
 *    FirestoreDebug.testCreateDocument("Test Manuale")
 *    FirestoreDebug.testRealtimeUpdates()
 */

/**
 * Testa la connessione a Firestore
 */
export const testConnection = async () => {
  try {
    console.log('Testo la connessione a Firestore...');
    
    if (!db) {
      console.error('Errore: Firestore db non inizializzato');
      return { success: false, error: 'Firestore db non inizializzato' };
    }
    
    const campaignsRef = collection(db, 'campaigns');
    const snapshot = await getDocs(campaignsRef);
    
    console.log(`Connessione riuscita! Campagne trovate: ${snapshot.size}`);
    
    const campaigns: Array<DocumentData & { id: string }> = [];
    snapshot.forEach(doc => {
      campaigns.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    return { success: true, campaigns };
  } catch (error) {
    console.error('Errore nel test di connessione:', error);
    return { success: false, error };
  }
};

/**
 * Testa la creazione di un documento in Firestore
 */
export const testCreateDocument = async (documentName = 'Test Debug') => {
  try {
    console.log('Creo un documento di test in Firestore...');
    
    if (!db) {
      console.error('Errore: Firestore db non inizializzato');
      return { success: false, error: 'Firestore db non inizializzato' };
    }
    
    const testDoc = {
      name: documentName,
      description: 'Documento di test creato manualmente',
      createdAt: Timestamp.fromDate(new Date()),
      testId: `debug-${Date.now()}`
    };
    
    const testRef = collection(db, 'persistenceTests');
    const newDoc = await addDoc(testRef, testDoc);
    
    console.log(`Documento creato con successo! ID: ${newDoc.id}`);
    
    return { success: true, docId: newDoc.id, data: testDoc };
  } catch (error) {
    console.error('Errore nella creazione del documento:', error);
    return { success: false, error };
  }
};

/**
 * Testa gli aggiornamenti in tempo reale
 */
export const testRealtimeUpdates = () => {
  try {
    console.log('Testo gli aggiornamenti in tempo reale...');
    
    if (!db) {
      console.error('Errore: Firestore db non inizializzato');
      return { success: false, error: 'Firestore db non inizializzato' };
    }
    
    const testRef = collection(db, 'persistenceTests');
    const q = query(testRef, where('testId', '>=', 'debug-'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log(`Aggiornamento in tempo reale: ${snapshot.size} documenti`);
      
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          console.log('Nuovo documento:', change.doc.data());
        } else if (change.type === 'modified') {
          console.log('Documento modificato:', change.doc.data());
        } else if (change.type === 'removed') {
          console.log('Documento rimosso:', change.doc.data());
        }
      });
    }, (error) => {
      console.error('Errore negli aggiornamenti in tempo reale:', error);
    });
    
    console.log('Listener per aggiornamenti in tempo reale attivato! Usa la funzione restituita per disattivare.');
    
    return unsubscribe;
  } catch (error) {
    console.error('Errore nell\'attivazione degli aggiornamenti in tempo reale:', error);
    return { success: false, error };
  }
}; 