'use client';

import { useEffect } from 'react';
import { AuthProvider } from "@/contexts/AuthContext";
import NavBar from "./NavBar";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from 'next/navigation';

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPage = pathname === '/auth';
  const isHomePage = pathname === '/';
  const isLoginPage = pathname === '/login';
  const isRegisterPage = pathname === '/register';
  const isUnauthenticatedPage = isAuthPage || isLoginPage || isRegisterPage;

  useEffect(() => {
    console.log("ClientLayout - Auth state:", { user: !!user, loading, pathname });
    
    if (!loading) {
      if (!user && !isUnauthenticatedPage) {
        console.log("Utente non autenticato, reindirizzamento alla pagina di login");
        router.push('/auth');
      } else if (user && isUnauthenticatedPage) {
        console.log("Utente già autenticato, reindirizzamento alla dashboard");
        router.push('/dashboard');
      } else if (user && isHomePage) {
        console.log("Utente già autenticato sulla home, reindirizzamento alla dashboard");
        router.push('/dashboard');
      }
    }
  }, [user, loading, router, isUnauthenticatedPage, isHomePage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-yellow-500">Caricamento...</div>
      </div>
    );
  }

  if (!user && !isUnauthenticatedPage) {
    return null;
  }

  return (
    <>
      {user && <NavBar />}
      {children}
    </>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProtectedLayout>{children}</ProtectedLayout>
    </AuthProvider>
  );
} 