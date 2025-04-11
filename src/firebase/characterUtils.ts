import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from './config';
import { Character } from '@/types/gameData';

// Ottieni un personaggio dal suo ID
export const getCharacterById = async (characterId: string): Promise<Character | null> => {
  try {
    console.log("Recupero personaggio con ID:", characterId);
    const characterRef = doc(db, 'characters', characterId);
    const characterSnap = await getDoc(characterRef);
    
    if (!characterSnap.exists()) {
      console.log("Personaggio non trovato:", characterId);
      return null;
    }
    
    return { id: characterSnap.id, ...characterSnap.data() } as Character;
  } catch (error) {
    console.error("Errore nel recupero del personaggio:", error);
    throw error;
  }
};

// Ottieni i personaggi di un utente
export const getUserCharacters = async (userId: string): Promise<Character[]> => {
  try {
    console.log("Recupero personaggi per l'utente:", userId);
    const q = query(collection(db, 'characters'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Character[];
  } catch (error) {
    console.error("Errore nel recupero dei personaggi dell'utente:", error);
    throw error;
  }
};

// Ottieni più personaggi dai loro ID
export const getCharactersByIds = async (characterIds: string[]): Promise<Record<string, Character>> => {
  try {
    const characters: Record<string, Character> = {};
    
    // Se non ci sono ID da cercare, restituisci un oggetto vuoto
    if (characterIds.length === 0) {
      return characters;
    }
    
    // Per un numero limitato di ID, è più efficiente fare query individuali
    if (characterIds.length <= 10) {
      const promises = characterIds.map(async (id) => {
        const character = await getCharacterById(id);
        if (character) {
          characters[id] = character;
        }
      });
      
      await Promise.all(promises);
    } else {
      // Per set più grandi, ottiene tutti i documenti e filtra in memoria
      // Nota: questo approccio può essere inefficiente per raccolte molto grandi
      const characterRef = collection(db, 'characters');
      const querySnapshot = await getDocs(characterRef);
      
      querySnapshot.forEach((doc) => {
        if (characterIds.includes(doc.id)) {
          characters[doc.id] = { id: doc.id, ...doc.data() } as Character;
        }
      });
    }
    
    return characters;
  } catch (error) {
    console.error("Errore nel recupero dei personaggi:", error);
    throw error;
  }
}; 