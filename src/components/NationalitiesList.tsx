import { useState } from 'react';
import { Nationality } from '@/types/gameData';

interface NationalitiesListProps {
  nationalities: Nationality[];
}

export default function NationalitiesList({ nationalities }: NationalitiesListProps) {
  const [expandedNationality, setExpandedNationality] = useState<string | null>(null);

  const toggleNationality = (id: string) => {
    setExpandedNationality(expandedNationality === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {nationalities.map((nationality) => (
        <div key={nationality.id} className="card">
          <button
            onClick={() => toggleNationality(nationality.id)}
            className="flex items-center w-full text-left"
          >
            <h3 className="text-xl font-semibold text-yellow-500">{nationality.name}</h3>
            <span className="ml-auto">{expandedNationality === nationality.id ? '▼' : '▶'}</span>
          </button>

          {expandedNationality === nationality.id && (
            <div className="mt-4 space-y-4">
              <div>
                <h4 className="font-medium">Cultura</h4>
                <p className="text-gray-300">{nationality.culture}</p>
              </div>

              <div>
                <h4 className="font-medium">Lingua</h4>
                <p className="text-gray-300">{nationality.language}</p>
              </div>

              {nationality.specialAbilities && nationality.specialAbilities.length > 0 && (
                <div>
                  <h4 className="font-medium">Abilità Speciali</h4>
                  <ul className="list-disc list-inside">
                    {nationality.specialAbilities.map((ability, index) => (
                      <li key={index} className="text-gray-300">
                        <span className="font-medium">{ability.name}:</span> {ability.description}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {nationality.startingEquipment && nationality.startingEquipment.length > 0 && (
                <div>
                  <h4 className="font-medium">Equipaggiamento Iniziale</h4>
                  <ul className="list-disc list-inside">
                    {nationality.startingEquipment.map((item, index) => (
                      <li key={index} className="text-gray-300">{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 