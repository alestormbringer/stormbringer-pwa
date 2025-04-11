'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import NavBar from '@/components/NavBar';
import { CharacterClass } from '@/types/gameData';
import ImageUpload from '@/components/ImageUpload';

export default function AddClassPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [firebaseStatus, setFirebaseStatus] = useState<string>('Verifica connessione...');
  const [isDeleting, setIsDeleting] = useState(false);
  
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

  // Stato per indicare se stiamo creando una variante
  const [isCreatingVariant, setIsCreatingVariant] = useState(false);
  const [parentClass, setParentClass] = useState<CharacterClass | null>(null);
  const [availableClasses, setAvailableClasses] = useState<CharacterClass[]>([]);

  // Verifica se ci sono parametri URL per passare direttamente alla creazione di variante
  // o per modificare una variante esistente
  const [searchParams, setSearchParams] = useState<{variant?: string, editId?: string}>({});
  
  // Verifica connessione a Firebase
  useEffect(() => {
    const checkFirebaseConnection = async () => {
      try {
        // Prova a leggere un documento da una collezione esistente
        console.log('Verifico connessione a Firebase...');
        const snapshot = await getDocs(collection(db, 'classes'));
        console.log('Connessione a Firebase riuscita:', snapshot.size, 'classi trovate');
        setFirebaseStatus(`Connesso a Firebase (${snapshot.size} classi trovate)`);
      } catch (error) {
        console.error('Errore di connessione a Firebase:', error);
        setFirebaseStatus(`Errore di connessione a Firebase: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
      }
    };

    checkFirebaseConnection();
  }, []);

  // Carica le classi disponibili per selezionare la classe genitore
  useEffect(() => {
    const fetchAvailableClasses = async () => {
      try {
        const classesRef = collection(db, 'classes');
        const snapshot = await getDocs(classesRef);
        const classesData = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as CharacterClass[];
        
        // Filtra solo le classi che non sono già varianti
        const mainClasses = classesData.filter(c => !c.isVariant);
        setAvailableClasses(mainClasses);
      } catch (error) {
        console.error('Errore durante il caricamento delle classi:', error);
      }
    };

    fetchAvailableClasses();
  }, []);

  // Verifica se ci sono parametri URL per passare direttamente alla creazione di variante
  // o per modificare una variante esistente
  useEffect(() => {
    // Controlla se siamo su un browser
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const variant = params.get('variant');
      const editId = params.get('editId');
      
      setSearchParams({
        variant: variant || undefined,
        editId: editId || undefined
      });
      
      if (variant === 'true') {
        setIsCreatingVariant(true);
      }
      
      // Se c'è un editId, carica quella classe come variante da modificare
      if (editId) {
        const loadVariantToEdit = async () => {
          try {
            setIsLoading(true);
            const docRef = doc(db, 'classes', editId);
            const snapshot = await getDoc(docRef);
            
            if (snapshot.exists()) {
              const data = snapshot.data() as CharacterClass;
              
              // Prepopola i campi del form
              setClassData({
                name: data.name || '',
                description: data.description || '',
                abilities: data.abilities || [],
                startingEquipment: data.startingEquipment || [],
                bonuses: data.bonuses || [],
                details: data.details || '',
                imageUrl: data.imageUrl || '',
                isVariant: true,
                parentClassId: data.parentClassId || '', // Mantenere il campo parentClassId
                variants: data.variants || []
              });
              
              // Se è una variante e ha una classe genitore, carica quella classe
              if (data.isVariant && data.parentClassId) {
                const parentDocRef = doc(db, 'classes', data.parentClassId);
                const parentSnapshot = await getDoc(parentDocRef);
                
                if (parentSnapshot.exists()) {
                  setParentClass({
                    id: data.parentClassId,
                    ...parentSnapshot.data()
                  } as CharacterClass);
                }
              }
            }
            setIsLoading(false);
          } catch (error) {
            console.error('Errore durante il caricamento della variante da modificare:', error);
            setSaveError('Errore durante il caricamento della variante: ' + (error instanceof Error ? error.message : 'Errore sconosciuto'));
            setIsLoading(false);
          }
        };
        
        loadVariantToEdit();
      }
    }
  }, []);

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
    setImageUrl(url);
    setClassData(prev => ({
      ...prev,
      imageUrl: url
    }));
  };

  const deleteLastClass = async () => {
    setIsDeleting(true);
    try {
      const classesRef = collection(db, 'classes');
      const snapshot = await getDocs(classesRef);
      
      if (snapshot.empty) {
        setSaveError('Nessuna classe trovata da eliminare');
        setIsDeleting(false);
        return;
      }
      
      // Prendi l'ultimo documento aggiunto (assumiamo sia quello che vogliamo eliminare)
      const lastClass = snapshot.docs[snapshot.docs.length - 1];
      
      await deleteDoc(doc(db, 'classes', lastClass.id));
      console.log('Classe eliminata con ID:', lastClass.id);
      
      setSaveSuccess(true);
      
      // Attendere 2 secondi prima di reindirizzare
      setTimeout(() => {
        router.push('/classes');
      }, 2000);
    } catch (error) {
      console.error('Errore durante l\'eliminazione della classe:', error);
      setSaveError(error instanceof Error ? error.message : 'Errore sconosciuto durante l\'eliminazione');
    } finally {
      setIsDeleting(false);
    }
  };

  // Funzione per selezionare la classe genitore
  const selectParentClass = (classId: string) => {
    const selectedClass = availableClasses.find(c => c.id === classId);
    if (selectedClass) {
      setParentClass(selectedClass);
      
      // Imposta alcuni campi predefiniti dalla classe genitore
      setClassData(prev => ({
        ...prev,
        isVariant: true,
        parentClassId: selectedClass.id
      }));
    }
  };

  // Modifica la funzione di submit per gestire anche l'aggiornamento di una variante esistente
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSaveError(null);
    setSaveSuccess(false);
    
    // Recupera l'ID dalla URL se stiamo modificando una variante esistente
    const params = new URLSearchParams(window.location.search);
    const editId = params.get('editId');
    
    try {
      console.log('Dati da salvare:', classData);
      
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
        // Aggiungi i campi per la gestione delle varianti
        isVariant: !!classData.isVariant,
        parentClassId: classData.parentClassId || null,
        variants: []
      };
      
      console.log('Dati sanitizzati da salvare:', classToSave);
      
      // Se stiamo modificando una variante esistente, aggiorniamo il documento invece di crearne uno nuovo
      if (editId) {
        await updateDoc(doc(db, 'classes', editId), classToSave);
        console.log('Variante aggiornata con ID:', editId);
        
        // Se è una variante, aggiorna anche la classe genitore
        if (classData.isVariant && classData.parentClassId && parentClass) {
          const variantInfo = {
            id: editId,
            name: classData.name,
            description: classData.description,
            imageUrl: classData.imageUrl || ''
          };
          
          // Cerca la variante nelle varianti del genitore
          const variants = parentClass.variants || [];
          const variantIndex = variants.findIndex(v => v.id === editId);
          
          if (variantIndex >= 0) {
            variants[variantIndex] = variantInfo; // Aggiorna
          } else {
            variants.push(variantInfo); // Aggiungi
          }
          
          await updateDoc(doc(db, 'classes', classData.parentClassId), {
            variants: variants
          });
          
          console.log('Classe genitore aggiornata con la variante modificata');
        }
      } else {
        // Crea una nuova classe o variante
        const docRef = await addDoc(collection(db, 'classes'), classToSave);
        console.log('Classe salvata con ID:', docRef.id);
        
        // Se è stata creata una variante, aggiorna anche la classe genitore
        if (classData.isVariant && classData.parentClassId && parentClass) {
          const variantInfo = {
            id: docRef.id,
            name: classData.name,
            description: classData.description,
            imageUrl: classData.imageUrl || ''
          };
          
          const parentVariants = Array.isArray(parentClass.variants) ? [...parentClass.variants, variantInfo] : [variantInfo];
          
          await updateDoc(doc(db, 'classes', classData.parentClassId), {
            variants: parentVariants
          });
          
          console.log('Classe genitore aggiornata con la nuova variante');
        }
      }
      
      setSaveSuccess(true);
      
      // Attendere 2 secondi prima di reindirizzare
      setTimeout(() => {
        router.push('/classes');
      }, 2000);
    } catch (error) {
      console.error('Errore durante il salvataggio della classe:', error);
      let errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto durante il salvataggio';
      
      // Gestione specifica per errori HTTP 400
      if (errorMessage.includes('400') || errorMessage.includes('Bad Request')) {
        errorMessage = 'Errore nella richiesta: controlla che non ci siano caratteri speciali o dati non validi nei campi';
        console.error('Dettagli dati:', JSON.stringify(classData));
      }
      
      setSaveError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-yellow-500 mb-8">
          {searchParams?.editId ? 'Modifica Variante' : isCreatingVariant ? 'Aggiungi Variante/Specializzazione' : 'Aggiungi Nuova Classe'}
        </h1>
        
        <div className="mb-4 flex justify-center space-x-4">
          <button
            onClick={() => setIsCreatingVariant(false)}
            className={`px-4 py-2 rounded transition-colors ${!isCreatingVariant 
              ? 'bg-yellow-600 text-white' 
              : 'bg-gray-700 text-gray-300'}`}
          >
            Classe Base
          </button>
          <button
            onClick={() => setIsCreatingVariant(true)}
            className={`px-4 py-2 rounded transition-colors ${isCreatingVariant 
              ? 'bg-yellow-600 text-white' 
              : 'bg-gray-700 text-gray-300'}`}
          >
            Variante/Specializzazione
          </button>
        </div>
        
        {isCreatingVariant && (
          <div className="mb-6 bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-yellow-500 mb-3">Seleziona la Classe Base</h2>
            {availableClasses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableClasses.map(cls => (
                  <div 
                    key={cls.id}
                    onClick={() => selectParentClass(cls.id)}
                    className={`p-3 rounded cursor-pointer border-2 transition-colors ${
                      parentClass?.id === cls.id 
                        ? 'border-yellow-500 bg-gray-700' 
                        : 'border-gray-700 hover:border-yellow-600'
                    }`}
                  >
                    <h3 className="font-bold text-yellow-400">{cls.name}</h3>
                    <p className="text-gray-300 text-sm truncate">{cls.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-300">Nessuna classe base trovata. Crea prima una classe base.</p>
            )}
            
            {parentClass && (
              <div className="mt-4 p-3 bg-gray-700 rounded">
                <p className="text-gray-300">
                  Stai creando una variante di <span className="text-yellow-400 font-bold">{parentClass.name}</span>
                </p>
              </div>
            )}
          </div>
        )}
        
        {(!isCreatingVariant || (isCreatingVariant && parentClass)) && (
          <div className="mb-4 flex justify-center">
            <button
              onClick={deleteLastClass}
              disabled={isDeleting}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors flex items-center"
            >
              {isDeleting ? 'Eliminazione in corso...' : 'Elimina ultima classe creata'}
            </button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="mb-4 p-2 bg-gray-700 text-gray-300 rounded text-sm">
            Stato Firebase: {firebaseStatus}
          </div>
          
          {saveError && (
            <div className="mb-4 p-3 bg-red-700 text-white rounded">
              Errore: {saveError}
            </div>
          )}
          
          {saveSuccess && (
            <div className="mb-4 p-3 bg-green-700 text-white rounded">
              Classe salvata con successo! Reindirizzamento in corso...
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
                
                {imageUrl && (
                  <div className="mt-2">
                    <img 
                      src={imageUrl} 
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
                <ul className="space-y-2">
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
                <ul className="space-y-2">
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
                <ul className="space-y-2">
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
              onClick={() => router.push('/classes')}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 mr-2"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
            >
              {isLoading ? 'Salvataggio...' : 'Salva Classe'}
            </button>
          </div>
        </form>
        <div className="mt-4 text-sm text-gray-400">
          <p><span className="text-red-500">*</span> Campi obbligatori</p>
          <p>Solo il nome, la descrizione e almeno un'abilità sono necessari per creare una classe.</p>
          {isCreatingVariant && parentClass && (
            <p className="mt-2 text-yellow-400">
              Nota: Stai creando una variante di <strong>{parentClass.name}</strong>. 
              Le abilità e i bonus inseriti qui saranno aggiunti a quelli della classe base.
            </p>
          )}
        </div>
      </main>
    </div>
  );
} 