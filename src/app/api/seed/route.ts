import { NextResponse } from 'next/server';

// Disabilitiamo completamente il seed in produzione
export async function GET() {
  // In produzione, restituisci un errore
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({
      success: false,
      message: 'Seed non disponibile in ambiente di produzione'
    }, { status: 403 });
  }
  
  return NextResponse.json({
    success: false,
    message: 'Funzionalità disabilitata temporaneamente'
  }, { status: 503 });
} 