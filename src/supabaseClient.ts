import { createClient } from '@supabase/supabase-js';

// Pega as chaves do arquivo .env ou do sistema da Vercel
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Cria a conexão
export const supabase = createClient(supabaseUrl, supabaseKey);