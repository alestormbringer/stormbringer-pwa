'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Weapon } from '@/types/gameData';
import NavBar from '@/components/NavBar';

// Estensione dell'interfaccia Weapon per includere le proprietà aggiuntive che stiamo utilizzando
interface ExtendedWeapon extends Weapon {
  forRequirement?: number | string;
  desRequirement?: number | string;
  length?: number | string;
}

// Dati statici per le armi
const INITIAL_MELEE_WEAPONS: ExtendedWeapon[] = [
  { id: '1', name: 'Accetta', category: 'Mischia', type: '', damage: '', weight: 0, cost: 0, description: '' },
  { id: '2', name: 'Ascia da battaglia', category: 'Mischia', type: '', damage: '', weight: 0, cost: 0, description: '' },
  { id: '3', name: 'Ascia lormyriana (2 mani)', category: 'Mischia', type: '', damage: '', weight: 0, cost: 0, description: '' },
  { id: '4', name: 'Ascia marinara (2 mani)', category: 'Mischia', type: '', damage: '', weight: 0, cost: 0, description: '' },
  { id: '5', name: 'Bastone (2 mani)', category: 'Mischia', type: '', damage: '', weight: 0, cost: 0, description: '' },
  { id: '6', name: 'Calcio', category: 'Mischia', type: '', damage: '', weight: 0, cost: 0, description: '' },
  { id: '7', name: 'Clava', category: 'Mischia', type: '', damage: '', weight: 0, cost: 0, description: '' },
  { id: '8', name: 'Daga', category: 'Mischia', type: '', damage: '', weight: 0, cost: 0, description: '' },
  { id: '9', name: 'Falcione', category: 'Mischia', type: '', damage: '', weight: 0, cost: 0, description: '' },
  { id: '10', name: 'Giavellotto', category: 'Mischia', type: '', damage: '', weight: 0, cost: 0, description: '' },
  { id: '11', name: 'Lancia (1 mano)', category: 'Mischia', type: '', damage: '', weight: 0, cost: 0, description: '' },
  { id: '12', name: 'Lancia lunga (2 mani)', category: 'Mischia', type: '', damage: '', weight: 0, cost: 0, description: '' },
  { id: '13', name: 'Mazza', category: 'Mischia', type: '', damage: '', weight: 0, cost: 0, description: '' },
  { id: '14', name: 'Mazza pesante (2 mani)', category: 'Mischia', type: '', damage: '', weight: 0, cost: 0, description: '' },
  { id: '15', name: 'Parma (scudo)', category: 'Mischia', type: '', damage: '', weight: 0, cost: 0, description: '' },
  { id: '16', name: 'Picca filkhariana (2 mani)', category: 'Mischia', type: '', damage: '', weight: 0, cost: 0, description: '' },
  { id: '17', name: 'Pugnale', category: 'Mischia', type: '', damage: '', weight: 0, cost: 0, description: '' },
  { id: '18', name: 'Pugno', category: 'Mischia', type: '', damage: '', weight: 0, cost: 0, description: '' },
  { id: '19', name: 'Scimitarra', category: 'Mischia', type: '', damage: '', weight: 0, cost: 0, description: '' },
  { id: '20', name: 'Scudo equestre', category: 'Mischia', type: '', damage: '', weight: 0, cost: 0, description: '' },
  { id: '21', name: 'Scudo grande', category: 'Mischia', type: '', damage: '', weight: 0, cost: 0, description: '' },
  { id: '22', name: 'Spada', category: 'Mischia', type: '', damage: '', weight: 0, cost: 0, description: '' },
  { id: '23', name: 'Spadone (2 mani)', category: 'Mischia', type: '', damage: '', weight: 0, cost: 0, description: '' },
  { id: '24', name: 'Targa (scudo)', category: 'Mischia', type: '', damage: '', weight: 0, cost: 0, description: '' },
  { id: '25', name: 'Testata', category: 'Mischia', type: '', damage: '', weight: 0, cost: 0, description: '' },
];

const INITIAL_RANGED_WEAPONS: ExtendedWeapon[] = [
  { id: '26', name: 'Arco d\'osso melniboneano', category: 'Tiro', type: '', damage: '', weight: 0, cost: 0, description: '' },
  { id: '27', name: 'Arco del deserto', category: 'Tiro', type: '', damage: '', weight: 0, cost: 0, description: '' },
  { id: '28', name: 'Arco lungo', category: 'Tiro', type: '', damage: '', weight: 0, cost: 0, description: '' },
  { id: '29', name: 'Fionda', category: 'Lancio', type: '', damage: '', weight: 0, cost: 0, description: '' },
  { id: '30', name: 'Giavellotto', category: 'Lancio', type: '', damage: '', weight: 0, cost: 0, description: '' },
  { id: '31', name: 'Lancia', category: 'Lancio', type: '', damage: '', weight: 0, cost: 0, description: '' },
  { id: '32', name: 'Parma (scudo)', category: 'Lancio', type: '', damage: '', weight: 0, cost: 0, description: '' },
  { id: '33', name: 'Peitre', category: 'Lancio', type: '', damage: '', weight: 0, cost: 0, description: '' },
  { id: '34', name: 'Pugnale', category: 'Lancio', type: '', damage: '', weight: 0, cost: 0, description: '' },
  { id: '35', name: 'Scure da lancio', category: 'Lancio', type: '', damage: '', weight: 0, cost: 0, description: '' },
  { id: '36', name: 'Targa', category: 'Lancio', type: '', damage: '', weight: 0, cost: 0, description: '' },
];

export default function WeaponsPage() {
  const [meleeWeapons, setMeleeWeapons] = useState<ExtendedWeapon[]>([]);
  const [rangedWeapons, setRangedWeapons] = useState<ExtendedWeapon[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isReadOnly, setIsReadOnly] = useState(true);

  useEffect(() => {
    // Carica i dati dal localStorage se esistono, altrimenti usa i dati iniziali
    try {
      const savedMeleeWeapons = localStorage.getItem('meleeWeapons');
      const savedRangedWeapons = localStorage.getItem('rangedWeapons');
      
      if (savedMeleeWeapons) {
        setMeleeWeapons(JSON.parse(savedMeleeWeapons));
      } else {
        setMeleeWeapons(INITIAL_MELEE_WEAPONS);
      }
      
      if (savedRangedWeapons) {
        setRangedWeapons(JSON.parse(savedRangedWeapons));
      } else {
        setRangedWeapons(INITIAL_RANGED_WEAPONS);
      }
    } catch (error) {
      console.error('Errore nel caricamento delle armi:', error);
      setMeleeWeapons(INITIAL_MELEE_WEAPONS);
      setRangedWeapons(INITIAL_RANGED_WEAPONS);
    }
    
    setLoading(false);
  }, []);

  // Funzione per aggiornare i valori delle armi da mischia
  const handleMeleeWeaponUpdate = (index: number, field: keyof ExtendedWeapon, value: any) => {
    const updatedWeapons = [...meleeWeapons];
    updatedWeapons[index] = {
      ...updatedWeapons[index],
      [field]: value
    };
    setMeleeWeapons(updatedWeapons);
  };

  // Funzione per aggiornare i valori delle armi da lancio e da tiro
  const handleRangedWeaponUpdate = (index: number, field: keyof ExtendedWeapon, value: any) => {
    const updatedWeapons = [...rangedWeapons];
    updatedWeapons[index] = {
      ...updatedWeapons[index],
      [field]: value
    };
    setRangedWeapons(updatedWeapons);
  };

  // Funzione per salvare i dati nel localStorage
  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      // Salva i dati nel localStorage
      localStorage.setItem('meleeWeapons', JSON.stringify(meleeWeapons));
      localStorage.setItem('rangedWeapons', JSON.stringify(rangedWeapons));
      
      // Per debug
      console.log('Armi da mischia salvate:', meleeWeapons);
      console.log('Armi da lancio e tiro salvate:', rangedWeapons);
      
      // Simuliamo un ritardo per mostrare il messaggio di salvataggio
      setTimeout(() => {
        setSaveStatus('saved');
        // Resetta lo stato dopo 3 secondi
        setTimeout(() => setSaveStatus('idle'), 3000);
      }, 1000);
    } catch (error) {
      console.error('Errore durante il salvataggio:', error);
      setSaveStatus('error');
    }
  };

  const toggleReadOnly = () => {
    setIsReadOnly(!isReadOnly);
  };

  const renderSaveButton = () => {
    switch (saveStatus) {
      case 'idle':
        return (
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
          >
            Salva Modifiche
          </button>
        );
      case 'saving':
        return (
          <button 
            className="px-6 py-2 bg-gray-600 text-white rounded cursor-not-allowed"
            disabled
          >
            Salvataggio in corso...
          </button>
        );
      case 'saved':
        return (
          <button 
            className="px-6 py-2 bg-green-600 text-white rounded cursor-not-allowed"
            disabled
          >
            Salvato ✓
          </button>
        );
      case 'error':
        return (
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Errore! Riprova
          </button>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-yellow-500 text-center mb-8">Armi di Stormbringer</h1>
        <p className="text-center text-gray-400 mb-8">Osservate per qualche minuto le tabelle: queste elencano tutte le armi disponibili nei Regni Giovani. Prestate speciale attenzione alle colonne della FOR e della DES, che specificano i requisiti che un personaggio deve possedere per poter utilizzare l'arma corrispondente. FOR indica la Forza necessaria al personaggio per usare l'arma in maniera efficace, mentre DES la Destrezza necessaria per usarla in modo corretto. Per usare un'arma senza soffrire delle penalità bisogna che FOR e DES abbiano almeno il valore richiesto. In generale, i requisiti richiesti non sono molto elevati: archi, scudi e armi a due mani hanno requisiti  più rigidi di FOR e DES, poiché è molto difficile imparare a usarli in modo corretto. Prestate molta attenzione nello scegliere le armi che potete usare in modo efficace.</p>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Tabella Armi da Mischia */}
            <div>
              <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Armi da Mischia</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Armi da Mischia
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                        FOR
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                        DES
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Danno
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Lunghezza(cm)
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Prezzo (MB)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {meleeWeapons.length > 0 ? (
                      meleeWeapons.map((weapon, index) => (
                        <tr 
                          key={weapon.id} 
                          className={`${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'}`}
                        >
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium text-white">{weapon.name}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                            <div className="text-sm text-white">{weapon.forRequirement || '-'}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                            <div className="text-sm text-white">{weapon.desRequirement || '-'}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                            <div className="text-sm text-white">{weapon.damage || '-'}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                            <div className="text-sm text-white">{weapon.length || '-'}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                            <div className="text-sm text-white">{weapon.cost || '-'}</div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-3 text-center text-gray-400">
                          Nessuna arma da mischia disponibile
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Tabella Armi da Lancio e da Tiro */}
            <div>
              <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Armi da Lancio e da Tiro</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Armi da lancio e da tiro
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                        FOR
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                        DES
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Danno
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Gittat (m)
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Prezzo (MB)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {rangedWeapons.length > 0 ? (
                      rangedWeapons.map((weapon, index) => (
                        <tr 
                          key={weapon.id} 
                          className={`${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'}`}
                        >
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium text-white">{weapon.name}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                            <div className="text-sm text-white">{weapon.forRequirement || '-'}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                            <div className="text-sm text-white">{weapon.desRequirement || '-'}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                            <div className="text-sm text-white">{weapon.damage || '-'}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                            <div className="text-sm text-white">{weapon.range || '-'}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                            <div className="text-sm text-white">{weapon.cost || '-'}</div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-3 text-center text-gray-400">
                          Nessuna arma da lancio o da tiro disponibile
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 