import { NextResponse } from 'next/server';
import { db } from '@/firebase/config';
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';

export async function GET() {
  try {
    // Tenta di leggere la lista delle campagne 
    const campaignsRef = collection(db, 'campaigns');
    const snapshot = await getDocs(campaignsRef);
    
    const campaigns = [];
    snapshot.forEach(doc => {
      campaigns.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    return NextResponse.json({
      status: 'ok',
      message: 'Firestore leggibile, campagne recuperate',
      count: campaigns.length,
      firestoreConfigured: !!db
    });
  } catch (error) {
    console.error('Test API Firestore error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Errore nel test di connessione Firestore',
      error: String(error)
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    // Crea un documento di test
    const testDoc = {
      name: 'Test Persistenza',
      description: 'Documento di test per verificare la persistenza Firestore',
      createdAt: Timestamp.fromDate(new Date()),
      testId: `test-${Date.now()}`
    };
    
    const testRef = collection(db, 'persistenceTests');
    const newDoc = await addDoc(testRef, testDoc);
    
    return NextResponse.json({
      status: 'ok',
      message: 'Documento di test creato con successo',
      docId: newDoc.id,
      data: testDoc
    });
  } catch (error) {
    console.error('Test API Firestore create error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Errore nella creazione del documento di test',
      error: String(error)
    }, { status: 500 });
  }
} 