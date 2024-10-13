import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import CharacterList from './components/CharacterList';
import CharacterForm from './components/CharacterForm';
import CharacterSheet from './components/CharacterSheet';
import LevelUp from './components/LevelUp';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<CharacterList />} />
            <Route path="/create" element={<CharacterForm />} />
            <Route path="/edit/:id" element={<CharacterForm />} />
            <Route path="/character/:id" element={<CharacterSheet />} />
            <Route path="/level-up/:id" element={<LevelUp />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;