import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Blocca l'accesso alle rotte di modifica e aggiunta delle classi
  if (path.startsWith('/classes/edit') || 
      path.startsWith('/classes/add') ||
      path.startsWith('/api/classes')) {
    
    // Se è una richiesta API, restituisci un errore 403
    if (path.startsWith('/api/classes')) {
      return new NextResponse(
        JSON.stringify({ error: 'Operazione non permessa' }),
        { 
          status: 403, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          } 
        }
      );
    }
    
    // Altrimenti reindirizza alla pagina delle classi
    return NextResponse.redirect(new URL('/classes', request.url));
  }

  return NextResponse.next();
}

// Configurazione del middleware - specifica su quali percorsi dovrebbe essere eseguito
export const config = {
  matcher: [
    '/classes/edit/:path*',
    '/classes/add/:path*',
    '/api/classes/:path*'
  ]
} 