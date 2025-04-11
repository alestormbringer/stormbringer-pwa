'use client';

import { useState } from 'react';
import NavBar from '@/components/NavBar';
import MapCoordinateHelper from '@/components/MapCoordinateHelper';

interface Region {
  id: string;
  name: string;
  shape: 'poly' | 'rect' | 'circle';
  coords: number[];
  alt: string;
  href: string;
}

export default function MapEditorPage() {
  const [mode, setMode] = useState<'circle' | 'poly'>('circle');
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [currentCoords, setCurrentCoords] = useState<number[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const handleCoordinatesGenerated = (coords: number[]) => {
    setCurrentCoords(coords);
  };

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMode(e.target.value as 'circle' | 'poly');
  };

  const handleAddRegion = () => {
    if (!name || !id || currentCoords.length === 0) return;
    
    const slug = id.toLowerCase().replace(/\s+/g, '-');
    
    const newRegion: Region = {
      id: slug,
      name,
      shape: mode,
      coords: currentCoords,
      alt: name,
      href: `/nationalities/${slug}`
    };

    if (editingIndex !== null) {
      // Stiamo modificando una regione esistente
      const updatedRegions = [...regions];
      updatedRegions[editingIndex] = newRegion;
      setRegions(updatedRegions);
      setEditingIndex(null);
    } else {
      // Stiamo aggiungendo una nuova regione
      setRegions([...regions, newRegion]);
    }
    
    // Reset dei campi
    setName('');
    setId('');
    setCurrentCoords([]);
  };

  const handleEditRegion = (index: number) => {
    const region = regions[index];
    setName(region.name);
    setId(region.id);
    setMode(region.shape as 'circle' | 'poly');
    setCurrentCoords(region.coords);
    setEditingIndex(index);
  };

  const handleCancelEdit = () => {
    setName('');
    setId('');
    setCurrentCoords([]);
    setEditingIndex(null);
  };

  const handleCopyCode = () => {
    const regionsCode = regions.map(region => {
      return `  {
    id: '${region.id}',
    name: '${region.name}',
    shape: '${region.shape}',
    coords: [${region.coords.join(', ')}],
    alt: '${region.alt}',
    href: '${region.href}'
  }`;
    }).join(',\n');
    
    const code = `const regions: Region[] = [\n${regionsCode}\n];`;
    navigator.clipboard.writeText(code);
    alert('Codice copiato negli appunti!');
  };

  const handleDeleteRegion = (index: number) => {
    const updatedRegions = [...regions];
    updatedRegions.splice(index, 1);
    setRegions(updatedRegions);
  };

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoomLevel(parseFloat(e.target.value));
  };

  return (
    <>
      <NavBar />
      <div className="bg-green-950 min-h-screen pt-16 pb-10 px-4 overflow-auto">
        <div className="mx-auto">
          <h1 className="text-4xl font-medievalsharp text-yellow-500 mb-6 text-center">
            Editor della Mappa
          </h1>
          
          <div className="bg-green-900 p-4 rounded-lg shadow-lg mb-6">
            <p className="text-green-100 mb-4 font-medievalsharp">
              Usa questo strumento per configurare le coordinate delle regioni sulla mappa. 
              Clicca sulla mappa per posizionare i punti, poi aggiungi la regione all'elenco.
            </p>
            
            <div className="flex items-center">
              <label className="text-green-100 mr-2 font-medievalsharp">Zoom:</label>
              <input 
                type="range" 
                min="0.5" 
                max="1.5" 
                step="0.1"
                value={zoomLevel} 
                onChange={handleZoomChange}
                className="w-32 mr-2" 
              />
              <span className="text-green-100 font-medievalsharp">{Math.round(zoomLevel * 100)}%</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 overflow-auto">
              <div className="bg-green-900 p-4 rounded-lg inline-block">
                <div style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}>
                  <MapCoordinateHelper 
                    imageUrl="/images/map/world-map.png" 
                    width={1000} 
                    height={750} 
                    onCoordinatesGenerated={handleCoordinatesGenerated}
                    mode={mode}
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-green-900 p-4 rounded-lg shadow-lg sticky top-20 self-start h-fit max-h-[calc(100vh-6rem)] overflow-y-auto">
              <h2 className="text-2xl font-medievalsharp text-yellow-500 mb-4">
                {editingIndex !== null ? 'Modifica Regione' : 'Aggiungi Regione'}
              </h2>
              
              <div className="mb-4">
                <label className="block text-green-100 mb-2 font-medievalsharp">Tipo di Forma:</label>
                <select 
                  value={mode} 
                  onChange={handleModeChange}
                  className="w-full bg-green-800 text-white px-3 py-2 rounded"
                >
                  <option value="circle">Cerchio</option>
                  <option value="poly">Poligono</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-green-100 mb-2 font-medievalsharp">Nome Regione:</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-green-800 text-white px-3 py-2 rounded"
                  placeholder="es. Melniboné"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-green-100 mb-2 font-medievalsharp">ID Regione:</label>
                <input 
                  type="text" 
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="w-full bg-green-800 text-white px-3 py-2 rounded"
                  placeholder="es. melnibone"
                />
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={handleAddRegion}
                  disabled={!name || !id || currentCoords.length === 0}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded font-medievalsharp disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                >
                  {editingIndex !== null ? 'Salva Modifiche' : 'Aggiungi Regione'}
                </button>
                
                {editingIndex !== null && (
                  <button 
                    onClick={handleCancelEdit}
                    className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded font-medievalsharp mb-4"
                  >
                    Annulla
                  </button>
                )}
              </div>
              
              <div className="mt-6">
                <h3 className="text-xl font-medievalsharp text-yellow-500 mb-2">
                  Regioni Configurate ({regions.length})
                </h3>
                
                <div className="max-h-60 overflow-y-auto bg-green-800 p-2 rounded mb-4">
                  {regions.length === 0 ? (
                    <p className="text-green-200 italic">Nessuna regione configurata</p>
                  ) : (
                    <ul className="list-disc list-inside">
                      {regions.map((region, index) => (
                        <li key={index} className="text-green-100 mb-2 flex items-center justify-between">
                          <span>
                            <span className="font-bold">{region.name}</span> ({region.shape})
                          </span>
                          <div className="flex space-x-1">
                            <button 
                              onClick={() => handleEditRegion(index)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 text-xs rounded"
                              title="Modifica regione"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => handleDeleteRegion(index)}
                              className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 text-xs rounded"
                              title="Elimina regione"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                
                <button 
                  onClick={handleCopyCode}
                  disabled={regions.length === 0}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-medievalsharp disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Copia Codice Regioni
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 