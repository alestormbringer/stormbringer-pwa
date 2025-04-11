# Stormbringer App

Un'applicazione per gestire i personaggi e le avventure nel mondo di Stormbringer.

## Tecnologie utilizzate

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Firebase
- ESLint
- Prettier

## Requisiti

- Node.js 18+
- npm o yarn

## Installazione

1. Clona il repository
2. Installa le dipendenze:
   ```bash
   npm install
   # o
   yarn install
   ```
3. Crea un file `.env.local` con le tue credenziali Firebase
4. Avvia l'applicazione in modalità sviluppo:
   ```bash
   npm run dev
   # o
   yarn dev
   ```

## Script disponibili

- `npm run dev` - Avvia l'applicazione in modalità sviluppo
- `npm run build` - Compila l'applicazione per la produzione
- `npm run start` - Avvia l'applicazione in modalità produzione
- `npm run lint` - Esegue il linting del codice

## Struttura del progetto

```
src/
  ├── app/              # Pagine dell'applicazione
  ├── components/       # Componenti React
  ├── contexts/         # Contesti React
  ├── lib/             # Librerie e utilità
  └── styles/          # Stili globali
```

## Licenza

MIT
