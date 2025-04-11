'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

interface NavBarProps {
  showWorldLinks?: boolean;
}

export default function NavBar({ showWorldLinks = false }: NavBarProps) {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  // Determina automaticamente se mostrare i link per la mappa del mondo
  const shouldShowWorldLinks = showWorldLinks || 
                           (pathname && (
                             pathname.startsWith('/nationalities') || 
                             pathname.startsWith('/world-map')
                           )) || false;

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-green-900 shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center">
              <Image
                src="/IMG_4969.png"
                alt="Stormbringer Logo"
                width={50}
                height={50}
                className="rounded-full"
                style={{ filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.3))' }}
              />
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {shouldShowWorldLinks && (
              <>
                <Link
                  href="/world-map"
                  className={`text-gray-300 hover:text-white px-3 py-2 rounded-md font-medievalsharp ${
                    isActive('/world-map') ? 'bg-green-800' : ''
                  }`}
                >
                  Mappa
                </Link>
                <Link
                  href="/nationalities"
                  className={`text-gray-300 hover:text-white px-3 py-2 rounded-md font-medievalsharp ${
                    isActive('/nationalities') ? 'bg-green-800' : ''
                  }`}
                >
                  Nazioni
                </Link>
              </>
            )}
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="text-gray-300 hover:text-white font-medievalsharp"
                >
                  Profilo
                </Link>
                <button
                  onClick={signOut}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md hover:bg-green-800 font-medievalsharp"
                >
                  Esci
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`text-gray-300 hover:text-white px-3 py-2 rounded-md font-medievalsharp ${
                    isActive('/login') ? 'bg-green-800' : ''
                  }`}
                >
                  Accedi
                </Link>
                <Link
                  href="/register"
                  className={`text-gray-300 hover:text-white px-3 py-2 rounded-md font-medievalsharp ${
                    isActive('/register') ? 'bg-green-800' : ''
                  }`}
                >
                  Registrati
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 