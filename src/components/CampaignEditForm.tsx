import { useState, useEffect } from 'react';
import { Campaign } from '@/types/campaign';
import { Timestamp } from 'firebase/firestore';

interface CampaignEditFormProps {
  campaign: Campaign;
  onSubmit: (data: Partial<Campaign>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function CampaignEditForm({ campaign, onSubmit, onCancel, loading = false }: CampaignEditFormProps) {
  const [formData, setFormData] = useState<Partial<Campaign>>({
    name: '',
    description: '',
    status: 'active',
    nextSessionDate: null,
  });
  const [fileInputs, setFileInputs] = useState<string[]>(['']);

  useEffect(() => {
    // Popola il form con i dati della campagna esistente
    setFormData({
      name: campaign.name,
      description: campaign.description,
      status: campaign.status,
      nextSessionDate: campaign.nextSessionDate,
    });
    
    // Inizializza gli input dei file
    setFileInputs(campaign.files?.length ? campaign.files : ['']);
  }, [campaign]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      nextSessionDate: value ? new Date(value) : null 
    }));
  };

  const handleFileChange = (index: number, value: string) => {
    const newFileInputs = [...fileInputs];
    newFileInputs[index] = value;
    setFileInputs(newFileInputs);
    
    // Aggiorna formData.files rimuovendo gli input vuoti
    const files = newFileInputs.filter(url => url.trim() !== '');
    setFormData(prev => ({ ...prev, files }));
  };

  const addFileInput = () => {
    setFileInputs([...fileInputs, '']);
  };

  const removeFileInput = (index: number) => {
    const newFileInputs = fileInputs.filter((_, i) => i !== index);
    setFileInputs(newFileInputs);
    
    // Aggiorna formData.files
    const files = newFileInputs.filter(url => url.trim() !== '');
    setFormData(prev => ({ ...prev, files }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Funzione per convertire Timestamp in formato YYYY-MM-DDTHH:MM
  const formatDateForInput = (date: Date | Timestamp | null | undefined) => {
    if (!date) return '';
    
    const dateObj = date instanceof Timestamp ? date.toDate() : date;
    return new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-yellow-500 mb-6">Modifica Campagna</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-300 mb-2">
            Nome Campagna
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Inserisci il nome della campagna"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-300 mb-2">
            Descrizione
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 min-h-[100px]"
            placeholder="Descrivi la tua campagna..."
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="status" className="block text-gray-300 mb-2">
            Stato
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="active">Attiva</option>
            <option value="paused">In pausa</option>
            <option value="completed">Completata</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="nextSessionDate" className="block text-gray-300 mb-2">
            Data prossima sessione (opzionale)
          </label>
          <input
            type="datetime-local"
            id="nextSessionDate"
            name="nextSessionDate"
            value={formatDateForInput(formData.nextSessionDate)}
            onChange={handleDateChange}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-300 mb-2">
            File allegati (URL) - opzionale
          </label>
          
          {fileInputs.map((fileUrl, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="url"
                value={fileUrl}
                onChange={(e) => handleFileChange(index, e.target.value)}
                className="flex-grow px-3 py-2 bg-gray-700 text-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="URL del file"
              />
              <button
                type="button"
                onClick={() => removeFileInput(index)}
                className="px-3 py-2 bg-red-700 text-white rounded-r-md hover:bg-red-800"
              >
                -
              </button>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addFileInput}
            className="mt-2 px-3 py-1 bg-gray-700 text-white rounded-md hover:bg-gray-600"
          >
            + Aggiungi un altro file
          </button>
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            disabled={loading}
          >
            Annulla
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 flex items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Aggiornamento in corso...
              </>
            ) : (
              'Salva Modifiche'
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 