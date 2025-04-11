'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import { useNationality } from '@/hooks/useNationality';
import NationalityDetails from '@/components/NationalityDetails';

export default function NationalityPage({ params }: { params: { slug: string } }) {
  const { nationality, loading, error } = useNationality(undefined, params.slug);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/nationalities"
            className="flex items-center text-blue-400 hover:text-blue-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Torna all'elenco delle nazionalità
          </Link>
        </div>

        <NationalityDetails 
          nationality={nationality} 
          loading={loading} 
          error={error} 
          showCharacterCreation={true}
          showFullDetails={true}
        />
      </main>
    </div>
  );
} 