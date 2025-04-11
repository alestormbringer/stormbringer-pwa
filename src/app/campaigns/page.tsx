'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import NavBar from '@/components/NavBar';
import { createCampaign, getUserCampaigns } from '@/firebase/campaignUtils';
import { Campaign, CampaignFormData } from '@/types/campaign';
import CampaignForm from '@/components/CampaignForm';
import { Timestamp } from 'firebase/firestore';

export default function CampaignsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Funzione per caricare le campagne
  const loadCampaigns = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      console.log("Inizio caricamento campagne per l'utente:", user.uid);
      const userCampaigns = await getUserCampaigns(user.uid);
      console.log("Campagne caricate con successo:", userCampaigns);
      setCampaigns(userCampaigns);
      // Pulisce eventuali errori precedenti
      setError(null);
    } catch (err) {
      console.error('Errore nel caricamento delle campagne:', err);
      setError('Si è verificato un errore nel caricamento delle campagne. Riprova più tardi.');
      // Se le campagne non vengono caricate, mostra comunque un array vuoto
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  // Effettua il caricamento delle campagne quando l'utente è autenticato
  useEffect(() => {
    // Pulisci sempre il sessionStorage all'avvio per evitare riferimenti a campagne eliminate
    if (typeof window !== 'undefined') {
      console.log('Pulizia sessionStorage per evitare riferimenti a campagne eliminate');
      sessionStorage.removeItem('userCampaigns');
    }
    
    console.log("Stato autenticazione:", { user, authLoading });
    
    if (authLoading) {
      console.log("Autenticazione in corso...");
      return;
    }
    
    if (!user) {
      console.log("Nessun utente autenticato, reindirizzamento al login");
      router.push('/login');
      return;
    }

    loadCampaigns();

    // Controlla se viene da un'altra pagina e deve ricaricare
    if (typeof window !== 'undefined' && sessionStorage.getItem('reloadCampaigns') === 'true') {
      console.log("Flag di ricaricamento trovato, ricarico le campagne");
      // Rimuovi il flag
      sessionStorage.removeItem('reloadCampaigns');
    }
  }, [user, authLoading, router]);

  const handleCreateCampaign = async (formData: CampaignFormData) => {
    if (!user) {
      console.error("Tentativo di creare una campagna senza utente autenticato");
      return;
    }
    
    try {
      setCreating(true);
      console.log("Inizio creazione campagna:", formData);
      const newCampaign = await createCampaign(formData, user.uid);
      console.log("Campagna creata con successo:", newCampaign);
      
      // Ricarica tutte le campagne per assicurarsi che l'elenco sia aggiornato
      await loadCampaigns();
      
      setShowForm(false);
      setError(null);
    } catch (err) {
      console.error('Errore nella creazione della campagna:', err);
      setError('Si è verificato un errore durante la creazione della campagna.');
    } finally {
      setCreating(false);
    }
  };

  const formatDate = (date: Date | Timestamp | undefined) => {
    if (!date) return 'N/A';
    
    try {
      // Gestisci il caso in cui date proviene da sessionStorage e potrebbe essere un oggetto JSON
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
        return 'Data non valida';
      }
      
      return new Intl.DateTimeFormat('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(dateObj);
    } catch (error) {
      console.error('Errore nella formattazione della data:', error, date);
      return 'Errore data';
    }
  };

  const formatDateTime = (date: Date | Timestamp | undefined) => {
    if (!date) return null;
    
    try {
      // Gestisci il caso in cui date proviene da sessionStorage e potrebbe essere un oggetto JSON
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
      return 'Errore data';
    }
  };

  const handleCampaignClick = (campaign: Campaign) => {
    console.log("Navigazione alla pagina della campagna:", campaign.id);
    router.push(`/campaigns/${campaign.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-yellow-500 mb-4">
            Campagne
          </h1>
          <p className="text-gray-300 text-lg">
            Gestisci le tue campagne di Stormbringer
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 text-red-200 rounded-md">
            {error}
          </div>
        )}

        {!showForm && (
          <div className="mb-6 flex justify-end">
            <button 
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
              onClick={() => setShowForm(true)}
            >
              <span>Crea nuova campagna</span>
              <span>+</span>
            </button>
          </div>
        )}

        {showForm && (
          <div className="mb-8">
            <CampaignForm 
              onSubmit={handleCreateCampaign} 
              onCancel={() => setShowForm(false)}
              loading={creating}
            />
          </div>
        )}

        {loading || authLoading ? (
          <div className="text-center py-10">
            <p className="text-gray-400">Caricamento campagne...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {campaigns.map((campaign) => (
              <div 
                key={campaign.id}
                className="bg-gray-800 rounded-lg p-6 shadow-lg hover:bg-gray-750 cursor-pointer transition duration-200"
                onClick={() => handleCampaignClick(campaign)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h2 className="text-2xl font-bold text-yellow-500">
                    {campaign.name}
                  </h2>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    campaign.status === 'active' ? 'bg-green-900 text-green-300' :
                    campaign.status === 'paused' ? 'bg-yellow-900 text-yellow-300' :
                    'bg-gray-700 text-gray-300'
                  }`}>
                    {campaign.status === 'active' ? 'Attiva' :
                     campaign.status === 'paused' ? 'In pausa' : 'Completata'}
                  </span>
                </div>
                <p className="text-gray-400 mb-4">{campaign.description}</p>
                <div className="flex flex-col gap-2 text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>Creata: {formatDate(campaign.createdAt)}</span>
                    <span>Giocatori: {campaign.players.length}</span>
                  </div>
                  {campaign.nextSessionDate && (
                    <div className="mt-2 px-3 py-1 bg-yellow-900/30 text-yellow-300 rounded-md">
                      Prossima sessione: {formatDateTime(campaign.nextSessionDate)}
                    </div>
                  )}
                  {campaign.files && campaign.files.length > 0 && (
                    <div className="mt-1 text-blue-400">
                      <span>{campaign.files.length} file allegati</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {campaigns.length === 0 && !loading && !showForm && !authLoading && (
          <div className="text-center py-10 bg-gray-800 rounded-lg">
            <p className="text-gray-400">Non hai ancora campagne attive.</p>
            <button 
              className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md"
              onClick={() => setShowForm(true)}
            >
              Crea la tua prima campagna
            </button>
          </div>
        )}
      </main>
    </div>
  );
} 