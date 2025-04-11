import { useState } from 'react';
import { Deity } from '@/types/gameData';

interface DeitiesListProps {
  deities: {
    chaos: Deity[];
    law: Deity[];
    beastLords: Deity[];
    elementals: Deity[];
  };
}

export default function DeitiesList({ deities }: DeitiesListProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    chaos: false,
    law: false,
    beastLords: false,
    elementals: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderDeityList = (deities: Deity[], section: string) => (
    <div className="ml-4">
      {expandedSections[section] && deities.map((deity) => (
        <div key={deity.id} className="card mb-2">
          <h3 className="text-xl font-semibold">{deity.name}</h3>
          <p className="text-gray-300">{deity.description}</p>
          {deity.domains && (
            <div className="mt-2">
              <h4 className="font-medium">Domini:</h4>
              <ul className="list-disc list-inside">
                {deity.domains.map((domain, index) => (
                  <li key={index}>{domain}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      <div>
        <button
          onClick={() => toggleSection('chaos')}
          className="flex items-center w-full text-left p-2 bg-gray-800 rounded-lg hover:bg-gray-700"
        >
          <span className="text-yellow-500 font-bold">Divinità del Caos</span>
          <span className="ml-auto">{expandedSections.chaos ? '▼' : '▶'}</span>
        </button>
        {renderDeityList(deities.chaos, 'chaos')}
      </div>

      <div>
        <button
          onClick={() => toggleSection('law')}
          className="flex items-center w-full text-left p-2 bg-gray-800 rounded-lg hover:bg-gray-700"
        >
          <span className="text-yellow-500 font-bold">Divinità della Legge</span>
          <span className="ml-auto">{expandedSections.law ? '▼' : '▶'}</span>
        </button>
        {renderDeityList(deities.law, 'law')}
      </div>

      <div>
        <button
          onClick={() => toggleSection('beastLords')}
          className="flex items-center w-full text-left p-2 bg-gray-800 rounded-lg hover:bg-gray-700"
        >
          <span className="text-yellow-500 font-bold">Signori delle Bestie</span>
          <span className="ml-auto">{expandedSections.beastLords ? '▼' : '▶'}</span>
        </button>
        {renderDeityList(deities.beastLords, 'beastLords')}
      </div>

      <div>
        <button
          onClick={() => toggleSection('elementals')}
          className="flex items-center w-full text-left p-2 bg-gray-800 rounded-lg hover:bg-gray-700"
        >
          <span className="text-yellow-500 font-bold">Elementali</span>
          <span className="ml-auto">{expandedSections.elementals ? '▼' : '▶'}</span>
        </button>
        {renderDeityList(deities.elementals, 'elementals')}
      </div>
    </div>
  );
} 