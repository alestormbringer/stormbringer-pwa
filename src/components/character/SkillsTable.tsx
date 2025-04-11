'use client';

import { useState } from 'react';
import { SkillsTableProps } from '@/types/components';

const SKILL_CATEGORIES = [
  'Combattimento',
  'Artigianato',
  'Conoscenze',
  'Lingue',
  'Furtività',
  'Percezione'
];

export default function SkillsTable({
  customStats,
  onAdd,
  onChange,
  isEditable = false
}: SkillsTableProps) {
  const [newSkillName, setNewSkillName] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const handleAddSkill = () => {
    if (newSkillName && selectedCategory) {
      onAdd(selectedCategory, newSkillName);
      setNewSkillName('');
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Abilità</h2>

      {isEditable && (
        <div className="mb-6 p-4 bg-gray-700 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Categoria
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-gray-600 border border-gray-500 rounded-md py-2 px-3 text-white"
              >
                <option value="">Seleziona categoria</option>
                {SKILL_CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Nome Abilità
              </label>
              <input
                type="text"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="w-full bg-gray-600 border border-gray-500 rounded-md py-2 px-3 text-white"
                placeholder="Inserisci nome abilità"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleAddSkill}
                disabled={!newSkillName || !selectedCategory}
                className="w-full bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Aggiungi Abilità
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {SKILL_CATEGORIES.map(category => {
          const categoryStats = customStats[category] || {};
          
          return (
            <div key={category} className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">{category}</h3>
              
              {Object.keys(categoryStats).length > 0 ? (
                <div className="overflow-hidden rounded-lg border border-gray-600">
                  <table className="min-w-full divide-y divide-gray-600">
                    <thead className="bg-gray-800">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Abilità
                        </th>
                        <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Base
                        </th>
                        {category === 'Lingue' && (
                          <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Parlato
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-gray-700 divide-y divide-gray-600">
                      {Object.entries(categoryStats).map(([key, stat]) => (
                        <tr key={key}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-white">
                            {key}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-center">
                            {isEditable ? (
                              <input
                                type="number"
                                value={stat.baseValue}
                                onChange={(e) => onChange(category, key, 'baseValue', parseInt(e.target.value) || 0)}
                                className="w-20 bg-gray-600 border border-gray-500 rounded text-center py-1 px-2 text-white"
                              />
                            ) : (
                              <span className="text-white">{stat.baseValue}</span>
                            )}
                          </td>
                          {category === 'Lingue' && (
                            <td className="px-4 py-2 whitespace-nowrap text-center">
                              {isEditable ? (
                                <input
                                  type="number"
                                  value={stat.value2 || 0}
                                  onChange={(e) => onChange(category, key, 'value2', parseInt(e.target.value) || 0)}
                                  className="w-20 bg-gray-600 border border-gray-500 rounded text-center py-1 px-2 text-white"
                                />
                              ) : (
                                <span className="text-white">{stat.value2 || 0}</span>
                              )}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400 text-sm italic">Nessuna abilità in questa categoria</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 