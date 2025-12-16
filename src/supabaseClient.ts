
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseKey = (import.meta as any).env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Faltam as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
