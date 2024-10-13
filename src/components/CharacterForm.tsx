import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Character, Equipment, Spell, Feature, CharacterClass } from '../types/character';
import { getCharacter, createCharacter, updateCharacter } from '../services/characterService';
import { calculateModifier, calculateProficiencyBonus } from '../utils/dndRules';
import EquipmentManager from './EquipmentManager';
import SpellbookManager from './SpellbookManager';
import CharacterPortrait from './CharacterPortrait';

const CharacterForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<Character>({
    id: 0,
    name: '',
    race: '',
    class: '',
    level: 1,
    experience: 0,
    background: '',
    alignment: '',
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
    proficiencyBonus: 2,
    hitPoints: 0,
    armorClass: 10,
    speed: 30,
    equipment: [],
    spells: [],
    features: [],
    personalityTraits: '',
    ideals: '',
    bonds: '',
    flaws: '',
    imageUrl: '',
    currency: { copper: 0, silver: 0, electrum: 0, gold: 0, platinum: 0 },
    spellSlots: {},
    classes: [{ name: '', level: 1 }],
  });

  useEffect(() => {
    if (id) {
      loadCharacter(parseInt(id));
    }
  }, [id]);

  const loadCharacter = async (characterId: number) => {
    const data = await getCharacter(characterId);
    setCharacter(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCharacter((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedCharacter = {
      ...character,
      proficiencyBonus: calculateProficiencyBonus(character.level),
      hitPoints: calculateHitPoints(character),
      armorClass: calculateArmorClass(character),
    };
    if (id) {
      await updateCharacter(parseInt(id), updatedCharacter);
    } else {
      await createCharacter(updatedCharacter);
    }
    navigate('/');
  };

  const handleEquipmentChange = (newEquipment: Equipment[]) => {
    setCharacter((prev) => ({ ...prev, equipment: newEquipment }));
  };

  const handleSpellsChange = (newSpells: Spell[]) => {
    setCharacter((prev) => ({ ...prev, spells: newSpells }));
  };

  const handleSpellSlotsChange = (newSpellSlots: Character['spellSlots']) => {
    setCharacter((prev) => ({ ...prev, spellSlots: newSpellSlots }));
  };

  const handleClassesChange = (index: number, field: keyof CharacterClass, value: string | number) => {
    setCharacter((prev) => {
      const newClasses = [...prev.classes];
      newClasses[index] = { ...newClasses[index], [field]: value };
      return { ...prev, classes: newClasses };
    });
  };

  const addCharacterClass = () => {
    setCharacter((prev) => ({
      ...prev,
      classes: [...prev.classes, { name: '', level: 1 }],
    }));
  };

  const removeCharacterClass = (index: number) => {
    setCharacter((prev) => ({
      ...prev,
      classes: prev.classes.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{id ? 'Edit' : 'Create'} Character</h1>
      
      <CharacterPortrait imageUrl={character.imageUrl} onImageChange={(url) => setCharacter(prev => ({ ...prev, imageUrl: url }))} />

      {/* Basic Information */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={character.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label htmlFor="race" className="block text-gray-700 font-bold mb-2">Race</label>
          <input
            type="text"
            id="race"
            name="race"
            value={character.race}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label htmlFor="background" className="block text-gray-700 font-bold mb-2">Background</label>
          <input
            type="text"
            id="background"
            name="background"
            value={character.background}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label htmlFor="alignment" className="block text-gray-700 font-bold mb-2">Alignment</label>
          <select
            id="alignment"
            name="alignment"
            value={character.alignment}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          >
            <option value="">Select Alignment</option>
            <option value="Lawful Good">Lawful Good</option>
            <option value="Neutral Good">Neutral Good</option>
            <option value="Chaotic Good">Chaotic Good</option>
            <option value="Lawful Neutral">Lawful Neutral</option>
            <option value="True Neutral">True Neutral</option>
            <option value="Chaotic Neutral">Chaotic Neutral</option>
            <option value="Lawful Evil">Lawful Evil</option>
            <option value="Neutral Evil">Neutral Evil</option>
            <option value="Chaotic Evil">Chaotic Evil</option>
          </select>
        </div>
      </div>

      {/* Classes */}
      <h2 className="text-2xl font-semibold mb-4">Classes</h2>
      {character.classes.map((characterClass, index) => (
        <div key={index} className="flex items-center space-x-4 mb-4">
          <input
            type="text"
            value={characterClass.name}
            onChange={(e) => handleClassesChange(index, 'name', e.target.value)}
            placeholder="Class name"
            className="flex-grow px-3 py-2 border rounded-lg"
          />
          <input
            type="number"
            value={characterClass.level}
            onChange={(e) => handleClassesChange(index, 'level', parseInt(e.target.value))}
            placeholder="Level"
            className="w-20 px-3 py-2 border rounded-lg"
            min="1"
            max="20"
          />
          <button
            type="button"
            onClick={() => removeCharacterClass(index)}
            className="text-red-500"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addCharacterClass}
        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 mb-6"
      >
        Add Class
      </button>

      {/* Ability Scores */}
      <h2 className="text-2xl font-semibold mb-4">Ability Scores</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].map((ability) => (
          <div key={ability}>
            <label htmlFor={ability} className="block text-gray-700 font-bold mb-2 capitalize">{ability}</label>
            <input
              type="number"
              id={ability}
              name={ability}
              value={character[ability as keyof Character]}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
              min="3"
              max="20"
            />
            <p className="text-sm text-gray-600 mt-1">
              Modifier: {calculateModifier(character[ability as keyof Character] as number)}
            </p>
          </div>
        ))}
      </div>

      {/* Equipment */}
      <EquipmentManager
        equipment={character.equipment}
        onEquipmentChange={handleEquipmentChange}
      />

      {/* Spells */}
      <SpellbookManager
        spells={character.spells}
        onSpellsChange={handleSpellsChange}
        spellSlots={character.spellSlots}
        onSpellSlotsChange={handleSpellSlotsChange}
      />

      {/* Features */}
      <h2 className="text-2xl font-semibold mb-4">Features</h2>
      {character.features.map((feature, index) => (
        <div key={feature.id} className="mb-4 p-4 border rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2">Name</label>
              <input
                type="text"
                value={feature.name}
                onChange={(e) => {
                  const updatedFeatures = [...character.features];
                  updatedFeatures[index].name = e.target.value;
                  setCharacter(prev => ({ ...prev, features: updatedFeatures }));
                }}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">Source</label>
              <select
                value={feature.source}
                onChange={(e) => {
                  const updatedFeatures = [...character.features];
                  updatedFeatures[index].source = e.target.value as 'Race' | 'Class' | 'Background' | 'Feat';
                  setCharacter(prev => ({ ...prev, features: updatedFeatures }));
                }}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="Race">Race</option>
                <option value="Class">Class</option>
                <option value="Background">Background</option>
                <option value="Feat">Feat</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-gray-700 font-bold mb-2">Description</label>
              <textarea
                value={feature.description}
                onChange={(e) => {
                  const updatedFeatures = [...character.features];
                  updatedFeatures[index].description = e.target.value;
                  setCharacter(prev => ({ ...prev, features: updatedFeatures }));
                }}
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
                required
              />
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setCharacter(prev => ({
          ...prev,
          features: [...prev.features, { id: Date.now(), name: '', source: 'Class', description: '' }]
        }))}
        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 mb-6"
      >
        Add Feature
      </button>

      {/* Personality Traits */}
      <h2 className="text-2xl font-semibold mb-4">Personality</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="personalityTraits" className="block text-gray-700 font-bold mb-2">Personality Traits</label>
          <textarea
            id="personalityTraits"
            name="personalityTraits"
            value={character.personalityTraits}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            rows={3}
          />
        </div>
        <div>
          <label htmlFor="ideals" className="block text-gray-700 font-bold mb-2">Ideals</label>
          <textarea
            id="ideals"
            name="ideals"
            value={character.ideals}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            rows={3}
          />
        </div>
        <div>
          <label htmlFor="bonds" className="block text-gray-700 font-bold mb-2">Bonds</label>
          <textarea
            id="bonds"
            name="bonds"
            value={character.bonds}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            rows={3}
          />
        </div>
        <div>
          <label htmlFor="flaws" className="block text-gray-700 font-bold mb-2">Flaws</label>
          <textarea
            id="flaws"
            name="flaws"
            value={character.flaws}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            rows={3}
          />
        </div>
      </div>

      {/* Currency */}
      <h2 className="text-2xl font-semibold mb-4">Currency</h2>
      <div className="grid grid-cols-5 gap-4 mb-6">
        {Object.entries(character.currency).map(([coin, amount]) => (
          <div key={coin}>
            <label htmlFor={coin} className="block text-gray-700 font-bold mb-2 capitalize">{coin}</label>
            <input
              type="number"
              id={coin}
              name={`currency.${coin}`}
              value={amount}
              onChange={(e) => setCharacter(prev => ({
                ...prev,
                currency: { ...prev.currency, [coin]: parseInt(e.target.value) }
              }))}
              className="w-full px-3 py-2 border rounded-lg"
              min="0"
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        {id ? 'Update' : 'Create'} Character
      </button>
    </form>
  );
};

export default CharacterForm;