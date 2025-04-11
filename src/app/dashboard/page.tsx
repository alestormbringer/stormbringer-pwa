'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import NavBar from '@/components/NavBar';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const cards = [
    {
      id: 'character-creation',
      title: 'Creazione Personaggio',
      description: 'Crea un nuovo personaggio',
      path: '/stormbringer-character',
      icon: '✨'
    },
    {
      id: 'characters',
      title: 'Personaggi',
      description: 'Gestisci i tuoi personaggi',
      path: '/characters',
      icon: '👤'
    },
    {
      id: 'campaigns',
      title: 'Campagne',
      description: 'Crea e gestisci le tue campagne',
      path: '/campaigns',
      icon: '📜'
    },
    {
      id: 'deities',
      title: 'Divinità',
      description: 'Esplora il pantheon di Stormbringer',
      path: '/deities',
      icon: '⚡'
    },
    {
      id: 'nationalities',
      title: 'Nazioni',
      description: 'Scopri le terre di Stormbringer',
      path: '/world-map',
      icon: '🗺️'
    },
    {
      id: 'classes',
      title: 'Classi',
      description: 'Esplora le classi disponibili',
      path: '/classes',
      icon: '🎭'
    },
    {
      id: 'weapons',
      title: 'Armi',
      description: 'Armi e equipaggiamento',
      path: '/weapons',
      icon: '⚔️'
    },
    {
      id: 'summons',
      title: 'Evocazioni',
      description: 'Demoni e creature evocabili',
      path: '/summons',
      icon: '👹'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-yellow-500 mb-4">
            Benvenuto in Stormbringer
          </h1>
          <p className="text-gray-300 text-lg">
            Scegli una sezione per iniziare la tua avventura
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`bg-gray-800 rounded-lg p-6 shadow-lg text-center cursor-pointer transform transition-all duration-300 ${
                hoveredCard === card.id ? 'scale-105' : ''
              }`}
              onClick={() => router.push(card.path)}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="text-4xl mb-4">{card.icon}</div>
              <h2 className="text-2xl font-bold text-yellow-500 mb-2">
                {card.title}
              </h2>
              <p className="text-gray-400">{card.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
} 