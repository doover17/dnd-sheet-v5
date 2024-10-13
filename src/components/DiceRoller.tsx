import React, { useState } from 'react';
import { Dice1 } from 'lucide-react';

interface DiceRollerProps {
  modifier: number;
  label: string;
}

const DiceRoller: React.FC<DiceRollerProps> = ({ modifier, label }) => {
  const [result, setResult] = useState<number | null>(null);

  const rollDice = () => {
    const roll = Math.floor(Math.random() * 20) + 1;
    setResult(roll + modifier);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={rollDice}
        className="flex items-center space-x-1 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
      >
        <Dice1 size={16} />
        <span>{label}</span>
      </button>
      {result !== null && <span className="text-lg font-bold">{result}</span>}
    </div>
  );
};

export default DiceRoller;
