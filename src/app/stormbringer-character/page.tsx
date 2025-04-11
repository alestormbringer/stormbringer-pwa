'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Character, CharacterWeapon, CharacterClass, CharacteristicValue } from '@/types/gameData';
import { initialCharacter } from '@/data/initialStats';
import NavBar from '@/components/NavBar';
import { Nationality as NationalityData } from '@/types/gameData';

// Importazione dei componenti
import BasicInfoTable from '@/components/character/BasicInfoTable';
import CharacteristicsTable from '@/components/character/CharacteristicsTable';
import ProtectionTable from '@/components/character/ProtectionTable';
import EquipmentTable from '@/components/character/EquipmentTable';
import WeaponsTable from '@/components/character/WeaponsTable';
import SkillsTable from '@/components/character/SkillsTable';
import HitPointsTable from '@/components/character/HitPointsTable';
import BodySizeTable from '@/components/character/BodySizeTable';
import NationalityTable from '@/components/character/NationalityTable';
import ClassTable from '@/components/character/ClassTable';

export default function StormbringerCharacter() {
  const router = useRouter();
  const [character, setCharacter] = useState<Omit<Character, 'id'>>(initialCharacter);
  const [activeSection, setActiveSection] = useState<number>(0);
  const [selectedNationality, setSelectedNationality] = useState<NationalityData | null>(null);
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null);
  const [nationalities, setNationalities] = useState<NationalityData[]>([]);
  const [classes, setClasses] = useState<CharacterClass[]>([]);
  const [loading, setLoading] = useState(true);

  // Carica le nazionalità e le classi all'avvio
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Carica le nazionalità
        const nationalitiesRef = collection(db, 'nationalities');
        const nationalitiesSnapshot = await getDocs(nationalitiesRef);
        const nationalitiesData = nationalitiesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as NationalityData[];
        setNationalities(nationalitiesData);

        // Carica le classi
        const classesRef = collection(db, 'classes');
        const classesSnapshot = await getDocs(classesRef);
        const classesData = classesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as CharacterClass[];
        setClasses(classesData);

        setLoading(false);
      } catch (error) {
        console.error('Errore nel caricamento dei dati:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sections = [
    {
      id: 'basic',
      title: '1. Caratteristiche di base',
      content: 'In questo gioco i personaggi vengono descritti attraverso una serie di attributi numerici, che riflettono le loro qualità ed abilità. I valori variano lungo una scala da 3 a 18, anche se in determinate circostanze possono scendere sino ad 1 o salire addirittura fino a 100 (punteggi particolarmente alti vengono riservati per descrivere stregoni come Elric, demoni e divinità; punteggi molto bassi indicano solitamente danni molto gravi subiti dal personaggio). Nessun valore di un essere umano può essere uguale o inferiore a zero, senza che il personaggio muoia. I PG (e i PNG) sono dotati di sette Caratteristiche: Forza (FOR), Costituzione (COS), Taglia (TAG), Intelligenza (INT), Mana (MAN), Destrezza (DES), Fascino (FAS). Le Caratteristiche vengono generate in modo casuale lanciando 3D6 una sola volta per ciascuna di esse. Registrate quindi i risultati sulla Scheda del Personaggio, utilizzando una matita per poterli successivamente modificare. Questi valori possono infatti cambiare per la Classe del personaggio o per la sua nazionalità. Il nome, il sesso, il colore dei capelli ed altre caratteristiche simili possono essere decise da chi sta creando il personaggio. Giocatori e GM sono liberi di aggiungere quanti dettagli desiderano per personalizzare e definire nel migliore dei modi il proprio personag-gio. Peculiarità come strabismo, modi di parlare originali ecc. aiutano i nuovi personaggi ad essere più vivi nell\'immaginazione del GM e dei giocatori.'
    },
    {
      id: 'nationality',
      title: '2. Nazioni',
      content: "I Regni Giovani non hanno una molteplicità di religioni e di organizzazioni solidaristiche che possano aiutare i PG durante le loro avventure, per cui essi dovranno possedere determiante abilità, necessarie alla sopravvivenza. Queste abilità vengono acquisite indipendemente, oppure automaticametne con l'appartenenza del PG ad una determinata Classe (una specie di casta) della società dei Regni Giovani. Anche se alcune nazionalità comportano Classi prefissate, la maggior parte degli avventurieri apparterrà a Classi, determiante casualmente, che rappresentano l'esperienza di base del personaggio stesso. In questo gioco si assume che l'età di un avventuriero, all'inizio della sua carriera, sia di 25 anni, durante i quali ha potuto apprendere le abilità proprie della sua Classe. Se desiderate invece iniziare con un PG con meno di 25 anni, sottrate 5% da ogni abilità per ogni anno di ringiovanimento. Se invece desiderate iniziare ad un'età superiore, aggiungete 1% ad ogni abilità per anno di invecchiamento, fino al massimo di 40 anni (il massimo è quindi pari ad un 15% in più). Dopo i 40 anni il corpo inizierà a subire le ingiurie del tempo, per cui dovrete sottrarre 1% ad ogni abilità fisica (ad esempio il combattimento) per ogni anno superiore a questa soglia. Le abilità mentali (come per esempio la magia) non diminuiranno di valore dopo i 40 anni, a meno che non vengano modificate nel corso del gioco."
    },
    {
      id: 'class',
      title: '3. Classi',
      content: 'Seleziona la classe del tuo personaggio. La classe determina le abilità e le competenze di base.'
    },
    {
      id: 'skills',
      title: '4. Abilità',
      content: 'Personalizza le abilità del tuo personaggio in base alla classe e alla nazionalità selezionate.'
    },
    {
      id: 'equipment',
      title: '5. Equipaggiamento e armatura',
      content: 'Scegli l\'equipaggiamento iniziale e l\'armatura del tuo personaggio.'
    },
    {
      id: 'personal',
      title: '6. Informazioni personali',
      content: 'Definisci i dettagli personali del tuo personaggio come nome, età, sesso e descrizione.'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'characters'), character);
      router.push('/characters');
    } catch (error) {
      console.error('Errore nel salvataggio del personaggio:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <NavBar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Caricamento in corso...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NavBar />
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8 text-yellow-400">Creazione Personaggio</h1>
        
        {/* Barra di navigazione delle sezioni */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(index)}
                className={`px-4 py-2 rounded-lg ${
                  activeSection === index
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* Contenuto delle sezioni */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-yellow-300">
            {sections[activeSection].title}
          </h2>
          <p className="text-gray-400 mb-6">{sections[activeSection].content}</p>

          {activeSection === 0 && (
            <div className="space-y-6">
              <CharacteristicsTable
                characteristics={character.characteristics}
                onChange={(key: string, value: number) => {
                  const updatedCharacteristics = { ...character.characteristics };
                  if (updatedCharacteristics[key]) {
                    updatedCharacteristics[key] = {
                      ...updatedCharacteristics[key],
                      baseValue: value,
                      // Se usiamo CharacteristicValue di gameData dobbiamo assicurarci che abbia il campo name
                      name: updatedCharacteristics[key].name || key.toUpperCase()
                    };
                  } else {
                    updatedCharacteristics[key] = {
                      name: key.toUpperCase(),
                      baseValue: value
                    };
                  }
                  
                  setCharacter(prev => ({
                    ...prev,
                    characteristics: updatedCharacteristics
                  }));
                }}
                isEditable={true}
              />
              
              <HitPointsTable 
                characteristics={character.characteristics}
                onChange={(hitPoints: number) => {
                  setCharacter(prev => ({
                    ...prev,
                    hitPoints
                  }));
                }}
              />
              
              <BodySizeTable 
                characteristics={character.characteristics}
              />
            </div>
          )}
              
          {activeSection === 1 && (
            <div className="space-y-6">
              <NationalityTable
                nationalities={nationalities}
                selectedNationality={character.nationality}
                onNationalityChange={(nationalityId) => {
                  // Trova la nazionalità nel catalogo delle nazionalità
                  const nationalityData = nationalities.find(n => n.id === nationalityId);
                  
                  setCharacter(prev => ({
                    ...prev,
                    nationality: nationalityId
                  }));
                  
                  // Trova la nazionalità selezionata per ulteriori dettagli
                  setSelectedNationality(nationalityData || null);
                  
                  // Log per debug
                  console.log(`Nazionalità selezionata - ID: ${nationalityId}, Nome: ${nationalityData?.name}`);
                }}
              />
            </div>
          )}

          {activeSection === 2 && (
            <div className="space-y-6">
              <ClassTable
                selectedClass={character.class}
                selectedNationality={selectedNationality?.name || ''}
                onChange={(field: string, value: any) => {
                  // Gestione per bonus di caratteristiche di Melniboné
                  if (field === 'melniboneIntBonus' || field === 'melniboneManBonus' || field === 'melniboneTagBonus') {
                    const updatedCharacteristics = { ...character.characteristics };
                    
                    // Aggiorniamo il valore della caratteristica interessata
                    if (field === 'melniboneIntBonus' && updatedCharacteristics.int) {
                      // Aggiorna INT
                      updatedCharacteristics.int = {
                        ...updatedCharacteristics.int,
                        melniboneBonus: value
                      };
                    } else if (field === 'melniboneManBonus' && updatedCharacteristics.man) {
                      // Aggiorna MAN
                      updatedCharacteristics.man = {
                        ...updatedCharacteristics.man,
                        melniboneBonus: value
                      };
                    } else if (field === 'melniboneTagBonus' && updatedCharacteristics.tag) {
                      // Aggiorna TAG
                      updatedCharacteristics.tag = {
                        ...updatedCharacteristics.tag,
                        melniboneBonus: value
                      };
                    }
                    
                    setCharacter(prev => ({
                      ...prev,
                      characteristics: updatedCharacteristics
                    }));
                  }
                  // Gestione per bonus di caratteristiche di Pan Tang
                  else if (field === 'panTangIntBonus' || field === 'panTangManBonus' || field === 'panTangTagBonus') {
                    const updatedCharacteristics = { ...character.characteristics };
                    
                    // Aggiorniamo il valore della caratteristica interessata
                    if (field === 'panTangIntBonus' && updatedCharacteristics.int) {
                      // Aggiorna INT
                      updatedCharacteristics.int = {
                        ...updatedCharacteristics.int,
                        panTangBonus: value
                      };
                    } else if (field === 'panTangManBonus' && updatedCharacteristics.man) {
                      // Aggiorna MAN
                      updatedCharacteristics.man = {
                        ...updatedCharacteristics.man,
                        panTangBonus: value
                      };
                    } else if (field === 'panTangTagBonus' && updatedCharacteristics.tag) {
                      // Aggiorna TAG
                      updatedCharacteristics.tag = {
                        ...updatedCharacteristics.tag,
                        panTangBonus: value
                      };
                    }
                    
                    // Verifica se la somma di INT + MAN è >= 32 per Pan Tang
                    const baseInt = Number(updatedCharacteristics.int?.baseValue || 0);
                    const baseMan = Number(updatedCharacteristics.man?.baseValue || 0);
                    const intBonus = Number(updatedCharacteristics.int?.panTangBonus || 0);
                    const manBonus = Number(updatedCharacteristics.man?.panTangBonus || 0);
                    
                    const totalIntMan = baseInt + baseMan + intBonus + manBonus;
                    console.log(`Pan Tang - Totale INT + MAN: ${totalIntMan}`);
                    
                    // Aggiorna le caratteristiche
                    setCharacter(prev => ({
                      ...prev,
                      characteristics: updatedCharacteristics,
                      // Imposta automaticamente la classe in base al totale
                      class: totalIntMan >= 32 ? 'Stregone' : 'Guerriero'
                    }));
                    
                    console.log(`Impostata classe a: ${totalIntMan >= 32 ? 'Stregone' : 'Guerriero'}`);
                  } else if (field === 'class') {
                    setCharacter(prev => ({
                      ...prev,
                      [field]: value
                    }));
                    
                    // Trova la classe selezionata per ulteriori dettagli
                    const selectedCls = classes.find(c => c.name === value);
                    setSelectedClass(selectedCls || null);
                    
                    // Log per debug
                    console.log(`Classe selezionata: ${value}`);
                  } else {
                    setCharacter(prev => ({
                      ...prev,
                      [field]: value
                    }));
                  }
                }}
                isEditable={true}
                characteristicsValues={{
                  int: Number(character.characteristics.int?.baseValue || 0),
                  man: Number(character.characteristics.man?.baseValue || 0),
                  tag: Number(character.characteristics.tag?.baseValue || 0)
                }}
              />
            </div>
          )}
          
          {activeSection === 3 && (
            <div className="space-y-6">
              <SkillsTable
                customStats={character.customStats}
                onAdd={(category: string, name: string) => {
                  setCharacter(prev => ({
                    ...prev,
                    customStats: {
                      ...prev.customStats,
                      [category]: {
                        ...prev.customStats[category],
                        [name]: { name, baseValue: 0 }
                      }
                    }
                  }));
                }}
                onChange={(category: string, key: string, field: 'baseValue' | 'value2', value: number) => {
                  setCharacter(prev => ({
                    ...prev,
                    customStats: {
                      ...prev.customStats,
                      [category]: {
                        ...prev.customStats[category],
                        [key]: { 
                          ...prev.customStats[category][key],
                          [field]: value 
                        }
                      }
                    }
                  }));
                }}
                isEditable={true}
              />
            </div>
          )}

          {activeSection === 4 && (
            <div className="space-y-6">
              <EquipmentTable
                character={character}
                onChange={(field: 'equipment' | 'inventory' | 'money', value: any) => {
                  setCharacter(prev => ({
                    ...prev,
                    [field]: value
                  }));
                }}
                isEditable={true}
              />
              <ProtectionTable
                character={character}
                onChange={(field: 'armor' | 'protection' | 'hitPoints' | 'seriousWound', value: string | number) => {
                  setCharacter(prev => ({
                    ...prev,
                    [field]: value
                  }));
                }}
                isEditable={true}
              />
              <WeaponsTable
                weapons={character.weapons}
                onAdd={() => {
                  setCharacter(prev => ({
                    ...prev,
                    weapons: [...prev.weapons, { name: '', attackPercentage: 0, damage: '', parryPercentage: 0 }]
                  }));
                }}
                onRemove={(index: number) => {
                  setCharacter(prev => ({
                    ...prev,
                    weapons: prev.weapons.filter((_, i) => i !== index)
                  }));
                }}
                onChange={(index: number, field: string, value: any) => {
                  setCharacter(prev => ({
                    ...prev,
                    weapons: prev.weapons.map((weapon, i) => 
                      i === index ? { ...weapon, [field]: value } : weapon
                    )
                  }));
                }}
                isEditable={true}
              />
            </div>
          )}

          {activeSection === 5 && (
            <div className="space-y-6">
              <BasicInfoTable
                character={character}
                onChange={(field: keyof Omit<Character, 'id'>, value: string | number) => {
                  setCharacter(prev => ({
                    ...prev,
                    [field]: value
                  }));
                }}
                isEditable={true}
              />
            </div>
          )}
        </div>

        {/* Pulsanti di navigazione */}
        <div className="flex justify-between mt-8">
          {activeSection > 0 && (
            <button
              onClick={() => setActiveSection(prev => Math.max(0, prev - 1))}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              Precedente
            </button>
          )}
          {activeSection < sections.length - 1 && (
            <button
              onClick={() => setActiveSection(prev => Math.min(sections.length - 1, prev + 1))}
              className={`px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 ${activeSection === 0 ? 'ml-auto' : ''}`}
            >
              Successivo
            </button>
          )}
        </div>

        {/* Pulsante di salvataggio */}
        <div className="flex justify-end mt-8">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Salva Personaggio
          </button>
        </div>
      </div>
    </div>
  );
} 