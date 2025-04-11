'use client';

import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { uploadImage } from '@/lib/cloudinary';

interface DeityFormData {
  name: string;
  domain: string;
  alignment: string;
  description: string;
  symbol: string;
  category: 'Legge' | 'Caos' | 'Elementali' | 'Signori delle bestie';
  imageFile?: File;
}

const categories = [
  { name: 'Legge', icon: '⚖️' },
  { name: 'Caos', icon: '💥' },
  { name: 'Elementali', icon: '🌍' },
  { name: 'Signori delle bestie', icon: '🐾' }
] as const;

const chaosDeities = [
  {
    name: 'Pyaray',
    domain: 'Acqua, Follia',
    alignment: 'Caos',
    description: 'Il Signore delle Acque Folli, noto per la sua natura imprevedibile e distruttiva.',
    symbol: 'Onda distorta',
    category: 'Caos' as const
  },
  {
    name: 'Arioch',
    domain: 'Guerra, Potere',
    alignment: 'Caos',
    description: 'Il Duca del Caos, uno dei più potenti Signori del Caos.',
    symbol: 'Spada fiammeggiante',
    category: 'Caos' as const
  },
  {
    name: 'Ornunlu',
    domain: 'Conoscenza, Segreti',
    alignment: 'Caos',
    description: 'Il Custode delle Conoscenze Proibite.',
    symbol: 'Libro aperto con occhi',
    category: 'Caos' as const
  },
  {
    name: 'Chardhros',
    domain: 'Morte, Decadenza',
    alignment: 'Caos',
    description: 'Il Signore della Morte e della Decadenza.',
    symbol: 'Teschio con corna',
    category: 'Caos' as const
  },
  {
    name: 'Balo',
    domain: 'Fuoco, Distruzione',
    alignment: 'Caos',
    description: 'Il Signore del Fuoco e della Distruzione.',
    symbol: 'Fiamma nera',
    category: 'Caos' as const
  },
  {
    name: 'Narjhan',
    domain: 'Inganno, Illusione',
    alignment: 'Caos',
    description: 'Il Maestro degli Inganni e delle Illusioni.',
    symbol: 'Maschera sorridente',
    category: 'Caos' as const
  },
  {
    name: 'Checkalakh',
    domain: 'Pestilenza, Malattia',
    alignment: 'Caos',
    description: 'Il Portatore di Pestilenze e Malattie.',
    symbol: 'Serpente avvelenato',
    category: 'Caos' as const
  },
  {
    name: 'Xiombarg',
    domain: 'Guerra, Conquista',
    alignment: 'Caos',
    description: 'La Regina della Guerra e della Conquista.',
    symbol: 'Spada e scudo incrociati',
    category: 'Caos' as const
  },
  {
    name: 'Mabelrode',
    domain: 'Tempo, Destino',
    alignment: 'Caos',
    description: 'Il Signore del Tempo e del Destino.',
    symbol: 'Clessidra rotta',
    category: 'Caos' as const
  },
  {
    name: 'Vezhan',
    domain: 'Oscurità, Paura',
    alignment: 'Caos',
    description: 'Il Signore dell\'Oscurità e della Paura.',
    symbol: 'Occhio nell\'oscurità',
    category: 'Caos' as const
  },
  {
    name: 'Hionhurn',
    domain: 'Gelo, Inverno',
    alignment: 'Caos',
    description: 'Il Signore del Gelo e dell\'Inverno Eterno.',
    symbol: 'Fiocco di neve nero',
    category: 'Caos' as const
  },
  {
    name: 'Eequor',
    domain: 'Aria, Tempesta',
    alignment: 'Caos',
    description: 'Il Signore dell\'Aria e delle Tempeste.',
    symbol: 'Fulmine contorto',
    category: 'Caos' as const
  },
  {
    name: 'Darnizhaan',
    domain: 'Terra, Terremoti',
    alignment: 'Caos',
    description: 'Il Signore della Terra e dei Terremoti.',
    symbol: 'Montagna spezzata',
    category: 'Caos' as const
  },
  {
    name: 'Balan',
    domain: 'Sangue, Sacrificio',
    alignment: 'Caos',
    description: 'Il Signore del Sangue e dei Sacrifici.',
    symbol: 'Goccia di sangue',
    category: 'Caos' as const
  },
  {
    name: 'Maluk',
    domain: 'Ombra, Inganno',
    alignment: 'Caos',
    description: 'Il Signore delle Ombre e dell\'Inganno.',
    symbol: 'Ombra con occhi rossi',
    category: 'Caos' as const
  },
  {
    name: 'Malchin',
    domain: 'Morte, Rinascita',
    alignment: 'Caos',
    description: 'Il Signore della Morte e della Rinascita.',
    symbol: 'Falena nera',
    category: 'Caos' as const
  },
  {
    name: 'Zhortra',
    domain: 'Fuoco, Passione',
    alignment: 'Caos',
    description: 'Il Signore del Fuoco e della Passione.',
    symbol: 'Cuore fiammeggiante',
    category: 'Caos' as const
  },
  {
    name: 'Urleh',
    domain: 'Acqua, Profondità',
    alignment: 'Caos',
    description: 'Il Signore delle Acque Profonde.',
    symbol: 'Tentacolo',
    category: 'Caos' as const
  },
  {
    name: 'Teer',
    domain: 'Terra, Forza',
    alignment: 'Caos',
    description: 'Il Signore della Terra e della Forza Bruta.',
    symbol: 'Pugno di roccia',
    category: 'Caos' as const
  }
];

const lawDeities = [
  {
    name: 'Donblas',
    domain: 'Giustizia, Ordine',
    alignment: 'Legge',
    description: 'Il Signore della Giustizia e dell\'Ordine, custode della legge divina.',
    symbol: 'Bilancia dorata',
    category: 'Legge' as const
  },
  {
    name: 'Lady Miggea',
    domain: 'Equilibrio, Armonia',
    alignment: 'Legge',
    description: 'La Signora dell\'Equilibrio e dell\'Armonia, protettrice dell\'ordine naturale.',
    symbol: 'Cerchio perfetto',
    category: 'Legge' as const
  },
  {
    name: 'Arkyn',
    domain: 'Saggezza, Conoscenza',
    alignment: 'Legge',
    description: 'Il Signore della Saggezza e della Conoscenza, guida dei saggi.',
    symbol: 'Libro aperto con luce',
    category: 'Legge' as const
  },
  {
    name: 'Quelch',
    domain: 'Protezione, Difesa',
    alignment: 'Legge',
    description: 'Il Signore della Protezione e della Difesa, guardiano dei deboli.',
    symbol: 'Scudo con stella',
    category: 'Legge' as const
  }
];

const elementalDeities = [
  {
    name: 'Straasha',
    domain: 'Acqua, Mare',
    alignment: 'Neutrale',
    description: 'La Signora delle Acque e del Mare, protettrice dei naviganti.',
    symbol: 'Tridente con onde',
    category: 'Elementali' as const
  },
  {
    name: 'Grome',
    domain: 'Terra, Montagne',
    alignment: 'Neutrale',
    description: 'Il Signore della Terra e delle Montagne, custode delle profondità.',
    symbol: 'Montagna con cristalli',
    category: 'Elementali' as const
  },
  {
    name: 'Lassa',
    domain: 'Aria, Vento',
    alignment: 'Neutrale',
    description: 'La Signora dell\'Aria e del Vento, messaggera degli dei.',
    symbol: 'Vortice di vento',
    category: 'Elementali' as const
  },
  {
    name: 'Kakatal',
    domain: 'Fuoco, Calore',
    alignment: 'Neutrale',
    description: 'Il Signore del Fuoco e del Calore, forgiatore di metalli.',
    symbol: 'Fiamma eterna',
    category: 'Elementali' as const
  }
];

const beastLords = [
  {
    name: 'Meerclar',
    domain: 'Gatti, Agilità',
    alignment: 'Neutrale',
    description: 'La Signora dei Gatti e dell\'Agilità, protettrice dei felini.',
    symbol: 'Occhio di gatto',
    category: 'Signori delle bestie' as const
  },
  {
    name: 'Fileet',
    domain: 'Uccelli, Libertà',
    alignment: 'Neutrale',
    description: 'La Signora degli Uccelli e della Libertà, messaggera dei cieli.',
    symbol: 'Piuma dorata',
    category: 'Signori delle bestie' as const
  },
  {
    name: 'Roofdrak',
    domain: 'Draghi, Potere',
    alignment: 'Neutrale',
    description: 'Il Signore dei Draghi e del Potere, custode della saggezza antica.',
    symbol: 'Ali di drago',
    category: 'Signori delle bestie' as const
  },
  {
    name: 'Nnuuurrr\'c\'c',
    domain: 'Serpenti, Mistero',
    alignment: 'Neutrale',
    description: 'Il Signore dei Serpenti e del Mistero, guardiano dei segreti.',
    symbol: 'Serpente attorcigliato',
    category: 'Signori delle bestie' as const
  },
  {
    name: 'Haaashaastaak',
    domain: 'Ragni, Tessitura',
    alignment: 'Neutrale',
    description: 'La Signora dei Ragni e della Tessitura, maestra delle trame.',
    symbol: 'Ragnatela dorata',
    category: 'Signori delle bestie' as const
  },
  {
    name: 'Jaanumaarh',
    domain: 'Lupi, Branco',
    alignment: 'Neutrale',
    description: 'Il Signore dei Lupi e del Branco, protettore dei cacciatori.',
    symbol: 'Zanna di lupo',
    category: 'Signori delle bestie' as const
  },
  {
    name: 'P!p!pp\'hhhh\'p',
    domain: 'Insetti, Adattamento',
    alignment: 'Neutrale',
    description: 'Il Signore degli Insetti e dell\'Adattamento, maestro del cambiamento.',
    symbol: 'Ali di insetto',
    category: 'Signori delle bestie' as const
  },
  {
    name: 'Skuiiiiiiii',
    domain: 'Pesci, Profondità',
    alignment: 'Neutrale',
    description: 'La Signora dei Pesci e delle Profondità, custode degli abissi.',
    symbol: 'Squama iridescente',
    category: 'Signori delle bestie' as const
  },
  {
    name: 'Uurr-Rzzzr',
    domain: 'Orsi, Forza',
    alignment: 'Neutrale',
    description: 'Il Signore degli Orsi e della Forza, protettore delle foreste.',
    symbol: 'Artiglio d\'orso',
    category: 'Signori delle bestie' as const
  },
  {
    name: 'Hhaabar\'mmpa',
    domain: 'Elefanti, Saggezza',
    alignment: 'Neutrale',
    description: 'La Signora degli Elefanti e della Saggezza, custode della memoria.',
    symbol: 'Zanna d\'avorio',
    category: 'Signori delle bestie' as const
  },
  {
    name: 'Shwa-Shwaa',
    domain: 'Aquile, Vista',
    alignment: 'Neutrale',
    description: 'La Signora delle Aquile e della Vista, guardiana delle altezze.',
    symbol: 'Artiglio d\'aquila',
    category: 'Signori delle bestie' as const
  },
  {
    name: 'Keheheh',
    domain: 'Iene, Opportunismo',
    alignment: 'Neutrale',
    description: 'Il Signore delle Iene e dell\'Opportunismo, maestro dell\'astuzia.',
    symbol: 'Risata di iena',
    category: 'Signori delle bestie' as const
  },
  {
    name: 'Sssss\'\'sss\'ssaan',
    domain: 'Serpenti, Veleno',
    alignment: 'Neutrale',
    description: 'Il Signore dei Serpenti e del Veleno, maestro della trasformazione.',
    symbol: 'Dente di serpente',
    category: 'Signori delle bestie' as const
  },
  {
    name: 'Wvvyy\'hunnh\'',
    domain: 'Cavalli, Velocità',
    alignment: 'Neutrale',
    description: 'La Signora dei Cavalli e della Velocità, protettrice dei viaggiatori.',
    symbol: 'Zoccolo alato',
    category: 'Signori delle bestie' as const
  },
  {
    name: 'Muru\'ah',
    domain: 'Tigri, Eleganza',
    alignment: 'Neutrale',
    description: 'La Signora delle Tigri e dell\'Eleganza, maestra della caccia.',
    symbol: 'Striscia di tigre',
    category: 'Signori delle bestie' as const
  }
];

export default function AddDeityForm() {
  const [formData, setFormData] = useState<DeityFormData>({
    name: '',
    domain: '',
    alignment: '',
    description: '',
    symbol: '',
    category: 'Legge'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let imageUrl = '';
      if (formData.imageFile) {
        imageUrl = await uploadImage(formData.imageFile);
      }

      const deityData = {
        ...formData,
        imageUrl,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'deities'), deityData);
      setSuccess(true);
      setFormData({
        name: '',
        domain: '',
        alignment: '',
        description: '',
        symbol: '',
        category: 'Legge'
      });
    } catch (err) {
      setError('Errore durante il salvataggio della divinità');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, imageFile: e.target.files![0] }));
    }
  };

  const addChaosDeities = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      for (const deity of chaosDeities) {
        await addDoc(collection(db, 'deities'), {
          ...deity,
          createdAt: new Date().toISOString()
        });
      }
      setSuccess(true);
    } catch (err) {
      setError('Errore durante il salvataggio delle divinità');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addLawDeities = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      for (const deity of lawDeities) {
        await addDoc(collection(db, 'deities'), {
          ...deity,
          createdAt: new Date().toISOString()
        });
      }
      setSuccess(true);
    } catch (err) {
      setError('Errore durante il salvataggio delle divinità');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addElementalDeities = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      for (const deity of elementalDeities) {
        await addDoc(collection(db, 'deities'), {
          ...deity,
          createdAt: new Date().toISOString()
        });
      }
      setSuccess(true);
    } catch (err) {
      setError('Errore durante il salvataggio delle divinità');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addBeastLords = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      for (const deity of beastLords) {
        await addDoc(collection(db, 'deities'), {
          ...deity,
          createdAt: new Date().toISOString()
        });
      }
      setSuccess(true);
    } catch (err) {
      setError('Errore durante il salvataggio delle divinità');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold text-yellow-500 mb-6">Aggiungi una nuova divinità</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900 text-red-200 rounded-lg">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-900 text-green-200 rounded-lg">
          Divinità aggiunta con successo!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-300 mb-2">Nome</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-gray-700 text-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Categoria</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-gray-700 text-gray-300 rounded-lg"
          >
            {categories.map(category => (
              <option key={category.name} value={category.name}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Dominio</label>
          <input
            type="text"
            name="domain"
            value={formData.domain}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-gray-700 text-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Allineamento</label>
          <input
            type="text"
            name="alignment"
            value={formData.alignment}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-gray-700 text-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Simbolo</label>
          <input
            type="text"
            name="symbol"
            value={formData.symbol}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-gray-700 text-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Immagine</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 bg-gray-700 text-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-300 mb-2">Descrizione</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-3 py-2 bg-gray-700 text-gray-300 rounded-lg"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2 px-4 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-400 disabled:opacity-50"
        >
          {loading ? 'Salvataggio...' : 'Aggiungi Divinità'}
        </button>

        <button
          type="button"
          onClick={addChaosDeities}
          disabled={loading}
          className="flex-1 py-2 px-4 bg-red-500 text-white font-bold rounded-lg hover:bg-red-400 disabled:opacity-50"
        >
          {loading ? 'Salvataggio...' : 'Aggiungi Divinità del Caos'}
        </button>

        <button
          type="button"
          onClick={addLawDeities}
          disabled={loading}
          className="flex-1 py-2 px-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 disabled:opacity-50"
        >
          {loading ? 'Salvataggio...' : 'Aggiungi Divinità della Legge'}
        </button>

        <button
          type="button"
          onClick={addElementalDeities}
          disabled={loading}
          className="flex-1 py-2 px-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-400 disabled:opacity-50"
        >
          {loading ? 'Salvataggio...' : 'Aggiungi Divinità Elementali'}
        </button>

        <button
          type="button"
          onClick={addBeastLords}
          disabled={loading}
          className="flex-1 py-2 px-4 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-400 disabled:opacity-50"
        >
          {loading ? 'Salvataggio...' : 'Aggiungi Signori delle Bestie'}
        </button>
      </div>
    </form>
  );
} 