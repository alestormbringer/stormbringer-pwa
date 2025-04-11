'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';
import NavBar from '@/components/NavBar';
import Link from 'next/link';
import { Nationality } from '@/types/nationality';

// Mappa degli slug per le nazionalità
const nameToSlug: Record<string, string> = {
  'Melniboné': 'melnibone',
  'Pan Tang': 'pan-tang',
  'Myrrhyn': 'myrrhyn',
  'Dharijor': 'dharijor',
  'Jharkor': 'jharkor',
  'Shazaar': 'shazaar',
  'Tarkesh': 'tarkesh',
  'Vilmir': 'vilmir',
  'Ilmiora': 'ilmiora',
  'Nadsokor': 'nadsokor',
  'Solitudine piangente': 'solitude-piangente',
  'Eshmir': 'eshmir',
  'Isola delle Città Purpuree': 'isola-delle-citta-purpuree',
  'Argimiliar': 'argimiliar',
  'Pikarayd': 'pikarayd',
  'Lormyr': 'lormyr',
  'Filkhar': 'filkhar',
  'Oin': 'oin',
  'Yu': 'yu',
  'Org': 'org'
};

export default function NationalitiesPage() {
  const [nationalities, setNationalities] = useState<Nationality[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNationalities = async () => {
      try {
        const nationalitiesRef = collection(db, 'nationalities');
        const snapshot = await getDocs(nationalitiesRef);
        const nationalitiesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Nationality[];

        setNationalities(nationalitiesData);
      } catch (error) {
        console.error('Errore durante il recupero delle nazionalità:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNationalities();
  }, []);

  const getSlug = (name: string) => {
    return nameToSlug[name] || name.toLowerCase().replace(/\s+/g, '-');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-yellow-500">Caricamento...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-yellow-500">
            Nazionalità del Mondo Conosciuto
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nationalities.map((nationality) => (
            <div key={nationality.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-yellow-400 mb-2">
                  {nationality.name}
                </h2>
                <p className="text-gray-300 mb-4 line-clamp-3">
                  {nationality.description}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <Link 
                    href={`/nationalities/${getSlug(nationality.name)}`}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Dettagli
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 