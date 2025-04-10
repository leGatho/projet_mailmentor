import { createClient } from '@supabase/supabase-js';

// Configuration de Supabase
const supabaseUrl = 'https://taalhnzoaiazagmeeawq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhYWxobnpvYWlhemFnbWVlYXdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMDYwMTcsImV4cCI6MjA1OTc4MjAxN30.mCCAssqegmUXUH7-ar0U9aAJF8ZlXZ7Kw846Me2dj8Y';

// Création du client Supabase
export const supabase = createClient(supabaseUrl, supabaseKey); 