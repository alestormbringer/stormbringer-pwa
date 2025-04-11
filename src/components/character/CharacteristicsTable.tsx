'use client';

import { Character, CharacteristicValue } from '@/types/gameData';
import { useState } from 'react';
import { FaInfoCircle, FaTimes } from 'react-icons/fa';

interface CharacteristicsTableProps {
  characteristics: Character['characteristics'];
  onChange: (key: string, value: any) => void;
  isEditable?: boolean;
}

const CHARACTERISTICS_DESCRIPTION = `
Lancia 3D6 per generare le Caratteristiche FOR, COS, TAG, INT, MAN, DES, FAS. 
Assegnare i valori ottenuti a proprio piacimento.
`;

type CharacteristicKey = 'for' | 'cos' | 'tag' | 'int' | 'man' | 'des' | 'fas';

const CHARACTERISTICS_INFO: Record<CharacteristicKey, { name: string; description: string }> = {
  for: {
    name: 'FORZA',
    description: 'La Forza (FOR) indica la potenza muscolare del personaggio e la capacità di sollevare e trasportare un peso. Questa Caratteristica può determinare con quale arma il personaggio può combattere, quanto può trasportare e quanti danni può infliggere nei combattimenti.'
  },
  cos: {
    name: 'COSTITUZIONE',
    description: 'La Costituzione (COS) può essere considerata la misura della salute fisica del personaggio. È inoltre il fattore principale nella determinazione di quanti Punti Ferita il personaggio può sopportare prima di morire.'
  },
  tag: {
    name: 'TAGLIA',
    description: 'La Taglia (TAG) indica la mole del personaggio. In questa Caratteristica vengono combinate altezza e peso, che nella Tab. 2.1.3.1 sono espresse in centimetri (cm) e chilogrammi (kg).'
  },
  int: {
    name: 'INTELLIGENZA',
    description: 'L\'Intelligenza (INT) indica l\'abilità di memorizzare, di astrarre, di risolvere problemi, di imparare dall\'esperienza e di pianificare azioni future. In termini di gioco INT risulta utile soprattutto nel campo della magia e di particolari abilità come la Conoscenza delle Piante.'
  },
  man: {
    name: 'MANA',
    description: 'Il Mana (MAN) è la Caratteristica base (affiancata all\'INT) per utilizzare la magia. In Stormbringer è necessario un valore molto elevato di MAN per eseguire qualunque pratica magica. Il MAN, inoltre, misura la fortuna e la forza di volontà.'
  },
  des: {
    name: 'DESTREZZA',
    description: 'La Destrezza (DES) quantifica l\'agilità, la destrezza manuale e molte abilità di tipo fisico. Questa Caratteristica influisce nella scelta delle armi che un personaggio può usare in combattimento.'
  },
  fas: {
    name: 'FASCINO',
    description: 'Il Fascino (FAS) misura la capacità di comando, il carisma e la personalità. Non è necessariamente una misura della bellezza fisica, anche se ogni tanto può essere usata in questo senso. Il FAS aiuterà i vostri personaggi nei rapporti con altri PG e PNG. In realtà, questa può essere considerata una Caratteristica di minore importanza.'
  }
};

const getTotalValueForCharacteristic = (key: string, value: CharacteristicValue): number => {
  const base = Number(value.baseValue) || 0;
  const melniboneBonus = value.melniboneBonus || 0;
  const panTangBonus = value.panTangBonus || 0;
  return base + melniboneBonus + panTangBonus;
};

export default function CharacteristicsTable({
  characteristics = {},
  onChange,
  isEditable = false
}: CharacteristicsTableProps) {
  const [modalInfo, setModalInfo] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
  }>({
    isOpen: false,
    title: '',
    description: ''
  });

  const handleValueChange = (key: string, value: string) => {
    const numValue = value === '' ? 0 : parseInt(value);
    onChange(key, isNaN(numValue) ? 0 : numValue);
  };

  const openModal = (title: string, description: string) => {
    setModalInfo({
      isOpen: true,
      title,
      description
    });
  };

  const closeModal = () => {
    setModalInfo({
      ...modalInfo,
      isOpen: false
    });
  };

  const baseCharacteristics: Array<{ key: CharacteristicKey; label: string }> = [
    { key: 'for', label: 'FOR' },
    { key: 'cos', label: 'COS' },
    { key: 'tag', label: 'TAG' },
    { key: 'int', label: 'INT' },
    { key: 'man', label: 'MAN' },
    { key: 'des', label: 'DES' },
    { key: 'fas', label: 'FAS' },
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-4 relative">
      {/* Modal informativo */}
      {modalInfo.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-yellow-500">{modalInfo.title}</h3>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <p className="text-gray-300">{modalInfo.description}</p>
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold mb-4">Caratteristiche Base</h2>
      
      <div className="bg-gray-700 rounded-lg p-3 mb-4 text-sm">
        <p className="text-gray-200">{CHARACTERISTICS_DESCRIPTION}</p>
      </div>
      
      <div className="overflow-hidden rounded-lg border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Caratteristica
              </th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                Valore
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {baseCharacteristics.map(({ key, label }) => {
              const characteristic = characteristics?.[key] || { baseValue: 0 };
              const value = getTotalValueForCharacteristic(key, characteristic);
              const info = CHARACTERISTICS_INFO[key];
              
              return (
                <tr key={key}>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <button
                        onClick={() => openModal(info.name, info.description)}
                        className="flex items-center text-white hover:text-yellow-500 transition-colors focus:outline-none"
                        aria-label={`Informazioni su ${info.name}`}
                      >
                        <span className="text-sm font-medium mr-2">
                          {label}
                        </span>
                        <FaInfoCircle size={14} className="text-yellow-500" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    {isEditable ? (
                      <div className="flex items-center justify-center">
                        <input
                          type="number"
                          value={value}
                          onChange={(e) => handleValueChange(key, e.target.value)}
                          className={`p-1 w-16 text-center bg-gray-700 rounded border-2 ${
                            value < 0 || value > 100 
                              ? 'border-red-500' 
                              : 'border-transparent hover:border-gray-600'
                          }`}
                          min="0"
                          max="100"
                        />
                        {characteristic.melniboneBonus && (
                          <div className="ml-2 text-yellow-400 font-medium">
                            +{characteristic.melniboneBonus}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-white">
                        {value}
                        {characteristic.melniboneBonus && (
                          <span className="ml-1 text-yellow-400 font-medium">
                            +{characteristic.melniboneBonus}
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
} 