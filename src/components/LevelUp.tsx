import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Character, ClassFeature } from '../types/character';
import { getCharacter, updateCharacter } from '../services/characterService';
import { calculateModifier, calculateProficiencyBonus } from '../utils/dndRules';
import ClassFeatures from './ClassFeatures';

const LevelUp: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<Character | null>(null);
  const [newAbilityScores, setNewAbilityScores] = useState<{ [key: string]: number }>({});
  const [newFeatures, setNewFeatures] = useState<ClassFeature[]>([]);
  const [selectedFeat, setSelectedFeat] = useState<string>('');

  useEffect(() => {
    if (id) {
      loadCharacter(parseInt(id));
    }
  }, [id]);

  const loadCharacter = async (characterId: number) => {
    const data = await getCharacter(characterId);
    setCharacter(data);
    setNewAbilityScores({
      strength: data.strength,
      dexterity: data.dexterity,
      constitution: data.constitution,
      intelligence: data.intelligence,
      wisdom: data.wisdom,
      charisma: data.charisma,
    });
  };

  const handleAbilityScoreChange = (ability: string, value: number) => {
    setNewAbilityScores((prev) => ({ ...prev, [ability]: value }));
  };

  const handleLevelUp = async () => {
    if (character) {
      const updatedCharacter: Character = {
        ...character,
        level: character.level + 1,
        ...newAbilityScores,
        proficiencyBonus: calculateProficiencyBonus(character.level + 1),
        features: [...character.features, ...newFeatures],
      };

      if (selectedFeat) {
        updatedCharacter.features.push({
          id: Date.now(),
          name: selectedFeat,
          description: 'New feat gained during level up',
          source: 'Feat',
        });
      }

      // Update hit points (simplified calculation)
      const constitutionModifier = calculateModifier(updatedCharacter.constitution);
      const hitDiceValue = 6; // Assuming d6 hit dice, adjust as needed
      updatedCharacter.hitPoints += Math.max(1, Math.floor(hitDiceValue / 2) + 1 + constitutionModifier);

      await updateCharacter(character.id, updatedCharacter);
      navigate(`/character/${character.id}`);
    }
  };

  if (!character) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Level Up {character.name}</h1>
      <p className="mb-4">Current Level: {character.level}</p>
      <p className="mb-4">New Level: {character.level + 1}</p>

      <h2 className="text-2xl font-semibold mb-4">Ability Scores</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {Object.entries(newAbilityScores).map(([ability, score]) => (
          <div key={ability}>
            <label htmlFor={ability} className="block text-gray-700 font-bold mb-2 capitalize">
              {ability}
            </label>
            <input
              type="number"
              id={ability}
              value={score}
              onChange={(e) => handleAbilityScoreChange(ability, parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg"
              min={character[ability as keyof Character]}
              max={20}
            />
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mb-4">New Class Features</h2>
      <ClassFeatures features={newFeatures} onFeaturesChange={setNewFeatures} />

      <h2 className="text-2xl font-semibold mb-4">Select a Feat (Optional)</h2>
      <select
        value={selectedFeat}
        onChange={(e) => setSelectedFeat(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg mb-6"
      >
        <option value="">Select a feat</option>
        <option value="Alert">Alert</option>
        <option value="Athlete">Athlete</option>
        <option value="Charger">Charger</option>
        <option value="Lucky">Lucky</option>
        <option value="Tough">Tough</option>
      </select>

      <button
        onClick={handleLevelUp}
        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
      >
        Confirm Level Up
      </button>
    </div>
  );
};

export default LevelUp;