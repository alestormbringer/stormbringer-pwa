import { collection, addDoc, getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

// Configurazione Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const deities = {
  Caos: [
    { name: 'Pyaray', domain: 'Acqua, Follia', alignment: 'Caos', description: 'Il Signore delle Acque Folli, noto per la sua natura imprevedibile e distruttiva.', symbol: 'Onda distorta', category: 'Caos' as const },
    { name: 'Arioch', domain: 'Guerra, Potere', alignment: 'Caos', description: 'Il Duca del Caos, uno dei più potenti Signori del Caos.', symbol: 'Spada fiammeggiante', category: 'Caos' as const },
    { name: 'Ornunlu', domain: 'Conoscenza, Segreti', alignment: 'Caos', description: 'Il Custode delle Conoscenze Proibite.', symbol: 'Libro aperto con occhi', category: 'Caos' as const },
    { name: 'Chardhros', domain: 'Morte, Decadenza', alignment: 'Caos', description: 'Il Signore della Morte e della Decadenza.', symbol: 'Teschio con corna', category: 'Caos' as const },
    { name: 'Balo', domain: 'Fuoco, Distruzione', alignment: 'Caos', description: 'Il Signore del Fuoco Distruttivo.', symbol: 'Fiamma nera', category: 'Caos' as const },
    { name: 'Narjhan', domain: 'Inganno, Illusione', alignment: 'Caos', description: 'Il Maestro dell\'Inganno e delle Illusioni.', symbol: 'Maschera cangiante', category: 'Caos' as const },
    { name: 'Checkalakh', domain: 'Follia, Caos', alignment: 'Caos', description: 'Il Signore della Follia Pura.', symbol: 'Occhio rotante', category: 'Caos' as const },
    { name: 'Xiombarg', domain: 'Guerra, Sangue', alignment: 'Caos', description: 'La Regina della Guerra e del Sangue.', symbol: 'Spada insanguinata', category: 'Caos' as const },
    { name: 'Mabelrode', domain: 'Guerra, Strategia', alignment: 'Caos', description: 'Il Signore della Guerra Strategica.', symbol: 'Scudo spezzato', category: 'Caos' as const },
    { name: 'Vezhan', domain: 'Conoscenza, Corruzione', alignment: 'Caos', description: 'Il Signore della Conoscenza Corrotta.', symbol: 'Libro insanguinato', category: 'Caos' as const },
    { name: 'Hionhurn', domain: 'Tempeste, Caos', alignment: 'Caos', description: 'Il Signore delle Tempeste Caotiche.', symbol: 'Fulmine contorto', category: 'Caos' as const },
    { name: 'Eequor', domain: 'Acqua, Profondità', alignment: 'Caos', description: 'Il Signore delle Profondità Marine.', symbol: 'Tentacolo contorto', category: 'Caos' as const },
    { name: 'Darnizhaan', domain: 'Morte, Tenebre', alignment: 'Caos', description: 'Il Signore delle Tenebre Eterne.', symbol: 'Luna nera', category: 'Caos' as const },
    { name: 'Balan', domain: 'Fuoco, Passione', alignment: 'Caos', description: 'Il Signore del Fuoco Passionale.', symbol: 'Cuore fiammeggiante', category: 'Caos' as const },
    { name: 'Maluk', domain: 'Guerra, Ferocia', alignment: 'Caos', description: 'Il Signore della Guerra Ferocia.', symbol: 'Artiglio insanguinato', category: 'Caos' as const },
    { name: 'Malchin', domain: 'Inganno, Tradimento', alignment: 'Caos', description: 'Il Signore del Tradimento.', symbol: 'Pugnale nascosto', category: 'Caos' as const },
    { name: 'Zhortra', domain: 'Guerra, Forza', alignment: 'Caos', description: 'Il Signore della Forza Bruta.', symbol: 'Martello da guerra', category: 'Caos' as const },
    { name: 'Urleh', domain: 'Morte, Peste', alignment: 'Caos', description: 'Il Signore della Peste.', symbol: 'Teschio con corna di toro', category: 'Caos' as const },
    { name: 'Teer', domain: 'Guerra, Vendetta', alignment: 'Caos', description: 'Il Signore della Vendetta.', symbol: 'Spada spezzata', category: 'Caos' as const }
  ],
  Legge: [
    { name: 'Donblas', domain: 'Conoscenza, Saggezza', alignment: 'Legge', description: 'Il Custode della Conoscenza, patrono dei saggi e degli studiosi.', symbol: 'Libro aperto con occhio', category: 'Legge' as const },
    { name: 'Lady Miggea', domain: 'Giustizia, Equilibrio', alignment: 'Legge', description: 'La Signora della Giustizia e dell\'Equilibrio.', symbol: 'Bilancia dorata', category: 'Legge' as const },
    { name: 'Arkyn', domain: 'Ordine, Armonia', alignment: 'Legge', description: 'Il Signore dell\'Ordine e dell\'Armonia.', symbol: 'Cerchio perfetto', category: 'Legge' as const },
    { name: 'Quelch', domain: 'Legge, Disciplina', alignment: 'Legge', description: 'Il Signore della Legge e della Disciplina.', symbol: 'Scettro di giustizia', category: 'Legge' as const }
  ],
  'Signori delle bestie': [
    { name: 'Meerclar', domain: 'Gatti, Agilità', alignment: 'Neutrale', description: 'La Signora dei Gatti, patrona dell\'agilità e della grazia.', symbol: 'Occhio di gatto', category: 'Signori delle bestie' as const },
    { name: 'Fileet', domain: 'Uccelli, Volo', alignment: 'Neutrale', description: 'Il Signore degli Uccelli, patrono del volo.', symbol: 'Ali spiegate', category: 'Signori delle bestie' as const },
    { name: 'Roofdrak', domain: 'Draghi, Potere', alignment: 'Neutrale', description: 'Il Signore dei Draghi, personificazione del potere.', symbol: 'Ali di drago', category: 'Signori delle bestie' as const },
    { name: 'Nnuuurrr\'c\'c', domain: 'Rettili, Adattamento', alignment: 'Neutrale', description: 'Il Signore dei Rettili, maestro dell\'adattamento.', symbol: 'Squama scintillante', category: 'Signori delle bestie' as const },
    { name: 'Haaashaastaak', domain: 'Bestie Selvagge', alignment: 'Neutrale', description: 'Il Signore delle Bestie Selvagge, personificazione della natura indomita.', symbol: 'Zanna di lupo', category: 'Signori delle bestie' as const },
    { name: 'Jaanumaarh', domain: 'Predatori, Caccia', alignment: 'Neutrale', description: 'Il Signore dei Predatori, maestro della caccia.', symbol: 'Artiglio affilato', category: 'Signori delle bestie' as const },
    { name: 'P!p!pp\'hhhh\'p', domain: 'Insetti, Sciami', alignment: 'Neutrale', description: 'Il Signore degli Insetti, controllore degli sciami.', symbol: 'Ali di insetto', category: 'Signori delle bestie' as const },
    { name: 'Skuiiiiiiii', domain: 'Uccelli Rapaci', alignment: 'Neutrale', description: 'Il Signore dei Rapaci, maestro del cielo.', symbol: 'Artiglio di rapace', category: 'Signori delle bestie' as const },
    { name: 'Uurr-Rzzzr', domain: 'Insetti, Veleno', alignment: 'Neutrale', description: 'Il Signore degli Insetti Velenosi.', symbol: 'Aculeo', category: 'Signori delle bestie' as const },
    { name: 'Hhaabar\'mmpa', domain: 'Bestie da Sella', alignment: 'Neutrale', description: 'Il Signore delle Bestie da Sella.', symbol: 'Briglia dorata', category: 'Signori delle bestie' as const },
    { name: 'Shwa-Shwaa', domain: 'Uccelli Acquatici', alignment: 'Neutrale', description: 'Il Signore degli Uccelli Acquatici.', symbol: 'Piuma d\'acqua', category: 'Signori delle bestie' as const },
    { name: 'Keheheh', domain: 'Bestie da Tiro', alignment: 'Neutrale', description: 'Il Signore delle Bestie da Tiro.', symbol: 'Giogo', category: 'Signori delle bestie' as const },
    { name: 'Sssss\'\'sss\'ssaan', domain: 'Serpenti, Saggezza', alignment: 'Neutrale', description: 'Il Signore dei Serpenti, portatore di saggezza.', symbol: 'Serpente attorcigliato', category: 'Signori delle bestie' as const },
    { name: 'Wvvyy\'hunnh\'', domain: 'Bestie da Guardia', alignment: 'Neutrale', description: 'Il Signore delle Bestie da Guardia.', symbol: 'Collare di guardia', category: 'Signori delle bestie' as const },
    { name: 'Muru\'ah', domain: 'Bestie da Compagnia', alignment: 'Neutrale', description: 'La Signora delle Bestie da Compagnia.', symbol: 'Cuore con zampa', category: 'Signori delle bestie' as const }
  ],
  Elementali: [
    { name: 'Straasha', domain: 'Aria, Tempeste', alignment: 'Neutrale', description: 'Il Signore dell\'Aria, controllore dei venti e delle tempeste.', symbol: 'Vortice di vento', category: 'Elementali' as const },
    { name: 'Grome', domain: 'Terra, Montagne', alignment: 'Neutrale', description: 'Il Signore della Terra, custode delle montagne e delle profondità.', symbol: 'Montagna stilizzata', category: 'Elementali' as const },
    { name: 'Lassa', domain: 'Fuoco, Passione', alignment: 'Neutrale', description: 'La Signora del Fuoco, personificazione della passione e della distruzione.', symbol: 'Fiamma danzante', category: 'Elementali' as const },
    { name: 'Kakatal', domain: 'Uccelli, Cielo', alignment: 'Neutrale', description: 'Il Signore degli Uccelli, patrono del volo e della libertà.', symbol: 'Ali spiegate', category: 'Elementali' as const }
  ]
};

export async function seedDeities() {
  try {
    const deitiesRef = collection(db, 'deities');
    
    // Aggiungi tutte le divinità
    for (const category of Object.keys(deities)) {
      for (const deity of deities[category as keyof typeof deities]) {
        await addDoc(deitiesRef, deity);
        console.log(`Aggiunta divinità: ${deity.name}`);
      }
    }
    
    console.log('Tutte le divinità sono state aggiunte con successo!');
  } catch (error) {
    console.error('Errore durante l\'aggiunta delle divinità:', error);
    throw error;
  }
}

// Esponi la funzione globalmente per accesso dalla console
if (typeof window !== 'undefined') {
  (window as any).seedDeities = seedDeities;
} 