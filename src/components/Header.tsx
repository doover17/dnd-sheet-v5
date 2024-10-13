import React from 'react';
import { Link } from 'react-router-dom';
import { Sword } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Sword size={24} />
          <span className="text-xl font-bold">D&D Character Sheet</span>
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:text-gray-300">Characters</Link>
            </li>
            <li>
              <Link to="/create" className="hover:text-gray-300">Create New</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;