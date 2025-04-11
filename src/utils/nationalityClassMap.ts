/**
 * Mappa delle classi predefinite per nazionalità
 * Quando un giocatore seleziona una di queste nazionalità, 
 * la classe corrispondente viene assegnata automaticamente
 */
export const NATIONALITY_CLASS_MAP: Record<string, string[]> = {
  'Pan Tang': ['Sacerdote'],
  'Nadsokor': ['Mendicante'],
  'Eshmir': ['Sacerdote']
};

/**
 * Verifica se la nazionalità è Melniboné
 * @param nationality Nome della nazionalità da verificare
 * @returns true se la nazionalità è Melniboné
 */
export function isMelnibonean(nationality: string): boolean {
  if (!nationality) return false;
  
  const normalizedNationality = nationality.toLowerCase();
  return normalizedNationality === 'melniboné' || 
         normalizedNationality === 'melnibonean' || 
         normalizedNationality === 'melnibonè' || 
         normalizedNationality === 'melnibone' ||
         normalizedNationality.includes('melnib');
}

/**
 * Verifica se la nazionalità è Solitudine Piangente
 * @param nationality Nome della nazionalità da verificare
 * @returns true se la nazionalità è Solitudine Piangente
 */
export function isWeepingWaste(nationality: string): boolean {
  if (!nationality) return false;
  
  const normalizedNationality = nationality.toLowerCase();
  return normalizedNationality === 'solitudine piangente' || 
         normalizedNationality === 'weeping waste' || 
         normalizedNationality === 'solitudine' ||
         normalizedNationality.includes('piangente') ||
         normalizedNationality.includes('weeping');
}

/**
 * Verifica se la nazionalità è Pan Tang
 * @param nationality Nome della nazionalità da verificare
 * @returns true se la nazionalità è Pan Tang
 */
export function isPanTang(nationality: string): boolean {
  if (!nationality) return false;
  
  const normalizedNationality = nationality.toLowerCase();
  return normalizedNationality === 'pan tang' || 
         normalizedNationality === 'pantang' || 
         normalizedNationality.includes('pan tang') ||
         normalizedNationality.includes('pantang');
}

/**
 * Ottiene le classi per Melniboné: sempre Nobile e Guerriero
 * @returns Array contenente Nobile e Guerriero
 */
export function getMelniboneanClasses(): string[] {
  return ['Nobile', 'Guerriero'];
}

/**
 * Ottiene le classi per Solitudine Piangente: sempre Guerriero e Cacciatore
 * @returns Array contenente Guerriero e Cacciatore
 */
export function getWeepingWasteClasses(): string[] {
  return ['Guerriero', 'Cacciatore'];
}

/**
 * Ottiene le classi per Pan Tang: Sacerdote e Guerriero
 * @returns Array contenente Sacerdote e Guerriero
 */
export function getPanTangClasses(): string[] {
  return ['Sacerdote', 'Guerriero'];
}

/**
 * Restituisce la classe predefinita per una determinata nazionalità
 * @param nationality Nome della nazionalità
 * @param index Indice della classe da restituire (0 = prima classe, 1 = seconda classe)
 * @returns Nome della classe predefinita o null se non esiste
 */
export function getDefaultClassForNationality(nationality: string, index: number = 0): string | null {
  if (!nationality) return null;
  
  // Caso speciale per Melniboné
  if (isMelnibonean(nationality)) {
    const classes = getMelniboneanClasses();
    return classes.length > index ? classes[index] : classes[0];
  }
  
  // Caso speciale per Solitudine Piangente
  if (isWeepingWaste(nationality)) {
    const classes = getWeepingWasteClasses();
    return classes.length > index ? classes[index] : classes[0];
  }
  
  // Caso speciale per Pan Tang
  if (isPanTang(nationality)) {
    const classes = getPanTangClasses();
    return classes.length > index ? classes[index] : classes[0];
  }
  
  // Cerca corrispondenze esatte
  if (NATIONALITY_CLASS_MAP[nationality]) {
    const classes = NATIONALITY_CLASS_MAP[nationality];
    return classes.length > index ? classes[index] : classes[0];
  }
  
  // Cerca nella mappa ignorando case
  const normalizedNationality = nationality.toLowerCase();
  for (const [key, classes] of Object.entries(NATIONALITY_CLASS_MAP)) {
    if (key.toLowerCase() === normalizedNationality) {
      return classes.length > index ? classes[index] : classes[0];
    }
  }
  
  // Cerca corrispondenze parziali
  for (const [key, classes] of Object.entries(NATIONALITY_CLASS_MAP)) {
    if (normalizedNationality.includes(key.toLowerCase()) || 
        key.toLowerCase().includes(normalizedNationality)) {
      return classes.length > index ? classes[index] : classes[0];
    }
  }
  
  return null;
}

/**
 * Ottiene tutte le classi predefinite per una nazionalità
 * @param nationality Nome della nazionalità
 * @returns Array di classi predefinite per la nazionalità
 */
export function getAllDefaultClassesForNationality(nationality: string): string[] {
  if (!nationality) return [];
  
  // Caso speciale per Melniboné
  if (isMelnibonean(nationality)) {
    return getMelniboneanClasses();
  }
  
  // Caso speciale per Solitudine Piangente
  if (isWeepingWaste(nationality)) {
    return getWeepingWasteClasses();
  }
  
  // Caso speciale per Pan Tang
  if (isPanTang(nationality)) {
    return getPanTangClasses();
  }
  
  // Cerca corrispondenze esatte
  if (NATIONALITY_CLASS_MAP[nationality]) {
    return NATIONALITY_CLASS_MAP[nationality];
  }
  
  // Cerca nella mappa ignorando case
  const normalizedNationality = nationality.toLowerCase();
  for (const [key, classes] of Object.entries(NATIONALITY_CLASS_MAP)) {
    if (key.toLowerCase() === normalizedNationality) {
      return classes;
    }
  }
  
  // Cerca corrispondenze parziali
  for (const [key, classes] of Object.entries(NATIONALITY_CLASS_MAP)) {
    if (normalizedNationality.includes(key.toLowerCase()) || 
        key.toLowerCase().includes(normalizedNationality)) {
      return classes;
    }
  }
  
  return [];
}

/**
 * Determina se una nazionalità ha una classe predefinita
 * @param nationality Nome della nazionalità
 * @returns true se la nazionalità ha una classe predefinita
 */
export function hasDefaultClass(nationality: string): boolean {
  // Caso speciale per Melniboné
  if (isMelnibonean(nationality)) {
    return true;
  }
  
  // Caso speciale per Solitudine Piangente
  if (isWeepingWaste(nationality)) {
    return true;
  }
  
  // Caso speciale per Pan Tang
  if (isPanTang(nationality)) {
    return true;
  }
  
  return getDefaultClassForNationality(nationality) !== null;
}

/**
 * Determina se una nazionalità ha classi multiple predefinite
 * @param nationality Nome della nazionalità
 * @returns true se la nazionalità ha più di una classe predefinita
 */
export function hasMultipleDefaultClasses(nationality: string): boolean {
  // Per Melniboné, Solitudine Piangente e Pan Tang sappiamo già che hanno più classi
  if (isMelnibonean(nationality) || isWeepingWaste(nationality) || isPanTang(nationality)) {
    return true;
  }
  
  // Per altre nazionalità, controlla il numero di classi nella mappa
  const classes = getAllDefaultClassesForNationality(nationality);
  return classes.length > 1;
}

/**
 * Ottiene il valore numerico per selezionare una classe specifica
 * @param className Nome della classe
 * @returns Valore numerico per la classe specificata o null se non trovata
 */
export function getNumberForClass(className: string): number | null {
  if (!className) return null;
  
  const classRanges = [
    { min: 1, max: 20, name: 'Guerriero' },
    { min: 21, max: 30, name: 'Mercante' },
    { min: 31, max: 45, name: 'Marinaio' },
    { min: 46, max: 60, name: 'Cacciatore' },
    { min: 61, max: 65, name: 'Agricoltore' },
    { min: 66, max: 70, name: 'Sacerdote' },
    { min: 71, max: 75, name: 'Nobile' },
    { min: 76, max: 85, name: 'Ladro' },
    { min: 86, max: 90, name: 'Mendicante' },
    { min: 91, max: 100, name: 'Artigiano' },
  ];
  
  // Cerca corrispondenze esatte
  const classRange = classRanges.find(range => 
    range.name.toLowerCase() === className.toLowerCase()
  );
  
  if (classRange) {
    // Restituisce il valore medio del range
    return Math.floor((classRange.min + classRange.max) / 2);
  }
  
  return null;
} 