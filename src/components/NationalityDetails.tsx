import React from 'react';
import { NationalityData } from '@/hooks/useNationality';

interface NationalityDetailsProps {
  nationality: NationalityData | null;
  loading?: boolean;
  error?: string | null;
  showCharacterCreation?: boolean;
  showFullDetails?: boolean;
}

/**
 * Componente per visualizzare i dettagli di una nazionalità
 */
export default function NationalityDetails({
  nationality,
  loading = false,
  error = null,
  showCharacterCreation = false,
  showFullDetails = false
}: NationalityDetailsProps) {
  if (loading) {
    return <div className="text-center text-yellow-500">Caricamento...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!nationality) {
    return <div className="text-red-500">Nazionalità non trovata</div>;
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Intestazione */}
      <div className="relative">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-yellow-400">{nationality.name}</h1>
          {nationality.region && (
            <p className="text-gray-300">{nationality.region}</p>
          )}
        </div>
      </div>

      {/* Corpo */}
      <div className="p-6">
        {/* Descrizione */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-yellow-400 mb-2">Descrizione</h2>
          <p className="text-gray-300">{nationality.description}</p>
        </div>

        {/* Informazioni sulla cultura */}
        {(nationality.culture || nationality.language) && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-yellow-400 mb-2">Cultura e Linguaggio</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nationality.culture && (
                <div>
                  <h3 className="text-lg font-medium text-white">Cultura</h3>
                  <p className="text-gray-300">{nationality.culture}</p>
                </div>
              )}
              {nationality.language && (
                <div>
                  <h3 className="text-lg font-medium text-white">Lingua principale</h3>
                  <p className="text-gray-300">{nationality.language}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tratti fisici */}
        {nationality.raceTraits && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-yellow-400 mb-2">Tratti fisici</h2>
            <p className="text-gray-300">{nationality.raceTraits}</p>
          </div>
        )}

        {/* Dettagli completi - mostrati solo se richiesti */}
        {showFullDetails && (
          <>
            {/* Lingue conosciute */}
            {nationality.languages && nationality.languages.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-yellow-400 mb-2">Lingue conosciute</h2>
                <ul className="list-disc list-inside text-gray-300">
                  {nationality.languages.map((lang, index) => (
                    <li key={index}>{lang}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bonus alle Caratteristiche */}
            {nationality.bonuses && nationality.bonuses.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-yellow-400 mb-2">Bonus alle Caratteristiche</h2>
                <ul className="list-disc list-inside text-gray-300">
                  {nationality.bonuses.map((bonus, index) => (
                    <li key={index}>
                      {bonus.characteristic}: {bonus.value > 0 ? `+${bonus.value}` : bonus.value}
                      {bonus.description && ` - ${bonus.description}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bonus alle Abilità */}
            {nationality.skillBonuses && nationality.skillBonuses.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-yellow-400 mb-2">Bonus alle Abilità</h2>
                <ul className="list-disc list-inside text-gray-300">
                  {nationality.skillBonuses.map((bonus, index) => (
                    <li key={index}>
                      {bonus.category} - {bonus.skillName}: {bonus.value > 0 ? `+${bonus.value}%` : `${bonus.value}%`}
                      {bonus.description && ` - ${bonus.description}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {/* Informazioni per la creazione del personaggio */}
        {showCharacterCreation && nationality.characterCreation && (
          <div className="mb-6 bg-gray-700 p-4 rounded">
            <h2 className="text-xl font-semibold text-yellow-400 mb-2">Creazione del personaggio</h2>
            <p className="text-gray-300">{nationality.characterCreation}</p>
          </div>
        )}
      </div>
    </div>
  );
} 