import { NextResponse } from 'next/server';
import { seedNationalities } from '@/lib/seedNationalities';

export async function POST() {
  try {
    console.log('Inizio importazione nazionalità...');
    const result = await seedNationalities();
    console.log('Importazione completata con successo');
    return NextResponse.json({ success: true, message: 'Nazionalità importate con successo' });
  } catch (error) {
    console.error('Errore dettagliato durante l\'importazione:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Errore durante l\'importazione delle nazionalità',
        error: error instanceof Error ? error.message : 'Errore sconosciuto'
      },
      { status: 500 }
    );
  }
} 