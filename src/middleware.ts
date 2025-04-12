import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Blocca l'accesso alle rotte di modifica e aggiunta delle classi
  if (path.startsWith('/classes/edit') || 
      path.startsWith('/classes/add')) {
    return NextResponse.redirect(new URL('/classes', request.url));
  }

  return NextResponse.next();
}

// Configurazione del middleware - specifica su quali percorsi dovrebbe essere eseguito
export const config = {
  matcher: [
    '/classes/edit/:path*',
    '/classes/add/:path*'
  ]
} 