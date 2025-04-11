'use client';

import { useState } from 'react';
import { Weapon } from '@/types/gameData';

interface WeaponsListProps {
  weapons: Weapon[];
}

export default function WeaponsList({ weapons }: WeaponsListProps) {
  const [expandedWeapon, setExpandedWeapon] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<Weapon['category'] | 'all'>('all');

  const filteredWeapons = categoryFilter === 'all' 
    ? weapons 
    : weapons.filter(weapon => weapon.category === categoryFilter);

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as Weapon['category'] | 'all')}
          className="p-2 rounded bg-gray-700"
        >
          <option value="all">Tutte le Armi</option>
          <option value="Mischia">Armi da Mischia</option>
          <option value="Lancio">Armi da Lancio</option>
          <option value="Tiro">Armi da Tiro</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWeapons.map((weapon) => (
          <div
            key={weapon.id}
            className="card cursor-pointer"
            onClick={() => setExpandedWeapon(expandedWeapon === weapon.id ? null : weapon.id)}
          >
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold">{weapon.name}</h3>
              <span className="text-sm text-gray-400">{weapon.category}</span>
            </div>
            <p className="text-gray-300 mt-2">{weapon.type}</p>
            <p className="text-yellow-500 font-medium mt-2">Danno: {weapon.damage}</p>

            {expandedWeapon === weapon.id && (
              <div className="mt-4 space-y-2">
                {weapon.range && (
                  <p className="text-gray-300">
                    <span className="font-medium">Gittata:</span> {weapon.range}
                  </p>
                )}
                {weapon.special && (
                  <p className="text-gray-300">
                    <span className="font-medium">Special:</span> {weapon.special}
                  </p>
                )}
                <p className="text-gray-300">
                  <span className="font-medium">Peso:</span> {weapon.weight} kg
                </p>
                <p className="text-gray-300">
                  <span className="font-medium">Costo:</span> {weapon.cost} monete
                </p>
                <p className="text-gray-300 mt-2">{weapon.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 