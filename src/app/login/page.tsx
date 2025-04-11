'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { FirebaseError } from 'firebase/app';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();

  // Chiudi l'alert dopo 5 secondi
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowAlert(false);
    
    try {
      console.log(`Tentativo di login con: ${email}`);
      await signIn(email, password);
      router.push('/dashboard');
    } catch (err) {
      setShowAlert(true);
      if (err instanceof FirebaseError) {
        console.log(`Errore Firebase: ${err.code}`);
        switch (err.code) {
          case 'auth/invalid-credential':
            setError('Email o password non corretti');
            break;
          case 'auth/too-many-requests':
            setError('Troppi tentativi falliti. Prova più tardi o reimposta la password');
            break;
          case 'auth/user-not-found':
            setError('Nessun utente trovato con questa email');
            break;
          case 'auth/wrong-password':
            setError('Password non corretta');
            break;
          case 'auth/invalid-email':
            setError('Formato email non valido');
            break;
          default:
            setError(`Errore di autenticazione: ${err.message}`);
        }
      } else {
        setError('Errore durante l\'accesso');
      }
      console.error('Errore di login:', err);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setShowAlert(false);
    
    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (err) {
      setShowAlert(true);
      if (err instanceof FirebaseError) {
        console.log(`Errore Firebase: ${err.code}`);
        setError(`Errore durante l'accesso con Google: ${err.message}`);
      } else {
        setError('Errore durante l\'accesso con Google');
      }
      console.error('Errore di login con Google:', err);
    }
  };

  return (
    <div className="min-h-screen bg-green-950 flex flex-col items-center justify-center">
      <main className="container mx-auto px-4">
        {showAlert && error && (
          <div className="fixed top-20 right-4 left-4 md:right-10 md:left-auto md:w-1/3 bg-red-600 text-white p-4 rounded-lg shadow-lg z-50 animate-bounce">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="font-medium font-medievalsharp">{error}</span>
              </div>
              <button
                onClick={() => setShowAlert(false)}
                className="text-white hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
        <div className="max-w-md mx-auto bg-green-900 rounded-lg p-6 shadow-lg">
          <div className="flex flex-col items-center mb-6">
            <Image
              src="/IMG_4969.png"
              alt="Stormbringer Logo"
              width={100}
              height={100}
              className="rounded-full mb-4"
              style={{ filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.3))' }}
            />
            <h1 className="text-2xl font-bold text-yellow-500 font-medievalsharp">Stormbringer</h1>
            
            {/* Pulsanti di navigazione tra login e registrazione */}
            <div className="flex mt-4 bg-green-800 rounded-lg p-1">
              <Link
                href="/login"
                className="px-4 py-2 rounded-md text-white bg-yellow-600 font-medievalsharp"
              >
                Accedi
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-md text-gray-300 font-medievalsharp"
              >
                Registrati
              </Link>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-500 text-white p-3 rounded mb-4 font-medievalsharp">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2 font-medievalsharp" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-green-800 text-white rounded font-medievalsharp"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2 font-medievalsharp" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-green-800 text-white rounded font-medievalsharp"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors mb-4 font-medievalsharp"
            >
              Accedi
            </button>
          </form>
          
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-green-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-green-900 text-gray-300 font-medievalsharp">oppure</span>
            </div>
          </div>
          
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center bg-white text-gray-800 px-4 py-2 rounded hover:bg-gray-200 transition-colors font-medievalsharp"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"
              />
            </svg>
            Accedi con Google
          </button>
        </div>
      </main>
    </div>
  );
} 