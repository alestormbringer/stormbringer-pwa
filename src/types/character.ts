export type CharacteristicKey = 'for' | 'cos' | 'tag' | 'int' | 'man';

export interface Characteristic {
  baseValue: number;
  bonus: number;
}

export interface CharacteristicValue {
  baseValue: number;
  value2?: number;
}

export interface Character {
  id: string;
  name: string;
  age: number;
  sex: string;
  nationality: string;
  class: string;
  cult: string;
  elan: string;
  handicap: string;
  description: string;
  armor: string;
  protection: number;
  hitPoints: number;
  notes: string;
  characteristics: {
    [K in CharacteristicKey]: Characteristic;
  };
  customStats: {
    [category: string]: {
      [key: string]: CharacteristicValue;
    };
  };
  equipment: string[];
  inventory: string[];
  weapons: any[]; // TODO: definire il tipo corretto per le armi
  level: number;
}

export interface CharacterClass {
  id: string;
  name: string;
  description: string;
  characteristics: {
    [key: string]: number;
  };
}

export interface NationalityData {
  id: string;
  name: string;
  description: string;
  characteristics: {
    [key: string]: number;
  };
} 