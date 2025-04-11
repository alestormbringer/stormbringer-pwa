'use client';

import React from 'react';
import InteractiveMap from '@/components/InteractiveMap';
import NavBar from '@/components/NavBar';
import { regions } from '@/data/regions';

export default function YoungKingdomsMapPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-yellow-500 mb-8 text-center">
          Mappa dei Regni Giovani
        </h1>
        <div className="max-w-4xl mx-auto">
          <InteractiveMap regions={regions} />
        </div>
        <div className="mt-8 text-gray-300 text-center">
          <p className="mb-4">Esplora i regni del mondo conosciuto:</p>
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {regions.map((region) => (
              <li key={region.id} className="text-sm">
                {region.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 