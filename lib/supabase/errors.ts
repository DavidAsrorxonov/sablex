import type { PostgrestError } from "@supabase/supabase-js";

export function throwSupabaseError(context: string, error: PostgrestError): never {
  throw new Error(`${context}: ${error.message}`);
}
