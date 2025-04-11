// Tipi per le Divinità
export interface Deity {
  id: string;
  name: string;
  alignment: 'Caos' | 'Legge' | 'Signori delle Bestie' | 'Elementali';
  description: string;
  domains?: string[];
  powers?: string[];
  worshipers?: string[];
  imageUrl?: string;
}

// Tipi per le Nazionalità
export interface Nationality {
  id: string;
  name: string;
  description: string;
  culture: string;
  language: string;
  specialAbilities?: {
    name: string;
    description: string;
  }[];
  startingEquipment?: string[];
  bonuses?: {
    characteristic: string;
    value: number;
    description?: string;
  }[];
  skillBonuses?: {
    category: string;
    skillName: string;
    value: number;
    description?: string;
  }[];
  raceTraits?: string;
  characterCreation?: string;
}

// Tipi per le Armi
export interface Weapon {
  id: string;
  name: string;
  category: 'Mischia' | 'Lancio' | 'Tiro';
  type: string;
  damage: string;
  range?: string;
  special?: string;
  weight: number;
  cost: number;
  description: string;
  attackPercentage?: number;
  parryPercentage?: number;
}

// Tipo per le Armi del personaggio
export interface CharacterWeapon {
  name: string;
  attackPercentage: number;
  damage: string;
  parryPercentage: number;
}

// Tipi per le Caratteristiche
export interface CharacteristicValue {
  name: string;
  baseValue?: number | string;
  userValue?: number | string;
  description?: string;
  isCustom?: boolean;
  checked?: boolean; // Per le caselle di spunta delle sottocategorie
  baseValue2?: number | string; // Seconda colonna per Leggere-Scrivere/Parlare
  melniboneBonus?: number; // Bonus per i personaggi di Melniboné
  panTangBonus?: number; // Bonus per i personaggi di Pan Tang
}

// Tipi per i Personaggi
export interface Character {
  id: string;
  // Tabella 1: Informazioni base
  name: string;
  sex?: string;
  age?: number;
  nationality: string;
  class: string;
  cult?: string;
  elan?: string;
  description?: string;
  handicap?: string;
  
  // Tabella 2: Caratteristiche base
  characteristics: {
    [key: string]: CharacteristicValue;
  };
  
  // Tabella 3: Protezione
  armor?: string;
  protection?: number;
  seriousWound?: number;
  hitPoints?: number;
  
  // Tabella 4: Equipaggiamento e denaro
  equipment: string[];
  inventory: string[];
  money?: string;
  
  // Tabella 5: Armi
  weapons: CharacterWeapon[];
  
  // Tabella 6: Abilità per categoria
  customStats: {
    [category: string]: {
      [key: string]: CharacteristicValue;
    };
  };
  
  level: number;
  notes: string;
}

// Tipo per le Classi dei Personaggi
export interface CharacterClass {
  id: string;
  name: string;
  description: string;
  abilities: {
    name: string;
    percentage: number;
    bonus?: string;
  }[];
  startingEquipment: string[];
  imageUrl?: string;
  bonuses?: {
    characteristic: string;
    value: string;
  }[];
  details?: string;
  // Campi per la gestione delle varianti
  isVariant?: boolean;      // Indica se è una variante/sottoclasse
  parentClassId?: string;   // ID della classe principale se è una variante
  variants?: {
    id: string;
    name: string;
    description: string;
    additionalAbilities?: {
      name: string;
      percentage: number;
      bonus?: string;
    }[];
    additionalBonuses?: {
      characteristic: string;
      value: string;
    }[];
    additionalDetails?: string;
    additionalEquipment?: string[]; // Equipaggiamento aggiuntivo specifico della variante
    imageUrl?: string;
  }[];                     // Elenco delle varianti disponibili per questa classe
}

// Struttura principale del database
export interface GameDatabase {
  deities: {
    chaos: Deity[];
    law: Deity[];
    beastLords: Deity[];
    elementals: Deity[];
  };
  nationalities: Nationality[];
  weapons: {
    melee: Weapon[];
    ranged: Weapon[];
  };
  characters: Character[];
}

export const STAT_CATEGORIES = [
  'Agilità',
  'Comunicazione',
  'Conoscenza',
  'Leggere-Scrivere/Parlare',
  'Manipolazione',
  'Percezione',
  'Furtività',
  'Evocazione'
] as const;

export type StatCategory = typeof STAT_CATEGORIES[number];

// Funzione di utilità per generare un ID univoco per nuove stats
export const generateStatId = (category: string, name: string) => {
  return `${category.toLowerCase()}_${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
}; 