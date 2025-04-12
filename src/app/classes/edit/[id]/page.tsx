'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { collection, getDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import NavBar from '@/components/NavBar';
import { CharacterClass } from '@/types/gameData';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload';

export default function EditClassPage() {
  const router = useRouter();
  const params = useParams();
  const classId = params?.id as string || '';
  
  // Reindirizza immediatamente alla pagina delle classi
  useEffect(() => {
    router.push('/classes');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center text-yellow-500">Reindirizzamento in corso...</div>
      </main>
    </div>
  );
} 