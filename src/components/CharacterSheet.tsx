import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Character } from '../types/character';
import { getCharacter } from '../services/characterService';
import { calculateModifier, calculateProficiencyBonus } from '../utils/dndRules';
import DiceRoller from './DiceRoller';
import EquipmentManager from './EquipmentManager';
import SpellbookManager from './SpellbookManager';
import CharacterPortrait from './CharacterPortrait';

const CharacterSheet: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [character, setCharacter] = useState<Character | null>(null);

  useEffect(() => {
    if (id) {
      loadCharacter(parseInt(id));
    }
  }, [id]);

  const loadCharacter = async (characterId: number) => {
    const data = await getCharacter(characterId);
    setCharacter(data);
  };

  const handleEquipmentChange = (newEquipment: Character['equipment']) => {
    if (character) {
      setCharacter({ ...character, equipment: newEquipment });
    }
  };

  const handleSpellsChange = (newSpells: Character['spells']) => {
    if (character) {
      setCharacter({ ...character, spells: newSpells });
    }
  };

  const handleSpellSlotsChange = (newSpellSlots: Character['spellSlots']) => {
    if (character) {
      setCharacter({ ...character, spellSlots: newSpellSlots });
    }
  };

  const handleImageChange = (newImageUrl: string) => {
    if (character) {
      setCharacter({ ...character, imageUrl: newImageUrl });
    }
  };

  if (!character) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{character.name}</h1>
          <p className="text-xl mb-2">
            {character.classes.map(c => `${c.name} ${c.level}`).join(' / ')}
          </p>
          <p className="text-gray-600">
            {character.race} | {character.background} | {character.alignment}
          </p>
        </div>
        <CharacterPortrait imageUrl={character.imageUrl} onImageChange={handleImageChange} />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Ability Scores</h2>
          <div className="grid grid-cols-3 gap-4">
            {['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].map((ability) => (
              <div key={ability} className="bg-gray-100 p-4 rounded-lg text-center">
                <h3 className="text-lg font-semibold capitalize">{ability}</h3>
                <p className="text-3xl font-bold">{character[ability as keyof Character]}</p>
                <p className="text-lg">
                  {calculateModifier(character[ability as keyof Character] as number) >= 0 ? '+' : ''}
                  {calculateModifier(character[ability as keyof Character] as number)}
                </p>
                <DiceRoller
                  modifier={calculateModifier(character[ability as keyof Character] as number)}
                  label={`${ability.charAt(0).toUpperCase() + ability.slice(1)} Check`}
                />
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-semibold mt-6 mb-4">Combat</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold">Armor Class</h3>
              <p className="text-3xl font-bold">{character.armorClass}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold">Hit Points</h3>
              <p className="text-3xl font-bold">{character.hitPoints}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold">Speed</h3>
              <p className="text-3xl font-bold">{character.speed} ft</p>
            </div>
          </div>

          <EquipmentManager
            equipment={character.equipment}
            onEquipmentChange={handleEquipmentChange}
          />

          <h2 className="text-2xl font-semibold mt-6 mb-4">Currency</h2>
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(character.currency).map(([coin, amount]) => (
              <div key={coin} className="bg-gray-100 p-2 rounded-lg text-center">
                <h3 className="text-sm font-semibold capitalize">{coin}</h3>
                <p className="text-lg font-bold">{amount}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          {character.features.map((feature) => (
            <div key={feature.id} className="mb-4">
              <h3 className="text-lg font-semibold">{feature.name} <span className="text-sm font-normal">({feature.source})</span></h3>
              <p className="text-gray-700">{feature.description}</p>
            </div>
          ))}

          <SpellbookManager
            spells={character.spells}
            onSpellsChange={handleSpellsChange}
            spellSlots={character.spellSlots}
            onSpellSlotsChange={handleSpellSlotsChange}
          />

          <h2 className="text-2xl font-semibold mt-6 mb-4">Personality</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold">Personality Traits</h3>
              <p className="text-gray-700">{character.personalityTraits}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Ideals</h3>
              <p className="text-gray-700">{character.ideals}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Bonds</h3>
              <p className="text-gray-700">{character.bonds}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Flaws</h3>
              <p className="text-gray-700">{character.flaws}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterSheet;