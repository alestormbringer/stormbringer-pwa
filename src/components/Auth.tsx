'use client';

import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError('');
    } catch (err) {
      setError('Errore durante il login');
      console.error(err);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setError('');
    } catch (err) {
      setError('Errore durante la registrazione');
      console.error(err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Errore durante il logout:', err);
    }
  };

  return (
    <div className="p-4">
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded"
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex space-x-4">
          <button
            onClick={handleSignIn}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Accedi
          </button>
          <button
            onClick={handleSignUp}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Registrati
          </button>
          <button
            onClick={handleSignOut}
            className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </form>
    </div>
  );
} 