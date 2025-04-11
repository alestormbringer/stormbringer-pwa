export interface Character {
  id: string;
  name: string;
  age: number;
  sex: string;
  nationality: string;
  class: string;
  cult: string;
  description: string;
  armor: string;
  protection: number;
  hitPoints: number;
  notes: string;
  characteristics: {
    for: { baseValue: number; bonus: number };
    cos: { baseValue: number; bonus: number };
    tag: { baseValue: number; bonus: number };
    int: { baseValue: number; bonus: number };
    man: { baseValue: number; bonus: number };
  };
  customStats: {
    [key: string]: {
      [key: string]: { baseValue?: number; value2?: number } | undefined;
    };
  };
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