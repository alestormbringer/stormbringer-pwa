'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import NavBar from '@/components/NavBar';

// Mappa degli slug per le nazionalità
const nameToSlug: Record<string, string> = {
  'Melniboné': 'melnibonae',
  'Pan Tang': 'pan-tang',
  'Myrrhyn': 'myrrhyn',
  'Dharijor': 'dharijor',
  'Jharkor': 'jharkor',
  'Shazaar': 'shazaar',
  'Tarkesh': 'tarkesh',
  'Vilmir': 'vilmir',
  'Ilmiora': 'ilmiora',
  'Nadsokor': 'nadsokor',
  'Solitudine piangente': 'weeping-waste',
  'Eshmir': 'eshmir',
  'Isola delle Città Purpuree': 'purple-towns',
  'Argimiliar': 'argimiliar',
  'Pikarayd': 'pikarayd',
  'Lormyr': 'lormyr',
  'Filkhar': 'filkhar',
  'Oin': 'oin',
  'Yu': 'yu',
  'Org': 'org'
};

export default function AddNationalityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showDebug, setShowDebug] = useState(false);

  const [nationalityData, setNationalityData] = useState({
    name: '',
    description: '',
    region: '',
    culture: '',
    language: '',
    languages: [] as string[],
  });

  const [newLanguage, setNewLanguage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNationalityData({ ...nationalityData, [name]: value });
  };

  const addLanguage = () => {
    if (newLanguage) {
      setNationalityData({
        ...nationalityData,
        languages: [...nationalityData.languages, newLanguage],
      });
      setNewLanguage('');
    }
  };

  const removeLanguage = (index: number) => {
    const updatedLanguages = [...nationalityData.languages];
    updatedLanguages.splice(index, 1);
    setNationalityData({ ...nationalityData, languages: updatedLanguages });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validazione
    if (!nationalityData.name || !nationalityData.description) {
      setError('Nome e Descrizione sono campi obbligatori');
      setLoading(false);
      return;
    }
    
    try {
      const nationalitiesRef = collection(db, 'nationalities');
      const newNationalityRef = await addDoc(nationalitiesRef, {
        ...nationalityData,
        createdAt: new Date(),
      });
      
      console.log('Nazionalità aggiunta con ID:', newNationalityRef.id);
      setSuccess(true);
      
      // Redirect dopo un breve timeout per mostrare il messaggio di successo
      setTimeout(() => {
        router.push('/nationalities');
      }, 2000);
    } catch (err) {
      console.error('Errore durante il salvataggio della nazionalità:', err);
      setError('Errore durante il salvataggio della nazionalità. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  // Funzione per verificare la connessione a Firebase
  const checkFirebaseConnection = async () => {
    try {
      const nationalitiesRef = collection(db, 'nationalities');
      const snapshot = await getDocs(nationalitiesRef);
      console.log(`Connessione a Firebase riuscita! Trovate ${snapshot.docs.length} nazionalità.`);
      return true;
    } catch (error) {
      console.error('Errore di connessione a Firebase:', error);
      return false;
    }
  };

  const debugConnection = async () => {
    setShowDebug(true);
    const connected = await checkFirebaseConnection();
    if (connected) {
      alert('Connessione a Firebase stabilita con successo!');
    } else {
      alert('Errore di connessione a Firebase. Controlla la console per i dettagli.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-yellow-500">Aggiungi Nazionalità</h1>
          <button 
            type="button" 
            className="bg-gray-700 text-white px-4 py-2 rounded text-sm"
            onClick={debugConnection}
          >
            Verifica Connessione
          </button>
        </div>

        {success && (
          <div className="bg-green-600 text-white p-4 mb-6 rounded">
            Nazionalità aggiunta con successo! Reindirizzamento...
          </div>
        )}

        {error && (
          <div className="bg-red-600 text-white p-4 mb-6 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">Informazioni Base</h2>
              
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Nome</label>
                <input
                  type="text"
                  name="name"
                  value={nationalityData.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded py-2 px-3 text-white"
                  placeholder="Es. Melniboné"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Regione</label>
                <input
                  type="text"
                  name="region"
                  value={nationalityData.region}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded py-2 px-3 text-white"
                  placeholder="Es. Isola nel Mare Occidentale"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Cultura</label>
                <input
                  type="text"
                  name="culture"
                  value={nationalityData.culture}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded py-2 px-3 text-white"
                  placeholder="Es. Guerriera, marittima"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Lingua Principale</label>
                <input
                  type="text"
                  name="language"
                  value={nationalityData.language}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded py-2 px-3 text-white"
                  placeholder="Es. Melniboneano"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Descrizione</label>
                <textarea
                  name="description"
                  value={nationalityData.description}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded py-2 px-3 text-white h-32"
                  placeholder="Descrivi questa nazionalità..."
                />
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">Lingue</h2>
              <div className="mb-6">
                <div className="flex mb-2">
                  <input
                    type="text"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-l py-2 px-3 text-white"
                    placeholder="Aggiungi una lingua"
                  />
                  <button
                    type="button"
                    onClick={addLanguage}
                    className="bg-green-600 text-white px-4 py-2 rounded-r hover:bg-green-700"
                  >
                    Aggiungi
                  </button>
                </div>
                
                <div className="mt-4 max-h-40 overflow-y-auto">
                  {nationalityData.languages.map((language, index) => (
                    <div key={index} className="bg-gray-700 p-3 rounded mb-2 flex justify-between items-center">
                      <span>{language}</span>
                      <button
                        type="button"
                        onClick={() => removeLanguage(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Rimuovi
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => router.push('/nationalities')}
              className="bg-gray-600 text-white px-6 py-2 rounded mr-4 hover:bg-gray-700"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700 flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Salvataggio...
                </>
              ) : (
                'Salva Nazionalità'
              )}
            </button>
          </div>
        </form>

        {showDebug && (
          <div className="mt-8 bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">Debug Info</h3>
            <pre className="bg-gray-900 p-4 rounded overflow-x-auto text-xs">
              {JSON.stringify({ nationalityData, db: !!db }, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 