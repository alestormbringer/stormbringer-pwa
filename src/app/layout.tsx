import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { MedievalSharp } from 'next/font/google';
import { AuthProvider } from "@/contexts/AuthContext";
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const medievalSharp = MedievalSharp({ 
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-medievalsharp',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Stormbringer App',
  description: 'Applicazione per la gestione dei personaggi di Stormbringer',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <head>
        <link rel="icon" href="/IMG_4969.png" />
        <Script id="firebase-connection-check" strategy="afterInteractive">
          {`
            function checkOnlineStatus() {
              var isOnline = navigator.onLine;
              console.log('Stato connessione:', isOnline ? 'Online' : 'Offline');
              
              if (isOnline) {
                document.documentElement.classList.remove('offline-mode');
              } else {
                document.documentElement.classList.add('offline-mode');
                console.warn('App in modalità offline - potrebbe esserci una limitata persistenza dei dati');
              }
            }
            
            // Controlla lo stato della connessione all'avvio
            checkOnlineStatus();
            
            // Aggiungi listener per i cambiamenti di stato della connessione
            window.addEventListener('online', checkOnlineStatus);
            window.addEventListener('offline', checkOnlineStatus);
            
            // Controlla anche Firebase persisitence status
            window.addEventListener('storage', function(e) {
              if (e.key === 'firebase:previous_tab_closed') {
                console.log('Tab Firebase precedente chiusa, tentativo di riconnessione...');
                location.reload();
              }
            });
          `}
        </Script>
      </head>
      <body className={`${inter.variable} ${medievalSharp.variable}`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
