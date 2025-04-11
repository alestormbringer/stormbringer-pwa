import { CldUploadWidget } from 'next-cloudinary';

// Funzioni per l'upload delle immagini
export const uploadImage = async (file: File) => {
  console.log('Caricamento file:', file.name, file.size, file.type);
  
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  
  if (!cloudName || !uploadPreset) {
    console.error('Configurazione Cloudinary mancante:', { 
      cloudName: cloudName ? 'OK' : 'Mancante', 
      uploadPreset: uploadPreset ? 'OK' : 'Mancante' 
    });
    throw new Error('Configurazione Cloudinary incompleta');
  }
  
  console.log('Configurazione Cloudinary:', { 
    cloudName: cloudName, 
    uploadPreset: uploadPreset 
  });
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  console.log('API URL:', apiUrl);
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    });

    console.log('Risposta Cloudinary status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Errore Cloudinary:', errorData);
      throw new Error(`Errore durante il caricamento dell'immagine: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Risposta Cloudinary success:', data.secure_url);
    return data; 
  } catch (error) {
    console.error('Errore di caricamento:', error);
    throw error;
  }
};

// Funzione per generare l'URL dell'immagine
export const getImageUrl = (publicId: string, options: any = {}) => {
  const baseUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
  const transformations = Object.entries(options)
    .map(([key, value]) => `${key}_${value}`)
    .join(',');
  
  return `${baseUrl}/${transformations ? transformations + '/' : ''}${publicId}`;
};

// Funzione per eliminare un'immagine
export const deleteImage = async (publicId: string) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = await fetch('/api/cloudinary-signature', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ publicId, timestamp }),
  }).then(res => res.json());

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/destroy`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        public_id: publicId,
        signature: signature.signature,
        timestamp: timestamp,
        api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Errore durante l\'eliminazione dell\'immagine');
  }

  return response.json();
}; 