'use client';

import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Weapon } from '@/types/gameData';

export default function AddWeaponForm() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Weapon['category']>('Mischia');
  const [type, setType] = useState('');
  const [damage, setDamage] = useState('');
  const [range, setRange] = useState('');
  const [special, setSpecial] = useState('');
  const [weight, setWeight] = useState('');
  const [cost, setCost] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const weaponData: Omit<Weapon, 'id'> = {
        name,
        category,
        type,
        damage,
        range,
        special,
        weight: parseFloat(weight),
        cost: parseFloat(cost),
        description
      };

      await addDoc(collection(db, 'weapons'), weaponData);
      
      // Reset form
      setName('');
      setCategory('Mischia');
      setType('');
      setDamage('');
      setRange('');
      setSpecial('');
      setWeight('');
      setCost('');
      setDescription('');
      
      alert('Arma aggiunta con successo!');
    } catch (error) {
      console.error('Error adding weapon:', error);
      alert('Errore durante l\'aggiunta dell\'arma');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Aggiungi Nuova Arma</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded bg-gray-700"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Categoria</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Weapon['category'])}
            className="w-full p-2 rounded bg-gray-700"
            required
          >
            <option value="Mischia">Mischia</option>
            <option value="Lancio">Lancio</option>
            <option value="Tiro">Tiro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tipo</label>
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 rounded bg-gray-700"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Danno</label>
          <input
            type="text"
            value={damage}
            onChange={(e) => setDamage(e.target.value)}
            className="w-full p-2 rounded bg-gray-700"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Gittata</label>
          <input
            type="text"
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="w-full p-2 rounded bg-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Special</label>
          <input
            type="text"
            value={special}
            onChange={(e) => setSpecial(e.target.value)}
            className="w-full p-2 rounded bg-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Peso</label>
          <input
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full p-2 rounded bg-gray-700"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Costo</label>
          <input
            type="number"
            step="0.1"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className="w-full p-2 rounded bg-gray-700"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Descrizione</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 rounded bg-gray-700"
          rows={4}
          required
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-green-600 rounded hover:bg-green-700"
      >
        Aggiungi Arma
      </button>
    </form>
  );
} 