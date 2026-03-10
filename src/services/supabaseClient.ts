import { createClient } from '@supabase/supabase-js';

// Mesmo projeto Supabase do Sistema LKM — schemas separados garantem isolamento total
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zvuxzrfbmmbhuhwaofrn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2dXh6cmZibW1iaHVod2FvZnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2ODkxNDEsImV4cCI6MjA4MjI2NTE0MX0.GpA8qLVeLF01x0baSALC1AmRTcKL90ALpxt35qKLVTQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'fioravante_auth_session', // chave diferente do LKM — sessões nunca se misturam
  },
  db: {
    schema: 'fioravante', // TODAS as queries vão para o schema fioravante, nunca para public
  },
});

export const isSupabaseConfigured = true;
