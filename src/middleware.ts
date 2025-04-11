import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Ottieni l'header origin dalla richiesta
  const origin = request.headers.get('origin') || '';
  
  // Crea una risposta NextResponse
  const response = NextResponse.next();
  
  // Aggiungi gli header CORS alla risposta
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  
  return response;
}

// Configurazione del middleware - specifica su quali percorsi dovrebbe essere eseguito
export const config = {
  matcher: [
    '/:path*', // Applica a tutte le rotte
  ],
} 