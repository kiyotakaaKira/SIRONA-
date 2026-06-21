import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co'
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-key'

  // Will return a client even if URL/key are empty — calls will fail gracefully
  return createBrowserClient(url, key)
}
