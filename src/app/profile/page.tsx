'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { FirebaseError } from 'firebase/app';
import Image from 'next/image';
import { createUserProfile } from '@/firebase/userUtils';
import { uploadImage } from '@/utils/cloudinary';
import NavBar from '@/components/NavBar';

export default function ProfilePage() {
  const { user, updateUserName, updateUserPhoto } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setPhotoURL(user.photoURL || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await updateUserName(displayName);
      setSuccess('Profilo aggiornato con successo!');
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(`Errore durante l'aggiornamento del profilo: ${err.message}`);
      } else {
        setError('Errore durante l\'aggiornamento del profilo');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      setError('');
      const uploadedImageUrl = await uploadImage(file);
      setPhotoURL(uploadedImageUrl);
      
      // Aggiorna la foto profilo in Firebase Auth
      await updateUserPhoto(uploadedImageUrl);
      setSuccess('Immagine profilo aggiornata con successo!');
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(`Errore durante il caricamento dell'immagine: ${err.message}`);
      } else {
        setError('Errore durante il caricamento dell\'immagine');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <>
      <NavBar />
      <div className="min-h-[calc(100vh-4rem)] bg-green-950 flex flex-col items-center justify-center p-4 pt-20">
        <div className="max-w-md w-full bg-green-900 rounded-lg p-6 shadow-lg">
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-32 h-32 mb-4">
              <Image
                src={photoURL || '/default-avatar.png'}
                alt="Avatar"
                width={128}
                height={128}
                className="rounded-full"
                style={{ filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.3))' }}
              />
              <label className="absolute bottom-0 right-0 bg-yellow-500 text-white p-2 rounded-full cursor-pointer hover:bg-yellow-600">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </label>
            </div>
            <h1 className="text-2xl font-bold text-yellow-500 font-medievalsharp">Gestione Profilo</h1>
          </div>

          {error && (
            <div className="bg-red-500 text-white p-3 rounded mb-4 font-medievalsharp">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500 text-white p-3 rounded mb-4 font-medievalsharp">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2 font-medievalsharp" htmlFor="displayName">
                Nome Utente
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 bg-green-800 text-white rounded font-medievalsharp"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors mb-4 font-medievalsharp disabled:opacity-50"
            >
              {isLoading ? 'Salvataggio...' : 'Salva Modifiche'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
} 