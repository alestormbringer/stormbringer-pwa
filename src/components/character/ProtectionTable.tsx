'use client';

import { Character } from '@/types/gameData';

interface ProtectionTableProps {
  character: Omit<Character, 'id'>;
  onChange: (field: 'armor' | 'protection' | 'seriousWound' | 'hitPoints', value: any) => void;
  isEditable?: boolean;
}

export default function ProtectionTable({ 
  character, 
  onChange, 
  isEditable = false 
}: ProtectionTableProps) {
  const handleNumberChange = (field: 'protection' | 'seriousWound' | 'hitPoints', value: string) => {
    const numValue = value === '' ? 0 : parseInt(value);
    onChange(field, isNaN(numValue) ? 0 : numValue);
  };

  const handleTextChange = (field: 'armor', value: string) => {
    onChange(field, value);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Protezione</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Armatura</label>
          {isEditable ? (
            <input
              type="text"
              value={character.armor || ''}
              onChange={(e) => handleTextChange('armor', e.target.value)}
              className="w-full p-2 bg-gray-700 rounded text-white"
            />
          ) : (
            <div className="p-2 bg-gray-700 rounded">
              {character.armor || '-'}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Protezione</label>
          {isEditable ? (
            <input
              type="number"
              value={character.protection || 0}
              onChange={(e) => handleNumberChange('protection', e.target.value)}
              className="w-full p-2 bg-gray-700 rounded text-white"
            />
          ) : (
            <div className="p-2 bg-gray-700 rounded">
              {character.protection || '0'}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Ferita Grave</label>
          {isEditable ? (
            <input
              type="number"
              value={character.seriousWound || 0}
              onChange={(e) => handleNumberChange('seriousWound', e.target.value)}
              className="w-full p-2 bg-gray-700 rounded text-white"
            />
          ) : (
            <div className="p-2 bg-gray-700 rounded">
              {character.seriousWound || '0'}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Punti Ferita</label>
          {isEditable ? (
            <input
              type="number"
              value={character.hitPoints || 0}
              onChange={(e) => handleNumberChange('hitPoints', e.target.value)}
              className="w-full p-2 bg-gray-700 rounded text-white"
            />
          ) : (
            <div className="p-2 bg-gray-700 rounded">
              {character.hitPoints || '0'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 