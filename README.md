# Stormbringer PWA

Progressive Web App per il gioco di ruolo Stormbringer, progettata per dispositivi iOS e Android.

## Tecnologie Utilizzate

- Next.js 14
- TypeScript
- Supabase (PostgreSQL e Autenticazione)
- Resend (Email)
- Tailwind CSS
- Vercel (Deployment)

## Funzionalità

- Autenticazione degli utenti
- Gestione dei personaggi
- Gestione delle campagne
- Chat in tempo reale
- Supporto multilingua (Italiano, Inglese)
- Modalità scura
- Installazione come PWA

## Installazione

1. Clona la repository:
```bash
git clone https://github.com/alestormbringer/stormbringer-pwa.git
cd stormbringer-pwa
```

2. Installa le dipendenze:
```bash
npm install
```

3. Crea un file `.env.local` nella root del progetto con le seguenti variabili:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
```

4. Avvia l'applicazione in modalità sviluppo:
```bash
npm run dev
```

## Deployment

L'applicazione è configurata per il deployment su Vercel. Per deployare:

1. Crea un account su [Vercel](https://vercel.com)
2. Connetti il tuo repository GitHub
3. Configura le variabili d'ambiente
4. Fai il deploy

## Struttura del Progetto

```
src/
├── app/              # App router di Next.js
├── components/       # Componenti React
├── lib/             # Utility e configurazioni
├── types/           # Definizioni TypeScript
└── public/          # File statici
```

## Contribuire

1. Fork la repository
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Commit le tue modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push sul branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## Licenza

Distribuito sotto la Licenza MIT. Vedi `LICENSE` per maggiori informazioni. 