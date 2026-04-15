import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Use a global singleton to prevent duplicate clients when Next.js bundles
// this module into multiple chunks (layout vs page). Duplicate clients cause
// auth session desync and hung REST queries on hard refresh.
const globalKey = '__supabase_client' as const;
const globalStore = (typeof window !== 'undefined' ? window : globalThis) as unknown as Record<string, SupabaseClient>;

export const supabase: SupabaseClient = globalStore[globalKey] ??= createClient(supabaseUrl, supabaseAnonKey);
