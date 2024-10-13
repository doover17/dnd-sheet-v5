export interface Character {
  id: number;
  name: string;
  race: string;
  class: string;
  level: number;
  experience: number;
  background: string;
  alignment: string;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  proficiencyBonus: number;
  hitPoints: number;
  armorClass: number;
  speed: number;
  equipment: Equipment[];
  spells: Spell[];
  features: Feature[];
  personalityTraits: string;
  ideals: string;
  bonds: string;
  flaws: string;
  imageUrl: string;
  currency: Currency;
  spellSlots: { [key: number]: { total: number; used: number } };
  classes: CharacterClass[];
}

export interface Equipment {
  id: number;
  name: string;
  type: 'Weapon' | 'Armor' | 'Item';
  quantity: number;
  weight: number;
  description: string;
}

export interface Spell {
  id: number;
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  description: string;
}

export interface Feature {
  id: number;
  name: string;
  source: 'Race' | 'Class' | 'Background' | 'Feat';
  description: string;
}

export interface ClassFeature extends Feature {
  level: number;
}

export interface Currency {
  copper: number;
  silver: number;
  electrum: number;
  gold: number;
  platinum: number;
}

export interface CharacterClass {
  name: string;
  level: number;
}