import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stormbringer RPG",
  description: "Il tuo compagno di avventure nel mondo di Stormbringer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

'use client';

import Link from "next/link";
import { AuthProvider } from "@/contexts/AuthContext";
import Auth from "@/components/Auth";
import { useAuth } from "@/contexts/AuthContext";

function NavBar() {
  const { user } = useAuth();

  return (
    <nav className="bg-gray-900 border-b border-yellow-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-yellow-500 text-xl font-bold hover:text-yellow-400 transition-colors">
              Stormbringer
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/deities"
                className="text-gray-300 hover:bg-gray-800 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Divinità
              </Link>
              <Link
                href="/nationalities"
                className="text-gray-300 hover:bg-gray-800 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Nazionalità
              </Link>
              <Link
                href="/weapons"
                className="text-gray-300 hover:bg-gray-800 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Armi
              </Link>
              <Link
                href="/characters"
                className="text-gray-300 hover:bg-gray-800 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Personaggi
              </Link>
              <Link
                href="/campaigns"
                className="text-gray-300 hover:bg-gray-800 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Campagne
              </Link>
            </div>
          </div>
          <div className="ml-4 flex items-center">
            {user ? (
              <div className="text-gray-300">
                {user.email}
              </div>
            ) : (
              <Auth />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <NavBar />
      {children}
    </AuthProvider>
  );
}
