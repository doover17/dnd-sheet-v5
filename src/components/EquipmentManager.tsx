import React, { useState } from 'react';
import { Equipment } from '../types/character';

interface EquipmentManagerProps {
  equipment: Equipment[];
  onEquipmentChange: (newEquipment: Equipment[]) => void;
}

const EquipmentManager: React.FC<EquipmentManagerProps> = ({ equipment, onEquipmentChange }) => {
  const [newItem, setNewItem] = useState<Equipment>({
    id: 0,
    name: '',
    type: 'Item',
    quantity: 1,
    weight: 0,
    description: '',
  });

  const addItem = () => {
    const updatedEquipment = [...equipment, { ...newItem, id: Date.now() }];
    onEquipmentChange(updatedEquipment);
    setNewItem({ id: 0, name: '', type: 'Item', quantity: 1, weight: 0, description: '' });
  };

  const removeItem = (id: number) => {
    const updatedEquipment = equipment.filter(item => item.id !== id);
    onEquipmentChange(updatedEquipment);
  };

  const totalWeight = equipment.reduce((sum, item) => sum + item.weight * item.quantity, 0);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">Equipment</h3>
      <div className="mb-4">
        <input
          type="text"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          placeholder="Item name"
          className="mr-2 p-1 border rounded"
        />
        <select
          value={newItem.type}
          onChange={(e) => setNewItem({ ...newItem, type: e.target.value as 'Weapon' | 'Armor' | 'Item' })}
          className="mr-2 p-1 border rounded"
        >
          <option value="Weapon">Weapon</option>
          <option value="Armor">Armor</option>
          <option value="Item">Item</option>
        </select>
        <input
          type="number"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
          placeholder="Quantity"
          className="mr-2 p-1 border rounded w-20"
        />
        <input
          type="number"
          value={newItem.weight}
          onChange={(e) => setNewItem({ ...newItem, weight: parseFloat(e.target.value) })}
          placeholder="Weight"
          className="mr-2 p-1 border rounded w-20"
        />
        <button onClick={addItem} className="bg-green-500 text-white px-2 py-1 rounded">Add</button>
      </div>
      <ul>
        {equipment.map((item) => (
          <li key={item.id} className="flex justify-between items-center mb-2">
            <span>{item.name} (x{item.quantity}) - {item.weight * item.quantity} lbs</span>
            <button onClick={() => removeItem(item.id)} className="text-red-500">Remove</button>
          </li>
        ))}
      </ul>
      <p className="font-semibold">Total Weight: {totalWeight.toFixed(2)} lbs</p>
    </div>
  );
};

export default EquipmentManager;