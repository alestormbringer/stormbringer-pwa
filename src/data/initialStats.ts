import { Character } from '@/types/gameData';

export const initialCharacteristics: Character['characteristics'] = {
  // Identità
  nome: { name: 'Nome' },
  sesso: { name: 'Sesso' },
  eta: { name: 'Età' },
  nazionalita: { name: 'Nazionalità' },
  classe: { name: 'Classe' },
  culto: { name: 'Culto' },
  elan: { name: 'Elan' },
  descrizione: { name: 'Descrizione' },

  // Caratteristiche Base
  for: { name: 'FOR', baseValue: 0 },
  cos: { name: 'COS', baseValue: 0 },
  tag: { name: 'TAG', baseValue: 0 },
  int: { name: 'INT', baseValue: 0 },
  man: { name: 'MAN', baseValue: 0 },
  des: { name: 'DES', baseValue: 0 },
  fas: { name: 'FAS', baseValue: 0 },

  // Combattimento
  armatura: { name: 'Armatura' },
  protezione: { name: 'Protezione' },
  feritaGrave: { name: 'Ferita Grave' },
  puntiFerita: { name: 'Punti Ferita' },
  oggetti: { name: 'Oggetti' },

  // Armi
  arma1: { name: 'Arma 1', description: 'Bonus / Att.% / Danno / Par.%' },
  arma2: { name: 'Arma 2', description: 'Bonus / Att.% / Danno / Par.%' },
  arma3: { name: 'Arma 3', description: 'Bonus / Att.% / Danno / Par.%' },

  // Agilità
  arrampicarsi: { name: 'Arrampicarsi', baseValue: 0 },
  saltare: { name: 'Saltare', baseValue: 0 },
  nuotare: { name: 'Nuotare', baseValue: 0 },
  schivare: { name: 'Schivare', baseValue: 0 },
  cavalcare: { name: 'Cavalcare', baseValue: 0 },
  cadere: { name: 'Cadere', baseValue: 0 },

  // Comunicazione
  reputazione: { name: 'Reputazione', baseValue: 0 },
  persuasione: { name: 'Persuasione', baseValue: 0 },
  oratoria: { name: 'Oratoria', baseValue: 0 },
  cantare: { name: 'Cantare', baseValue: 0 },

  // Conoscenza
  arte: { name: 'Arte', baseValue: 0 },
  prontoSoccorso: { name: 'Pronto Soccorso', baseValue: 0 },
  memoria: { name: 'Memoria', baseValue: 0 },
  navigazione: { name: 'Navigazione', baseValue: 0 },
  conoscenzaVeleni: { name: 'Conoscenza Veleni', baseValue: 0 },
  valutareTesori: { name: 'Valutare Tesori', baseValue: 0 },
  cartografia: { name: 'Cartografia', baseValue: 0 },
  conoscenzaMusica: { name: 'Conoscenza Musica', baseValue: 0 },
  conoscenzaPiante: { name: 'Conoscenza Piante', baseValue: 0 },

  // Leggere-Scrivere/Parlare
  linguaComune: { name: 'Lingua Comune', baseValue: 0 },
  altoMelniboneano: { name: 'Alto Melniboneano', baseValue: 0 },
  tardoMelniboneano: { name: 'Tardo Melniboneano', baseValue: 0 },
  mabden: { name: 'Mabden', baseValue: 0 },
  mong: { name: 'Mong', baseValue: 0 },
  org: { name: 'Org', baseValue: 0 },
  pande: { name: 'Pande', baseValue: 0 },
  yuric: { name: 'Yuric', baseValue: 0 },

  // Manipolazione
  giocoleria: { name: 'Giocoleria', baseValue: 0 },
  prestidigitazione: { name: 'Prestidigitazione', baseValue: 0 },
  trappole: { name: 'Trappole', baseValue: 0 },
  scassinare: { name: 'Scassinare', baseValue: 0 },
  nodi: { name: 'Nodi', baseValue: 0 },

  // Percezione
  equilibrio: { name: 'Equilibrio', baseValue: 0 },
  annusare: { name: 'Annusare', baseValue: 0 },
  osservare: { name: 'Osservare', baseValue: 0 },
  seguireTracce: { name: 'Seguire Tracce', baseValue: 0 },
  ascoltare: { name: 'Ascoltare', baseValue: 0 },
  cercare: { name: 'Cercare', baseValue: 0 },
  gustare: { name: 'Gustare', baseValue: 0 },

  // Furtività
  agguato: { name: 'Agguato', baseValue: 0 },
  borseggiare: { name: 'Borseggiare', baseValue: 0 },
  nascondere: { name: 'Nascondere', baseValue: 0 },
  nascondersi: { name: 'Nascondersi', baseValue: 0 },

  // Evocazione
  evocare: { name: 'Evocare', baseValue: 0 },
};

export const initialCustomStats: Character['customStats'] = {
  // Agilità
  'Agilità': {
    _categoryValue: { name: "Valore Categoria", baseValue: 0 },
    arrampicarsi: { name: 'Arrampicarsi', baseValue: 0, checked: false },
    saltare: { name: 'Saltare', baseValue: 0, checked: false },
    nuotare: { name: 'Nuotare', baseValue: 0, checked: false },
    schivare: { name: 'Schivare', baseValue: 0, checked: false },
    cavalcare: { name: 'Cavalcare', baseValue: 0, checked: false },
    cadere: { name: 'Cadere', baseValue: 0, checked: false },
  },

  // Comunicazione
  'Comunicazione': {
    _categoryValue: { name: "Valore Categoria", baseValue: 0 },
    reputazione: { name: 'Reputazione', baseValue: 0, checked: false },
    persuasione: { name: 'Persuasione', baseValue: 0, checked: false },
    oratoria: { name: 'Oratoria', baseValue: 0, checked: false },
    cantare: { name: 'Cantare', baseValue: 0, checked: false },
  },

  // Conoscenza
  'Conoscenza': {
    _categoryValue: { name: "Valore Categoria", baseValue: 0 },
    arte: { name: 'Arte', baseValue: 0, checked: false },
    prontoSoccorso: { name: 'Pronto Soccorso', baseValue: 0, checked: false },
    memoria: { name: 'Memoria', baseValue: 0, checked: false },
    navigazione: { name: 'Navigazione', baseValue: 0, checked: false },
    conoscenzaVeleni: { name: 'Conoscenza Veleni', baseValue: 0, checked: false },
    conoscenzaMusica: { name: 'Conoscenza Musica', baseValue: 0, checked: false },
    conoscenzaPiante: { name: 'Conoscenza Piante', baseValue: 0, checked: false },
    valutareTesori: { name: 'Valutare Tesori', baseValue: 0, checked: false },
    cartografia: { name: 'Cartografia', baseValue: 0, checked: false },
  },

  // Leggere-Scrivere/Parlare
  'Leggere-Scrivere/Parlare': {
    _categoryValue: { name: "Valore Categoria", baseValue: 0 },
    linguaComune: { name: 'Lingua Comune', baseValue: 0, baseValue2: 0, checked: false },
    altoMelniboneano: { name: 'Alto Melniboneano', baseValue: 0, baseValue2: 0, checked: false },
    tardoMelniboneano: { name: 'Tardo Melniboneano', baseValue: 0, baseValue2: 0, checked: false },
    mabden: { name: 'Mabden', baseValue: 0, baseValue2: 0, checked: false },
    mong: { name: 'Mong', baseValue: 0, baseValue2: 0, checked: false },
    org: { name: 'Org', baseValue: 0, baseValue2: 0, checked: false },
    pande: { name: 'Pande', baseValue: 0, baseValue2: 0, checked: false },
    yuric: { name: 'Yuric', baseValue: 0, baseValue2: 0, checked: false },
  },

  // Manipolazione
  'Manipolazione': {
    _categoryValue: { name: "Valore Categoria", baseValue: 0 },
    giocoleria: { name: 'Giocoleria', baseValue: 0, checked: false },
    prestidigitazione: { name: 'Prestidigitazione', baseValue: 0, checked: false },
    trappole: { name: 'Innescare/Disinnescare Trappole', baseValue: 0, checked: false },
    scassinare: { name: 'Scassinare', baseValue: 0, checked: false },
    nodi: { name: 'Fare/Disfare Nodi', baseValue: 0, checked: false },
  },

  // Percezione
  'Percezione': {
    _categoryValue: { name: "Valore Categoria", baseValue: 0 },
    equilibrio: { name: 'Equilibrio', baseValue: 0, checked: false },
    annusare: { name: 'Annusare', baseValue: 0, checked: false },
    osservare: { name: 'Osservare', baseValue: 0, checked: false },
    seguireTracce: { name: 'Seguire Tracce', baseValue: 0, checked: false },
    ascoltare: { name: 'Ascoltare', baseValue: 0, checked: false },
    cercare: { name: 'Cercare', baseValue: 0, checked: false },
    gustare: { name: 'Gustare', baseValue: 0, checked: false },
  },

  // Furtività
  'Furtività': {
    _categoryValue: { name: "Valore Categoria", baseValue: 0 },
    agguato: { name: 'Agguato', baseValue: 0, checked: false },
    borseggiare: { name: 'Borseggiare', baseValue: 0, checked: false },
    intrufolarsi: { name: 'Intrufolarsi', baseValue: 0, checked: false },
    nascondere: { name: 'Nascondere', baseValue: 0, checked: false },
    nascondersi: { name: 'Nascondersi', baseValue: 0, checked: false },
  },

  // Evocazione
  'Evocazione': {
    _categoryValue: { name: "Valore Categoria", baseValue: 0 },
    evocare: { name: 'Evocare', baseValue: 0, checked: false },
    evocazioniMemorizzate: { name: 'Evocazioni Memorizzate', baseValue: 0, checked: false },
  },
};

export const initialCharacter: Omit<Character, 'id'> = {
  // Tabella 1: Informazioni base
  name: '',
  sex: '',
  age: 0,
  nationality: '',
  class: '',
  cult: '',
  elan: '',
  description: '',
  handicap: '',
  
  // Tabella 2: Caratteristiche base
  characteristics: initialCharacteristics,
  
  // Tabella 3: Protezione
  armor: '',
  protection: 0,
  seriousWound: 0,
  hitPoints: 0,
  
  // Tabella 4: Equipaggiamento e denaro
  equipment: [],
  inventory: [],
  money: '',
  
  // Tabella 5: Armi
  weapons: [],
  
  // Tabella 6: Abilità per categoria
  customStats: initialCustomStats,
  
  level: 1,
  notes: '',
}; 