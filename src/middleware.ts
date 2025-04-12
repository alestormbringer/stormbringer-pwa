import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Blocca l'accesso alle rotte di modifica e aggiunta delle classi
  if (request.nextUrl.pathname.startsWith('/classes/edit') || 
      request.nextUrl.pathname.startsWith('/classes/add')) {
    return NextResponse.redirect(new URL('/classes', request.url))
  }

  return NextResponse.next()
}

// Configurazione del middleware - specifica su quali percorsi dovrebbe essere eseguito
export const config = {
  matcher: [
    '/classes/edit/:path*',
    '/classes/add/:path*'
  ]
} 