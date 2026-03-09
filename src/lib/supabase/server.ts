import "server-only";

import { createClient } from "@supabase/supabase-js";

function isPlaceholderValue(value: string | undefined, placeholder: string) {
  return !value || value.includes(placeholder);
}

export function isSupabaseConfigured() {
  return !isPlaceholderValue(process.env.NEXT_PUBLIC_SUPABASE_URL, "your-project-ref") &&
    !isPlaceholderValue(process.env.SUPABASE_SERVICE_ROLE_KEY, "your-supabase-service-role-key")
    ? true
    : !isPlaceholderValue(process.env.NEXT_PUBLIC_SUPABASE_URL, "your-project-ref") &&
        !isPlaceholderValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, "your-supabase-anon-key");
}

export function getSupabaseServerClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
