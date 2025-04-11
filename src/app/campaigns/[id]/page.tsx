'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import NavBar from '@/components/NavBar';
import { getCampaign, updateCampaign, deleteCampaign } from '@/firebase/campaignUtils';
import { Campaign, ChatMessage } from '@/types/campaign';
import { Timestamp } from 'firebase/firestore';
import CampaignEditForm from '@/components/CampaignEditForm';
import CampaignChat from '@/components/CampaignChat';
import { getUserProfiles } from '@/firebase/userUtils';
import { getCharactersByIds } from '@/firebase/characterUtils';
import { Character } from '@/types/gameData';
import { UserData } from '@/types/firebase';

export default function CampaignDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [userProfiles, setUserProfiles] = useState<Record<string, UserData>>({});
  const [characters, setCharacters] = useState<Record<string, Character>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'chat'>('details');

  useEffect(() => {
    console.log("Stato autenticazione:", { user, authLoading, params });
    
    if (authLoading) {
      console.log("Autenticazione in corso...");
      return;
    }
    
    if (!user) {
      console.log("Nessun utente autenticato, reindirizzamento al login");
      router.push('/login');
      return;
    }

    if (!params || !params.id) {
      console.error("ID campagna mancante");
      setError('ID campagna mancante');
      setLoading(false);
      return;
    }

    loadCampaign();
  }, [user, authLoading, params, router]);

  const loadCampaign = async () => {
    if (!params || !params.id || !user) return;
    
    try {
      setLoading(true);
      console.log("Inizio caricamento campagna con ID:", params.id);
      const campaignData = await getCampaign(params.id);
      
      if (!campaignData) {
        console.error("Campagna non trovata:", params.id);
        setError('Campagna non trovata');
        return;
      }
      
      // Verifica che l'utente sia parte della campagna
      if (!campaignData.players.includes(user.uid) && campaignData.dmId !== user.uid) {
        console.error("Accesso negato alla campagna:", params.id);
        setError('Non hai accesso a questa campagna');
        return;
      }
      
      console.log("Campagna caricata con successo:", campaignData);
      setCampaign(campaignData);
      
      // Carica i profili degli utenti per la campagna
      if (campaignData.players && campaignData.players.length > 0) {
        const profiles = await getUserProfiles(campaignData.players);
        setUserProfiles(profiles);
      }
      
      // Carica i personaggi associati ai giocatori
      if (campaignData.playerCharacters && Object.keys(campaignData.playerCharacters).length > 0) {
        const characterIds = Object.values(campaignData.playerCharacters) as string[];
        const charactersData = await getCharactersByIds(characterIds);
        setCharacters(charactersData);
      }
    } catch (err) {
      console.error('Errore nel caricamento della campagna:', err);
      setError('Si è verificato un errore nel caricamento della campagna.');
    } finally {
      setLoading(false);
    }
  };

  // Funzione per ottenere il nome del giocatore
  const getPlayerName = (playerId: string): string => {
    if (playerId === user?.uid) return 'Tu';
    if (userProfiles[playerId]?.displayName) return userProfiles[playerId].displayName || '';
    return `Giocatore ${playerId.substring(0, 4)}`;
  };
  
  // Funzione per ottenere il nome del personaggio
  const getCharacterName = (characterId: string): string => {
    return characters[characterId]?.name || `Personaggio ${characterId.substring(0, 4)}`;
  };

  const formatDate = (date: Date | Timestamp | undefined) => {
    if (!date) return 'N/A';
    
    const dateObj = date instanceof Timestamp ? date.toDate() : date;
    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(dateObj);
  };

  const formatDateTime = (date: Date | Timestamp | undefined | null) => {
    if (!date) return 'Non programmata';
    
    try {
      let dateObj;
      if (date instanceof Timestamp) {
        dateObj = date.toDate();
      } else if (date instanceof Date) {
        dateObj = date;
      } else if (typeof date === 'object' && date !== null && 'seconds' in date) {
        // È un oggetto Timestamp serializzato
        dateObj = new Date((date as any).seconds * 1000);
      } else {
        // Tenta di convertirlo in data
        dateObj = new Date(date as any);
      }
      
      // Verifica che la data sia valida
      if (isNaN(dateObj.getTime())) {
        console.error('Data non valida:', date);
        return 'Data non valida';
      }
      
      return new Intl.DateTimeFormat('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(dateObj);
    } catch (error) {
      console.error('Errore nella formattazione della data e ora:', error, date);
      return 'Data non valida';
    }
  };

  // Funzione per tornare alla lista delle campagne
  const handleBack = () => {
    // Impostiamo un flag nella sessionStorage per indicare che è necessario ricaricare
    sessionStorage.setItem('reloadCampaigns', 'true');
    router.push('/campaigns');
  };

  const handleCampaignUpdate = async (updatedData: Partial<Campaign>) => {
    if (!campaign) return;
    
    try {
      setUpdating(true);
      console.log("Inizio aggiornamento campagna:", campaign.id, "con dati:", updatedData);
      await updateCampaign(campaign.id, updatedData);
      console.log("Aggiornamento completato, ricaricamento dati");
      await loadCampaign(); // Ricarica la campagna con i dati aggiornati
      setShowEditForm(false);
    } catch (err) {
      console.error('Errore nell\'aggiornamento della campagna:', err);
      setError('Si è verificato un errore durante l\'aggiornamento della campagna.');
    } finally {
      setUpdating(false);
    }
  };

  const handleCampaignDelete = async () => {
    if (!campaign) return;
    
    try {
      setDeleting(true);
      console.log("Inizio eliminazione campagna:", campaign.id);
      await deleteCampaign(campaign.id);
      console.log("Eliminazione completata, reindirizzamento alla lista campagne");
      router.push('/campaigns');
    } catch (err) {
      console.error('Errore nell\'eliminazione della campagna:', err);
      setError('Si è verificato un errore durante l\'eliminazione della campagna.');
      setDeleting(false);
      setShowConfirmDelete(false);
    }
  };

  const handleNewMessage = (message: ChatMessage) => {
    if (!campaign) return;
    
    console.log("Nuovo messaggio aggiunto alla chat:", message);
    // Aggiorna la campagna locale con il nuovo messaggio
    setCampaign({
      ...campaign,
      chats: [...(campaign.chats || []), message]
    });
  };

  const hasFiles = campaign?.files && campaign.files.length > 0;
  const isGameMaster = campaign && user ? campaign.dmId === user.uid : false;
  
  // Funzione per copiare il link d'accesso negli appunti
  const copyAccessLink = () => {
    if (campaign?.accessLink) {
      const fullLink = `${window.location.origin}${campaign.accessLink}`;
      navigator.clipboard.writeText(fullLink)
        .then(() => {
          alert('Link copiato negli appunti!');
        })
        .catch(err => {
          console.error('Errore durante la copia del link:', err);
          alert('Errore durante la copia del link');
        });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <button 
          onClick={handleBack}
          className="mb-6 text-yellow-500 hover:text-yellow-400 flex items-center gap-2"
        >
          ← Torna alle campagne
        </button>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 text-red-200 rounded-md">
            {error}
          </div>
        )}

        {loading || authLoading ? (
          <div className="text-center py-10">
            <p className="text-gray-400">Caricamento campagna...</p>
          </div>
        ) : campaign ? (
          <>
            {showEditForm ? (
              <CampaignEditForm 
                campaign={campaign} 
                onSubmit={handleCampaignUpdate} 
                onCancel={() => setShowEditForm(false)} 
                loading={updating}
              />
            ) : (
              <>
                <div className="mb-6 flex justify-between items-center">
                  <div className="flex space-x-4">
                    <button 
                      onClick={() => setActiveTab('details')}
                      className={`px-4 py-2 rounded-t-lg ${
                        activeTab === 'details' 
                          ? 'bg-gray-800 text-yellow-500 font-medium' 
                          : 'bg-gray-700 text-gray-400 hover:bg-gray-750'
                      }`}
                    >
                      Dettagli
                    </button>
                    <button 
                      onClick={() => setActiveTab('chat')}
                      className={`px-4 py-2 rounded-t-lg ${
                        activeTab === 'chat' 
                          ? 'bg-gray-800 text-yellow-500 font-medium' 
                          : 'bg-gray-700 text-gray-400 hover:bg-gray-750'
                      }`}
                    >
                      Chat
                    </button>
                  </div>
                  
                  {isGameMaster && (
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setShowEditForm(true)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Modifica
                      </button>
                      <button 
                        onClick={() => setShowConfirmDelete(true)}
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Elimina
                      </button>
                    </div>
                  )}
                </div>

                {activeTab === 'details' ? (
                  <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold text-yellow-500">
                          {campaign.name}
                        </h1>
                        <span className={`px-3 py-1 text-sm rounded-full ${
                          campaign.status === 'active' ? 'bg-green-900 text-green-300' : 
                          campaign.status === 'paused' ? 'bg-yellow-900 text-yellow-300' : 
                          'bg-gray-700 text-gray-300'
                        }`}>
                          {campaign.status === 'active' ? 'Attiva' : 
                           campaign.status === 'paused' ? 'In pausa' : 
                           'Completata'}
                        </span>
                      </div>
                      
                      <div className="mb-6">
                        <p className="text-gray-300 text-lg mb-4">{campaign.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="text-gray-500">
                            <span className="block">Data creazione:</span>
                            <span className="text-gray-300">{formatDate(campaign.createdAt)}</span>
                          </div>
                          <div className="text-gray-500">
                            <span className="block">Ultimo aggiornamento:</span>
                            <span className="text-gray-300">{formatDate(campaign.updatedAt)}</span>
                          </div>
                          <div className="text-gray-500">
                            <span className="block">Prossima sessione:</span>
                            <span className="text-gray-300">
                              {formatDateTime(campaign.nextSessionDate)}
                            </span>
                          </div>
                          <div className="text-gray-500">
                            <span className="block">Game Master:</span>
                            <span className="text-gray-300">
                              {campaign.dmId === user?.uid ? 'Tu' : campaign.dmId}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {hasFiles && (
                        <div className="border-t border-gray-700 pt-6 mb-6">
                          <h2 className="text-xl font-semibold text-yellow-500 mb-4">File</h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {campaign.files?.map((fileUrl, index) => (
                              <a 
                                key={index}
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gray-700 p-3 rounded-md hover:bg-gray-600 text-blue-300 hover:text-blue-200 flex items-center gap-2"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="truncate">File {index + 1}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="border-t border-gray-700 pt-6">
                        <h2 className="text-xl font-semibold text-yellow-500 mb-4">Giocatori</h2>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {campaign.players.map((playerId, index) => (
                            <div key={index} className={`px-3 py-1 rounded-full ${
                              playerId === campaign.dmId 
                                ? 'bg-yellow-900/60 text-yellow-300' 
                                : 'bg-gray-700 text-gray-300'
                            }`}>
                              {getPlayerName(playerId)} {playerId === campaign.dmId ? '(GM)' : ''}
                            </div>
                          ))}
                        </div>
                        
                        {campaign.playerCharacters && Object.keys(campaign.playerCharacters).length > 0 && (
                          <div className="mt-4">
                            <h3 className="text-lg font-semibold text-gray-300 mb-3">Personaggi in gioco</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {Object.entries(campaign.playerCharacters).map(([playerId, characterId]) => (
                                <div key={playerId} className="bg-gray-700/50 p-3 rounded-md">
                                  <div className="text-sm flex justify-between items-center">
                                    <span className="text-yellow-400 font-medium">
                                      {getCharacterName(characterId)}
                                    </span>
                                    <span className="text-gray-400 text-xs">
                                      {getPlayerName(playerId)} {playerId === campaign.dmId ? '(GM)' : ''}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Sezione Link d'accesso (solo per il GM) */}
                      {isGameMaster && (
                        <div className="border-t border-gray-700 pt-6 mt-6">
                          <h2 className="text-xl font-semibold text-yellow-500 mb-4">Link d&apos;accesso</h2>
                          <div className="mb-4">
                            <p className="text-gray-300 mb-2">
                              Condividi questo link con i giocatori per invitarli alla tua campagna:
                            </p>
                            <div className="flex items-center">
                              <div className="bg-gray-700 py-2 px-3 rounded-l-md text-gray-300 flex-1 truncate">
                                {campaign.accessLink ? `${window.location.origin}${campaign.accessLink}` : 'Link non disponibile'}
                              </div>
                              <button 
                                onClick={copyAccessLink}
                                className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-3 rounded-r-md"
                                disabled={!campaign.accessLink}
                              >
                                Copia
                              </button>
                            </div>
                            <p className="text-gray-500 text-sm mt-2">
                              I giocatori potranno selezionare un personaggio prima di unirsi alla campagna.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    {campaign && user && (
                      <CampaignChat 
                        campaignId={campaign.id}
                        messages={campaign.chats || []}
                        userId={user.uid}
                        userName={user.displayName || user.email || 'Utente anonimo'}
                        onNewMessage={handleNewMessage}
                      />
                    )}
                  </div>
                )}
              </>
            )}

            {showConfirmDelete && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
                  <h3 className="text-xl font-bold text-red-500 mb-4">Elimina campagna</h3>
                  <p className="text-gray-300 mb-6">
                    Sei sicuro di voler eliminare questa campagna? Questa azione non può essere annullata.
                  </p>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowConfirmDelete(false)}
                      className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
                      disabled={deleting}
                    >
                      Annulla
                    </button>
                    <button
                      onClick={handleCampaignDelete}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                      disabled={deleting}
                    >
                      {deleting ? (
                        <>
                          <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Eliminazione...
                        </>
                      ) : 'Conferma eliminazione'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-10 bg-gray-800 rounded-lg">
            <p className="text-gray-400">Campagna non trovata.</p>
          </div>
        )}
      </main>
    </div>
  );
} 