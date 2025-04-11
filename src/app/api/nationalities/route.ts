import { NextResponse } from 'next/server';
import { db } from '@/firebase/config';
import { collection, getDocs } from 'firebase/firestore';

export async function GET() {
  try {
    const nationalitiesRef = collection(db, 'nationalities');
    const snapshot = await getDocs(nationalitiesRef);
    const nationalities = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ success: true, nationalities });
  } catch (error) {
    console.error('Errore durante il recupero delle nazionalità:', error);
    return NextResponse.json(
      { success: false, message: 'Errore durante il recupero delle nazionalità' },
      { status: 500 }
    );
  }
} 