'use client';

import { useState, useEffect } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { CharacterClass } from '@/types/gameData';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';
import Image from 'next/image';
import { 
  getDefaultClassForNationality, 
  getNumberForClass, 
  hasDefaultClass,
  getAllDefaultClassesForNationality,
  isMelnibonean,
  isWeepingWaste,
  isPanTang,
  hasMultipleDefaultClasses,
  NATIONALITY_CLASS_MAP 
} from '@/utils/nationalityClassMap';

interface ClassTableProps {
  selectedClass: string;
  selectedNationality?: string;
  onChange: (key: string, value: any) => void;
  isEditable?: boolean;
  characteristicsValues?: {
    int?: number;
    man?: number;
    tag?: number;
  };
}

// Tabella delle classi basata sulla tabella fornita
const CLASS_RANGES = [
  { min: 1, max: 20, name: 'Guerriero' },
  { min: 21, max: 30, name: 'Mercante' },
  { min: 31, max: 45, name: 'Marinaio' },
  { min: 46, max: 60, name: 'Cacciatore' },
  { min: 61, max: 65, name: 'Agricoltore' },
  { min: 66, max: 70, name: 'Sacerdote' },
  { min: 71, max: 75, name: 'Nobile' },
  { min: 76, max: 85, name: 'Ladro' },
  { min: 86, max: 90, name: 'Mendicante' },
  { min: 91, max: 100, name: 'Artigiano' },
];

const CLASS_DESCRIPTION = `
Scegli un numero tra 1 e 100 per determinare la tua classe.
`;

export default function ClassTable({
  selectedClass = '',
  selectedNationality = '',
  onChange,
  isEditable = false,
  characteristicsValues
}: ClassTableProps) {
  const [classNumber, setClassNumber] = useState<number>(0);
  const [classes, setClasses] = useState<CharacterClass[]>([]);
  const [selectedClassDetails, setSelectedClassDetails] = useState<CharacterClass | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Stati per i bonus di Melniboné
  const [melniboneIntBonus, setMelniboneIntBonus] = useState<number>(0);
  const [melniboneManBonus, setMelniboneManBonus] = useState<number>(0);
  const [melniboneTagBonus, setMelniboneTagBonus] = useState<number>(0);
  const [baseIntValue, setBaseIntValue] = useState<number>(0);
  const [baseManValue, setBaseManValue] = useState<number>(0);
  
  // Stati per i bonus di Pan Tang
  const [panTangIntBonus, setPanTangIntBonus] = useState<number>(0);
  const [panTangManBonus, setPanTangManBonus] = useState<number>(0);

  // Effetto per caricare le classi dal database
  useEffect(() => {
    fetchClasses();
  }, []);

  // Effetto per aggiornare i valori di base di INT e MAN quando cambiano
  useEffect(() => {
    if (characteristicsValues) {
      setBaseIntValue(characteristicsValues.int || 0);
      setBaseManValue(characteristicsValues.man || 0);
    }
  }, [characteristicsValues]);

  // Funzione per ottenere classi predefinite per una nazionalità
  const getDefaultClassesForNationality = (nationality: string): string[] => {
    return getAllDefaultClassesForNationality(nationality);
  };

  // Effetto per selezionare automaticamente la classe predefinita quando cambia la nazionalità
  useEffect(() => {
    if (selectedNationality && !selectedClass && isEditable) {
      console.log(`Nazionalità selezionata: ${selectedNationality}`);
      
      // Per Melniboné e Solitudine Piangente non selezioniamo automaticamente una classe ma mostriamo entrambe
      if (isMelnibonean(selectedNationality) || isWeepingWaste(selectedNationality) || isPanTang(selectedNationality)) {
        console.log(`${selectedNationality} rilevato: entrambe le classi disponibili`);
        // Forza l'aggiornamento per mostrare le classi speciali
        onChange('special_dual_classes', true);
        return;
      }
      
      // Ottieni le classi disponibili per questa nazionalità
      const defaultClasses = getDefaultClassesForNationality(selectedNationality);
      console.log(`Classi predefinite per ${selectedNationality}:`, defaultClasses);
      
      if (defaultClasses.length > 0) {
        // Seleziona la prima classe predefinita
        const defaultClass = defaultClasses[0];
        console.log(`Classe predefinita selezionata: ${defaultClass}`);
        
        if (defaultClass) {
          const defaultNumber = getNumberForClass(defaultClass);
          console.log(`Numero per la classe ${defaultClass}: ${defaultNumber}`);
          if (defaultNumber) {
            setClassNumber(defaultNumber);
          }
          
          // Applica automaticamente la classe predefinita
          onChange('class', defaultClass);
        }
      }
    }
  }, [selectedNationality, isEditable, selectedClass]);

  // Effetto per aggiornare i dettagli della classe selezionata quando cambia la selezione
  useEffect(() => {
    if (selectedClass && classes.length > 0) {
      // Cerca nel database per trovare la classe selezionata
      let classDetails = classes.find(c => c.name.toLowerCase() === selectedClass.toLowerCase());
      
      // Se non è stata trovata, potrebbe essere una variante
      if (!classDetails) {
        for (const cls of classes) {
          if (cls.variants) {
            const variant = cls.variants.find(v => v.name.toLowerCase() === selectedClass.toLowerCase());
            if (variant) {
              // Combina i dati della classe base con quelli della variante
              classDetails = {
                ...cls,
                name: variant.name,
                description: variant.description || cls.description,
                imageUrl: variant.imageUrl || cls.imageUrl,
                details: variant.additionalDetails || cls.details,
                abilities: variant.additionalAbilities || cls.abilities,
                startingEquipment: variant.additionalEquipment || cls.startingEquipment
              };
              break;
            }
          }
        }
      }
      
      setSelectedClassDetails(classDetails || null);
    } else {
      setSelectedClassDetails(null);
    }
  }, [selectedClass, classes]);

  // Effetto per verificare se il personaggio di Pan Tang diventa Stregone
  useEffect(() => {
    if (isPanTang(selectedNationality) && isEditable) {
      // Prima verifichiamo se è uno Stregone
      const totalInt = baseIntValue + panTangIntBonus;
      const totalMan = baseManValue + panTangManBonus;
      const total = totalInt + totalMan;
      
      console.log('Pan Tang - Verifica Stregone:', {
        baseIntValue,
        panTangIntBonus,
        baseManValue,
        panTangManBonus,
        total
      });

      // Impostiamo sempre il bonus TAG
      onChange('panTangTagBonus', 1);
      onChange('checkPanTangStregone', true);
      
      // Se il totale è >= 32, deve essere Stregone
      if (total >= 32) {
        console.log('Pan Tang - Impostazione classe a Stregone (totale >= 32)');
        onChange('class', 'Stregone');
      } 
      // Altrimenti, se almeno uno dei bonus è stato impostato, diventa Guerriero
      else if ((panTangIntBonus > 0 || panTangManBonus > 0) && selectedClass !== 'Stregone') {
        console.log('Pan Tang - Impostazione classe a Guerriero (bonus impostati ma totale < 32)');
        onChange('class', 'Guerriero');
      }
    }
  }, [
    selectedNationality,
    isEditable,
    baseIntValue,
    baseManValue,
    panTangIntBonus,
    panTangManBonus,
    selectedClass // Aggiungiamo selectedClass alle dipendenze
  ]);

  // Effetto per verificare se il personaggio di Melniboné diventa Stregone
  useEffect(() => {
    if (isMelnibonean(selectedNationality) && isEditable) {
      const totalInt = baseIntValue + melniboneIntBonus;
      const totalMan = baseManValue + melniboneManBonus;
      const total = totalInt + totalMan;

      console.log('Melniboné - Verifica Stregone:', {
        baseIntValue,
        melniboneIntBonus,
        baseManValue,
        melniboneManBonus,
        total
      });

      // Impostiamo sempre il bonus TAG
      onChange('melniboneTagBonus', 3);
      onChange('checkMelniboneStregone', true);
      
      // Se il totale è >= 32, deve essere Stregone
      if (total >= 32) {
        console.log('Melniboné - Impostazione classe a Stregone (totale >= 32)');
        onChange('class', 'Stregone');
      }
    }
  }, [
    selectedNationality,
    isEditable,
    baseIntValue,
    baseManValue,
    melniboneIntBonus,
    melniboneManBonus
  ]);

  const fetchClasses = async () => {
    try {
      const classesRef = collection(db, 'classes');
      const snapshot = await getDocs(classesRef);
      const classesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CharacterClass[];
      
      setClasses(classesData);
    } catch (error) {
      console.error('Errore durante il recupero delle classi:', error);
      // Fallback con classi di esempio
      setClasses(getFallbackClasses());
    } finally {
      setLoading(false);
    }
  };

  // Funzione per ottenere dati di fallback/esempio per le classi
  const getFallbackClasses = (): CharacterClass[] => {
    return CLASS_RANGES.map(range => ({
      id: `fallback-${range.name.toLowerCase()}`,
      name: range.name,
      description: `I ${range.name} sono una classe importante nei Regni Giovani.`,
      abilities: [
        { name: 'Abilità principale', percentage: 50 }
      ],
      startingEquipment: ['Equipaggiamento di base'],
      imageUrl: `/images/classes/${range.name.toLowerCase()}.png`
    })) as CharacterClass[];
  };

  const handleNumberChange = (value: string) => {
    const num = parseInt(value);
    if (!isNaN(num) && num >= 1 && num <= 100) {
      setClassNumber(num);
    } else if (value === '') {
      setClassNumber(0);
    }
  };

  // Ottiene il percorso dell'immagine per la classe selezionata
  const getImagePath = () => {
    if (!selectedClass) return null;
    
    if (selectedClassDetails?.imageUrl) {
      return selectedClassDetails.imageUrl;
    }
    
    // Fallback: cerca l'immagine nella cartella public/images/classes
    // Normalizza il nome per il percorso dell'immagine
    const className = selectedClass.toLowerCase()
      .replace(/\s+/g, '-')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    
    return `/images/classes/${className}.png`;
  };

  // Ottiene la descrizione della classe
  const getClassDescription = () => {
    if (selectedClassDetails?.description) {
      return selectedClassDetails.description;
    }
    
    // Descrizioni di fallback per ogni classe
    const fallbackDescriptions: {[key: string]: string} = {
      'Guerriero': 'I Guerrieri vengono allenati a combattere fin dall\'infanzia. Alcune nazioni, come Melniboné e Pan Tang, dove il lavoro servile viene svolto da schiavi e dove i veri cittadini si considerano aristocratici esaltano la pratica delle armi. Come tutti sanno, è compito dell\'aristocrazia combattere e, di conseguenza, tutti gli uomini abili vengono addestrati per diventare Guerrieri.',
      'Mercante': 'Esistono due tipi di mercante: il bottegaio ed il viaggiatore. Quest\'ultimo rischia la vita e i capitali viaggiando di contrada in contrada alla ricerca di profitto. Le abilità elencate sono proprie dei viaggiatori. I bottegai, legati al proprio negozio (e pertanto più sedentari), avranno le stesse abilità salvo per quanto riguarda l\'uso delle armi, che devono essere ridotte alla metà del valore originale.',
      'Marinaio': 'I Regni Giovani sono un mondo in prevalenza marinaio e quasi tutte le nazioni intrattengono commerci via mare con altri paesi: perciò i Marinai sono una Classe molto diffusa. Le abilità dei Marinai sono:',
      'Cacciatore': 'I Cacciatori inseguono e abbattono la selvaggina nelle foreste, nei deserti, e nelle altre zone selvagge tra le città dei Regni Giovani.',
      'Agricoltore': 'Gli Agricoltori coltivano la terra e allevano bestiame. Sono il cuore dell\'economia di sussistenza dei Regni Giovani e possiedono conoscenze uniche sulle piante e sul clima.',
      'Sacerdote': 'Gran parte della popolazione dei Regni Giovani adora i Signori della Legge o i Signori del Caos. Esiste comunque un gran numero di divinità minori, come gli elementali, i Signori delle Bestie e i demoni. I Sacerdoti organizzano queste religioni, presiedono alla costruzione di nuovi edifici sacri, studiano la medicina e la magia e intercedono con le divinità in favore della popolazione.',
      'Nobile': 'La maggior parte delle nazioni dei Regni Giovani è retta da monarchie sostenute da una classe nobiliare. A differenza delle altre Classi, i Nobili sono generalmente abbastanza ricchi da non dover lavorare per vivere.',
      'Ladro': 'Ovunque esiste la civilizzazione troverete i Ladri. Questi sono solitamente cittadini che, all\'occasione giusta, divengono avventurieri.',
      'Mendicante': 'I Mendicanti sono in genere considerati dei "fuori casta" in qualunque tipo di cultura, in quanto generalmente brutti a vedersi; quelli dei Regni Giovani sono addirittura rivoltanti. Disseminati in tutto il mondo, hanno il loro quartier generale nella città abbandonata di Nadsokor, al confine tra Vilmir e Ilmiora.',
      'Artigiano': 'Costituiscono la spina dorsale di ogni società pre-tecnologica, come quella dei Regni Giovani. In realtà, questa Classe dovrebbe essere la più diffusa tra i PG ma, se ipotizziamo che la maggior parte degli Agricoltori rimanga a casa a coltivare le proprie terre piuttosto che cercare guai come avventure, il gioco potrebbe diventare oltremodo noioso.',
      'Assassino': 'Gli Assassini sono Guerrieri che sfruttano le proprie abilità per uccidere su commissione, agendo con ogni mezzo possibile, senza alcun riguardo per il codice d\'onore. Per aumentare la loro efficacia acquisiscono particolari conoscenze:'
    };
    
    return fallbackDescriptions[selectedClass] || `I ${selectedClass} sono una classe importante nei Regni Giovani.`;
  };

  // Ottiene tutte le classi predefinite per la nazionalità
  const getDefaultClasses = () => {
    if (!selectedNationality) return [];
    return getDefaultClassesForNationality(selectedNationality);
  };

  // Ottiene la descrizione specifica per la classe e nazionalità
  const getClassDescriptionForNationality = (className: string, nationality: string) => {
    // Descrizioni personalizzate per combinazioni specifiche di nazionalità e classe
    const specialDescriptions: Record<string, Record<string, string>> = {
      'Guerriero': {
        'Solitudine Piangente': 'I Guerrieri della Solitudine Piangente sono noti per la loro forza e resistenza in un ambiente ostile. Addestrati a sopravvivere nelle condizioni più estreme, questi guerrieri combattono per proteggere la loro gente dai pericoli del deserto.'
      },
      'Cacciatore': {
        'Solitudine Piangente': 'I Cacciatori della Solitudine Piangente sono maestri del tracciamento e della sopravvivenza. La loro capacità di trovare prede nelle terre desolate è leggendaria, e possono seguire tracce praticamente invisibili ad altre persone.'
      }
    };

    // Verifica se esiste una descrizione speciale per questa combinazione
    if (specialDescriptions[className]?.[nationality]) {
      return specialDescriptions[className][nationality];
    }

    // Altrimenti restituisci la descrizione generica
    return getClassDescription();
  };

  return (
    <div className="bg-gray-800 rounded-lg p-3 relative">
      {selectedNationality && getDefaultClasses().length > 1 && 
       !isMelnibonean(selectedNationality) && !isWeepingWaste(selectedNationality) && !isPanTang(selectedNationality) && (
        <div className="mb-4 p-2 border border-yellow-500 rounded-lg bg-yellow-900/30">
          <p className="text-sm text-yellow-200 mb-2">
            La nazionalità {selectedNationality} ha le seguenti classi predefinite:
          </p>
          <div className="flex flex-wrap gap-2">
            {getDefaultClasses().map((cls, idx) => (
              <span key={idx} className="inline-block bg-yellow-800 text-yellow-200 px-2 py-1 rounded text-xs">
                {cls}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Sezione Modificatori per nazionalità */}
      <div className="mb-6 p-4 border border-yellow-600 rounded-lg">
        <h2 className="text-xl font-bold text-yellow-400 mb-2">Modificatori alle caratteristiche per nazionalità</h2>
        
        {/* Contenuto della sezione per Melniboné */}
        {isMelnibonean(selectedNationality) && (
          <div className="mt-4 bg-gray-700 rounded-lg p-4">
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                  <p className="text-white">TAG base: <span className="text-yellow-400 font-bold">{characteristicsValues?.tag || 0}</span></p>
                </div>
                <div>
                  <p className="text-white">Bonus TAG: <span className="text-green-400 font-bold">+3</span></p>
                </div>
              </div>
              <p className="text-white text-center">Totale TAG: <span className="text-yellow-400 font-bold">{(characteristicsValues?.tag || 0) + 3}</span></p>
            </div>
          
            <h3 className="text-xl font-bold text-yellow-500 mb-3">Bonus per Stregone</h3>
            <p className="text-gray-200 text-sm mb-4">Se la somma di INT + MAN (valori base + bonus) è almeno 32, il personaggio può essere un Stregone.</p>
            
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <h4 className="text-lg font-semibold text-gray-300 mb-3">Valori base (dalla sezione Caratteristiche di Base):</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white">INT base: <span className="text-yellow-400 font-bold">{baseIntValue}</span></p>
                </div>
                <div>
                  <p className="text-white">MAN base: <span className="text-yellow-400 font-bold">{baseManValue}</span></p>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-gray-300 mb-3">Bonus aggiuntivi:</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white mb-2">Bonus INT:</p>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={melniboneIntBonus || ""}
                    className="p-1.5 w-full text-center bg-gray-700 rounded border border-gray-600 text-white"
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= 0 && value <= 10) {
                        setMelniboneIntBonus(value);
                        onChange('melniboneIntBonus', value);
                        
                        // Verifica se il personaggio diventa Stregone
                        const totalInt = baseIntValue + value;
                        const totalMan = baseManValue + melniboneManBonus;
                        
                        if (totalInt + totalMan >= 32) {
                          onChange('class', 'Stregone');
                        }
                      } else {
                        setMelniboneIntBonus(0);
                        onChange('melniboneIntBonus', 0);
                      }
                    }}
                  />
                </div>
                <div>
                  <p className="text-white mb-2">Bonus MAN:</p>
                  <input
                    type="number"
                    min="0"
                    max="12"
                    value={melniboneManBonus || ""}
                    className="p-1.5 w-full text-center bg-gray-700 rounded border border-gray-600 text-white"
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= 0 && value <= 12) {
                        setMelniboneManBonus(value);
                        onChange('melniboneManBonus', value);
                        
                        // Impostiamo sempre +3 alla TAG
                        setMelniboneTagBonus(3);
                        onChange('melniboneTagBonus', 3);
                        
                        // Verifica se il personaggio diventa Stregone
                        const totalInt = baseIntValue + melniboneIntBonus;
                        const totalMan = baseManValue + value;
                        
                        if (totalInt + totalMan >= 32) {
                          onChange('class', 'Stregone');
                        }
                      } else {
                        setMelniboneManBonus(0);
                        onChange('melniboneManBonus', 0);
                        setMelniboneTagBonus(0);
                        onChange('melniboneTagBonus', 0);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            
            <p className="text-lg font-bold text-center mb-4">Totale INT + MAN: <span className="text-yellow-400">{baseIntValue + melniboneIntBonus + baseManValue + melniboneManBonus}</span></p>
            
            {baseIntValue + melniboneIntBonus + baseManValue + melniboneManBonus >= 32 && (
              <div className="mt-3 bg-green-900 p-3 rounded-lg border border-green-600">
                <p className="text-green-300 font-bold text-center">
                  Il tuo personaggio è uno Stregone! (INT + MAN ≥ 32)
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* Contenuto della sezione per Pan Tang */}
        {isPanTang(selectedNationality) && (
          <div className="mt-4 bg-gray-700 rounded-lg p-4">
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                  <p className="text-white">TAG base: <span className="text-yellow-400 font-bold">{characteristicsValues?.tag || 0}</span></p>
                </div>
                <div>
                  <p className="text-white">Bonus TAG: <span className="text-green-400 font-bold">+1</span></p>
                </div>
              </div>
              <p className="text-white text-center">Totale TAG: <span className="text-yellow-400 font-bold">{(characteristicsValues?.tag || 0) + 1}</span></p>
            </div>
          
            <h3 className="text-xl font-bold text-yellow-500 mb-3">Bonus per Stregone</h3>
            <p className="text-gray-200 text-sm mb-4">Se la somma di INT + MAN (valori base + bonus) è almeno 32, il personaggio è automaticamente uno Stregone.</p>
            
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <h4 className="text-lg font-semibold text-gray-300 mb-3">Valori base (dalla sezione Caratteristiche di Base):</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white">INT base: <span className="text-yellow-400 font-bold">{baseIntValue}</span></p>
                </div>
                <div>
                  <p className="text-white">MAN base: <span className="text-yellow-400 font-bold">{baseManValue}</span></p>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-gray-300 mb-3">Bonus aggiuntivi:</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white mb-2">Bonus INT:</p>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={panTangIntBonus || ""}
                    className="p-1.5 w-full text-center bg-gray-700 rounded border border-gray-600 text-white"
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= 1 && value <= 8) {
                        setPanTangIntBonus(value);
                        onChange('panTangIntBonus', value);
                        
                        // Impostiamo sempre +1 alla TAG
                        onChange('panTangTagBonus', 1);
                        
                        // Verifica se il personaggio diventa Stregone
                        const totalInt = baseIntValue + value;
                        const totalMan = baseManValue + panTangManBonus;
                        
                        console.log(`Pan Tang - Totale INT + MAN: ${totalInt + totalMan}`);
                        
                        if (totalInt + totalMan >= 32) {
                          console.log('Pan Tang - Impostazione classe a Stregone');
                          setTimeout(() => {
                            onChange('class', 'Stregone');
                          }, 0);
                        } else {
                          console.log('Pan Tang - Impostazione classe a Guerriero');
                          setTimeout(() => {
                            onChange('class', 'Guerriero');
                          }, 0);
                        }
                      } else {
                        setPanTangIntBonus(0);
                        onChange('panTangIntBonus', 0);
                      }
                    }}
                  />
                </div>
                <div>
                  <p className="text-white mb-2">Bonus MAN:</p>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={panTangManBonus || ""}
                    className="p-1.5 w-full text-center bg-gray-700 rounded border border-gray-600 text-white"
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= 1 && value <= 8) {
                        setPanTangManBonus(value);
                        onChange('panTangManBonus', value);
                        
                        // Impostiamo sempre +1 alla TAG
                        onChange('panTangTagBonus', 1);
                        
                        // Verifica se il personaggio diventa Stregone
                        const totalInt = baseIntValue + panTangIntBonus;
                        const totalMan = baseManValue + value;
                        
                        console.log(`Pan Tang - Totale INT + MAN: ${totalInt + totalMan}`);
                        
                        if (totalInt + totalMan >= 32) {
                          console.log('Pan Tang - Impostazione classe a Stregone');
                          setTimeout(() => {
                            onChange('class', 'Stregone');
                          }, 0);
                        } else {
                          console.log('Pan Tang - Impostazione classe a Guerriero');
                          setTimeout(() => {
                            onChange('class', 'Guerriero');
                          }, 0);
                        }
                      } else {
                        setPanTangManBonus(0);
                        onChange('panTangManBonus', 0);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            
            <p className="text-lg font-bold text-center mb-4">Totale INT + MAN: <span className="text-yellow-400">{baseIntValue + panTangIntBonus + baseManValue + panTangManBonus}</span></p>
            
            {baseIntValue + panTangIntBonus + baseManValue + panTangManBonus >= 32 ? (
              <div className="mt-3 bg-green-900 p-3 rounded-lg border border-green-600">
                <p className="text-green-300 font-bold text-center">
                  Il tuo personaggio è uno Stregone! (INT + MAN ≥ 32)
                </p>
              </div>
            ) : (
              <div className="mt-3 bg-blue-900 p-3 rounded-lg border border-blue-600">
                <p className="text-blue-300 font-bold text-center">
                  Il tuo personaggio è un Guerriero (INT + MAN {'<'} 32)
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Se è Melniboné mostriamo direttamente entrambe le classi anche quando è già selezionata una classe */}
      {isMelnibonean(selectedNationality) && (
        <>
          <h3 className="text-base font-bold text-yellow-500 mb-2">Nobile</h3>
          <div className="mt-2 bg-gray-700 rounded-lg p-3 mb-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="md:w-1/4 flex justify-center">
                <div className="relative w-40 h-40 overflow-hidden rounded-lg border-2 border-yellow-600 shadow-md bg-gray-600">
                  <Image 
                    src="/images/classes/nobile.png"
                    alt="Nobile"
                    fill
                    sizes="(max-width: 768px) 100vw, 160px"
                    priority
                    style={{ objectFit: "scale-down", padding: "2px" }}
                    onError={(e) => {
                      // Se l'immagine non è disponibile, rimuovi l'elemento
                      const target = e.target as HTMLImageElement;
                      if (target.parentElement) {
                        target.parentElement.style.display = 'none';
                      }
                    }}
                  />
                </div>
              </div>
              <div className="md:w-3/4">
                <p className="text-gray-200 text-sm">{'La maggior parte delle nazioni dei Regni Giovani è retta da monarchie sostenute da una classe nobiliare. A differenza delle altre Classi, i Nobili sono generalmente abbastanza ricchi da non dover lavorare per vivere.'}</p>
              </div>
            </div>
          </div>
          
          <h3 className="text-base font-bold text-yellow-500 mb-2">Guerriero</h3>
          <div className="mt-2 bg-gray-700 rounded-lg p-3">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="md:w-1/4 flex justify-center">
                <div className="relative w-40 h-40 overflow-hidden rounded-lg border-2 border-yellow-600 shadow-md bg-gray-600">
                  <Image 
                    src="/images/classes/guerriero.png"
                    alt="Guerriero"
                    fill
                    sizes="(max-width: 768px) 100vw, 160px"
                    priority
                    style={{ objectFit: "scale-down", padding: "2px" }}
                    onError={(e) => {
                      // Se l'immagine non è disponibile, rimuovi l'elemento
                      const target = e.target as HTMLImageElement;
                      if (target.parentElement) {
                        target.parentElement.style.display = 'none';
                      }
                    }}
                  />
                </div>
              </div>
              <div className="md:w-3/4">
                <p className="text-gray-200 text-sm">{'I Guerrieri vengono allenati a combattere fin dall\'infanzia. Alcune nazioni, come Melniboné e Pan Tang, dove il lavoro servile viene svolto da schiavi e dove i veri cittadini si considerano aristocratici esaltano la pratica delle armi. Come tutti sanno, è compito dell\'aristocrazia combattere e, di conseguenza, tutti gli uomini abili vengono addestrati per diventare Guerrieri.'}</p>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Se è Solitudine Piangente mostriamo direttamente le classi Guerriero e Cacciatore */}
      {isWeepingWaste(selectedNationality) && (
        <>
          <h3 className="text-base font-bold text-yellow-500 mb-2">Guerriero</h3>
          <div className="mt-2 bg-gray-700 rounded-lg p-3 mb-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="md:w-1/4 flex justify-center">
                <div className="relative w-40 h-40 overflow-hidden rounded-lg border-2 border-yellow-600 shadow-md bg-gray-600">
                  <Image 
                    src="/images/classes/guerriero.png"
                    alt="Guerriero"
                    fill
                    sizes="(max-width: 768px) 100vw, 160px"
                    priority
                    style={{ objectFit: "scale-down", padding: "2px" }}
                    onError={(e) => {
                      // Se l'immagine non è disponibile, rimuovi l'elemento
                      const target = e.target as HTMLImageElement;
                      if (target.parentElement) {
                        target.parentElement.style.display = 'none';
                      }
                    }}
                  />
                </div>
              </div>
              <div className="md:w-3/4">
                <p className="text-gray-200 text-sm">{getClassDescriptionForNationality('Guerriero', 'Solitudine Piangente')}</p>
              </div>
            </div>
          </div>
          
          <h3 className="text-base font-bold text-yellow-500 mb-2">Cacciatore</h3>
          <div className="mt-2 bg-gray-700 rounded-lg p-3">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="md:w-1/4 flex justify-center">
                <div className="relative w-40 h-40 overflow-hidden rounded-lg border-2 border-yellow-600 shadow-md bg-gray-600">
                  <Image 
                    src="/images/classes/cacciatore.png"
                    alt="Cacciatore"
                    fill
                    sizes="(max-width: 768px) 100vw, 160px"
                    priority
                    style={{ objectFit: "scale-down", padding: "2px" }}
                    onError={(e) => {
                      // Se l'immagine non è disponibile, rimuovi l'elemento
                      const target = e.target as HTMLImageElement;
                      if (target.parentElement) {
                        target.parentElement.style.display = 'none';
                      }
                    }}
                  />
                </div>
              </div>
              <div className="md:w-3/4">
                <p className="text-gray-200 text-sm">{getClassDescriptionForNationality('Cacciatore', 'Solitudine Piangente')}</p>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Se è Pan Tang mostriamo direttamente le classi Sacerdote e Guerriero */}
      {isPanTang(selectedNationality) && (
        <>
          <h3 className="text-base font-bold text-yellow-500 mb-2">Sacerdote</h3>
          <div className="mt-2 bg-gray-700 rounded-lg p-3 mb-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="md:w-1/4 flex justify-center">
                <div className="relative w-40 h-40 overflow-hidden rounded-lg border-2 border-yellow-600 shadow-md bg-gray-600">
                  <Image 
                    src="/images/classes/sacerdote.png"
                    alt="Sacerdote"
                    fill
                    sizes="(max-width: 768px) 100vw, 160px"
                    priority
                    style={{ objectFit: "scale-down", padding: "2px" }}
                    onError={(e) => {
                      // Se l'immagine non è disponibile, rimuovi l'elemento
                      const target = e.target as HTMLImageElement;
                      if (target.parentElement) {
                        target.parentElement.style.display = 'none';
                      }
                    }}
                  />
                </div>
              </div>
              <div className="md:w-3/4">
                <p className="text-gray-200 text-sm">{'Gran parte della popolazione dei Regni Giovani adora i Signori della Legge o i Signori del Caos. Esiste comunque un gran numero di divinità minori, come gli elementali, i Signori delle Bestie e i demoni. I Sacerdoti organizzano queste religioni, presiedono alla costruzione di nuovi edifici sacri, studiano la medicina e la magia e intercedono con le divinità in favore della popolazione.'}</p>
              </div>
            </div>
          </div>
          
          <h3 className="text-base font-bold text-yellow-500 mb-2">Guerriero</h3>
          <div className="mt-2 bg-gray-700 rounded-lg p-3">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="md:w-1/4 flex justify-center">
                <div className="relative w-40 h-40 overflow-hidden rounded-lg border-2 border-yellow-600 shadow-md bg-gray-600">
                  <Image 
                    src="/images/classes/guerriero.png"
                    alt="Guerriero"
                    fill
                    sizes="(max-width: 768px) 100vw, 160px"
                    priority
                    style={{ objectFit: "scale-down", padding: "2px" }}
                    onError={(e) => {
                      // Se l'immagine non è disponibile, rimuovi l'elemento
                      const target = e.target as HTMLImageElement;
                      if (target.parentElement) {
                        target.parentElement.style.display = 'none';
                      }
                    }}
                  />
                </div>
              </div>
              <div className="md:w-3/4">
                <p className="text-gray-200 text-sm">{'I Guerrieri vengono allenati a combattere fin dall\'infanzia. Alcune nazioni, come Melniboné e Pan Tang, dove il lavoro servile viene svolto da schiavi e dove i veri cittadini si considerano aristocratici esaltano la pratica delle armi. Come tutti sanno, è compito dell\'aristocrazia combattere e, di conseguenza, tutti gli uomini abili vengono addestrati per diventare Guerrieri.'}</p>
              </div>
            </div>
          </div>
        </>
      )}
      
      {(!selectedClass || !isEditable) && 
       !isMelnibonean(selectedNationality) && 
       !isWeepingWaste(selectedNationality) &&
       !isPanTang(selectedNationality) && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Tira un numero (1-100):
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={classNumber === 0 ? '' : classNumber}
              onChange={(e) => handleNumberChange(e.target.value)}
              className="p-1.5 w-24 text-center bg-gray-700 rounded border border-gray-600 text-white"
              min="1"
              max="100"
              placeholder="1-100"
              disabled={!isEditable}
            />
            {isEditable && (
              <button
                onClick={() => {
                  if (classNumber >= 1 && classNumber <= 100) {
                    const range = CLASS_RANGES.find(range => 
                      classNumber >= range.min && classNumber <= range.max
                    );
                    
                    if (range) {
                      onChange('class', range.name);
                    }
                  }
                }}
                disabled={classNumber < 1 || classNumber > 100}
                className={`py-1.5 px-3 rounded font-medium text-sm ${
                  classNumber < 1 || classNumber > 100
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-yellow-600 text-white hover:bg-yellow-700'
                }`}
              >
                Conferma
              </button>
            )}
          </div>
        </div>
      )}
      
      {!selectedClass && 
       !isMelnibonean(selectedNationality) && 
       !isWeepingWaste(selectedNationality) &&
       !isPanTang(selectedNationality) && (
        <div 
          className="overflow-hidden rounded-lg border border-gray-700 mb-4 pointer-events-none" 
          onClick={(e) => e.preventDefault()}
        >
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Range
                </th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Classe
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {CLASS_RANGES.map((range) => {
                const isSelected = classNumber >= range.min && classNumber <= range.max;
                const defaultClasses = getDefaultClasses();
                const isDefaultForNationality = defaultClasses.includes(range.name);
                
                return (
                  <tr 
                    key={range.name}
                    className={`${isSelected ? 'bg-gray-700' : isDefaultForNationality ? 'bg-yellow-900/30' : ''} cursor-default select-none`}
                    // Assicuriamoci che la riga non sia cliccabile
                    role="presentation"
                    // Disabilitiamo eventuali event handlers
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    tabIndex={-1}
                    aria-disabled="true"
                  >
                    <td 
                      className="px-3 py-1.5 whitespace-nowrap text-sm select-none pointer-events-none"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    >
                      {range.min}-{range.max}
                    </td>
                    <td 
                      className="px-3 py-1.5 whitespace-nowrap text-sm flex items-center select-none pointer-events-none"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    >
                      <span 
                        className={
                          isSelected 
                            ? 'text-yellow-300 font-medium pointer-events-none' 
                            : isDefaultForNationality 
                              ? 'text-yellow-200 pointer-events-none' 
                              : 'text-white pointer-events-none'
                        }
                      >
                        {range.name}
                      </span>
                      {isSelected && (
                        <span className="ml-2 inline-block w-2.5 h-2.5 bg-yellow-500 rounded-full pointer-events-none"></span>
                      )}
                      {isDefaultForNationality && !isSelected && (
                        <span className="ml-2 text-xs text-yellow-500 pointer-events-none">
                          (Predefinita)
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Dettagli della classe selezionata */}
      {selectedClass && 
       !isMelnibonean(selectedNationality) && 
       !isWeepingWaste(selectedNationality) &&
       !isPanTang(selectedNationality) && (
        <div className="mt-2 bg-gray-700 rounded-lg p-3">
          <h3 className="text-base font-bold text-yellow-500 mb-2">{selectedClass}</h3>
          <div className="flex flex-col md:flex-row gap-3">
            {getImagePath() && (
              <div className="md:w-1/4 flex justify-center">
                <div className="relative w-40 h-40 overflow-hidden rounded-lg border-2 border-yellow-600 shadow-md bg-gray-600">
                  <Image 
                    src={getImagePath() || ''}
                    alt={selectedClass}
                    fill
                    sizes="(max-width: 768px) 100vw, 160px"
                    priority
                    style={{ objectFit: "scale-down", padding: "2px" }}
                    onError={(e) => {
                      // Se l'immagine non è disponibile, rimuovi l'elemento
                      const target = e.target as HTMLImageElement;
                      if (target.parentElement) {
                        target.parentElement.style.display = 'none';
                      }
                    }}
                  />
                </div>
              </div>
            )}
            <div className={getImagePath() ? "md:w-3/4" : "w-full"}>
              <p className="text-gray-200 text-sm">{getClassDescription()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 