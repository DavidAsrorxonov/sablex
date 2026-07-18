import "server-only";

import { throwSupabaseError } from "@/lib/supabase/errors";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { Inserts, LogRow } from "@/lib/supabase/types";

export type InsertLogInput = Inserts<"logs">;

export async function insertLog(input: InsertLogInput): Promise<LogRow> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("logs")
    .insert(input)
    .select()
    .single();

  if (error) {
    throwSupabaseError("Failed to insert log", error);
  }

  return data;
}

export async function getRecentLogs(limit = 100): Promise<LogRow[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throwSupabaseError("Failed to fetch recent logs", error);
  }

  return data ?? [];
}
