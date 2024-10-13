import React from 'react';
import { ClassFeature } from '../types/character';

interface ClassFeaturesProps {
  features: ClassFeature[];
  onFeaturesChange: (newFeatures: ClassFeature[]) => void;
}

const ClassFeatures: React.FC<ClassFeaturesProps> = ({ features, onFeaturesChange }) => {
  const addFeature = () => {
    const newFeature: ClassFeature = {
      id: Date.now(),
      name: '',
      description: '',
      level: 1,
    };
    onFeaturesChange([...features, newFeature]);
  };

  const updateFeature = (id: number, field: keyof ClassFeature, value: string | number) => {
    const updatedFeatures = features.map(feature =>
      feature.id === id ? { ...feature, [field]: value } : feature
    );
    onFeaturesChange(updatedFeatures);
  };

  const removeFeature = (id: number) => {
    const updatedFeatures = features.filter(feature => feature.id !== id);
    onFeaturesChange(updatedFeatures);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">Class Features</h3>
      {features.map(feature => (
        <div key={feature.id} className="mb-4 p-4 border rounded">
          <input
            type="text"
            value={feature.name}
            onChange={(e) => updateFeature(feature.id, 'name', e.target.value)}
            placeholder="Feature name"
            className="w-full mb-2 p-1 border rounded"
          />
          <textarea
            value={feature.description}
            onChange={(e) => updateFeature(feature.id, 'description', e.target.value)}
            placeholder="Feature description"
            className="w-full mb-2 p-1 border rounded"
            rows={3}
          />
          <input
            type="number"
            value={feature.level}
            onChange={(e) => updateFeature(feature.id, 'level', parseInt(e.target.value))}
            placeholder="Level"
            className="w-20 mb-2 p-1 border rounded"
          />
          <button onClick={() => removeFeature(feature.id)} className="ml-2 text-red-500">Remove</button>
        </div>
      ))}
      <button onClick={addFeature} className="bg-green-500 text-white px-2 py-1 rounded">Add Feature</button>
    </div>
  );
};

export default ClassFeatures;