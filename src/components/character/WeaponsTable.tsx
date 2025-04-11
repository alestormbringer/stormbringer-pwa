'use client';

import { CharacterWeapon } from '@/types/gameData';

interface WeaponsTableProps {
  weapons: CharacterWeapon[];
  onAdd: () => void;
  onChange: (index: number, field: keyof CharacterWeapon, value: any) => void;
  onRemove: (index: number) => void;
  isEditable?: boolean;
}

export default function WeaponsTable({
  weapons,
  onAdd,
  onChange,
  onRemove,
  isEditable = false
}: WeaponsTableProps) {
  const handleWeaponChange = (index: number, field: keyof CharacterWeapon, value: any) => {
    if (field === 'attackPercentage' || field === 'parryPercentage') {
      const numValue = value === '' ? 0 : parseInt(value);
      onChange(index, field, isNaN(numValue) ? 0 : numValue);
    } else {
      onChange(index, field, value);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Armi</h2>
        {isEditable && (
          <button
            onClick={onAdd}
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
          >
            Aggiungi Arma
          </button>
        )}
      </div>
      
      <div className="overflow-hidden rounded-lg border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Arma
              </th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                Att %
              </th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                Danno
              </th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                Par %
              </th>
              {isEditable && (
                <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Azioni
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {weapons.length > 0 ? (
              weapons.map((weapon, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">
                    {isEditable ? (
                      <input
                        type="text"
                        value={weapon.name}
                        onChange={(e) => handleWeaponChange(index, 'name', e.target.value)}
                        className="w-full p-1 bg-gray-700 rounded text-white"
                      />
                    ) : (
                      <div className="text-sm font-medium text-white">{weapon.name || '-'}</div>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {isEditable ? (
                      <input
                        type="number"
                        value={weapon.attackPercentage}
                        onChange={(e) => handleWeaponChange(index, 'attackPercentage', e.target.value)}
                        className="p-1 w-16 text-center bg-gray-700 rounded text-white"
                      />
                    ) : (
                      <div className="text-sm text-white">{weapon.attackPercentage}%</div>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {isEditable ? (
                      <input
                        type="text"
                        value={weapon.damage}
                        onChange={(e) => handleWeaponChange(index, 'damage', e.target.value)}
                        className="p-1 w-24 text-center bg-gray-700 rounded text-white"
                        placeholder="es. 1d8+1"
                      />
                    ) : (
                      <div className="text-sm text-white">{weapon.damage || '-'}</div>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {isEditable ? (
                      <input
                        type="number"
                        value={weapon.parryPercentage}
                        onChange={(e) => handleWeaponChange(index, 'parryPercentage', e.target.value)}
                        className="p-1 w-16 text-center bg-gray-700 rounded text-white"
                      />
                    ) : (
                      <div className="text-sm text-white">{weapon.parryPercentage}%</div>
                    )}
                  </td>
                  {isEditable && (
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => onRemove(index)}
                        className="text-red-400 hover:text-red-500"
                      >
                        &times;
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isEditable ? 5 : 4} className="px-4 py-4 text-center text-sm text-gray-500 italic">
                  Nessuna arma aggiunta
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 