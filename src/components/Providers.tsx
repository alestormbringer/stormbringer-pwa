'use client'

import { createContext, useContext, useState } from 'react'
import { ThemeProvider } from 'next-themes'
import { createBrowserClient } from '@supabase/ssr'
import { SupabaseClient } from '@supabase/supabase-js'

type AppContextType = {
  supabase: SupabaseClient
}

export const AppContext = createContext<AppContextType>({} as AppContextType)

export function useAppContext() {
  return useContext(AppContext)
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables')
    }

    return createBrowserClient(
      supabaseUrl,
      supabaseAnonKey
    )
  })

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AppContext.Provider value={{ supabase }}>
        {children}
      </AppContext.Provider>
    </ThemeProvider>
  )
} 