'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import NavBar from '@/components/NavBar';
import { getCampaignByAccessLink, addPlayerToCampaign } from '@/firebase/campaignUtils';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Campaign } from '@/types/campaign';
import { Character } from '@/types/gameData';
import Link from 'next/link';

export default function JoinCampaignPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (!params || !params.id) {
      setError('Link di invito non valido');
      setLoading(false);
      return;
    }
    
    loadCampaign();
    loadCharacters();
  }, [user, authLoading, params, router]);
  
  const loadCampaign = async () => {
    if (!params || !params.id) return;
    
    try {
      const campaignData = await getCampaignByAccessLink(params.id);
      
      if (!campaignData) {
        setError('Campagna non trovata. Il link potrebbe essere scaduto o non valido.');
        setLoading(false);
        return;
      }
      
      // Se l'utente è già membro della campagna, reindirizza direttamente alla pagina della campagna
      if (user && campaignData.players.includes(user.uid)) {
        router.push(`/campaigns/${campaignData.id}`);
        return;
      }
      
      setCampaign(campaignData);
    } catch (err) {
      console.error('Errore nel caricamento della campagna:', err);
      setError('Si è verificato un errore nel caricamento della campagna.');
    } finally {
      setLoading(false);
    }
  };
  
  const loadCharacters = async () => {
    if (!user) return;
    
    try {
      const q = query(collection(db, 'characters'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const charactersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Character[];
      
      setCharacters(charactersData);
    } catch (err) {
      console.error('Errore nel caricamento dei personaggi:', err);
      setError('Si è verificato un errore nel caricamento dei tuoi personaggi.');
    }
  };
  
  const handleJoinCampaign = async () => {
    if (!user || !campaign || !selectedCharacterId) {
      setError('Devi selezionare un personaggio per partecipare alla campagna.');
      return;
    }
    
    try {
      setJoining(true);
      await addPlayerToCampaign(campaign.id, user.uid, selectedCharacterId);
      router.push(`/campaigns/${campaign.id}`);
    } catch (err) {
      console.error('Errore nell\'unirsi alla campagna:', err);
      setError('Si è verificato un errore durante l\'adesione alla campagna.');
      setJoining(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {loading || authLoading ? (
            <div className="text-center py-10">
              <p className="text-gray-400">Caricamento...</p>
            </div>
          ) : error ? (
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="p-4 bg-red-900/50 text-red-200 rounded-md mb-6">
                {error}
              </div>
              <div className="text-center">
                <Link href="/" className="text-yellow-500 hover:text-yellow-400">
                  Torna alla home
                </Link>
              </div>
            </div>
          ) : campaign ? (
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h1 className="text-2xl font-bold text-yellow-500 mb-6">
                Unisciti alla campagna: {campaign.name}
              </h1>
              
              <div className="mb-6">
                <p className="text-gray-300 mb-4">{campaign.description}</p>
                <p className="text-gray-400 text-sm">
                  Creata da: {campaign.dmId === user?.uid ? 'Te' : 'Game Master'}
                </p>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-yellow-500 mb-4">
                  Scegli un personaggio
                </h2>
                
                {characters.length === 0 ? (
                  <div className="p-4 bg-blue-900/30 text-blue-200 rounded-md mb-4">
                    <p>Non hai ancora personaggi. Crea un personaggio prima di partecipare a questa campagna.</p>
                    <div className="mt-3">
                      <Link 
                        href="/stormbringer-character" 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                      >
                        Crea un personaggio
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {characters.map((character) => (
                      <div 
                        key={character.id}
                        className={`p-4 rounded-md cursor-pointer transition-colors ${
                          selectedCharacterId === character.id
                            ? 'bg-yellow-800/40 border-2 border-yellow-500'
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                        onClick={() => setSelectedCharacterId(character.id)}
                      >
                        <h3 className="font-bold text-lg text-yellow-400 mb-1">
                          {character.name}
                        </h3>
                        <div className="text-sm text-gray-300">
                          <p><span className="text-gray-400">Nazionalità:</span> {character.nationality}</p>
                          <p><span className="text-gray-400">Classe:</span> {character.class}</p>
                          {character.cult && (
                            <p><span className="text-gray-400">Culto:</span> {character.cult}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {characters.length > 0 && (
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={handleJoinCampaign}
                      disabled={!selectedCharacterId || joining}
                      className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                        selectedCharacterId
                          ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {joining ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Unione in corso...
                        </>
                      ) : 'Unisciti con questo personaggio'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-800 rounded-lg">
              <p className="text-gray-400">Campagna non trovata.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 