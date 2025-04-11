'use client';

import { useState } from 'react';
import WorldMap from '@/components/WorldMap';
import NavBar from '@/components/NavBar';
import Link from 'next/link';

export default function WorldMapPage() {
  return (
    <>
      <NavBar />
      <div className="bg-green-950 min-h-screen pt-16 pb-10">
        <div className="mx-auto px-4">
          <h1 className="text-4xl font-medievalsharp text-yellow-500 mb-6 text-center">
            Mappa del Mondo dei Regni Giovani
          </h1>
          
          <div className="bg-green-900 p-4 rounded-lg shadow-lg mb-6 max-w-6xl mx-auto">
            <p className="text-green-100 mb-4 font-medievalsharp">
              Esplora la mappa del mondo di Stormbringer. Passa il mouse sopra una regione per visualizzarne il nome, 
              e clicca per vedere informazioni dettagliate su quella nazione.
            </p>
            <div className="flex justify-end">
              <Link href="/nationalities" className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medievalsharp rounded-md transition-colors">
                Lista Nazioni
              </Link>
            </div>
          </div>
          
          <div className="flex justify-center overflow-auto">
            <WorldMap 
              width={1600} 
              height={1200} 
            />
          </div>
        </div>
      </div>
    </>
  );
} 