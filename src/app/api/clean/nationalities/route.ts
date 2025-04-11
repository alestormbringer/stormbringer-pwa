import { NextResponse } from 'next/server';
import { cleanNationalities } from '@/lib/cleanNationalities';

export async function POST() {
  try {
    await cleanNationalities();
    return NextResponse.json({ success: true, message: 'Nazionalità rimosse con successo' });
  } catch (error) {
    console.error('Errore durante la rimozione delle nazionalità:', error);
    return NextResponse.json(
      { success: false, message: 'Errore durante la rimozione delle nazionalità' },
      { status: 500 }
    );
  }
} 