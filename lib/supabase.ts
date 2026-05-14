import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Use service_role key if available, otherwise fall back to anon key
// (works when RLS is disabled on the tables)
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey && supabaseServiceKey !== "your_service_role_key_here"
    ? supabaseServiceKey
    : supabaseAnonKey
);

// Client-side client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
