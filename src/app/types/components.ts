import { Character, CharacterClass, NationalityData } from './character';

export interface CharacteristicsTableProps {
  character: Omit<Character, 'id'>;
  onCharacteristicChange: (key: string, value: number) => void;
}

export interface BasicInfoTableProps {
  character: Omit<Character, 'id'>;
  nationalities?: NationalityData[];
  classes?: CharacterClass[];
  onNationalityChange?: (nationality: NationalityData) => void;
  onClassChange?: (characterClass: CharacterClass) => void;
}

export interface SkillsTableProps {
  character: Omit<Character, 'id'>;
  onSkillChange: (category: string, skill: string, value: number) => void;
} 