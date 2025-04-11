'use client';

import { useState } from 'react';
import { Character } from '@/types/gameData';

interface EquipmentTableProps {
  character: Omit<Character, 'id'>;
  onChange: (field: 'equipment' | 'inventory' | 'money', value: any) => void;
  isEditable?: boolean;
}

export default function EquipmentTable({
  character,
  onChange,
  isEditable = false
}: EquipmentTableProps) {
  const [newItem, setNewItem] = useState('');

  const handleAddItem = (type: 'equipment' | 'inventory') => {
    if (newItem.trim()) {
      const updatedItems = [...character[type], newItem.trim()];
      onChange(type, updatedItems);
      setNewItem('');
    }
  };

  const handleRemoveItem = (type: 'equipment' | 'inventory', index: number) => {
    const updatedItems = [...character[type]];
    updatedItems.splice(index, 1);
    onChange(type, updatedItems);
  };

  const handleMoneyChange = (value: string) => {
    onChange('money', value);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Equipaggiamento e Denaro</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Equipaggiamento */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Equipaggiamento</h3>
          
          <ul className="mt-2 space-y-1 max-h-60 overflow-y-auto border border-gray-700 rounded p-2">
            {character.equipment.length > 0 ? (
              character.equipment.map((item, index) => (
                <li key={index} className="flex justify-between items-center p-1 hover:bg-gray-700 rounded">
                  <span>{item}</span>
                  {isEditable && (
                    <button 
                      onClick={() => handleRemoveItem('equipment', index)}
                      className="text-red-400 hover:text-red-500"
                    >
                      &times;
                    </button>
                  )}
                </li>
              ))
            ) : (
              <li className="text-gray-500 italic">Nessun oggetto</li>
            )}
          </ul>
          
          {isEditable && (
            <div className="mt-2 flex">
              <input 
                type="text" 
                className="flex-1 p-2 bg-gray-700 rounded-l text-white"
                placeholder="Aggiungi oggetto..." 
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddItem('equipment')}
              />
              <button 
                className="bg-green-600 text-white px-3 py-2 rounded-r hover:bg-green-700"
                onClick={() => handleAddItem('equipment')}
              >
                +
              </button>
            </div>
          )}
        </div>
        
        {/* Inventario e Denaro */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Inventario</h3>
            
            <ul className="mt-2 space-y-1 max-h-60 overflow-y-auto border border-gray-700 rounded p-2">
              {character.inventory.length > 0 ? (
                character.inventory.map((item, index) => (
                  <li key={index} className="flex justify-between items-center p-1 hover:bg-gray-700 rounded">
                    <span>{item}</span>
                    {isEditable && (
                      <button 
                        onClick={() => handleRemoveItem('inventory', index)}
                        className="text-red-400 hover:text-red-500"
                      >
                        &times;
                      </button>
                    )}
                  </li>
                ))
              ) : (
                <li className="text-gray-500 italic">Nessun oggetto</li>
              )}
            </ul>
            
            {isEditable && (
              <div className="mt-2 flex">
                <input 
                  type="text" 
                  className="flex-1 p-2 bg-gray-700 rounded-l text-white"
                  placeholder="Aggiungi oggetto..." 
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddItem('inventory')}
                />
                <button 
                  className="bg-green-600 text-white px-3 py-2 rounded-r hover:bg-green-700"
                  onClick={() => handleAddItem('inventory')}
                >
                  +
                </button>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Denaro</h3>
            {isEditable ? (
              <textarea
                className="w-full p-2 bg-gray-700 rounded text-white"
                value={character.money || ''}
                onChange={(e) => handleMoneyChange(e.target.value)}
                rows={2}
                placeholder="Es: 50 monete d'oro, 30 d'argento..."
              />
            ) : (
              <div className="p-2 border border-gray-700 rounded min-h-12">
                {character.money || <span className="text-gray-500 italic">Nessun denaro</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 