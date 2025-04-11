'use client';

import { Character } from '@/types/gameData';
import { useState, useEffect } from 'react';

interface HitPointsTableProps {
  characteristics: Character['characteristics'];
  onChange?: (hitPoints: number) => void;
}

export default function HitPointsTable({
  characteristics,
  onChange
}: HitPointsTableProps) {
  const [hitPoints, setHitPoints] = useState(0);

  useEffect(() => {
    calculateHitPoints();
  }, [characteristics]);

  const calculateHitPoints = () => {
    // Prendi i valori base di COS e TAG
    const cosValue = Number(characteristics?.cos?.baseValue || 0);
    const tagValue = Number(characteristics?.tag?.baseValue || 0);
    
    // Considera i bonus di Melniboné
    const tagBonus = Number(characteristics?.tag?.melniboneBonus || 0);
    const totalTagValue = tagValue + tagBonus;
    
    let finalHitPoints = cosValue;
    
    // Se TAG > 12, aggiungi 1 punto per ogni valore sopra 12
    if (totalTagValue > 12) {
      finalHitPoints += (totalTagValue - 12);
    }
    
    // Se TAG < 9, sottrai 1 punto per ogni valore sotto 9
    if (totalTagValue < 9) {
      finalHitPoints -= (9 - totalTagValue);
    }
    
    // Aggiorna lo stato
    setHitPoints(finalHitPoints);
    
    // Chiama la callback se fornita
    if (onChange) {
      onChange(finalHitPoints);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-yellow-400 mb-2">Punti Ferita</h3>
      
      <div className="bg-gray-700 rounded-lg p-3 mb-4 text-sm">
        <p>Anche se i Punti Ferita (PF) non sono una vera Caratteristica costituiscono, comunque, un valore fonda-mentale, poiché indicano quanti danni un personaggio può subire prima di morire. Stabiliscono anche la gravità di una ferita (minore o maggiore). Il numero di PF di un personaggio viene calcolato aggiungendo alla COS 1 punto per ogni punto di TAG superiore a 12, o sottraendo 1 punto per ogni punto inferiore a 9. Tranne quando indicato diversamente, questa formula per il calcolo dei PF è valida per la creazione di ogni essere vivente.</p>
      </div>
      
      <div className="overflow-hidden rounded-lg border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Valore Base COS
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Modifica per TAG
              </th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                Punti Ferita Totali
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            <tr>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm font-medium text-white">
                  {characteristics?.cos?.baseValue || 0}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {(() => {
                  const tagValue = Number(characteristics?.tag?.baseValue || 0);
                  const tagBonus = Number(characteristics?.tag?.melniboneBonus || 0);
                  const totalTagValue = tagValue + tagBonus;
                  
                  const modifier = totalTagValue > 12 
                    ? `+${totalTagValue - 12}` 
                    : totalTagValue < 9 
                      ? `-${9 - totalTagValue}` 
                      : "0";
                  const color = totalTagValue > 12 
                    ? "text-green-500" 
                    : totalTagValue < 9 
                      ? "text-red-500" 
                      : "text-white";
                  
                  return (
                    <div className={`text-sm font-medium ${color}`}>
                      {modifier}
                      {tagBonus > 0 && (
                        <span className="ml-2 text-xs text-yellow-500">
                          (Bonus Melniboné: +{tagBonus})
                        </span>
                      )}
                    </div>
                  );
                })()}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-center">
                <div className="text-lg font-bold text-yellow-400">
                  {hitPoints}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
} 