import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

// Check if Supabase environment variables are properly configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Debug environment variables
console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key length:", supabaseAnonKey?.length);

// Create Supabase client with fallback for development
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient<Database>(supabaseUrl, supabaseAnonKey)
    : null;

// Function to check if Supabase is properly configured
export function isSupabaseConfigured() {
  if (!supabase) return false;

  // Check if environment variables are set and not placeholder values
  const isUrlValid = supabaseUrl && supabaseUrl.includes("supabase.co");
  const isKeyValid = supabaseAnonKey && supabaseAnonKey.length > 20;

  return isUrlValid && isKeyValid;
}
