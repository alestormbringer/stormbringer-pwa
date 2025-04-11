'use client';

import { BasicInfoTableProps } from '@/types/components';

export default function BasicInfoTable({
  character,
  onChange,
  isEditable = false
}: BasicInfoTableProps) {
  const handleChange = (field: keyof typeof character, value: string | number) => {
    onChange(field, value);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Informazioni Base</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Nome
          </label>
          <input
            type="text"
            value={character.name}
            onChange={(e) => handleChange('name', e.target.value)}
            disabled={!isEditable}
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Età
          </label>
          <input
            type="number"
            value={character.age}
            onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
            disabled={!isEditable}
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Sesso
          </label>
          <input
            type="text"
            value={character.sex}
            onChange={(e) => handleChange('sex', e.target.value)}
            disabled={!isEditable}
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Nazionalità
          </label>
          <input
            type="text"
            value={character.nationality}
            onChange={(e) => handleChange('nationality', e.target.value)}
            disabled={!isEditable}
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Classe
          </label>
          <input
            type="text"
            value={character.class}
            onChange={(e) => handleChange('class', e.target.value)}
            disabled={!isEditable}
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Culto
          </label>
          <input
            type="text"
            value={character.cult}
            onChange={(e) => handleChange('cult', e.target.value)}
            disabled={!isEditable}
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Elan
          </label>
          <input
            type="text"
            value={character.elan}
            onChange={(e) => handleChange('elan', e.target.value)}
            disabled={!isEditable}
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Handicap
          </label>
          <input
            type="text"
            value={character.handicap}
            onChange={(e) => handleChange('handicap', e.target.value)}
            disabled={!isEditable}
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"
          />
        </div>
      </div>
    </div>
  );
} 