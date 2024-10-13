import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, ArrowUp } from 'lucide-react';
import { Character } from '../types/character';
import { getAllCharacters, deleteCharacter } from '../services/characterService';

const CharacterList: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    const data = await getAllCharacters();
    setCharacters(data);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this character?')) {
      await deleteCharacter(id);
      loadCharacters();
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Character List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {characters.map((character) => (
          <div key={character.id} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">{character.name}</h2>
            <p className="text-gray-600 mb-4">
              Level {character.level} {character.race} {character.class}
            </p>
            <div className="flex justify-between items-center">
              <Link
                to={`/character/${character.id}`}
                className="text-blue-600 hover:text-blue-800"
              >
                View Details
              </Link>
              <div className="flex space-x-2">
                <Link
                  to={`/edit/${character.id}`}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <Edit size={20} />
                </Link>
                <Link
                  to={`/level-up/${character.id}`}
                  className="text-green-600 hover:text-green-800"
                >
                  <ArrowUp size={20} />
                </Link>
                <button
                  onClick={() => handleDelete(character.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterList;