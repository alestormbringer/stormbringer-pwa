'use client';

import React, { useState, useEffect } from 'react';
import { Nationality } from '@/types/gameData';
import Link from 'next/link';

interface NationalityTableProps {
  nationalities: Nationality[];
  selectedNationality: string;
  onNationalityChange: (nationality: string) => void;
}

// Definizione specifica delle fasce numeriche per ogni nazionalità
type NationalityRange = {
  id: string;
  name: string;
  range: string;
};

// Mappa degli slug per le nazionalità (come da verifica del sistema di routing dell'applicazione)
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

// Tabella predefinita delle fasce di valori per le nazionalità (come da immagine)
const NATIONALITY_RANGES: NationalityRange[] = [
  { id: 'melnibone', name: 'Melniboné', range: '01-02' },
  { id: 'pan-tang', name: 'Pan Tang', range: '03-05' },
  { id: 'myrrhyn', name: 'Myrrhyn', range: '06-08' },
  { id: 'dharijor', name: 'Dharijor', range: '09-12' },
  { id: 'jharkor', name: 'Jharkor', range: '13-16' },
  { id: 'shazaar', name: 'Shazaar', range: '17-24' },
  { id: 'tarkesh', name: 'Tarkesh', range: '25-29' },
  { id: 'vilmir', name: 'Vilmir', range: '30-37' },
  { id: 'ilmiora', name: 'Ilmiora', range: '38-44' },
  { id: 'nadsokor', name: 'Nadsokor', range: '45-49' },
  { id: 'solitudine-piangente', name: 'Solitudine Piangente', range: '50-56' },
  { id: 'eshmir', name: 'Eshmir', range: '57-60' },
  { id: 'isola-delle-citta-purpuree', name: 'Isola delle Città Purpuree', range: '61-67' },
  { id: 'argimiliar', name: 'Argimiliar', range: '68-74' },
  { id: 'pikarayd', name: 'Pikarayd', range: '75-81' },
  { id: 'lormyr', name: 'Lormyr', range: '82-88' },
  { id: 'filkhar', name: 'Filkhar', range: '89-95' },
  { id: 'oin', name: 'Oin', range: '96-97' },
  { id: 'yu', name: 'Yu', range: '98-99' },
  { id: 'org', name: 'Org', range: '100' }
];

// Funzione per ottenere i valori numerici da una stringa di range (es. "01-02" -> [1, 2])
const getRangeValues = (rangeStr: string): [number, number] => {
  if (rangeStr.includes('-')) {
    const [min, max] = rangeStr.split('-').map(n => parseInt(n, 10));
    return [min, max];
  } else {
    const value = parseInt(rangeStr, 10);
    return [value, value];
  }
};

// Funzione per ottenere lo slug corretto per una nazionalità
const getSlugForNationality = (name: string): string => {
  return nameToSlug[name] || name.toLowerCase().replace(/\s+/g, '-');
};

export default function NationalityTable({
  nationalities,
  selectedNationality,
  onNationalityChange
}: NationalityTableProps) {
  const [randomValue, setRandomValue] = useState<number | ''>('');
  const [selectedNationalityData, setSelectedNationalityData] = useState<Nationality | null>(null);
  const [showTable, setShowTable] = useState(true);
  const [hasSelectedNationality, setHasSelectedNationality] = useState(false);

  // Modifico la funzione getNationalityById per migliorare la ricerca
  const getNationalityById = (id: string): Nationality | undefined => {
    // 1. Prima cerca per ID esatto
    let nationality = nationalities.find(n => n.id === id);
    
    // 2. Se non trova, cerca per nome esatto corrispondente al range
    if (!nationality) {
      const rangeName = NATIONALITY_RANGES.find(r => r.id === id)?.name;
      if (rangeName) {
        nationality = nationalities.find(n => n.name === rangeName);
      }
    }
    
    // 3. Se ancora non trova, prova ricerca parziale nell'ID (fallback)
    if (!nationality) {
      nationality = nationalities.find(n => 
        n.id.toLowerCase().includes(id.toLowerCase()) || 
        id.toLowerCase().includes(n.id.toLowerCase())
      );
    }
    
    // 4. Ultimo tentativo: cerca per nome parziale
    if (!nationality) {
      const rangeName = NATIONALITY_RANGES.find(r => r.id === id)?.name;
      if (rangeName) {
        nationality = nationalities.find(n => 
          n.name.toLowerCase().includes(rangeName.toLowerCase()) || 
          rangeName.toLowerCase().includes(n.name.toLowerCase())
        );
      }
    }
    
    // Log per capire cosa sta succedendo
    if (!nationality) {
      console.log("Nazioni disponibili:", nationalities.map(n => ({id: n.id, name: n.name})));
      console.log("Cercando nazionalità con id:", id);
    }
    
    return nationality;
  };

  // Aggiorna la nazionalità selezionata quando cambia il valore random
  useEffect(() => {
    // Rimuoviamo l'aggiornamento automatico della nazionalità
    // Ora questo avviene solo tramite il pulsante Conferma
    if (randomValue === '') return;
    
    const numValue = Number(randomValue);
    if (isNaN(numValue) || numValue < 1 || numValue > 100) return;
    
    console.log("Valore numerico inserito:", numValue); // Log per debug
    
    // Troviamo solo il range corrispondente per riferimento, senza selezionare
    const foundRange = NATIONALITY_RANGES.find(range => {
      const [min, max] = getRangeValues(range.range);
      return numValue >= min && numValue <= max;
    });
    
    if (foundRange) {
      console.log("Range trovato:", foundRange); // Log per debug
    } else {
      console.log("Nessun range trovato per il valore:", numValue); // Log per debug
    }
  }, [randomValue]);

  // Aggiungo un useEffect per il debug all'avvio del componente
  useEffect(() => {
    console.log("Nazionalità disponibili:", nationalities.map(n => ({id: n.id, name: n.name})));
    console.log("Range di nazionalità:", NATIONALITY_RANGES);
  }, [nationalities]);

  // Funzione per resettare la selezione e mostrare nuovamente la tabella
  const handleReset = () => {
    setRandomValue('');
    setShowTable(true);
    setHasSelectedNationality(false);
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-yellow-400 mb-2">Tabella delle Nazionalità</h3>
      
      <div className="bg-gray-700 rounded-lg p-3 mb-4 text-sm">
        <p>La Nazionalità del personaggio viene determinata tirando 1D100 e confrontando il risultato con la tabella delle nazionalità. Una volta determinata la nazionalità, basterà andare nella sezione 3. Classi e verranno applicati direttamente i modificatori alle caratteristiche.</p>
      </div>
      
      <div className="flex space-x-4 mb-4">
        <div className="w-1/2">
          <label htmlFor="randomValue" className="block text-sm font-medium text-gray-400 mb-1">
            Tira 1D100 e inserisci il risultato
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              id="randomValue"
              min="1"
              max="100"
              value={randomValue}
              onChange={(e) => {
                const newValue = e.target.value === '' ? '' : Number(e.target.value);
                setRandomValue(newValue);
                console.log("Input value changed to:", newValue); // Log per debug
              }}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white w-full"
            />
            <button
              onClick={() => {
                if (randomValue !== '') {
                  const numValue = Number(randomValue);
                  // Trova la nazionalità corrispondente alla fascia
                  const foundRange = NATIONALITY_RANGES.find(range => {
                    const [min, max] = getRangeValues(range.range);
                    return numValue >= min && numValue <= max;
                  });
                  
                  if (foundRange) {
                    // Trova la nazionalità corrispondente nei dati
                    const nationalityData = getNationalityById(foundRange.id);
                    
                    if (nationalityData) {
                      onNationalityChange(nationalityData.id);
                      setSelectedNationalityData(nationalityData);
                      setHasSelectedNationality(true);
                      setShowTable(false); // Nascondi la tabella dopo aver selezionato una nazionalità
                    }
                  }
                }
              }}
              disabled={randomValue === '' || Number(randomValue) < 1 || Number(randomValue) > 100}
              className={`py-2 px-3 rounded font-medium text-sm ${
                randomValue === '' || Number(randomValue) < 1 || Number(randomValue) > 100
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-yellow-600 text-white hover:bg-yellow-700'
              }`}
            >
              Conferma
            </button>
          </div>
        </div>
        
        <div className="w-1/2">
          <div className="block text-sm font-medium text-gray-400 mb-1">
            Nazionalità selezionata
          </div>
          <div className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white">
            <div className="flex justify-between items-center">
              <span className="font-medium">{selectedNationalityData?.name || 'Nessuna nazionalità selezionata'}</span>
              <div className="flex space-x-2">
                {selectedNationalityData && (
                  <Link 
                    href={`/nationalities/${getSlugForNationality(selectedNationalityData.name)}`}
                    className="text-xs text-blue-400 hover:text-blue-300 hover:underline"
                    target="_blank"
                  >
                    Leggi la descrizione della nazionalità
                  </Link>
                )}
                {hasSelectedNationality && (
                  <button 
                    onClick={handleReset}
                    className="text-xs text-red-400 hover:text-red-300 hover:underline ml-2"
                  >
                    Cambia
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Aggiungo solo le sezioni "Tratti fisici" e "Creazione del personaggio" */}
      {selectedNationalityData && (
        <div className="bg-gray-700 rounded-lg p-4 mb-4 mt-4">
          {/* Tratti fisici */}
          {selectedNationalityData.raceTraits && (
            <div className="mb-4">
              <h4 className="font-semibold text-yellow-400 mb-2">Tratti Fisici</h4>
              <p className="text-gray-300">{selectedNationalityData.raceTraits}</p>
            </div>
          )}
          
          {/* Creazione del personaggio */}
          {selectedNationalityData.characterCreation && (
            <div>
              <h4 className="font-semibold text-yellow-400 mb-2">Creazione del Personaggio</h4>
              <p className="text-gray-300">{selectedNationalityData.characterCreation}</p>
            </div>
          )}
          
          {/* Messaggio se i dati non sono disponibili */}
          {!selectedNationalityData.raceTraits && !selectedNationalityData.characterCreation && (
            <div className="text-center text-gray-400">
              <p>Le informazioni dettagliate su questa nazionalità saranno disponibili presto.</p>
              <p className="mt-2">Consulta il manuale di Stormbringer per i modificatori alle caratteristiche e i tratti fisici specifici.</p>
            </div>
          )}
        </div>
      )}
      
      {showTable && (
        <div className="overflow-x-auto">
          <div className="overflow-hidden rounded-lg border border-gray-700">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    1D100
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Nazionalità
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {NATIONALITY_RANGES.map((range) => {
                  // Trova la nazionalità corrispondente nei dati
                  const fullNationality = getNationalityById(range.id);
                  const isSelected = fullNationality && selectedNationality === fullNationality.id;
                  
                  return (
                    <tr 
                      key={range.id} 
                      className={isSelected ? 'bg-gray-700' : ''}
                    >
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className={`text-sm font-medium ${isSelected ? 'text-yellow-400' : 'text-white'}`}>
                          {range.range}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-white">
                          {range.name}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 