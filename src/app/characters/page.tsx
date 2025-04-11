'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import NavBar from '@/components/NavBar';
import Link from 'next/link';
import { Character, CharacterWeapon } from '@/types/gameData';

// Importazione esplicita dei componenti della scheda personaggio
import BasicInfoTable from '@/components/character/BasicInfoTable';
import CharacteristicsTable from '@/components/character/CharacteristicsTable';
import ProtectionTable from '@/components/character/ProtectionTable';
import EquipmentTable from '@/components/character/EquipmentTable';
import WeaponsTable from '@/components/character/WeaponsTable';
import SkillsTable from '@/components/character/SkillsTable';

export default function CharactersPage() {
  const { user } = useAuth();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [viewMode, setViewMode] = useState<'view' | 'edit'>('view');

  useEffect(() => {
    if (user) {
      fetchCharacters();
    }
  }, [user]);

  const fetchCharacters = async () => {
    if (!user) return;

    const q = query(collection(db, 'characters'), where('userId', '==', user.uid));
    const querySnapshot = await getDocs(q);
    const charactersData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Character[];

    setCharacters(charactersData);
  };

  const handleUpdateCharacter = async (updatedCharacter: Character) => {
    if (!user || !updatedCharacter.id) return;

    try {
      // Rimuoviamo il campo id dal carattere da aggiornare
      const { id, ...characterData } = updatedCharacter;
      
      // Aggiorna il personaggio esistente
      const characterRef = doc(db, 'characters', id);
      await updateDoc(characterRef, characterData);
      
      setSelectedCharacter(null);
      fetchCharacters();
    } catch (error) {
      console.error('Errore durante il salvataggio del personaggio:', error);
    }
  };

  const handleDeleteCharacter = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo personaggio?")) return;

    try {
      await deleteDoc(doc(db, 'characters', id));
      fetchCharacters();
    } catch (error) {
      console.error('Errore durante l\'eliminazione del personaggio:', error);
    }
  };

  const selectCharacter = async (id: string, mode: 'view' | 'edit') => {
    try {
      const characterDoc = await getDoc(doc(db, 'characters', id));
      
      if (characterDoc.exists()) {
        setSelectedCharacter({ id: characterDoc.id, ...characterDoc.data() } as Character);
        setViewMode(mode);
      }
    } catch (error) {
      console.error('Errore durante il recupero del personaggio:', error);
    }
  };

  const handleBasicInfoChange = (field: keyof Character, value: any) => {
    if (!selectedCharacter) return;
    
    setSelectedCharacter(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleCharacteristicChange = (key: string, value: any) => {
    if (!selectedCharacter) return;
    
    setSelectedCharacter(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        characteristics: {
          ...prev.characteristics,
          [key]: {
            ...prev.characteristics[key],
            baseValue: value
          }
        }
      };
    });
  };

  const handleProtectionChange = (field: 'armor' | 'protection' | 'seriousWound' | 'hitPoints', value: any) => {
    if (!selectedCharacter) return;
    
    setSelectedCharacter(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleWeaponAdd = () => {
    if (!selectedCharacter) return;
    
    const newWeapon: CharacterWeapon = {
      name: '',
      attackPercentage: 0,
      damage: '',
      parryPercentage: 0
    };
    
    setSelectedCharacter(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        weapons: [...prev.weapons, newWeapon]
      };
    });
  };

  const handleWeaponChange = (index: number, field: keyof CharacterWeapon, value: any) => {
    if (!selectedCharacter) return;
    
    setSelectedCharacter(prev => {
      if (!prev) return prev;
      
      const updatedWeapons = [...prev.weapons];
      updatedWeapons[index] = {
        ...updatedWeapons[index],
        [field]: value
      };
      
      return {
        ...prev,
        weapons: updatedWeapons
      };
    });
  };

  const handleWeaponRemove = (index: number) => {
    if (!selectedCharacter) return;
    
    setSelectedCharacter(prev => {
      if (!prev) return prev;
      
      const updatedWeapons = [...prev.weapons];
      updatedWeapons.splice(index, 1);
      
      return {
        ...prev,
        weapons: updatedWeapons
      };
    });
  };

  const handleEquipmentChange = (field: 'equipment' | 'inventory' | 'money', value: any) => {
    if (!selectedCharacter) return;
    
    setSelectedCharacter(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleCustomStatAdd = (category: string, name: string) => {
    if (!selectedCharacter) return;
    
    const key = `${category.toLowerCase()}_${name.toLowerCase().replace(/\s+/g, '_')}`;
    
    setSelectedCharacter(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        customStats: {
          ...prev.customStats,
          [category]: {
            ...prev.customStats[category],
            [key]: {
              name,
              baseValue: 0,
              checked: false
            }
          }
        }
      };
    });
  };

  const handleCustomStatChange = (category: string, key: string, field: 'baseValue' | 'value2' | 'checked', value: any) => {
    if (!selectedCharacter) return;
    
    setSelectedCharacter(prev => {
      if (!prev) return prev;
      return {
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
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedCharacter) {
      handleUpdateCharacter(selectedCharacter);
    }
  };

  const renderCharacterModal = () => {
    if (!selectedCharacter) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-yellow-500">
              {viewMode === 'view' ? 'Visualizza personaggio' : 'Modifica personaggio'}
            </h2>
            <div className="flex gap-3">
              {viewMode === 'view' ? (
                <button
                  onClick={() => setViewMode('edit')}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                >
                  Modifica
                </button>
              ) : (
                <button
                  onClick={() => setViewMode('view')}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
                >
                  Visualizza
                </button>
              )}
              <button
                onClick={() => setSelectedCharacter(null)}
                className="text-gray-300 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>

          {viewMode === 'view' ? (
            <div className="space-y-8">
              {/* Riepilogo personaggio */}
              <div className="border-b border-gray-700 pb-4">
                <h3 className="text-xl text-yellow-500 mb-2">1. Informazioni Base</h3>
                <BasicInfoTable character={selectedCharacter} onChange={() => {}} isEditable={false} />
              </div>
              
              <div className="border-b border-gray-700 pb-4">
                <h3 className="text-xl text-yellow-500 mb-2">2. Caratteristiche</h3>
                <CharacteristicsTable characteristics={selectedCharacter.characteristics} onChange={() => {}} isEditable={false} />
              </div>
              
              <div className="border-b border-gray-700 pb-4">
                <h3 className="text-xl text-yellow-500 mb-2">3. Protezione</h3>
                <ProtectionTable character={selectedCharacter} onChange={() => {}} isEditable={false} />
              </div>
              
              <div className="border-b border-gray-700 pb-4">
                <h3 className="text-xl text-yellow-500 mb-2">4. Equipaggiamento</h3>
                <EquipmentTable character={selectedCharacter} onChange={() => {}} isEditable={false} />
              </div>
              
              <div className="border-b border-gray-700 pb-4">
                <h3 className="text-xl text-yellow-500 mb-2">5. Armi</h3>
                <WeaponsTable 
                  weapons={selectedCharacter.weapons} 
                  onAdd={() => {}} 
                  onChange={() => {}} 
                  onRemove={() => {}} 
                  isEditable={false} 
                />
              </div>
              
              <div>
                <h3 className="text-xl text-yellow-500 mb-2">6. Abilità</h3>
                <SkillsTable 
                  customStats={selectedCharacter.customStats} 
                  onAdd={() => {}} 
                  onChange={(category: string, key: string, field: "baseValue" | "value2", value: number) => handleCustomStatChange(category, key, field, value)} 
                  isEditable={false} 
                />
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="border-b border-gray-700 pb-4">
                <h3 className="text-xl text-yellow-500 mb-2">1. Informazioni Base</h3>
                <BasicInfoTable character={selectedCharacter} onChange={handleBasicInfoChange} isEditable={true} />
              </div>
              
              <div className="border-b border-gray-700 pb-4">
                <h3 className="text-xl text-yellow-500 mb-2">2. Caratteristiche</h3>
                <CharacteristicsTable characteristics={selectedCharacter.characteristics} onChange={handleCharacteristicChange} isEditable={true} />
              </div>
              
              <div className="border-b border-gray-700 pb-4">
                <h3 className="text-xl text-yellow-500 mb-2">3. Protezione</h3>
                <ProtectionTable character={selectedCharacter} onChange={handleProtectionChange} isEditable={true} />
              </div>
              
              <div className="border-b border-gray-700 pb-4">
                <h3 className="text-xl text-yellow-500 mb-2">4. Equipaggiamento</h3>
                <EquipmentTable character={selectedCharacter} onChange={handleEquipmentChange} isEditable={true} />
              </div>
              
              <div className="border-b border-gray-700 pb-4">
                <h3 className="text-xl text-yellow-500 mb-2">5. Armi</h3>
                <WeaponsTable 
                  weapons={selectedCharacter.weapons} 
                  onAdd={handleWeaponAdd} 
                  onChange={handleWeaponChange} 
                  onRemove={handleWeaponRemove} 
                  isEditable={true} 
                />
              </div>
              
              <div>
                <h3 className="text-xl text-yellow-500 mb-2">6. Abilità</h3>
                <SkillsTable 
                  customStats={selectedCharacter.customStats} 
                  onAdd={handleCustomStatAdd} 
                  onChange={(category: string, key: string, field: "baseValue" | "value2", value: number) => handleCustomStatChange(category, key, field, value)} 
                  isEditable={true} 
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setSelectedCharacter(null)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 mr-2"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Salva Modifiche
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-yellow-500 mb-4">I tuoi personaggi</h1>
          <div className="flex justify-center">
            <Link
              href="/stormbringer-character"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex items-center"
            >
              <span className="mr-2">+</span> Nuovo Personaggio
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((character) => (
            <div key={character.id} className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold text-yellow-500 mb-2">{character.name}</h2>
              <p className="text-gray-300 mb-2">
                {character.nationality} - {character.class}
              </p>
              <p className="text-gray-400 mb-4">{character.description}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => selectCharacter(character.id, 'view')}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
                >
                  Visualizza
                </button>
                <button
                  onClick={() => selectCharacter(character.id, 'edit')}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                >
                  Modifica
                </button>
                <button
                  onClick={() => handleDeleteCharacter(character.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                >
                  Elimina
                </button>
              </div>
            </div>
          ))}
        </div>

        {renderCharacterModal()}
      </div>
    </div>
  );
} 