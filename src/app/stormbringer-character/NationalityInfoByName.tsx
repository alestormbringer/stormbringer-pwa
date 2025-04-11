import React, { useEffect } from 'react';
import { useNationality } from '@/hooks/useNationality';

interface NationalityInfoByNameProps {
  name: string;
}

/**
 * Componente che mostra le informazioni dettagliate di una nazionalità basandosi sul nome
 */
export default function NationalityInfoByName({ name }: NationalityInfoByNameProps) {
  // Mappa dei nomi alle slug
  const nameToSlug: Record<string, string> = {
    'Melniboné': 'melnibonae',
    'Pan Tang': 'pan-tang',
    'Myrrhyn': 'myrrhyn',
    'Dharijor': 'dharijor',
    'Jharkor': 'jharkor',
    'Shazaar': 'shazaar',
    'Tarkesh': 'tarkesh',
    'Vilmir': 'vilmir',
    'Ilmiora': 'ilmiora',
    'Nadsokor': 'nadsokor',
    'Solitudine Piangente': 'weeping-waste',
    'Eshmir': 'eshmir',
    'Isola delle Città Purpuree': 'purple-towns',
    'Argimiliar': 'argimiliar',
    'Pikarayd': 'pikarayd',
    'Lormyr': 'lormyr',
    'Filkhar': 'filkhar',
    'Oin': 'oin',
    'Yu': 'yu',
    'Org': 'org'
  };

  // Determina lo slug dalla nazionalità
  const slug = nameToSlug[name] || name.toLowerCase().replace(/\s+/g, '-');
  
  // Usa l'hook per caricare le informazioni della nazionalità
  const { nationality, loading, error } = useNationality(undefined, slug);

  if (loading) {
    return <div className="text-gray-300">Caricamento informazioni...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!nationality) {
    return (
      <div className="text-gray-300">
        <p>Informazioni dettagliate su questa nazionalità saranno aggiunte presto.</p>
        <p>Consulta il manuale di Stormbringer per i modificatori alle caratteristiche e le abilità speciali.</p>
      </div>
    );
  }

  return (
    <div className="text-gray-300 space-y-2">
      {nationality.raceTraits && <p>{nationality.raceTraits}</p>}
      
      {nationality.characterCreation && (
        <>
          <p className="font-medium text-yellow-200">Modificatori alle caratteristiche:</p>
          <p className="mt-2">{nationality.characterCreation}</p>
        </>
      )}
      
      {!nationality.characterCreation && !nationality.raceTraits && (
        <>
          <p>Informazioni dettagliate su questa nazionalità saranno aggiunte presto.</p>
          <p>Consulta il manuale di Stormbringer per i modificatori alle caratteristiche e le abilità speciali.</p>
        </>
      )}
    </div>
  );
} 