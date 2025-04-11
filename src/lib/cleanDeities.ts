import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase/config';

// Tipo per la divinità
interface Deity {
  id: string;
  name: string;
  [key: string]: any;
}

export async function cleanDeities() {
  try {
    const deitiesRef = collection(db, 'deities');
    const snapshot = await getDocs(deitiesRef);
    const deitiesData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Deity[];

    // Raggruppa le divinità per nome
    const groupedDeities = deitiesData.reduce((acc, current) => {
      if (!acc[current.name]) {
        acc[current.name] = [];
      }
      acc[current.name].push(current);
      return acc;
    }, {} as Record<string, Deity[]>);

    // Per ogni gruppo di divinità con lo stesso nome, mantieni solo la prima e elimina le altre
    for (const [name, deities] of Object.entries(groupedDeities)) {
      if (deities.length > 1) {
        // Mantieni la prima divinità ed elimina le altre
        const [first, ...rest] = deities;
        for (const deity of rest) {
          await deleteDoc(doc(db, 'deities', deity.id));
          console.log(`Eliminata divinità duplicata: ${name}`);
        }
      }
    }

    console.log('Pulizia completata!');
  } catch (error) {
    console.error('Errore durante la pulizia delle divinità:', error);
    throw error;
  }
} 