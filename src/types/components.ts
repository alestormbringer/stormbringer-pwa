import { Character, CharacteristicValue } from './gameData';

export interface BasicInfoTableProps {
  character: Omit<Character, 'id'>;
  onChange: (field: keyof Omit<Character, 'id'>, value: string | number) => void;
  isEditable?: boolean;
}

export interface CharacteristicsTableProps {
  characteristics: Character['characteristics'];
  onChange: (key: string, value: number) => void;
  isEditable?: boolean;
}

export interface SkillsTableProps {
  customStats: Character['customStats'];
  onAdd: (category: string, name: string) => void;
  onChange: (category: string, key: string, field: 'baseValue' | 'value2', value: number) => void;
  isEditable?: boolean;
} 