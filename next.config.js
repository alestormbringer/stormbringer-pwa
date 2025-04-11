/** @type {import('next').NextConfig} */
const nextConfig = {
  // Assicurati che l'output sia in modalità standalone per una migliore compatibilità
  output: 'standalone',
  
  // Aggiungi un basePath vuoto per assicurarsi che i percorsi siano corretti
  basePath: '',
  
  // Assicurati che gli asset vengano correttamente referenziati
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : undefined,
  
  // Disabilita temporaneamente la compressione se ci sono problemi
  compress: false,
  
  // Configura i percorsi degli asset statici
  images: {
    domains: ['firebasestorage.googleapis.com'],
    unoptimized: true,
  },
  
  // Disabilita la generazione di ETag per ridurre problemi di caching
  generateEtags: false,
  
  // Impostazioni di deploy sicure
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      {
        // Applica a tutte le rotte
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 