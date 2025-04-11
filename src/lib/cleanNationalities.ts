import { collection, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function cleanNationalities() {
  try {
    const nationalitiesRef = collection(db, 'nationalities');
    const snapshot = await getDocs(nationalitiesRef);
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    console.log('Nazionalità rimosse con successo!');
  } catch (error) {
    console.error('Errore durante la rimozione delle nazionalità:', error);
  }
} 