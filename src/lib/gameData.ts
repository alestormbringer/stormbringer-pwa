import { CharacterClass, NationalityData } from '@/types/character';

export function getCharacterClasses(): CharacterClass[] {
  return [
    {
      id: '1',
      name: 'Guerriero',
      description: 'Esperto nel combattimento e nelle arti marziali',
      characteristics: {
        for: 2,
        cos: 1
      }
    },
    {
      id: '2',
      name: 'Mago',
      description: 'Maestro delle arti arcane',
      characteristics: {
        int: 2,
        man: 1
      }
    }
  ];
}

export function getNationalities(): NationalityData[] {
  return [
    {
      id: '1',
      name: 'Melniboneano',
      description: 'Nobile razza degli antichi draghi',
      characteristics: {
        int: 2,
        man: 1
      }
    },
    {
      id: '2',
      name: 'Mabden',
      description: 'Umani comuni delle Giovani Nazioni',
      characteristics: {
        for: 1,
        cos: 1
      }
    }
  ];
} 