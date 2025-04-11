'use client';

import { useState } from 'react';
import { Character, CharacterWeapon, STAT_CATEGORIES } from '@/types/gameData';
import BasicInfoTable from './BasicInfoTable';
import CharacteristicsTable from './CharacteristicsTable';
import ProtectionTable from './ProtectionTable';
import EquipmentTable from './EquipmentTable';
import WeaponsTable from './WeaponsTable';
import SkillsTable from './SkillsTable';

interface CharacterSheetProps {
  character: Omit<Character, 'id'>;
  onBasicInfoChange: (field: keyof Character, value: any) => void;
  onCharacteristicChange: (key: string, value: any) => void;
  onProtectionChange: (field: 'armor' | 'protection' | 'seriousWound' | 'hitPoints', value: any) => void;
  onWeaponAdd: () => void;
  onWeaponChange: (index: number, field: keyof CharacterWeapon, value: any) => void;
  onWeaponRemove: (index: number) => void;
  onEquipmentChange: (field: 'equipment' | 'inventory' | 'money', value: any) => void;
  onCustomStatAdd: (category: string, name: string) => void;
  onCustomStatChange: (category: string, key: string, field: 'baseValue' | 'baseValue2' | 'checked', value: any) => void;
  isEditable?: boolean;
}

export default function CharacterSheet({
  character,
  onBasicInfoChange,
  onCharacteristicChange,
  onProtectionChange,
  onWeaponAdd,
  onWeaponChange,
  onWeaponRemove,
  onEquipmentChange,
  onCustomStatAdd,
  onCustomStatChange,
  isEditable = false
}: CharacterSheetProps) {
  const [activeTab, setActiveTab] = useState<number>(0);

  const tabs = [
    { name: 'Informazioni Base', component: 
      <BasicInfoTable 
        character={character} 
        onChange={onBasicInfoChange} 
        isEditable={isEditable} 
      /> 
    },
    { name: 'Caratteristiche', component: 
      <CharacteristicsTable 
        characteristics={character.characteristics} 
        onChange={onCharacteristicChange} 
        isEditable={isEditable} 
      /> 
    },
    { name: 'Protezione', component: 
      <ProtectionTable 
        character={character} 
        onChange={onProtectionChange} 
        isEditable={isEditable} 
      /> 
    },
    { name: 'Equipaggiamento', component: 
      <EquipmentTable 
        character={character} 
        onChange={onEquipmentChange} 
        isEditable={isEditable} 
      /> 
    },
    { name: 'Armi', component: 
      <WeaponsTable 
        weapons={character.weapons} 
        onAdd={onWeaponAdd} 
        onChange={onWeaponChange} 
        onRemove={onWeaponRemove} 
        isEditable={isEditable} 
      /> 
    },
    { name: 'Abilità', component: 
      <SkillsTable 
        customStats={character.customStats} 
        onAdd={onCustomStatAdd} 
        onChange={onCustomStatChange} 
        isEditable={isEditable} 
      /> 
    }
  ];

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-4 space-y-6">
      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-gray-700">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`px-4 py-2 font-medium rounded-t-lg transition ${
              activeTab === index
                ? 'bg-gray-700 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-2">
        {tabs[activeTab].component}
      </div>

      {/* Per visualizzazione completa, mostriamo anche una versione stampabile con tutte le tabelle */}
      {isEditable && (
        <div className="mt-8 pt-8 border-t border-gray-700 print:block hidden">
          <h2 className="text-xl font-bold mb-4">Scheda completa (per stampa)</h2>
          <div className="space-y-8">
            {tabs.map((tab, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold mb-2">{tab.name}</h3>
                {tab.component}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 