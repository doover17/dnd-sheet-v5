import React, { useState } from 'react';
import { Spell } from '../types/character';

interface SpellbookManagerProps {
  spells: Spell[];
  onSpellsChange: (newSpells: Spell[]) => void;
  spellSlots: { [key: number]: { total: number; used: number } };
  onSpellSlotsChange: (newSpellSlots: { [key: number]: { total: number; used: number } }) => void;
}

const SpellbookManager: React.FC<SpellbookManagerProps> = ({ spells, onSpellsChange, spellSlots, onSpellSlotsChange }) => {
  const [newSpell, setNewSpell] = useState<Spell>({
    id: 0,
    name: '',
    level: 0,
    school: '',
    castingTime: '',
    range: '',
    components: '',
    duration: '',
    description: '',
  });

  const addSpell = () => {
    const updatedSpells = [...spells, { ...newSpell, id: Date.now() }];
    onSpellsChange(updatedSpells);
    setNewSpell({ id: 0, name: '', level: 0, school: '', castingTime: '', range: '', components: '', duration: '', description: '' });
  };

  const removeSpell = (id: number) => {
    const updatedSpells = spells.filter(spell => spell.id !== id);
    onSpellsChange(updatedSpells);
  };

  const useSpellSlot = (level: number) => {
    if (spellSlots[level].used < spellSlots[level].total) {
      const newSpellSlots = {
        ...spellSlots,
        [level]: { ...spellSlots[level], used: spellSlots[level].used + 1 },
      };
      onSpellSlotsChange(newSpellSlots);
    }
  };

  const resetSpellSlots = () => {
    const resetSlots = Object.fromEntries(
      Object.entries(spellSlots).map(([level, slot]) => [level, { ...slot, used: 0 }])
    );
    onSpellSlotsChange(resetSlots);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">Spellbook</h3>
      <div className="mb-4">
        <input
          type="text"
          value={newSpell.name}
          onChange={(e) => setNewSpell({ ...newSpell, name: e.target.value })}
          placeholder="Spell name"
          className="mr-2 p-1 border rounded"
        />
        <input
          type="number"
          value={newSpell.level}
          onChange={(e) => setNewSpell({ ...newSpell, level: parseInt(e.target.value) })}
          placeholder="Level"
          className="mr-2 p-1 border rounded w-20"
        />
        <button onClick={addSpell} className="bg-green-500 text-white px-2 py-1 rounded">Add Spell</button>
      </div>
      <div className="mb-4">
        <h4 className="font-semibold">Spell Slots</h4>
        {Object.entries(spellSlots).map(([level, slot]) => (
          <div key={level} className="flex items-center space-x-2 mb-1">
            <span>Level {level}:</span>
            <span>{slot.used}/{slot.total}</span>
            <button
              onClick={() => useSpellSlot(parseInt(level))}
              className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
              disabled={slot.used >= slot.total}
            >
              Use
            </button>
          </div>
        ))}
        <button onClick={resetSpellSlots} className="bg-gray-500 text-white px-2 py-1 rounded text-sm">Reset Slots</button>
      </div>
      <ul>
        {spells.map((spell) => (
          <li key={spell.id} className="flex justify-between items-center mb-2">
            <span>{spell.name} (Level {spell.level})</span>
            <button onClick={() => removeSpell(spell.id)} className="text-red-500">Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SpellbookManager;