'use client';

import NavBar from '@/components/NavBar';

export default function SummonsPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-yellow-500 mb-4">
            Evocazioni
          </h1>
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <p className="text-3xl text-gray-300 font-semibold">Coming soon...</p>
          </div>
        </div>
      </main>
    </div>
  );
} 