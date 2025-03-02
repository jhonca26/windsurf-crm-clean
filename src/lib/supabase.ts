import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mokstlcwwpwpsfeilygi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1va3N0bGN3d3B3cHNmZWlseWdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3ODIyMjYsImV4cCI6MjA1NjM1ODIyNn0.a3ByyulKG_2NBWjRSAqJ0m7D6od74ne-gDsA9io1wXU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
