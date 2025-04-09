import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase URL and anon key
const supabaseUrl = 'https://zqklmviyavwtbbdkxppx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpxa2xtdml5YXZ3dGJiZGt4cHB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MTcxODgsImV4cCI6MjA1OTI5MzE4OH0.dATtm54mcNOCJAmA6L6xsy3ZYPaaBrlqdNz9fhW9rek';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
}); 