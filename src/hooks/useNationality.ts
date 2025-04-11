import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  addDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Nationality } from '@/types/nationality';
import { auth } from '@/firebase/config';

export type NationalityData = {
  id?: string;
  name: string;
  description: string;
  region: string;
  culture: string;
  language: string;
  traits: { name: string; description: string }[];
  languages: string[];
  specialAbilities: { name: string; description: string }[];
  startingEquipment: string[];
  imageUrl: string;
  characterCreation: string;
  raceTraits: string;
  bonuses?: { 
    characteristic: string; 
    value: number;
    description?: string;
  }[];
  skillBonuses?: { 
    category: string; 
    skillName: string; 
    value: number;
    description?: string;
  }[];
};

/**
 * Hook per recuperare una nazionalità specifica dal database
 * @param id - ID della nazionalità da recuperare (opzionale)
 * @param slug - Slug della nazionalità da recuperare (opzionale, in alternativa all'ID)
 * @returns Oggetto con i dati della nazionalità e funzioni per gestirla
 */
export function useNationality(id?: string, slug?: string) {
  const [nationality, setNationality] = useState<NationalityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Mappa degli slug per le nazionalità
  const nameToSlug: Record<string, string> = {
    'Melniboné': 'melnibonae',
    'Pan Tang': 'pan-tang',
    'Myrrhyn': 'myrrhyn',
    'Dharijor': 'dharijor',
    'Jharkor': 'jharkor',
    'Shazaar': 'shazaar',
    'Tarkesh': 'tarkesh',
    'Vilmir': 'vilmir',
    'Ilmiora': 'ilmiora',
    'Nadsokor': 'nadsokor',
    'Solitudine piangente': 'weeping-waste',
    'Solitudine Piangente': 'weeping-waste',
    'Eshmir': 'eshmir',
    'Isola delle Città Purpuree': 'purple-towns',
    'Argimiliar': 'argimiliar',
    'Pikarayd': 'pikarayd',
    'Lormyr': 'lormyr',
    'Filkhar': 'filkhar',
    'Oin': 'oin',
    'Yu': 'yu',
    'Org': 'org'
  };

  // Questa mappa contiene lo slug inverso (da slug a nome)
  const slugToName: Record<string, string> = Object.entries(nameToSlug).reduce(
    (acc, [name, value]) => {
      acc[value] = name;
      return acc;
    }, 
    {} as Record<string, string>
  );

  useEffect(() => {
    const fetchNationality = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Se abbiamo un ID, recuperiamo direttamente il documento
        if (id) {
          const nationalityDoc = doc(db, 'nationalities', id);
          const nationalitySnapshot = await getDoc(nationalityDoc);
          
          if (nationalitySnapshot.exists()) {
            const data = nationalitySnapshot.data();
            setNationality({
              id: nationalitySnapshot.id,
              name: data.name || '',
              description: data.description || '',
              region: data.region || '',
              culture: data.culture || '',
              language: data.language || '',
              traits: data.traits || [],
              languages: data.languages || [],
              specialAbilities: data.specialAbilities || [],
              startingEquipment: data.startingEquipment || [],
              imageUrl: data.imageUrl || '',
              characterCreation: data.characterCreation || '',
              raceTraits: data.raceTraits || '',
              bonuses: data.bonuses || [],
              skillBonuses: data.skillBonuses || []
            });
          } else {
            setError('Nazionalità non trovata');
          }
        } 
        // Se abbiamo uno slug, cerchiamo la nazionalità con quel nome
        else if (slug) {
          // Cerchiamo prima nella mappa degli slug
          const nationalityName = slugToName[slug];
          
          if (nationalityName) {
            // Se lo slug è nella mappa, cerchiamo il documento con quel nome
            const nationalitiesRef = collection(db, 'nationalities');
            const q = query(nationalitiesRef, where('name', '==', nationalityName));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
              const doc = querySnapshot.docs[0];
              const data = doc.data();
              setNationality({
                id: doc.id,
                name: data.name || '',
                description: data.description || '',
                region: data.region || '',
                culture: data.culture || '',
                language: data.language || '',
                traits: data.traits || [],
                languages: data.languages || [],
                specialAbilities: data.specialAbilities || [],
                startingEquipment: data.startingEquipment || [],
                imageUrl: data.imageUrl || '',
                characterCreation: data.characterCreation || '',
                raceTraits: data.raceTraits || '',
                bonuses: data.bonuses || [],
                skillBonuses: data.skillBonuses || []
              });
            } else {
              // Se non troviamo un documento, ritorna un template vuoto
              setNationality({
                name: nationalityName,
                description: `Informazioni su ${nationalityName} saranno aggiunte presto.`,
                region: '',
                culture: '',
                language: '',
                traits: [],
                languages: [],
                specialAbilities: [],
                startingEquipment: [],
                imageUrl: '',
                characterCreation: '',
                raceTraits: '',
                bonuses: [],
                skillBonuses: []
              });
            }
          } else {
            setError(`Nazionalità con slug '${slug}' non trovata`);
          }
        } else {
          // Se non abbiamo né ID né slug, restituiamo un template vuoto
          setNationality({
            name: '',
            description: '',
            region: '',
            culture: '',
            language: '',
            traits: [],
            languages: [],
            specialAbilities: [],
            startingEquipment: [],
            imageUrl: '',
            characterCreation: '',
            raceTraits: '',
            bonuses: [],
            skillBonuses: []
          });
        }
      } catch (err) {
        console.error('Errore durante il recupero della nazionalità:', err);
        setError('Errore durante il recupero della nazionalità');
      } finally {
        setLoading(false);
      }
    };

    fetchNationality();
  }, [id, slug]);

  /**
   * Aggiorna o crea una nazionalità
   * @param data - Dati della nazionalità da aggiornare o creare
   * @returns Promise con l'ID della nazionalità
   */
  const saveNationality = async (data: NationalityData): Promise<string> => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Verifica che l'utente sia autenticato
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Devi essere autenticato per salvare una nazionalità');
      }
      
      if (data.id) {
        // Aggiorna una nazionalità esistente
        const nationalityDoc = doc(db, 'nationalities', data.id);
        await updateDoc(nationalityDoc, {
          ...data,
          updatedAt: new Date(),
          updatedBy: currentUser.uid
        });
        setSuccess(true);
        return data.id;
      } else {
        // Crea una nuova nazionalità
        const nationalitiesRef = collection(db, 'nationalities');
        const newDoc = await addDoc(nationalitiesRef, {
          ...data,
          createdAt: new Date(),
          createdBy: currentUser.uid
        });
        setSuccess(true);
        return newDoc.id;
      }
    } catch (err) {
      console.error('Errore durante il salvataggio della nazionalità:', err);
      setError(`Errore durante il salvataggio della nazionalità: ${err instanceof Error ? err.message : 'Errore sconosciuto'}`);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  /**
   * Recupera tutte le nazionalità
   * @returns Promise con la lista delle nazionalità
   */
  const getAllNationalities = async (): Promise<NationalityData[]> => {
    try {
      const nationalitiesRef = collection(db, 'nationalities');
      const snapshot = await getDocs(nationalitiesRef);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NationalityData[];
    } catch (err) {
      console.error('Errore durante il recupero delle nazionalità:', err);
      setError('Errore durante il recupero delle nazionalità');
      return [];
    }
  };

  /**
   * Verifica la connessione a Firebase
   * @returns Promise<boolean> - true se la connessione è stata stabilita, false altrimenti
   */
  const checkFirebaseConnection = async (): Promise<boolean> => {
    try {
      const nationalitiesRef = collection(db, 'nationalities');
      const snapshot = await getDocs(nationalitiesRef);
      console.log(`Connessione a Firebase riuscita! Trovate ${snapshot.docs.length} nazionalità.`);
      return true;
    } catch (err) {
      console.error('Errore di connessione a Firebase:', err);
      return false;
    }
  };

  /**
   * Ottiene lo slug dalla mappa o lo genera dal nome
   * @param name - Nome della nazionalità
   * @returns string - Slug della nazionalità
   */
  const getSlug = (name: string): string => {
    return nameToSlug[name] || name.toLowerCase().replace(/\s+/g, '-');
  };

  /**
   * Verifica esplicitamente lo stato di autenticazione dell'utente
   * @returns Object con informazioni sullo stato di autenticazione
   */
  const checkAuthenticationStatus = (): { isAuthenticated: boolean; user: any } => {
    const currentUser = auth.currentUser;
    return { 
      isAuthenticated: currentUser !== null,
      user: currentUser
    };
  };

  return {
    nationality,
    loading,
    error,
    saving,
    success,
    saveNationality,
    getAllNationalities,
    checkFirebaseConnection,
    getSlug,
    setNationality,
    checkAuthenticationStatus
  };
} 