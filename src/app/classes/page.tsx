'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import NavBar from '@/components/NavBar';
import { CharacterClass } from '@/types/gameData';
import Link from 'next/link';

export default function ClassesPage() {
  const [classes, setClasses] = useState<CharacterClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [firebaseStatus, setFirebaseStatus] = useState('Connessione in corso...');
  const [currentClassVariant, setCurrentClassVariant] = useState<{[key: string]: string}>({
    'Mercante': 'Mercante',
    'Marinaio': 'Marinaio',
    'Guerriero': 'Guerriero'
  });

  // Funzione per cambiare la variante della classe
  const cycleClassVariant = (classId: string) => {
    const classItem = classes.find(c => c.id === classId);
    if (!classItem) return;
    
    if (classItem.variants && classItem.variants.length > 0) {
      // Trova la variante corrente
      const currentVariantName = currentClassVariant[classId] || classItem.name;
      
      console.log(`Cambio variante per classe ${classId} - ${classItem.name}`);
      console.log(`Variante corrente: ${currentVariantName}`);
      console.log(`Varianti disponibili:`, classItem.variants);
      
      // Se la variante corrente è la classe base
      if (currentVariantName === classItem.name) {
        // Passa alla prima variante
        setCurrentClassVariant(prev => ({
          ...prev,
          [classId]: classItem.variants![0].name
        }));
        console.log(`Passaggio a variante: ${classItem.variants![0].name}`);
      } else {
        // Trova l'indice della variante corrente
        const variantIndex = classItem.variants.findIndex(v => v.name === currentVariantName);
        if (variantIndex >= 0) {
          // Passa alla variante successiva o torna alla classe base
          const nextVariantIndex = (variantIndex + 1) % (classItem.variants.length + 1);
          const nextVariantName = nextVariantIndex === classItem.variants.length 
            ? classItem.name 
            : classItem.variants[nextVariantIndex].name;
          
          setCurrentClassVariant(prev => ({
            ...prev,
            [classId]: nextVariantName
          }));
          console.log(`Passaggio a variante: ${nextVariantName}`);
        }
      }
    }
    else {
      // Mantieni la compatibilità con il vecchio sistema per i dati di fallback
      if (classItem.name === 'Mercante') {
        setCurrentClassVariant(prev => ({
          ...prev,
          [classId]: prev[classId] === 'Mercante' 
            ? 'Bottegaio' 
            : prev[classId] === 'Bottegaio'
              ? 'Viaggiatore'
              : 'Mercante'
        }));
      } else if (classItem.name === 'Marinaio') {
        const nextVariant = {
          'Marinaio': 'Nostromo',
          'Nostromo': 'Capitano',
          'Capitano': 'Marinaio'
        }[currentClassVariant[classId] as 'Marinaio' | 'Nostromo' | 'Capitano'];
        
        setCurrentClassVariant(prev => ({
          ...prev,
          [classId]: nextVariant
        }));
      } else if (classItem.name === 'Guerriero') {
        setCurrentClassVariant(prev => ({
          ...prev,
          [classId]: prev[classId] === 'Guerriero' ? 'Assassino' : 'Guerriero'
        }));
      }
    }
  };

  // Funzione per reindirizzare alla pagina di aggiunta classe se non ci sono classi
  const redirectToAddPage = () => {
    console.log("Reindirizzamento alla pagina di aggiunta classe...");
    window.location.href = "/classes/add";
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      console.log("Tentativo di recupero delle classi...");
      const classesRef = collection(db, 'classes');
      const snapshot = await getDocs(classesRef);
      const classesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CharacterClass[];
      console.log("Classi recuperate (dettaglio):", JSON.stringify(classesData, null, 2));
      
      if (classesData.length === 0) {
        console.log("Nessuna classe trovata, carico dati di fallback");
        setError("Nessuna classe trovata nel database. Puoi aggiungere nuove classi usando il pulsante 'Nuova Classe'.");
        setClasses(getFallbackClasses());
      } else {
        // Ottieni tutte le classi, incluse le varianti
        setClasses(classesData);
        
        // Inizializza lo stato per le varianti da visualizzare
        const initialVariants: {[key: string]: string} = {};
        classesData.forEach(cls => {
          if (cls.variants && cls.variants.length > 0) {
            initialVariants[cls.id] = cls.name;
          }
        });
        
        // Rimuovo il caricamento di classi di fallback per Marinaio e Mercante
        setCurrentClassVariant(initialVariants);
      }
    } catch (error) {
      console.error('Errore durante il recupero delle classi:', error);
      
      // Messaggio di errore più specifico per problemi di permessi
      if (error instanceof Error && error.message.includes('permission-denied')) {
        setError("Errore di permessi nel database. Vengono mostrate classi di esempio.");
      } else {
        setError("Errore nel recupero delle classi: " + (error instanceof Error ? error.message : 'Errore sconosciuto'));
      }
      
      // Dati di fallback in caso di errore
      console.log("Carico dati di fallback a causa dell'errore");
      setClasses(getFallbackClasses());
    } finally {
      setIsLoading(false);
    }
  };

  // Funzione per ottenere i dati di fallback/esempio
  const getFallbackClasses = (): CharacterClass[] => {
    return [
      {
        id: 'fallback-guerriero',
        name: 'Guerriero',
        description: 'I Guerrieri sono esperti combattenti, presenti in tutte le nazioni dei Regni Giovani. Alcuni guerrieri servono nobili, altri lavorano come mercenari o guardie cittadine.',
        abilities: [
          { name: 'Abilità con due armi a scelta', percentage: 70 },
          { name: 'Parata', percentage: 60 },
          { name: 'Schivare', percentage: 50 },
          { name: 'Tattica', percentage: 40 }
        ],
        startingEquipment: ['Due armi a scelta', 'Armatura a scelta', 'Scudo (opzionale)', 'Razioni da viaggio'],
        details: 'I guerrieri formano la spina dorsale degli eserciti e delle forze di protezione dei Regni Giovani. Sono addestrati nel combattimento e nella sopravvivenza.'
      }
    ] as CharacterClass[];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <NavBar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center text-yellow-500">Caricamento...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-yellow-500 mb-4">
            Classi di Stormbringer
          </h1>
          <div className="flex justify-center space-x-2">
            <Link 
              href="/classes/add" 
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuova Classe
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-700 bg-opacity-70 text-white rounded-lg border border-red-500">
            <div className="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-bold">Avviso:</span>
            </div>
            <p>{error}</p>
            <p className="text-sm mt-2 opacity-80">Le classi visualizzate sono dati di esempio e non verranno salvate nel database.</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-8">
          {/* Visualizza le classi base */}
          {classes.filter(c => !c.isVariant).map((characterClass) => (
            <div key={characterClass.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
              {/* Header con divisore decorativo */}
              <div className="w-full bg-yellow-600 h-1 mb-1"></div>
              <div className="flex justify-center">
                <div className="w-2/3 border-b border-yellow-600"></div>
              </div>
              
              <div className="p-6">
                {/* Layout in stile manuale */}
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Colonna sinistra con immagine e nome */}
                  <div className="lg:w-1/3">
                    <h2 className="text-3xl font-bold text-yellow-500 mb-4 text-center uppercase">
                      {characterClass.name}
                    </h2>
                    
                    {/* Immagine centrale senza frecce */}
                    <div className="relative flex-grow mx-2">
                      {characterClass.imageUrl ? (
                        <img
                          src={characterClass.imageUrl}
                          alt={characterClass.name}
                          className="w-full max-h-96 object-contain rounded-lg mb-4 mx-auto"
                        />
                      ) : (
                        <div className="w-full h-96 bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                          <span className="text-6xl text-yellow-500 font-bold">
                            {characterClass.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-center space-x-2 mb-4">
                      <span 
                        className="bg-gray-600 text-white px-3 py-1 rounded flex items-center text-sm cursor-not-allowed opacity-70"
                        title="La modifica delle classi è disabilitata"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Modifica disabilitata
                      </span>
                    </div>
                  </div>
                  
                  {/* Colonna destra con dettagli in stile manuale */}
                  <div className="lg:w-2/3">
                    <p className="text-gray-300 mb-6 text-justify italic">
                      {characterClass.description}
                    </p>
                    
                    {/* Abilities in formato tabella */}
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-yellow-500 mb-2 border-b border-yellow-600 pb-1">
                        Abilità
                      </h3>
                      <div className="space-y-3">
                        {characterClass.abilities.map((ability, index) => (
                          <div key={index} className="flex justify-between">
                            <span className="text-white">
                              {index + 1}. {ability.name}
                            </span>
                            <span className="text-yellow-400">
                              {ability.percentage}% {ability.bonus && `+ bonus di ${ability.bonus}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Equipaggiamento iniziale */}
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-yellow-500 mb-2 border-b border-yellow-600 pb-1">
                        Equipaggiamento Iniziale
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {characterClass.startingEquipment.map((item, index) => (
                          <div key={index} className="text-gray-300">{item}</div>
                        ))}
                      </div>
                    </div>

                    {/* Bonus alle caratteristiche se presenti */}
                    {characterClass.bonuses && characterClass.bonuses.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-xl font-semibold text-yellow-500 mb-2 border-b border-yellow-600 pb-1">
                          Bonus alle Caratteristiche
                        </h3>
                        <ul className="list-disc list-inside text-gray-300">
                          {characterClass.bonuses.map((bonus, index) => (
                            <li key={index}>{bonus.characteristic}: {bonus.value}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Dettagli aggiuntivi */}
                    {characterClass.details && (
                      <div>
                        <h3 className="text-xl font-semibold text-yellow-500 mb-2 border-b border-yellow-600 pb-1">
                          Note
                        </h3>
                        <p className="text-gray-300 text-justify">
                          {characterClass.details}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Footer con divisore decorativo */}
              <div className="flex justify-center">
                <div className="w-2/3 border-t border-yellow-600"></div>
              </div>
              <div className="w-full bg-yellow-600 h-1 mt-1"></div>
            </div>
          ))}
        </div>
      </main>
      
      {/* Aggiungo animazione per l'effetto fade in e pulsazione */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
}

// Semplificazione delle funzioni per gestire le varianti
function hasVariants(classItem: CharacterClass): boolean {
  return Array.isArray(classItem.variants) && classItem.variants.length > 0;
}

function oldStyleHasVariants(classItem: CharacterClass): boolean {
  return false;
}

function getCurrentVariantName(classItem: CharacterClass, currentVariant?: {[key: string]: string}): string {
  return classItem.name;
} 