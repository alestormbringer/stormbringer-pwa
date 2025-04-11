'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { FirebaseError } from 'firebase/app';
import Image from 'next/image';
import { createUserProfile } from '@/firebase/userUtils';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!displayName.trim()) {
      setError('Il nome utente è obbligatorio');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Le password non coincidono');
      return;
    }
    
    if (password.length < 6) {
      setError('La password deve contenere almeno 6 caratteri');
      return;
    }
    
    try {
      await signUp(email, password, displayName.trim());
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case 'auth/email-already-in-use':
            setError('Questa email è già registrata');
            break;
          case 'auth/invalid-email':
            setError('Formato email non valido');
            break;
          case 'auth/weak-password':
            setError('La password è troppo debole');
            break;
          default:
            setError(`Errore durante la registrazione: ${err.message}`);
        }
      } else {
        setError('Errore durante la registrazione');
      }
      console.error('Errore di registrazione:', err);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    
    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof FirebaseError) {
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
                className="px-4 py-2 rounded-md text-gray-300 font-medievalsharp"
              >
                Accedi
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-md text-white bg-yellow-600 font-medievalsharp"
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
              <label className="block text-gray-300 mb-2 font-medievalsharp" htmlFor="displayName">
                Nome Utente
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 bg-green-800 text-white rounded font-medievalsharp"
                placeholder="Come vuoi essere chiamato?"
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
            <div className="mb-4">
              <label className="block text-gray-300 mb-2 font-medievalsharp" htmlFor="confirmPassword">
                Conferma Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 bg-green-800 text-white rounded font-medievalsharp"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors mb-4 font-medievalsharp"
            >
              Registrati
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
            Continua con Google
          </button>
        </div>
      </main>
    </div>
  );
} 