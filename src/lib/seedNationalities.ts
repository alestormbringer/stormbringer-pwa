import { Nationality } from '@/types/gameData';
import { collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from './firebase.config';

export const nationalities: Nationality[] = [
  {
    id: 'melnibone',
    name: 'Melniboné',
    description: 'L\'antico impero degli Elfi, noto per la sua magia potente e la sua cultura decadente.',
    culture: 'Elfica decadente',
    language: 'Alto Melniboneano',
    specialAbilities: [
      {
        name: 'Sangue Elfico',
        description: 'Resistenza naturale alla magia e capacità di percepire le energie magiche.'
      }
    ],
    startingEquipment: ['Spada elfica', 'Tunica di seta', 'Amuleto di protezione']
  },
  {
    id: 'pan-tang',
    name: 'Pan Tang',
    description: 'Un regno guerriero noto per la sua ferocia e il culto delle divinità del caos.',
    culture: 'Guerriera',
    language: 'Pande',
    specialAbilities: [
      {
        name: 'Ferocia in Battaglia',
        description: 'Bonus in combattimento quando si affrontano nemici più deboli.'
      }
    ],
    startingEquipment: ['Scimitarra', 'Armatura di cuoio', 'Totem del caos']
  },
  {
    id: 'myrrhyn',
    name: 'Myrrhyn',
    description: 'Una terra di mercanti e navigatori, famosa per le sue spezie e i suoi commerci.',
    culture: 'Mercantile',
    language: 'Mabden',
    specialAbilities: [
      {
        name: 'Mercante Nato',
        description: 'Capacità di valutare meglio il valore degli oggetti e contrattare prezzi migliori.'
      }
    ],
    startingEquipment: ['Borsa di monete', 'Bilancia da mercante', 'Mappa commerciale']
  },
  {
    id: 'jharkor',
    name: 'Jharkor',
    description: 'Un regno di cavalieri e nobili, noto per il suo codice d\'onore e le sue tradizioni cavalleresche.',
    culture: 'Cavalleresca',
    language: 'Mabden',
    specialAbilities: [
      {
        name: 'Cavaliere Nobile',
        description: 'Bonus nelle prove di cavalleria e nell\'interazione con la nobiltà.'
      }
    ],
    startingEquipment: ['Spada lunga', 'Armatura di maglia', 'Stendardo di famiglia']
  },
  {
    id: 'shazaar',
    name: 'Shazaar',
    description: 'Una terra di nomadi e cacciatori, famosa per le sue steppe infinite.',
    culture: 'Nomade',
    language: 'Mabden',
    specialAbilities: [
      {
        name: 'Occhio del Cacciatore',
        description: 'Bonus nel seguire tracce e nell\'orientamento in territori aperti.'
      }
    ],
    startingEquipment: ['Arco composito', 'Pelle di lupo', 'Bussola']
  },
  {
    id: 'tarkesh',
    name: 'Tarkesh',
    description: 'Un regno di mercenari e avventurieri, noto per la sua tolleranza verso ogni tipo di individuo.',
    culture: 'Mercenaria',
    language: 'Mabden',
    specialAbilities: [
      {
        name: 'Sopravvivenza Urbana',
        description: 'Bonus nell\'orientarsi nelle città e nel trovare informazioni.'
      }
    ],
    startingEquipment: ['Daga', 'Armatura leggera', 'Borsa di monete']
  },
  {
    id: 'vilmir',
    name: 'Vilmir',
    description: 'Una terra di studiosi e maghi, famosa per le sue biblioteche e accademie.',
    culture: 'Intellettuale',
    language: 'Mabden',
    specialAbilities: [
      {
        name: 'Studioso Nato',
        description: 'Bonus nell\'apprendimento di nuove lingue e nella comprensione di testi antichi.'
      }
    ],
    startingEquipment: ['Libro di incantesimi', 'Pergamene', 'Piuma d\'oca']
  },
  {
    id: 'ilmiora',
    name: 'Ilmiora',
    description: 'Un regno di artisti e poeti, noto per la sua bellezza e raffinatezza.',
    culture: 'Artistica',
    language: 'Mabden',
    specialAbilities: [
      {
        name: 'Sensi Affinati',
        description: 'Bonus nella percezione della bellezza e nell\'apprezzamento dell\'arte.'
      }
    ],
    startingEquipment: ['Lira', 'Pergamene', 'Pigmenti colorati']
  },
  {
    id: 'nadsokor',
    name: 'Nadsokor',
    description: 'La Città dei Mendicanti, un luogo di miseria e disperazione.',
    culture: 'Mendicante',
    language: 'Mabden',
    specialAbilities: [
      {
        name: 'Sopravvivenza Urbana',
        description: 'Bonus nel trovare rifugio e risorse nelle città.'
      }
    ],
    startingEquipment: ['Bastone', 'Cappotto rattoppato', 'Borsa vuota']
  },
  {
    id: 'solitudine-piangente',
    name: 'Solitudine Piangente',
    description: 'Una terra desolata e misteriosa, abitata da creature strane e antiche.',
    culture: 'Misteriosa',
    language: 'Antico',
    specialAbilities: [
      {
        name: 'Resistenza alla Pazzia',
        description: 'Bonus nel resistere agli effetti mentali delle creature mostruose.'
      }
    ],
    startingEquipment: ['Amuleto protettivo', 'Mantello scuro', 'Lampada a olio']
  },
  {
    id: 'eshmir',
    name: 'Eshmir',
    description: 'Una terra di montagne e miniere, famosa per i suoi metalli preziosi.',
    culture: 'Miniera',
    language: 'Mabden',
    specialAbilities: [
      {
        name: 'Conoscenza dei Metalli',
        description: 'Bonus nel riconoscere e lavorare i metalli preziosi.'
      }
    ],
    startingEquipment: ['Piccone', 'Lampada da minatore', 'Borsa di gemme grezze']
  },
  {
    id: 'isola-citta-purpuree',
    name: 'Isola delle Città Purpuree',
    description: 'Un arcipelago di città-stato, famoso per la sua ricchezza e decadenza.',
    culture: 'Mercantile',
    language: 'Mabden',
    specialAbilities: [
      {
        name: 'Navigatore Esperto',
        description: 'Bonus nella navigazione e nel commercio marittimo.'
      }
    ],
    startingEquipment: ['Bussola', 'Mappa nautica', 'Borsa di monete']
  },
  {
    id: 'argimiliar',
    name: 'Argimiliar',
    description: 'Una terra di maghi e alchimisti, nota per le sue torri di studio.',
    culture: 'Magica',
    language: 'Mabden',
    specialAbilities: [
      {
        name: 'Affinità Magica',
        description: 'Bonus nell\'apprendimento e nell\'utilizzo della magia.'
      }
    ],
    startingEquipment: ['Bacchetta', 'Pozioni base', 'Libro di incantesimi']
  },
  {
    id: 'pikarayd',
    name: 'Pikarayd',
    description: 'Una terra di pirati e corsari, famosa per le sue navi veloci.',
    culture: 'Pirata',
    language: 'Mabden',
    specialAbilities: [
      {
        name: 'Mani Veloci',
        description: 'Bonus nel maneggiare le corde e nel combattimento navale.'
      }
    ],
    startingEquipment: ['Sciabola', 'Pistola', 'Bussola']
  },
  {
    id: 'lormyr',
    name: 'Lormyr',
    description: 'Un regno di mercanti e banchieri, noto per la sua ricchezza.',
    culture: 'Mercantile',
    language: 'Mabden',
    specialAbilities: [
      {
        name: 'Occhio per gli Affari',
        description: 'Bonus nel commercio e nella gestione delle finanze.'
      }
    ],
    startingEquipment: ['Borsa di monete', 'Libro contabile', 'Sigillo mercantile']
  },
  {
    id: 'filkhar',
    name: 'Filkhar',
    description: 'Una terra di nomadi e cacciatori, famosa per le sue pianure.',
    culture: 'Nomade',
    language: 'Mabden',
    specialAbilities: [
      {
        name: 'Cacciatore delle Pianure',
        description: 'Bonus nella caccia e nell\'orientamento nelle pianure.'
      }
    ],
    startingEquipment: ['Arco lungo', 'Pelle di bisonte', 'Bussola']
  },
  {
    id: 'dharijor',
    name: 'Dharijor',
    description: 'Un regno di guerrieri e sacerdoti, noto per il suo fanatismo religioso.',
    culture: 'Religiosa',
    language: 'Mabden',
    specialAbilities: [
      {
        name: 'Fervore Religioso',
        description: 'Bonus nel resistere alla paura e nell\'incitare gli altri.'
      }
    ],
    startingEquipment: ['Mazza sacra', 'Tunica religiosa', 'Amuleto sacro']
  },
  {
    id: 'oin',
    name: 'Oin',
    description: 'Una terra di minatori e artigiani, famosa per le sue opere in metallo.',
    culture: 'Artigiana',
    language: 'Mabden',
    specialAbilities: [
      {
        name: 'Mani Abili',
        description: 'Bonus nella lavorazione dei metalli e nella creazione di oggetti.'
      }
    ],
    startingEquipment: ['Martello', 'Borsa di attrezzi', 'Metallo grezzo']
  },
  {
    id: 'yu',
    name: 'Yu',
    description: 'Una terra di filosofi e monaci, nota per la sua saggezza.',
    culture: 'Filosofica',
    language: 'Mabden',
    specialAbilities: [
      {
        name: 'Mente Serena',
        description: 'Bonus nel meditare e nel resistere alle tentazioni.'
      }
    ],
    startingEquipment: ['Bastone da passeggio', 'Tunica semplice', 'Libro di saggezza']
  },
  {
    id: 'org',
    name: 'Org',
    description: 'Una terra di barbari e guerrieri, famosa per la sua ferocia.',
    culture: 'Barbarica',
    language: 'Org',
    specialAbilities: [
      {
        name: 'Forza Bruta',
        description: 'Bonus nel combattimento corpo a corpo e nella resistenza fisica.'
      }
    ],
    startingEquipment: ['Ascia da battaglia', 'Pelle d\'orso', 'Totem tribale']
  }
];

export async function seedNationalities() {
  try {
    // Prima puliamo la collezione esistente
    const nationalitiesRef = collection(db, 'nationalities');
    const snapshot = await getDocs(nationalitiesRef);
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    // Poi aggiungiamo le nuove nazionalità
    const addPromises = nationalities.map(nationality => {
      // Rimuoviamo l'id dal documento prima di salvarlo
      const { id, ...nationalityData } = nationality;
      return addDoc(nationalitiesRef, nationalityData);
    });
    
    await Promise.all(addPromises);
    console.log('Nazionalità importate con successo!');
    return true;
  } catch (error) {
    console.error('Errore durante l\'importazione delle nazionalità:', error);
    throw error;
  }
} 