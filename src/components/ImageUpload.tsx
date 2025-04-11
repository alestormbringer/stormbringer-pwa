'use client';

import { useState } from 'react';
import { uploadImage } from '@/lib/cloudinary';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ onUpload, label = 'Carica immagine' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError('');

    try {
      const result = await uploadImage(file);
      console.log('Risultato upload:', result);
      if (result && result.secure_url) {
        onUpload(result.secure_url);
      } else {
        throw new Error('URL immagine non disponibile nella risposta');
      }
    } catch (err) {
      console.error('Errore upload:', err);
      setError('Errore durante il caricamento dell\'immagine');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-gray-300">
        {label}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="image-upload"
        />
        <div className="mt-1">
          <label
            htmlFor="image-upload"
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
              isUploading
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-yellow-500 hover:bg-yellow-600 cursor-pointer'
            } text-white`}
          >
            {isUploading ? 'Caricamento...' : 'Seleziona immagine'}
          </label>
        </div>
      </label>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
} 