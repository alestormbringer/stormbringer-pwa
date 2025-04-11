'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Character, CharacterWeapon } from '@/types/gameData';
import { initialCharacter } from '@/data/initialStats';
import NavBar from '@/components/NavBar';
import { useAuth } from '@/contexts/AuthContext';

// Importazione esplicita dei componenti della scheda personaggio
import BasicInfoTable from '@/components/character/BasicInfoTable';
import CharacteristicsTable from '@/components/character/CharacteristicsTable';
import ProtectionTable from '@/components/character/ProtectionTable';
import EquipmentTable from '@/components/character/EquipmentTable';
import WeaponsTable from '@/components/character/WeaponsTable';
import SkillsTable from '@/components/character/SkillsTable';

export default function CharacterSheetPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [character, setCharacter] = useState<Omit<Character, 'id'>>(initialCharacter);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBasicInfoChange = (field: keyof Character, value: any) => {
    setCharacter(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCharacteristicChange = (key: string, value: any) => {
    setCharacter(prev => ({
      ...prev,
      characteristics: {
        ...prev.characteristics,
        [key]: {
          ...prev.characteristics[key],
          baseValue: value
        }
      }
    }));
  };

  const handleProtectionChange = (field: 'armor' | 'protection' | 'seriousWound' | 'hitPoints', value: any) => {
    setCharacter(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWeaponAdd = () => {
    const newWeapon: CharacterWeapon = {
      name: '',
      attackPercentage: 0,
      damage: '',
      parryPercentage: 0
    };
    
    setCharacter(prev => ({
      ...prev,
      weapons: [...prev.weapons, newWeapon]
    }));
  };

  const handleWeaponChange = (index: number, field: keyof CharacterWeapon, value: any) => {
    setCharacter(prev => {
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
    setCharacter(prev => {
      const updatedWeapons = [...prev.weapons];
      updatedWeapons.splice(index, 1);
      
      return {
        ...prev,
        weapons: updatedWeapons
      };
    });
  };

  const handleEquipmentChange = (field: 'equipment' | 'inventory' | 'money', value: any) => {
    setCharacter(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCustomStatAdd = (category: string, name: string) => {
    const key = `${category.toLowerCase()}_${name.toLowerCase().replace(/\s+/g, '_')}`;
    
    setCharacter(prev => ({
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
    }));
  };

  const handleCustomStatChange = (category: string, key: string, field: 'baseValue' | 'baseValue2' | 'checked', value: any) => {
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Devi accedere per creare un personaggio');
      router.push('/login');
      return;
    }
    
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'characters'), {
        ...character,
        userId: user.uid,
        createdAt: new Date()
      });
      router.push('/characters');
    } catch (error) {
      console.error('Error creating character:', error);
      alert('Errore durante la creazione del personaggio');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NavBar />
      <div className="container mx-auto p-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-yellow-500">Scheda Personaggio Stormbringer</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="space-y-12">
              {/* Sezione Informazioni Base */}
              <div className="border-b border-gray-700 pb-8">
                <h2 className="text-2xl font-bold text-yellow-500 mb-4">1. Informazioni Base</h2>
                <BasicInfoTable 
                  character={character} 
                  onChange={handleBasicInfoChange} 
                  isEditable={true} 
                />
              </div>
              
              {/* Sezione Caratteristiche */}
              <div className="border-b border-gray-700 pb-8">
                <h2 className="text-2xl font-bold text-yellow-500 mb-4">2. Caratteristiche</h2>
                <CharacteristicsTable 
                  characteristics={character.characteristics} 
                  onChange={handleCharacteristicChange} 
                  isEditable={true} 
                />
              </div>
              
              {/* Sezione Protezione */}
              <div className="border-b border-gray-700 pb-8">
                <h2 className="text-2xl font-bold text-yellow-500 mb-4">3. Protezione</h2>
                <ProtectionTable 
                  character={character} 
                  onChange={handleProtectionChange} 
                  isEditable={true} 
                />
              </div>
              
              {/* Sezione Equipaggiamento */}
              <div className="border-b border-gray-700 pb-8">
                <h2 className="text-2xl font-bold text-yellow-500 mb-4">4. Equipaggiamento</h2>
                <EquipmentTable 
                  character={character} 
                  onChange={handleEquipmentChange} 
                  isEditable={true} 
                />
              </div>
              
              {/* Sezione Armi */}
              <div className="border-b border-gray-700 pb-8">
                <h2 className="text-2xl font-bold text-yellow-500 mb-4">5. Armi</h2>
                <WeaponsTable 
                  weapons={character.weapons} 
                  onAdd={handleWeaponAdd} 
                  onChange={handleWeaponChange} 
                  onRemove={handleWeaponRemove} 
                  isEditable={true} 
                />
              </div>
              
              {/* Sezione Abilità */}
              <div>
                <h2 className="text-2xl font-bold text-yellow-500 mb-4">6. Abilità</h2>
                <SkillsTable 
                  customStats={character.customStats} 
                  onAdd={handleCustomStatAdd} 
                  onChange={handleCustomStatChange} 
                  isEditable={true} 
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={() => router.push('/characters')}
              className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 ${isSubmitting ? 'bg-green-800' : 'bg-green-600 hover:bg-green-700'} text-white rounded`}
            >
              {isSubmitting ? 'Salvataggio...' : 'Salva Personaggio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 