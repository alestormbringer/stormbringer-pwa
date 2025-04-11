'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { collection, getDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import NavBar from '@/components/NavBar';
import { CharacterClass } from '@/types/gameData';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload';

export default function EditClassPage() {
  const router = useRouter();
  const params = useParams();
  const classId = params?.id as string || '';
  
  const [isLoading, setIsLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isVariant, setIsVariant] = useState(false);
  const [parentClass, setParentClass] = useState<CharacterClass | null>(null);
  
  const [classData, setClassData] = useState<Omit<CharacterClass, 'id'>>({
    name: '',
    description: '',
    abilities: [],
    startingEquipment: [],
    bonuses: [],
    details: '',
    variants: []
  });

  // Stato temporaneo per nuove abilità
  const [newAbility, setNewAbility] = useState({
    name: '',
    percentage: 0,
    bonus: ''
  });

  // Stato temporaneo per nuovo equipaggiamento
  const [newEquipment, setNewEquipment] = useState('');

  // Stato temporaneo per nuovi bonus
  const [newBonus, setNewBonus] = useState({
    characteristic: '',
    value: ''
  });

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        setIsLoading(true);
        const docRef = doc(db, 'classes', classId);
        const snapshot = await getDoc(docRef);

        if (!snapshot.exists()) {
          setNotFound(true);
          setError('La classe richiesta non esiste.');
          setIsLoading(false);
          return;
        }

        const data = snapshot.data() as Omit<CharacterClass, 'id'>;
        setClassData(data);
        
        // Controlla se è una variante
        if (data.isVariant && data.parentClassId) {
          setIsVariant(true);
          
          // Carica la classe genitore
          try {
            const parentDocRef = doc(db, 'classes', data.parentClassId);
            const parentSnapshot = await getDoc(parentDocRef);
            
            if (parentSnapshot.exists()) {
              const parentData = {
                id: data.parentClassId,
                ...parentSnapshot.data()
              } as CharacterClass;
              
              setParentClass(parentData);
            }
          } catch (error) {
            console.error('Errore durante il caricamento della classe genitore:', error);
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Errore durante il recupero dei dati della classe:', error);
        setError(error instanceof Error ? error.message : 'Errore sconosciuto');
        setNotFound(true);
        setIsLoading(false);
      }
    };

    if (classId) {
      fetchClassData();
    }
  }, [classId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setClassData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAbilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAbility(prev => ({
      ...prev,
      [name]: name === 'percentage' ? parseInt(value) || 0 : value
    }));
  };

  const handleBonusChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewBonus(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addAbility = () => {
    if (newAbility.name.trim() === '') return;
    
    setClassData(prev => ({
      ...prev,
      abilities: Array.isArray(prev.abilities)
        ? [...prev.abilities, { ...newAbility }]
        : [{ ...newAbility }]
    }));
    
    setNewAbility({
      name: '',
      percentage: 0,
      bonus: ''
    });
  };

  const removeAbility = (index: number) => {
    setClassData(prev => ({
      ...prev,
      abilities: Array.isArray(prev.abilities)
        ? prev.abilities.filter((_, i) => i !== index)
        : []
    }));
  };

  const addEquipment = () => {
    if (newEquipment.trim() === '') return;
    
    setClassData(prev => ({
      ...prev,
      startingEquipment: Array.isArray(prev.startingEquipment) 
        ? [...prev.startingEquipment, newEquipment]
        : [newEquipment]
    }));
    
    setNewEquipment('');
  };

  const removeEquipment = (index: number) => {
    setClassData(prev => ({
      ...prev,
      startingEquipment: Array.isArray(prev.startingEquipment)
        ? prev.startingEquipment.filter((_, i) => i !== index)
        : []
    }));
  };

  const addBonus = () => {
    if (newBonus.characteristic.trim() === '' || newBonus.value.trim() === '') return;
    
    setClassData(prev => ({
      ...prev,
      bonuses: Array.isArray(prev.bonuses) ? [...prev.bonuses, { ...newBonus }] : [{ ...newBonus }]
    }));
    
    setNewBonus({
      characteristic: '',
      value: ''
    });
  };

  const removeBonus = (index: number) => {
    setClassData(prev => ({
      ...prev,
      bonuses: Array.isArray(prev.bonuses) 
        ? prev.bonuses.filter((_, i) => i !== index)
        : []
    }));
  };

  const handleImageUpload = (url: string) => {
    setClassData(prev => ({
      ...prev,
      imageUrl: url
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setError(null);
    setSaveSuccess(false);
    
    try {
      console.log('Dati da aggiornare:', classData);
      
      if (!classData.name || classData.name.trim() === '') {
        throw new Error('Il nome della classe è obbligatorio');
      }
      
      if (!classData.description || classData.description.trim() === '') {
        throw new Error('La descrizione della classe è obbligatoria');
      }
      
      if (!classData.abilities || classData.abilities.length === 0) {
        throw new Error('Aggiungi almeno un\'abilità');
      }
      
      // Assicurati che i campi opzionali esistano, anche se vuoti
      // E sanitizza i dati per evitare errori HTTP 400
      const classToSave = {
        name: classData.name.trim(),
        description: classData.description.trim(),
        abilities: classData.abilities.map(ability => ({
          name: ability.name.trim(),
          percentage: typeof ability.percentage === 'number' && !isNaN(ability.percentage) 
            ? ability.percentage 
            : parseInt(String(ability.percentage || '0')) || 0,
          bonus: ability.bonus ? ability.bonus.trim() : ''
        })),
        startingEquipment: Array.isArray(classData.startingEquipment) 
          ? classData.startingEquipment.map(item => item ? item.trim() : '').filter(Boolean)
          : [],
        bonuses: Array.isArray(classData.bonuses)
          ? classData.bonuses
              .filter(bonus => bonus && typeof bonus === 'object')
              .map(bonus => ({
                characteristic: bonus.characteristic ? bonus.characteristic.trim() : '',
                value: bonus.value ? bonus.value.trim() : ''
              }))
              .filter(bonus => bonus.characteristic && bonus.value)
          : [],
        details: classData.details ? classData.details.trim() : '',
        imageUrl: classData.imageUrl || '',
        // Mantieni i campi per la gestione delle varianti
        isVariant: !!classData.isVariant,
        parentClassId: classData.parentClassId || null,
        variants: Array.isArray(classData.variants) ? classData.variants : []
      };
      
      console.log('Dati sanitizzati da aggiornare:', classToSave);
      
      await updateDoc(doc(db, 'classes', classId), classToSave);
      console.log('Classe aggiornata con ID:', classId);
      
      // Se è una variante, aggiorna anche la classe genitore
      if (isVariant && classData.parentClassId && parentClass) {
        // Trova la variante nella classe genitore
        const variants = parentClass.variants || [];
        const variantIndex = variants.findIndex(v => v.id === classId);
        
        // Aggiorna o aggiungi la variante nei dati del genitore
        const updatedVariant = {
          id: classId,
          name: classData.name,
          description: classData.description,
          imageUrl: classData.imageUrl || ''
        };
        
        const updatedVariants = [...variants];
        if (variantIndex >= 0) {
          updatedVariants[variantIndex] = updatedVariant;
        } else {
          updatedVariants.push(updatedVariant);
        }
        
        // Aggiorna la classe genitore
        await updateDoc(doc(db, 'classes', classData.parentClassId), {
          variants: updatedVariants
        });
        
        console.log('Classe genitore aggiornata');
      }
      
      setSaveSuccess(true);
      
      // Attendere 2 secondi prima di reindirizzare
      setTimeout(() => {
        router.push('/classes');
      }, 2000);
    } catch (error) {
      console.error('Errore durante l\'aggiornamento della classe:', error);
      let errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto durante l\'aggiornamento';
      
      // Gestione specifica per errori HTTP 400
      if (errorMessage.includes('400') || errorMessage.includes('Bad Request')) {
        errorMessage = 'Errore nella richiesta: controlla che non ci siano caratteri speciali o dati non validi nei campi';
        console.error('Dettagli dati:', JSON.stringify(classData));
      }
      
      setError(errorMessage);
      setSaveLoading(false);
    }
  };

  // Funzione per tornare alla lista delle classi
  const goBack = () => {
    router.push('/classes');
  };

  // Nel caso di una variante, anche se eliminiamo la variante dalla classe genitore
  const handleDeleteVariantFromParent = async () => {
    if (!isVariant || !classData.parentClassId || !parentClass) {
      return;
    }

    // Chiedi conferma all'utente
    if (!confirm(`Sei sicuro di voler rimuovere questa variante dalla classe principale ${parentClass.name}? Questo non eliminerà la variante dal database, ma la disconnetterà dalla classe principale.`)) {
      return;
    }

    try {
      setIsLoading(true);

      // Trova la variante nella classe genitore
      const variants = parentClass.variants || [];
      const updatedVariants = variants.filter(v => v.id !== classId);
      
      // Aggiorna la classe genitore
      await updateDoc(doc(db, 'classes', classData.parentClassId), {
        variants: updatedVariants
      });
      
      // Aggiorna anche questa variante per rimuovere il collegamento al genitore
      await updateDoc(doc(db, 'classes', classId), {
        isVariant: false,
        parentClassId: ""
      });
      
      setIsVariant(false);
      setParentClass(null);
      setClassData(prev => ({
        ...prev,
        isVariant: false,
        parentClassId: ""
      }));
      
      alert('Variante scollegata dalla classe principale con successo.');
      setIsLoading(false);
    } catch (error) {
      console.error('Errore durante lo scollegamento della variante:', error);
      alert('Errore durante lo scollegamento della variante: ' + (error instanceof Error ? error.message : 'Errore sconosciuto'));
      setIsLoading(false);
    }
  };

  // Funzione per cambiare la classe genitore di questa variante
  const handleChangeParent = async () => {
    if (!isVariant) {
      return;
    }

    // Chiedi conferma all'utente
    if (!confirm(`Sei sicuro di voler cambiare la classe principale di questa variante? La variante verrà rimossa dalla classe principale corrente.`)) {
      return;
    }

    try {
      // Qui dovresti implementare una UI per selezionare un'altra classe base
      // Per ora, reindirizziamo alla pagina di creazione variante
      router.push(`/classes/add?variant=true&editId=${classId}`);
    } catch (error) {
      console.error('Errore durante il cambio della classe principale:', error);
      alert('Errore durante il cambio della classe principale: ' + (error instanceof Error ? error.message : 'Errore sconosciuto'));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <NavBar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center text-yellow-500">Caricamento dati classe...</div>
        </main>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-900">
        <NavBar />
        <main className="container mx-auto px-4 py-8">
          <div className="bg-red-700 bg-opacity-70 text-white p-4 rounded-lg mb-6">
            <h2 className="text-xl font-bold mb-2">Errore: Classe non trovata</h2>
            <p>{error}</p>
          </div>
          
          <div className="text-center">
            <button 
              onClick={goBack} 
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded transition-colors"
            >
              Torna alla lista delle classi
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-yellow-500 mb-8">
          {isVariant ? 'Modifica Variante' : 'Modifica Classe'}: {classData.name}
        </h1>
        
        {isVariant && parentClass && (
          <div className="mb-6 bg-gray-800 p-4 rounded-lg">
            <p className="text-yellow-400 font-semibold">
              Questa è una variante della classe base: <span className="font-bold">{parentClass.name}</span>
            </p>
            <div className="mt-3 flex space-x-4">
              <button
                onClick={handleDeleteVariantFromParent}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors flex items-center text-sm"
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Scollega da Classe Base
              </button>
              <button
                onClick={handleChangeParent}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors flex items-center text-sm"
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Cambia Classe Base
              </button>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="mb-4 p-2 bg-gray-700 text-gray-300 rounded text-sm">
            Stato Firebase: {isLoading ? 'Caricamento...' : 'Connesso a Firebase - Classe caricata'}
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-700 text-white rounded">
              Errore: {error}
            </div>
          )}
          
          {saveSuccess && (
            <div className="mb-4 p-3 bg-green-700 text-white rounded">
              Classe aggiornata con successo! Reindirizzamento in corso...
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Colonna sinistra */}
            <div>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-300 mb-2">
                  Nome della Classe: <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={classData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-gray-300 mb-2">
                  Descrizione: <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={classData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="details" className="block text-gray-300 mb-2">
                  Dettagli Aggiuntivi: <span className="text-gray-500">(opzionale)</span>
                </label>
                <textarea
                  id="details"
                  name="details"
                  value={classData.details}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <p className="text-gray-400 text-xs mt-1">Inserisci qui dettagli aggiuntivi sulla classe. Questo campo non è obbligatorio.</p>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">
                  Immagine della Classe: <span className="text-gray-500">(opzionale)</span>
                </label>
                <ImageUpload onUpload={handleImageUpload} />
                <p className="text-gray-400 text-xs mt-1">Puoi caricare un'immagine rappresentativa della classe, ma non è obbligatorio.</p>
                
                {classData.imageUrl && (
                  <div className="mt-2">
                    <img 
                      src={classData.imageUrl} 
                      alt="Preview" 
                      className="w-40 h-40 object-cover rounded"
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* Colonna destra - Abilità e dettagli */}
            <div>
              {/* Abilità */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-yellow-500 mb-2 border-b border-yellow-600 pb-1">
                  Abilità <span className="text-red-500">*</span>
                </h3>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    name="name"
                    value={newAbility.name}
                    onChange={handleAbilityChange}
                    placeholder="Nome abilità"
                    className="flex-1 px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <input
                    type="number"
                    name="percentage"
                    value={newAbility.percentage}
                    onChange={handleAbilityChange}
                    placeholder="%"
                    className="w-20 px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <input
                    type="text"
                    name="bonus"
                    value={newAbility.bonus}
                    onChange={handleAbilityChange}
                    placeholder="Bonus"
                    className="w-1/3 px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <button
                    type="button"
                    onClick={addAbility}
                    className="bg-yellow-600 text-white px-3 py-2 rounded hover:bg-yellow-700"
                  >
                    +
                  </button>
                </div>
                <ul className="space-y-2 max-h-60 overflow-y-auto">
                  {classData.abilities.map((ability, index) => (
                    <li key={index} className="flex justify-between items-center p-2 bg-gray-700 rounded">
                      <span className="text-white">{ability.name} - {ability.percentage}%</span>
                      <button
                        type="button"
                        onClick={() => removeAbility(index)}
                        className="text-red-500"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Equipaggiamento Iniziale */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-yellow-500 mb-2 border-b border-yellow-600 pb-1">
                  Equipaggiamento Iniziale <span className="text-gray-500">(opzionale)</span>
                </h3>
                <p className="text-gray-400 text-xs mb-2">Questo campo non è obbligatorio. Puoi lasciarlo vuoto se la classe non ha equipaggiamento particolare.</p>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newEquipment}
                    onChange={(e) => setNewEquipment(e.target.value)}
                    placeholder="Oggetto equipaggiamento"
                    className="flex-1 px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <button
                    type="button"
                    onClick={addEquipment}
                    className="bg-yellow-600 text-white px-3 py-2 rounded hover:bg-yellow-700"
                  >
                    +
                  </button>
                </div>
                <ul className="space-y-2 max-h-40 overflow-y-auto">
                  {classData.startingEquipment.map((item, index) => (
                    <li key={index} className="flex justify-between items-center p-2 bg-gray-700 rounded">
                      <span className="text-white">{item}</span>
                      <button
                        type="button"
                        onClick={() => removeEquipment(index)}
                        className="text-red-500"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Bonus alle Caratteristiche */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-yellow-500 mb-2 border-b border-yellow-600 pb-1">
                  Bonus alle Caratteristiche <span className="text-gray-500">(opzionale)</span>
                </h3>
                <p className="text-gray-400 text-xs mb-2">Questo campo non è obbligatorio. Puoi lasciarlo vuoto se la classe non ha bonus alle caratteristiche.</p>
                <div className="flex space-x-2 mb-2">
                  <select
                    name="characteristic"
                    value={newBonus.characteristic}
                    onChange={handleBonusChange}
                    className="w-1/2 px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="">Seleziona</option>
                    <option value="FOR">Forza (FOR)</option>
                    <option value="COS">Costituzione (COS)</option>
                    <option value="TAG">Taglia (TAG)</option>
                    <option value="INT">Intelligenza (INT)</option>
                    <option value="MAN">Mana (MAN)</option>
                    <option value="DES">Destrezza (DES)</option>
                    <option value="FAS">Fascino (FAS)</option>
                  </select>
                  <input
                    type="text"
                    name="value"
                    value={newBonus.value}
                    onChange={handleBonusChange}
                    placeholder="Valore (es. +1D4)"
                    className="flex-1 px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <button
                    type="button"
                    onClick={addBonus}
                    className="bg-yellow-600 text-white px-3 py-2 rounded hover:bg-yellow-700"
                  >
                    +
                  </button>
                </div>
                <ul className="space-y-2 max-h-40 overflow-y-auto">
                  {classData.bonuses?.map((bonus, index) => (
                    <li key={index} className="flex justify-between items-center p-2 bg-gray-700 rounded">
                      <span className="text-white">{bonus.characteristic}: {bonus.value}</span>
                      <button
                        type="button"
                        onClick={() => removeBonus(index)}
                        className="text-red-500"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={goBack}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 mr-2"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={saveLoading}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
            >
              {saveLoading ? 'Salvataggio...' : 'Aggiorna Classe'}
            </button>
          </div>
        </form>
        <div className="mt-4 text-sm text-gray-400">
          <p><span className="text-red-500">*</span> Campi obbligatori</p>
          <p>Solo il nome, la descrizione e almeno un'abilità sono necessari per creare una classe.</p>
          {isVariant && parentClass && (
            <p className="mt-2 text-yellow-400">
              Nota: Stai modificando una variante di <strong>{parentClass.name}</strong>.
            </p>
          )}
        </div>
      </main>
    </div>
  );
} 