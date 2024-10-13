import { Character } from '../types/character';

// Simulating API calls with local storage for now
const STORAGE_KEY = 'dnd_characters';

export const getAllCharacters = async (): Promise<Character[]> => {
  const characters = localStorage.getItem(STORAGE_KEY);
  return characters ? JSON.parse(characters) : [];
};

export const getCharacter = async (id: number): Promise<Character | null> => {
  const characters = await getAllCharacters();
  return characters.find((c) => c.id === id) || null;
};

export const createCharacter = async (character: Omit<Character, 'id'>): Promise<Character> => {
  const characters = await getAllCharacters();
  const newCharacter = { ...character, id: Date.now() };
  characters.push(newCharacter);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
  return newCharacter;
};

export const updateCharacter = async (id: number, character: Character): Promise<Character> => {
  const characters = await getAllCharacters();
  const index = characters.findIndex((c) => c.id === id);
  if (index !== -1) {
    characters[index] = { ...character, id };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
    return characters[index];
  }
  throw new Error('Character not found');
};

export const deleteCharacter = async (id: number): Promise<void> => {
  const characters = await getAllCharacters();
  const updatedCharacters = characters.filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCharacters));
};