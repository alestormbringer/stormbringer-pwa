import { Character, CharacterClass } from '@/types/gameData';
import { NationalityData } from '@/hooks/useNationality';

/**
 * Applica i bonus di nazionalità a un personaggio
 * @param character Personaggio a cui applicare i bonus
 * @param nationality Nazionalità da cui prendere i bonus
 * @returns Personaggio con i bonus applicati
 */
export const applyNationalityBonuses = (
  character: Omit<Character, 'id'>, 
  nationality: NationalityData | null
): Omit<Character, 'id'> => {
  if (!nationality || !nationality.bonuses) {
    return character;
  }

  const updatedCharacter = { ...character };

  // Applica i bonus alle caratteristiche di base
  nationality.bonuses.forEach(bonus => {
    const charKey = mapCharacteristicName(bonus.characteristic);
    if (charKey && updatedCharacter.characteristics[charKey]) {
      const currentValue = updatedCharacter.characteristics[charKey].baseValue as number || 0;
      updatedCharacter.characteristics[charKey] = {
        ...updatedCharacter.characteristics[charKey],
        baseValue: currentValue + bonus.value
      };
    }
  });

  // Applica i bonus alle abilità
  if (nationality.skillBonuses) {
    nationality.skillBonuses.forEach(skillBonus => {
      const { category, skillName, value } = skillBonus;
      
      // Verifica se la categoria esiste
      if (updatedCharacter.customStats[category]) {
        // Cerca l'abilità nella categoria
        const skillKey = Object.keys(updatedCharacter.customStats[category]).find(
          key => updatedCharacter.customStats[category][key].name === skillName
        );
        
        if (skillKey) {
          // Aggiorna il valore dell'abilità esistente
          const currentValue = updatedCharacter.customStats[category][skillKey].baseValue as number || 0;
          updatedCharacter.customStats[category][skillKey] = {
            ...updatedCharacter.customStats[category][skillKey],
            baseValue: currentValue + value
          };
        } else {
          // Se l'abilità non esiste, aggiungila automaticamente alla categoria
          const newSkillKey = `${category.toLowerCase()}_${skillName.toLowerCase().replace(/\s+/g, '_')}`;
          updatedCharacter.customStats[category][newSkillKey] = {
            name: skillName,
            baseValue: value,
            checked: false
          };
        }
      }
    });
  }

  return updatedCharacter;
};

/**
 * Applica i bonus di classe a un personaggio
 * @param character Personaggio a cui applicare i bonus
 * @param characterClass Classe da cui prendere i bonus
 * @returns Personaggio con i bonus applicati
 */
export const applyClassBonuses = (
  character: Omit<Character, 'id'>, 
  characterClass: CharacterClass | null
): Omit<Character, 'id'> => {
  if (!characterClass) {
    return character;
  }

  const updatedCharacter = { ...character };

  // Applica i bonus alle caratteristiche
  if (characterClass.bonuses) {
    characterClass.bonuses.forEach(bonus => {
      const charKey = mapCharacteristicName(bonus.characteristic);
      if (charKey && updatedCharacter.characteristics[charKey]) {
        const currentValue = updatedCharacter.characteristics[charKey].baseValue as number || 0;
        const bonusValue = parseInt(bonus.value) || 0;
        updatedCharacter.characteristics[charKey] = {
          ...updatedCharacter.characteristics[charKey],
          baseValue: currentValue + bonusValue
        };
      }
    });
  }

  // Applica le abilità della classe
  if (characterClass.abilities) {
    characterClass.abilities.forEach(ability => {
      // Trova la categoria e l'abilità appropriata
      const { category, skillName } = findCategoryAndSkill(ability.name);
      
      if (category && skillName && updatedCharacter.customStats[category]) {
        // Cerca l'abilità nella categoria
        const skillKey = Object.keys(updatedCharacter.customStats[category]).find(
          key => updatedCharacter.customStats[category][key].name === skillName
        );
        
        if (skillKey) {
          // Aggiorna l'abilità esistente
          const currentValue = updatedCharacter.customStats[category][skillKey].baseValue as number || 0;
          // Prendi il valore più alto tra quello attuale e quello della classe
          const newValue = Math.max(currentValue, ability.percentage);
          updatedCharacter.customStats[category][skillKey] = {
            ...updatedCharacter.customStats[category][skillKey],
            baseValue: newValue,
            checked: true // Segna come abilità di classe
          };
        } else {
          // Se l'abilità non esiste, aggiungila alla categoria
          const newSkillKey = `${category.toLowerCase()}_${skillName.toLowerCase().replace(/\s+/g, '_')}`;
          updatedCharacter.customStats[category][newSkillKey] = {
            name: skillName,
            baseValue: ability.percentage,
            checked: true // Segna come abilità di classe
          };
        }
      }
    });
  }

  return updatedCharacter;
};

/**
 * Mappa il nome della caratteristica al suo codice
 */
const mapCharacteristicName = (characteristicName: string): string | null => {
  const mapping: Record<string, string> = {
    'FOR': 'for',
    'Forza': 'for',
    'COS': 'cos',
    'Costituzione': 'cos',
    'TAG': 'tag',
    'Taglia': 'tag',
    'INT': 'int',
    'Intelligenza': 'int',
    'MAN': 'man',
    'Manipolazione': 'man',
    'DES': 'des',
    'Destrezza': 'des',
    'FAS': 'fas',
    'Fascino': 'fas'
  };

  return mapping[characteristicName] || null;
};

/**
 * Trova la categoria e il nome dell'abilità basandosi sul nome
 */
const findCategoryAndSkill = (abilityName: string): { category: string | null; skillName: string | null } => {
  // Mappatura delle abilità alle loro categorie
  const abilityMapping: Record<string, { category: string; skillName: string }> = {
    'Arrampicarsi': { category: 'Agilità', skillName: 'Arrampicarsi' },
    'Saltare': { category: 'Agilità', skillName: 'Saltare' },
    'Nuotare': { category: 'Agilità', skillName: 'Nuotare' },
    'Schivare': { category: 'Agilità', skillName: 'Schivare' },
    'Cavalcare': { category: 'Agilità', skillName: 'Cavalcare' },
    'Cadere': { category: 'Agilità', skillName: 'Cadere' },
    
    'Reputazione': { category: 'Comunicazione', skillName: 'Reputazione' },
    'Persuasione': { category: 'Comunicazione', skillName: 'Persuasione' },
    'Oratoria': { category: 'Comunicazione', skillName: 'Oratoria' },
    'Cantare': { category: 'Comunicazione', skillName: 'Cantare' },

    'Arte': { category: 'Conoscenza', skillName: 'Arte' },
    'Pronto Soccorso': { category: 'Conoscenza', skillName: 'Pronto Soccorso' },
    'Memoria': { category: 'Conoscenza', skillName: 'Memoria' },
    'Navigazione': { category: 'Conoscenza', skillName: 'Navigazione' },
    'Conoscenza Veleni': { category: 'Conoscenza', skillName: 'Conoscenza Veleni' },
    'Conoscenza Musica': { category: 'Conoscenza', skillName: 'Conoscenza Musica' },
    'Conoscenza Piante': { category: 'Conoscenza', skillName: 'Conoscenza Piante' },
    'Valutare Tesori': { category: 'Conoscenza', skillName: 'Valutare Tesori' },
    'Cartografia': { category: 'Conoscenza', skillName: 'Cartografia' },

    'Lingua Comune': { category: 'Leggere-Scrivere/Parlare', skillName: 'Lingua Comune' },
    'Alto Melniboneano': { category: 'Leggere-Scrivere/Parlare', skillName: 'Alto Melniboneano' },
    'Tardo Melniboneano': { category: 'Leggere-Scrivere/Parlare', skillName: 'Tardo Melniboneano' },
    'Mabden': { category: 'Leggere-Scrivere/Parlare', skillName: 'Mabden' },
    'Mong': { category: 'Leggere-Scrivere/Parlare', skillName: 'Mong' },
    'Org': { category: 'Leggere-Scrivere/Parlare', skillName: 'Org' },
    'Pande': { category: 'Leggere-Scrivere/Parlare', skillName: 'Pande' },
    'Yuric': { category: 'Leggere-Scrivere/Parlare', skillName: 'Yuric' },

    'Giocoleria': { category: 'Manipolazione', skillName: 'Giocoleria' },
    'Prestidigitazione': { category: 'Manipolazione', skillName: 'Prestidigitazione' },
    'Trappole': { category: 'Manipolazione', skillName: 'Innescare/Disinnescare Trappole' },
    'Scassinare': { category: 'Manipolazione', skillName: 'Scassinare' },
    'Nodi': { category: 'Manipolazione', skillName: 'Fare/Disfare Nodi' },

    'Equilibrio': { category: 'Percezione', skillName: 'Equilibrio' },
    'Annusare': { category: 'Percezione', skillName: 'Annusare' },
    'Osservare': { category: 'Percezione', skillName: 'Osservare' },
    'Seguire Tracce': { category: 'Percezione', skillName: 'Seguire Tracce' },
    'Ascoltare': { category: 'Percezione', skillName: 'Ascoltare' },
    'Cercare': { category: 'Percezione', skillName: 'Cercare' },
    'Gustare': { category: 'Percezione', skillName: 'Gustare' },

    'Agguato': { category: 'Furtività', skillName: 'Agguato' },
    'Borseggiare': { category: 'Furtività', skillName: 'Borseggiare' },
    'Intrufolarsi': { category: 'Furtività', skillName: 'Intrufolarsi' },
    'Nascondere': { category: 'Furtività', skillName: 'Nascondere' },
    'Nascondersi': { category: 'Furtività', skillName: 'Nascondersi' },

    'Evocare': { category: 'Evocazione', skillName: 'Evocare' },
    'Evocazioni Memorizzate': { category: 'Evocazione', skillName: 'Evocazioni Memorizzate' }
  };

  const mapping = abilityMapping[abilityName];
  if (mapping) {
    return { category: mapping.category, skillName: mapping.skillName };
  }

  return { category: null, skillName: abilityName };
}; 