export interface Nationality {
  id: string;
  name: string;
  description: string;
  traits: {
    name: string;
    description: string;
  }[];
  languages: string[];
  startingEquipment?: string[];
  specialAbilities?: {
    name: string;
    description: string;
  }[];
} 