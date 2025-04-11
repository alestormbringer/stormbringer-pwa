'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import NavBar from '@/components/NavBar';

interface Deity {
  id: string;
  name: string;
  domain: string;
  alignment: string;
  description: string;
  symbol: string;
  imageUrl: string;
  category: 'Legge' | 'Caos' | 'Elementali' | 'Signori delle bestie';
}

const categories = [
  { 
    name: 'Legge', 
    icon: '⚖️',
    description: 'Le divinità della Legge rappresentano l\'ordine, la giustizia e l\'equilibrio',
    color: 'from-blue-500 to-blue-700'
  },
  { 
    name: 'Caos', 
    icon: '💥',
    description: 'Le divinità del Caos incarnano il cambiamento, la distruzione e la libertà',
    color: 'from-red-500 to-red-700'
  },
  { 
    name: 'Elementali', 
    icon: '🌍',
    description: 'Le divinità Elementali governano le forze primordiali della natura',
    color: 'from-green-500 to-green-700'
  },
  { 
    name: 'Signori delle bestie', 
    icon: '🐲',
    description: 'I Signori delle Bestie comandano sulle creature del mondo',
    color: 'from-purple-500 to-purple-700'
  }
] as const;

export default function DeitiesPage() {
  const [deities, setDeities] = useState<Deity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchDeities();
  }, []);

  const fetchDeities = async () => {
    try {
      const deitiesRef = collection(db, 'deities');
      const snapshot = await getDocs(deitiesRef);
      const deitiesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Deity[];

      // Rimuovi duplicati basandoti sul nome della divinità
      const uniqueDeities = deitiesData.reduce((acc, current) => {
        const x = acc.find(item => item.name === current.name);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, [] as Deity[]);

      setDeities(uniqueDeities);
    } catch (error) {
      console.error('Errore durante il recupero delle divinità:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDeities = selectedCategory
    ? deities.filter(deity => deity.category === selectedCategory)
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <NavBar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center text-yellow-500">Caricamento...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-yellow-500 mb-8 text-center">
          Pantheon di Stormbringer
        </h1>

        {!selectedCategory ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`relative overflow-hidden rounded-lg h-64 w-full bg-gradient-to-br ${category.color} hover:opacity-90 transition-opacity duration-300`}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white">
                  <span className="text-6xl mb-4">{category.icon}</span>
                  <h2 className="text-3xl font-bold mb-2">{category.name}</h2>
                  <p className="text-center text-white/80">{category.description}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <>
            <div className="mb-8 flex justify-between items-center">
              <button
                onClick={() => setSelectedCategory(null)}
                className="px-4 py-2 bg-gray-800 text-yellow-500 rounded-lg hover:bg-gray-700"
              >
                ← Torna alle categorie
              </button>
              <h2 className="text-2xl font-bold text-yellow-500">
                {categories.find(c => c.name === selectedCategory)?.icon} {selectedCategory}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDeities.map((deity) => (
                <div key={deity.id} className="bg-gray-800 rounded-lg p-6 shadow-lg">
                  {deity.imageUrl && (
                    <img
                      src={deity.imageUrl}
                      alt={deity.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h2 className="text-2xl font-bold text-yellow-500 mb-2">{deity.name}</h2>
                  <p className="text-gray-300 mb-2">
                    <span className="font-semibold">Dominio:</span> {deity.domain}
                  </p>
                  <p className="text-gray-300 mb-2">
                    <span className="font-semibold">Allineamento:</span> {deity.alignment}
                  </p>
                  <p className="text-gray-300 mb-2">
                    <span className="font-semibold">Simbolo:</span> {deity.symbol}
                  </p>
                  <p className="text-gray-400">{deity.description}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
} 