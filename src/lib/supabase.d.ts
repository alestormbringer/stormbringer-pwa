import { SupabaseClient } from '@supabase/supabase-js'

declare module '@/lib/supabase' {
  const supabase: SupabaseClient
  export default supabase
} 