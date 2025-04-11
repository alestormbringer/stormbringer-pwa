import { NextResponse } from 'next/server';
import { auth } from '@/firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';

export async function GET() {
  try {
    return NextResponse.json({
      status: 'ok',
      message: 'Firebase connessione attiva',
      authConfigured: !!auth
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Errore nel test di connessione Firebase',
      error: String(error)
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({
        status: 'error',
        message: 'Email e password sono richiesti'
      }, { status: 400 });
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return NextResponse.json({
        status: 'ok',
        message: 'Login riuscito',
        uid: userCredential.user.uid,
        email: userCredential.user.email
      });
    } catch (error: any) {
      return NextResponse.json({
        status: 'error',
        message: 'Login fallito',
        errorCode: error.code,
        errorMessage: error.message
      }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Errore nell\'elaborazione della richiesta',
      error: String(error)
    }, { status: 500 });
  }
} 