'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';
import { uploadImage } from '@/lib/cloudinary';
import { useNationality } from '@/hooks/useNationality';
import { useAuth } from '@/contexts/AuthContext';

export default function EditNationalityPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Verifica autenticazione
  useEffect(() => {
    if (!authLoading && !user) {
      setAuthError('Devi essere autenticato per modificare le nazionalità. Effettua il login.');
      // Reindirizza alla pagina di login dopo 3 secondi
      const timer = setTimeout(() => {
        router.push('/auth');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user, authLoading, router]);

  // Utilizziamo l'hook per recuperare e gestire la nazionalità
  const { 
    nationality,
    loading,
    error,
    saving, 
    success,
    saveNationality,
    checkFirebaseConnection,
    setNationality,
    checkAuthenticationStatus
  } = useNationality(params.id);

  // Aggiorna l'imageUrl quando nationality cambia
  useEffect(() => {
    if (nationality?.imageUrl) {
      setImageUrl(nationality.imageUrl);
    }
  }, [nationality]);

  const [newTrait, setNewTrait] = useState({ name: '', description: '' });
  const [newLanguage, setNewLanguage] = useState('');
  const [newAbility, setNewAbility] = useState({ name: '', description: '' });
  const [newEquipment, setNewEquipment] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!nationality) return;
    
    const { name, value } = e.target;
    setNationality({ ...nationality, [name]: value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!nationality) return;
    
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const result = await uploadImage(file);
      if (result && result.secure_url) {
        setImageUrl(result.secure_url);
        setNationality({ ...nationality, imageUrl: result.secure_url });
      }
    } catch (error) {
      console.error('Errore durante il caricamento dell\'immagine:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const addTrait = () => {
    if (!nationality) return;
    
    if (newTrait.name && newTrait.description) {
      setNationality({
        ...nationality,
        traits: [...nationality.traits, { ...newTrait }],
      });
      setNewTrait({ name: '', description: '' });
    }
  };

  const removeTrait = (index: number) => {
    if (!nationality) return;
    
    const updatedTraits = [...nationality.traits];
    updatedTraits.splice(index, 1);
    setNationality({ ...nationality, traits: updatedTraits });
  };

  const addLanguage = () => {
    if (!nationality) return;
    
    if (newLanguage) {
      setNationality({
        ...nationality,
        languages: [...nationality.languages, newLanguage],
      });
      setNewLanguage('');
    }
  };

  const removeLanguage = (index: number) => {
    if (!nationality) return;
    
    const updatedLanguages = [...nationality.languages];
    updatedLanguages.splice(index, 1);
    setNationality({ ...nationality, languages: updatedLanguages });
  };

  const addAbility = () => {
    if (!nationality) return;
    
    if (newAbility.name && newAbility.description) {
      setNationality({
        ...nationality,
        specialAbilities: [...nationality.specialAbilities, { ...newAbility }],
      });
      setNewAbility({ name: '', description: '' });
    }
  };

  const removeAbility = (index: number) => {
    if (!nationality) return;
    
    const updatedAbilities = [...nationality.specialAbilities];
    updatedAbilities.splice(index, 1);
    setNationality({ ...nationality, specialAbilities: updatedAbilities });
  };

  const addEquipment = () => {
    if (!nationality) return;
    
    if (newEquipment) {
      setNationality({
        ...nationality,
        startingEquipment: [...nationality.startingEquipment, newEquipment],
      });
      setNewEquipment('');
    }
  };

  const removeEquipment = (index: number) => {
    if (!nationality) return;
    
    const updatedEquipment = [...nationality.startingEquipment];
    updatedEquipment.splice(index, 1);
    setNationality({ ...nationality, startingEquipment: updatedEquipment });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nationality) return;
    
    // Validazione
    if (!nationality.name || !nationality.description) {
      return;
    }
    
    try {
      // Verifica autenticazione prima di salvare
      const authStatus = checkAuthenticationStatus();
      if (!authStatus.isAuthenticated) {
        setAuthError('Devi effettuare il login per salvare le modifiche');
        router.push('/auth');
        return;
      }
      
      await saveNationality(nationality);
      
      // Redirect dopo un breve timeout per mostrare il messaggio di successo
      setTimeout(() => {
        router.push('/nationalities');
      }, 2000);
    } catch (err) {
      console.error('Errore durante l\'aggiornamento della nazionalità:', err);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-yellow-500">Caricamento...</div>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-600 text-white p-4 mb-6 rounded text-center">
            {authError}
          </div>
          <div className="text-center">
            <button 
              onClick={() => router.push('/auth')}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mt-4"
            >
              Vai alla pagina di login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!nationality) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-500">Nazionalità non trovata</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-yellow-500">Modifica Nazionalità: {nationality.name}</h1>
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
            Nazionalità aggiornata con successo! Reindirizzamento...
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
                  value={nationality.name}
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
                  value={nationality.region}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded py-2 px-3 text-white"
                  placeholder="Es. Est dei Regni Giovani"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Cultura</label>
                <input
                  type="text"
                  name="culture"
                  value={nationality.culture}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded py-2 px-3 text-white"
                  placeholder="Es. Decadente, antica"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Lingua</label>
                <input
                  type="text"
                  name="language"
                  value={nationality.language}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded py-2 px-3 text-white"
                  placeholder="Es. Lingua alta di Melniboné"
                />
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">Descrizioni</h2>
              
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Descrizione generale</label>
                <textarea
                  name="description"
                  value={nationality.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full bg-gray-700 border border-gray-600 rounded py-2 px-3 text-white"
                  placeholder="Descrivi questa nazionalità..."
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Tratti fisici</label>
                <textarea
                  name="raceTraits"
                  value={nationality.raceTraits}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full bg-gray-700 border border-gray-600 rounded py-2 px-3 text-white"
                  placeholder="Descrivi i tratti fisici tipici..."
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Creazione del personaggio</label>
                <textarea
                  name="characterCreation"
                  value={nationality.characterCreation}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full bg-gray-700 border border-gray-600 rounded py-2 px-3 text-white"
                  placeholder="Modificatori alle caratteristiche e abilità speciali..."
                />
              </div>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-1 gap-6">
            <div>
              <h2 className="text-xl font-semibold text-yellow-400 mb-4">Lingue conosciute</h2>
              <div className="mb-4 flex">
                <input
                  type="text"
                  placeholder="Lingua"
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-l py-2 px-3 text-white"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                />
                <button
                  type="button"
                  className="bg-blue-600 text-white rounded-r px-4 py-2 hover:bg-blue-700"
                  onClick={addLanguage}
                >
                  +
                </button>
              </div>
              
              <ul className="bg-gray-700 rounded p-2 min-h-[100px] max-h-[200px] overflow-y-auto">
                {nationality.languages.length === 0 ? (
                  <li className="text-gray-400 p-2">Nessuna lingua aggiunta</li>
                ) : (
                  nationality.languages.map((language, index) => (
                    <li key={index} className="flex justify-between items-center py-1 px-2 border-b border-gray-600 last:border-b-0">
                      <span>{language}</span>
                      <button
                        type="button"
                        className="text-red-400 hover:text-red-500 ml-2"
                        onClick={() => removeLanguage(index)}
                      >
                        ×
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => router.push('/nationalities')}
              className="bg-gray-600 text-white px-6 py-2 rounded mr-2 hover:bg-gray-700"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              disabled={saving}
            >
              {saving ? 'Salvataggio...' : 'Aggiorna Nazionalità'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 