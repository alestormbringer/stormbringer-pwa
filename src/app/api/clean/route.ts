import { NextResponse } from 'next/server';
import { cleanDeities } from '@/lib/cleanDeities';

export async function GET() {
  try {
    await cleanDeities();
    return NextResponse.json({ 
      success: true, 
      message: 'Database pulito con successo' 
    });
  } catch (error: any) {
    console.error('Errore durante la pulizia del database:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Errore durante la pulizia del database',
        code: error.code || 'unknown'
      },
      { status: 500 }
    );
  }
} 