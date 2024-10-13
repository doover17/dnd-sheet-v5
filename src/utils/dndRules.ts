import { Character } from '../types/character';

export const calculateModifier = (score: number): number => {
  return Math.floor((score - 10) / 2);
};

export const calculateProficiencyBonus = (level: number): number => {
  return Math.floor((level - 1) / 4) + 2;
};

export const calculateHitPoints = (character: Character): number => {
  const constitutionModifier = calculateModifier(character.constitution);
  const hitDice = getHitDiceByClass(character.class);
  return hitDice + constitutionModifier + (character.level - 1) * (Math.floor(hitDice / 2) + 1 + constitutionModifier);
};

export const calculateArmorClass = (character: Character): number => {
  const dexterityModifier = calculateModifier(character.dexterity);
  const baseAC = 10 + dexterityModifier;
  
  const armor = character.equipment.find(item => item.type === 'Armor');
  if (armor) {
    // This is a simplified calculation. In a real app, you'd have more complex logic based on armor type.
    return Math.max(baseAC, 14 + Math.min(dexterityModifier, 2)); // Assuming medium armor
  }
  
  return baseAC;
};

const getHitDiceByClass = (characterClass: string): number => {
  const hitDiceMap: { [key: string]: number } = {
    'Barbarian': 12,
    'Fighter': 10,
    'Paladin': 10,
    'Ranger': 10,
    'Sorcerer': 6,
    'Wizard': 6,
    'Bard': 8,
    'Cleric': 8,
    'Druid': 8,
    'Monk': 8,
    'Rogue': 8,
    'Warlock': 8
  };
  return hitDiceMap[characterClass] || 8; // Default to d8 if class not found
};