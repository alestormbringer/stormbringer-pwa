import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { NationalityData } from '@/hooks/useNationality';

interface AddNationalityFormProps {
  initialData?: NationalityData;
  mode?: 'add' | 'edit';
}

export default function AddNationalityForm({ initialData, mode = 'add' }: AddNationalityFormProps) {
  const router = useRouter();
  const [nationality, setNationality] = useState<NationalityData>(
    initialData || {
      name: '',
      description: '',
      region: '',
      culture: '',
      language: '',
      traits: [],
      languages: [],
      specialAbilities: [],
      startingEquipment: [],
      imageUrl: '',
      characterCreation: '',
      raceTraits: '',
      bonuses: [],
      skillBonuses: []
    }
  );

  // Stato per i nuovi campi di input
  const [newTrait, setNewTrait] = useState({ name: '', description: '' });
  const [newLanguage, setNewLanguage] = useState('');
  const [newAbility, setNewAbility] = useState({ name: '', description: '' });
  const [newEquipment, setNewEquipment] = useState('');
  const [newBonus, setNewBonus] = useState({ characteristic: '', value: 0, description: '' });
  const [newSkillBonus, setNewSkillBonus] = useState({ category: '', skillName: '', value: 0, description: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const nationalitiesRef = collection(db, 'nationalities');
      await addDoc(nationalitiesRef, nationality);
      alert('Nazionalità aggiunta con successo!');
      setNationality({
        name: '',
        description: '',
        region: '',
        culture: '',
        language: '',
        traits: [],
        languages: [],
        specialAbilities: [],
        startingEquipment: [],
        imageUrl: '',
        characterCreation: '',
        raceTraits: '',
        bonuses: [],
        skillBonuses: []
      });
    } catch (error) {
      console.error('Error adding nationality:', error);
      alert('Errore durante l\'aggiunta della nazionalità');
    }
  };

  const handleSpecialAbilityChange = (index: number, field: 'name' | 'description', value: string) => {
    setNationality(prev => {
      const newAbilities = [...(prev.specialAbilities || [])];
      if (!newAbilities[index]) {
        newAbilities[index] = { name: '', description: '' };
      }
      newAbilities[index][field] = value;
      return { ...prev, specialAbilities: newAbilities };
    });
  };

  const addSpecialAbility = () => {
    setNationality(prev => ({
      ...prev,
      specialAbilities: [...(prev.specialAbilities || []), { name: '', description: '' }]
    }));
  };

  const handleEquipmentChange = (value: string) => {
    setNationality(prev => ({
      ...prev,
      startingEquipment: value.split(',').map(item => item.trim())
    }));
  };

  const handleBonusAdd = () => {
    if (newBonus.characteristic && newBonus.value !== undefined) {
      setNationality({
        ...nationality,
        bonuses: [...(nationality.bonuses || []), { ...newBonus }]
      });
      setNewBonus({ characteristic: '', value: 0, description: '' });
    }
  };

  const handleBonusRemove = (index: number) => {
    const updatedBonuses = [...(nationality.bonuses || [])];
    updatedBonuses.splice(index, 1);
    setNationality({
      ...nationality,
      bonuses: updatedBonuses
    });
  };

  const handleSkillBonusAdd = () => {
    if (newSkillBonus.category && newSkillBonus.skillName && newSkillBonus.value !== undefined) {
      setNationality({
        ...nationality,
        skillBonuses: [...(nationality.skillBonuses || []), { ...newSkillBonus }]
      });
      setNewSkillBonus({ category: '', skillName: '', value: 0, description: '' });
    }
  };

  const handleSkillBonusRemove = (index: number) => {
    const updatedSkillBonuses = [...(nationality.skillBonuses || [])];
    updatedSkillBonuses.splice(index, 1);
    setNationality({
      ...nationality,
      skillBonuses: updatedSkillBonuses
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Aggiungi una nuova Nazionalità</h2>
      
      <div>
        <label className="block text-sm font-medium mb-1">Nome</label>
        <input
          type="text"
          value={nationality.name}
          onChange={(e) => setNationality(prev => ({ ...prev, name: e.target.value }))}
          className="w-full p-2 bg-gray-700 rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Descrizione</label>
        <textarea
          value={nationality.description}
          onChange={(e) => setNationality(prev => ({ ...prev, description: e.target.value }))}
          className="w-full p-2 bg-gray-700 rounded"
          rows={4}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Cultura</label>
        <input
          type="text"
          value={nationality.culture}
          onChange={(e) => setNationality(prev => ({ ...prev, culture: e.target.value }))}
          className="w-full p-2 bg-gray-700 rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Lingua</label>
        <input
          type="text"
          value={nationality.language}
          onChange={(e) => setNationality(prev => ({ ...prev, language: e.target.value }))}
          className="w-full p-2 bg-gray-700 rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Abilità Speciali</label>
        {(nationality.specialAbilities || []).map((ability, index) => (
          <div key={index} className="mb-2 space-y-2">
            <input
              type="text"
              placeholder="Nome abilità"
              value={ability.name}
              onChange={(e) => handleSpecialAbilityChange(index, 'name', e.target.value)}
              className="w-full p-2 bg-gray-700 rounded"
            />
            <input
              type="text"
              placeholder="Descrizione"
              value={ability.description}
              onChange={(e) => handleSpecialAbilityChange(index, 'description', e.target.value)}
              className="w-full p-2 bg-gray-700 rounded"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addSpecialAbility}
          className="btn-primary mt-2"
        >
          Aggiungi Abilità
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Equipaggiamento Iniziale (separato da virgola)</label>
        <input
          type="text"
          value={nationality.startingEquipment?.join(', ')}
          onChange={(e) => handleEquipmentChange(e.target.value)}
          className="w-full p-2 bg-gray-700 rounded"
        />
      </div>

      {/* Bonus alle Caratteristiche */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-yellow-400">Bonus alle Caratteristiche</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-300 mb-1">Caratteristica</label>
            <select
              value={newBonus.characteristic}
              onChange={(e) => setNewBonus({ ...newBonus, characteristic: e.target.value })}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            >
              <option value="">Seleziona Caratteristica</option>
              <option value="FOR">FOR (Forza)</option>
              <option value="COS">COS (Costituzione)</option>
              <option value="TAG">TAG (Taglia)</option>
              <option value="INT">INT (Intelligenza)</option>
              <option value="MAN">MAN (Manipolazione)</option>
              <option value="DES">DES (Destrezza)</option>
              <option value="FAS">FAS (Fascino)</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Valore</label>
            <input
              type="number"
              value={newBonus.value}
              onChange={(e) => setNewBonus({ ...newBonus, value: parseInt(e.target.value) })}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Descrizione (opzionale)</label>
            <input
              type="text"
              value={newBonus.description}
              onChange={(e) => setNewBonus({ ...newBonus, description: e.target.value })}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            />
          </div>
        </div>
        
        <button
          type="button"
          onClick={handleBonusAdd}
          className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Aggiungi Bonus
        </button>
        
        {nationality.bonuses && nationality.bonuses.length > 0 && (
          <div className="mt-2">
            <h3 className="text-lg font-medium text-white mb-2">Bonus aggiunti:</h3>
            <ul className="space-y-2">
              {nationality.bonuses.map((bonus, index) => (
                <li key={index} className="flex justify-between items-center p-2 bg-gray-700 rounded">
                  <span>
                    {bonus.characteristic}: {bonus.value > 0 ? `+${bonus.value}` : bonus.value}
                    {bonus.description && ` - ${bonus.description}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleBonusRemove(index)}
                    className="text-red-400 hover:text-red-500"
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Bonus alle Abilità */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-yellow-400">Bonus alle Abilità</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-gray-300 mb-1">Categoria</label>
            <select
              value={newSkillBonus.category}
              onChange={(e) => setNewSkillBonus({ ...newSkillBonus, category: e.target.value })}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            >
              <option value="">Seleziona Categoria</option>
              <option value="Agilità">Agilità</option>
              <option value="Comunicazione">Comunicazione</option>
              <option value="Conoscenza">Conoscenza</option>
              <option value="Leggere-Scrivere/Parlare">Leggere-Scrivere/Parlare</option>
              <option value="Manipolazione">Manipolazione</option>
              <option value="Percezione">Percezione</option>
              <option value="Furtività">Furtività</option>
              <option value="Evocazione">Evocazione</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Nome Abilità</label>
            <input
              type="text"
              value={newSkillBonus.skillName}
              onChange={(e) => setNewSkillBonus({ ...newSkillBonus, skillName: e.target.value })}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Valore (%)</label>
            <input
              type="number"
              value={newSkillBonus.value}
              onChange={(e) => setNewSkillBonus({ ...newSkillBonus, value: parseInt(e.target.value) })}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Descrizione (opzionale)</label>
            <input
              type="text"
              value={newSkillBonus.description}
              onChange={(e) => setNewSkillBonus({ ...newSkillBonus, description: e.target.value })}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            />
          </div>
        </div>
        
        <button
          type="button"
          onClick={handleSkillBonusAdd}
          className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Aggiungi Bonus Abilità
        </button>
        
        {nationality.skillBonuses && nationality.skillBonuses.length > 0 && (
          <div className="mt-2">
            <h3 className="text-lg font-medium text-white mb-2">Bonus alle abilità aggiunti:</h3>
            <ul className="space-y-2">
              {nationality.skillBonuses.map((bonus, index) => (
                <li key={index} className="flex justify-between items-center p-2 bg-gray-700 rounded">
                  <span>
                    {bonus.category} - {bonus.skillName}: {bonus.value > 0 ? `+${bonus.value}%` : `${bonus.value}%`}
                    {bonus.description && ` - ${bonus.description}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSkillBonusRemove(index)}
                    className="text-red-400 hover:text-red-500"
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button type="submit" className="btn-primary w-full">
        Aggiungi Nazionalità
      </button>
    </form>
  );
} 