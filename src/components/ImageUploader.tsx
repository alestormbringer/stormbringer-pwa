'use client';

import { useState } from 'react';
import { uploadImage } from '@/lib/cloudinary';

interface ImageUploaderProps {
  onUploadComplete: (url: string) => void;
  label?: string;
}

export default function ImageUploader({ onUploadComplete, label = 'Carica Immagine' }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verifica il tipo di file
    if (!file.type.startsWith('image/')) {
      setError('Per favore carica solo file immagine');
      return;
    }

    // Verifica la dimensione del file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('L\'immagine non può essere più grande di 5MB');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Simula il progresso di caricamento
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const imageUrl = await uploadImage(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      onUploadComplete(imageUrl);
      
      // Reset dopo il successo
      setTimeout(() => {
        setUploadProgress(0);
        setIsUploading(false);
      }, 1000);
    } catch (err) {
      console.error('Errore di caricamento:', err);
      setError(err instanceof Error ? err.message : 'Errore durante il caricamento dell\'immagine');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-200">
          {label}
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="block w-full text-sm text-gray-400
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-yellow-500 file:text-black
            hover:file:bg-yellow-400
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {isUploading && (
        <div className="space-y-2">
          <div className="h-2 bg-gray-700 rounded">
            <div
              className="h-full bg-yellow-500 rounded transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-400">
            Caricamento in corso... {uploadProgress}%
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-2 rounded text-sm">
          {error}
        </div>
      )}
    </div>
  );
} 