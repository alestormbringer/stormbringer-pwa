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
  Timestamp,
  addDoc,
  arrayUnion,
  enableIndexedDbPersistence,
  connectFirestoreEmulator
} from 'firebase/firestore';
import { db } from './config';
import { Campaign, CampaignFormData, ChatMessage } from '../types/campaign';
import { v4 as uuidv4 } from 'uuid';

// Abilita la persistenza offline per Firestore (solo lato client)
try {
  if (typeof window !== 'undefined') {
    enableIndexedDbPersistence(db)
      .then(() => {
        console.log('Persistenza Firestore abilitata con successo');
      })
      .catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn('La persistenza non può essere abilitata perché più tab sono aperte');
        } else if (err.code === 'unimplemented') {
          console.warn('Il browser non supporta la persistenza del database IndexedDB');
        }
      });
  }
} catch (error) {
  console.error('Errore nell\'abilitare la persistenza:', error);
}

// Connect to Firestore emulator if in development environment
if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
  connectFirestoreEmulator(db, 'localhost', 8080);
  console.log('Connesso all\'emulatore Firestore');
}

// Crea una nuova campagna
export const createCampaign = async (campaignData: CampaignFormData, userId: string) => {
  console.log("Creazione campagna:", campaignData, "per l'utente:", userId);
  const campaignsRef = collection(db, 'campaigns');
  
  // Genera un link d'accesso univoco
  const uniqueId = uuidv4();
  const accessLink = `/join-campaign/${uniqueId}`;
  
  const newCampaign = {
    ...campaignData,
    dmId: userId,
    players: [userId], // Il creatore è anche un giocatore
    createdAt: Timestamp.fromDate(new Date()),
    updatedAt: Timestamp.fromDate(new Date()),
    status: 'active',
    nextSessionDate: campaignData.nextSessionDate ? Timestamp.fromDate(campaignData.nextSessionDate) : null,
    chats: [],
    accessLink, // Aggiungi il link d'accesso alla campagna
  };
  
  try {
    console.log("Tentativo di aggiungere campagna a Firestore:", JSON.stringify(newCampaign));
    const docRef = await addDoc(campaignsRef, newCampaign);
    console.log("Campagna creata con ID:", docRef.id);
    
    // Verifica immediatamente che la campagna sia stata creata
    const createdCampaign = await getCampaign(docRef.id);
    console.log("Verifica campagna appena creata:", createdCampaign);
    
    // Ritorna la campagna con l'ID
    const campaignWithId = { id: docRef.id, ...newCampaign };
    
    // Prepara una versione della campagna adatta per sessionStorage
    // Converti i Timestamp in oggetti con seconds e nanoseconds
    const storableCampaign = JSON.parse(JSON.stringify(campaignWithId, (key, value) => {
      // Gestisci i Timestamp per la serializzazione
      if (value && typeof value === 'object' && value.constructor.name === 'Timestamp') {
        return {
          seconds: value.seconds,
          nanoseconds: value.nanoseconds,
          __isTimestamp: true
        };
      }
      return value;
    }));
    
    // Salva la campagna in sessionStorage per garantire che sia disponibile 
    // anche se l'indice non è ancora pronto
    if (typeof window !== 'undefined') {
      const storedCampaigns = JSON.parse(sessionStorage.getItem('userCampaigns') || '[]');
      storedCampaigns.unshift(storableCampaign); // Aggiungi in cima
      sessionStorage.setItem('userCampaigns', JSON.stringify(storedCampaigns));
    }
    
    return campaignWithId;
  } catch (error) {
    console.error("Errore nella creazione della campagna:", error);
    throw error;
  }
};

// Ottieni una campagna specifica
export const getCampaign = async (campaignId: string) => {
  console.log("Recupero campagna con ID:", campaignId);
  const campaignRef = doc(db, 'campaigns', campaignId);
  
  try {
    console.log("Tentativo di recupero documento...");
    const campaignSnap = await getDoc(campaignRef);
    
    if (!campaignSnap.exists()) {
      console.log("Campagna non trovata nel database:", campaignId);
      
      // Prova a recuperare la campagna dal sessionStorage
      if (typeof window !== 'undefined') {
        const storedCampaigns = JSON.parse(sessionStorage.getItem('userCampaigns') || '[]');
        const storedCampaign = storedCampaigns.find((c: any) => c.id === campaignId);
        
        if (storedCampaign) {
          console.log("Campagna trovata in sessionStorage:", storedCampaign);
          return storedCampaign;
        }
      }
      
      return null;
    }
    
    const data = campaignSnap.data();
    console.log("Dati campagna recuperati dal database:", data);
    
    // Verifica che tutti i campi necessari siano presenti
    if (!data.name || !data.description || !data.dmId || !data.players) {
      console.error("Dati campagna incompleti:", data);
      throw new Error("Dati campagna incompleti");
    }
    
    return { id: campaignSnap.id, ...data } as Campaign;
  } catch (error) {
    console.error("Errore nel recupero della campagna:", error);
    
    // In caso di errore, prova a recuperare la campagna dal sessionStorage
    if (typeof window !== 'undefined') {
      const storedCampaigns = JSON.parse(sessionStorage.getItem('userCampaigns') || '[]');
      const storedCampaign = storedCampaigns.find((c: any) => c.id === campaignId);
      
      if (storedCampaign) {
        console.log("Recupero di emergenza da sessionStorage:", storedCampaign);
        return storedCampaign;
      }
    }
    
    throw error;
  }
};

// Ottieni tutte le campagne di un utente (come DM o giocatore)
export const getUserCampaigns = async (userId: string) => {
  console.log("Caricamento campagne per l'utente:", userId);
  const campaignsRef = collection(db, 'campaigns');
  
  try {
    // Usa una query semplice che non richiede un indice composto
    const querySnapshot = await getDocs(campaignsRef);
    const campaigns: Campaign[] = [];
    
    console.log("Totale campagne nel database:", querySnapshot.size);
    
    // Filtra manualmente lato client
    querySnapshot.forEach((doc) => {
      const campaignData = doc.data() as Partial<Campaign>;
      if (campaignData.players?.includes(userId)) {
        campaigns.push({ id: doc.id, ...campaignData } as Campaign);
      }
    });
    
    // Ordina manualmente per data di aggiornamento
    campaigns.sort((a, b) => {
      const dateA = a.updatedAt instanceof Timestamp ? a.updatedAt.toDate() : a.updatedAt as Date;
      const dateB = b.updatedAt instanceof Timestamp ? b.updatedAt.toDate() : b.updatedAt as Date;
      return dateB.getTime() - dateA.getTime();
    });

    // Controlla se ci sono campagne salvate in sessionStorage (per nuove campagne appena create)
    if (typeof window !== 'undefined') {
      const storedCampaigns = JSON.parse(sessionStorage.getItem('userCampaigns') || '[]');
      
      if (storedCampaigns.length > 0) {
        console.log("Campagne trovate in sessionStorage:", storedCampaigns.length);
        
        // Unisci le campagne dal database con quelle dal sessionStorage
        const allCampaignIds = new Set(campaigns.map(c => c.id));
        
        // Aggiungi solo le campagne che non sono già presenti
        for (const storedCampaign of storedCampaigns) {
          if (!allCampaignIds.has(storedCampaign.id)) {
            campaigns.unshift(storedCampaign); // Aggiungi in cima
            allCampaignIds.add(storedCampaign.id);
          }
        }
        
        // Riordina tutte le campagne
        campaigns.sort((a, b) => {
          const dateA = a.updatedAt instanceof Timestamp ? a.updatedAt.toDate() : new Date(a.updatedAt as any);
          const dateB = b.updatedAt instanceof Timestamp ? b.updatedAt.toDate() : new Date(b.updatedAt as any);
          return dateB.getTime() - dateA.getTime();
        });
      }
    }
    
    console.log("Campagne filtrate per l'utente:", campaigns.length);
    return campaigns;
  } catch (error) {
    console.error("Errore nel recupero delle campagne:", error);
    
    // In caso di errore, prova a recuperare le campagne da sessionStorage
    if (typeof window !== 'undefined') {
      const storedCampaigns = JSON.parse(sessionStorage.getItem('userCampaigns') || '[]');
      if (storedCampaigns.length > 0) {
        console.log("Recupero di emergenza da sessionStorage:", storedCampaigns.length, "campagne");
        return storedCampaigns;
      }
    }
    
    throw error;
  }
};

// Aggiorna una campagna esistente
export const updateCampaign = async (campaignId: string, data: Partial<Campaign>) => {
  console.log("Aggiornamento campagna:", campaignId, "con dati:", data);
  const campaignRef = doc(db, 'campaigns', campaignId);
  
  const updateData = {
    ...data,
    updatedAt: Timestamp.fromDate(new Date()),
    nextSessionDate: data.nextSessionDate ? 
      (data.nextSessionDate instanceof Date ? Timestamp.fromDate(data.nextSessionDate) : data.nextSessionDate) 
      : null
  };
  
  try {
    await updateDoc(campaignRef, updateData);
    console.log("Campagna aggiornata con successo:", campaignId);
    return { id: campaignId, ...updateData };
  } catch (error) {
    console.error("Errore nell'aggiornamento della campagna:", error);
    throw error;
  }
};

// Elimina una campagna
export const deleteCampaign = async (campaignId: string) => {
  console.log("Eliminazione campagna:", campaignId);
  const campaignRef = doc(db, 'campaigns', campaignId);
  
  try {
    await deleteDoc(campaignRef);
    console.log("Campagna eliminata con successo:", campaignId);
  } catch (error) {
    console.error("Errore nell'eliminazione della campagna:", error);
    throw error;
  }
};

// Aggiungi un messaggio alla chat
export const addChatMessage = async (campaignId: string, userId: string, userName: string, text: string) => {
  console.log("Aggiunta messaggio chat nella campagna:", campaignId, "dall'utente:", userId);
  const campaignRef = doc(db, 'campaigns', campaignId);
  
  const newMessage: ChatMessage = {
    id: uuidv4(),
    userId,
    userName,
    text,
    timestamp: Timestamp.fromDate(new Date())
  };
  
  try {
    await updateDoc(campaignRef, {
      chats: arrayUnion(newMessage),
      updatedAt: Timestamp.fromDate(new Date())
    });
    console.log("Messaggio aggiunto con successo");
    return newMessage;
  } catch (error) {
    console.error("Errore nell'aggiunta del messaggio:", error);
    throw error;
  }
};

// Carica i messaggi della chat
export const getChatMessages = async (campaignId: string) => {
  console.log("Recupero messaggi chat per la campagna:", campaignId);
  const campaign = await getCampaign(campaignId);
  const messages = campaign?.chats || [];
  console.log("Messaggi chat recuperati:", messages.length);
  return messages;
};

// Carica file
export const addFileToCollection = async (campaignId: string, fileUrl: string) => {
  console.log("Aggiunta file alla campagna:", campaignId, "URL:", fileUrl);
  const campaignRef = doc(db, 'campaigns', campaignId);
  
  try {
    await updateDoc(campaignRef, {
      files: arrayUnion(fileUrl),
      updatedAt: Timestamp.fromDate(new Date())
    });
    console.log("File aggiunto con successo");
    return fileUrl;
  } catch (error) {
    console.error("Errore nell'aggiunta del file:", error);
    throw error;
  }
};

// Trova una campagna tramite il link d'accesso
export const getCampaignByAccessLink = async (accessLinkId: string) => {
  console.log("Ricerca campagna tramite link d'accesso:", accessLinkId);
  const campaignsRef = collection(db, 'campaigns');
  const accessLink = `/join-campaign/${accessLinkId}`;
  
  try {
    // Esegui una query sulla collezione delle campagne
    const q = query(campaignsRef, where("accessLink", "==", accessLink));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log("Nessuna campagna trovata con questo link");
      return null;
    }
    
    // Dovrebbe esserci solo una campagna con questo link
    const campaignDoc = querySnapshot.docs[0];
    console.log("Campagna trovata:", campaignDoc.id);
    
    return { id: campaignDoc.id, ...campaignDoc.data() } as Campaign;
  } catch (error) {
    console.error("Errore nella ricerca della campagna tramite link:", error);
    throw error;
  }
};

// Aggiungi un giocatore a una campagna con il personaggio scelto
export const addPlayerToCampaign = async (campaignId: string, userId: string, characterId: string) => {
  console.log("Aggiunta giocatore:", userId, "con personaggio:", characterId, "alla campagna:", campaignId);
  const campaignRef = doc(db, 'campaigns', campaignId);
  
  try {
    // Verifica se il giocatore è già nella campagna
    const campaignSnap = await getDoc(campaignRef);
    
    if (!campaignSnap.exists()) {
      throw new Error("Campagna non trovata");
    }
    
    const campaignData = campaignSnap.data() as Campaign;
    
    // Se il giocatore è già presente, non fare nulla
    if (campaignData.players.includes(userId)) {
      console.log("Il giocatore è già membro della campagna");
      return { ...campaignData, id: campaignId };
    }
    
    // Aggiungi il giocatore alla lista dei giocatori
    const updatedPlayers = [...campaignData.players, userId];
    
    // Inizializza la mappa dei personaggi se non esiste
    const playerCharacters = campaignData.playerCharacters || {};
    playerCharacters[userId] = characterId;
    
    // Aggiorna la campagna
    await updateDoc(campaignRef, {
      players: updatedPlayers,
      playerCharacters: playerCharacters,
      updatedAt: Timestamp.fromDate(new Date())
    });
    
    console.log("Giocatore aggiunto con successo alla campagna");
    
    // Restituisci la campagna aggiornata
    return {
      ...campaignData,
      id: campaignId,
      players: updatedPlayers,
      playerCharacters: playerCharacters,
      updatedAt: Timestamp.fromDate(new Date())
    } as Campaign;
  } catch (error) {
    console.error("Errore nell'aggiunta del giocatore alla campagna:", error);
    throw error;
  }
}; 