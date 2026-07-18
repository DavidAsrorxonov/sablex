import "server-only";

import { throwSupabaseError } from "@/lib/supabase/errors";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type {
  Inserts,
  OxylabsScheduleRow,
  OxylabsScheduleRunRow,
} from "@/lib/supabase/types";

export type UpsertOxylabsScheduleInput = Inserts<"oxylabs_schedules">;
export type RecordOxylabsScheduleRunInput = Inserts<"oxylabs_schedule_runs">;

export async function listOxylabsSchedules(): Promise<OxylabsScheduleRow[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("oxylabs_schedules")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throwSupabaseError("Failed to list Oxylabs schedules", error);
  }

  return data ?? [];
}

export async function upsertOxylabsSchedule(
  input: UpsertOxylabsScheduleInput,
): Promise<OxylabsScheduleRow> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("oxylabs_schedules")
    .upsert(input, { onConflict: "source_id" })
    .select()
    .single();

  if (error) {
    throwSupabaseError("Failed to upsert Oxylabs schedule", error);
  }

  return data;
}

export async function recordOxylabsScheduleRun(
  input: RecordOxylabsScheduleRunInput,
): Promise<OxylabsScheduleRunRow> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("oxylabs_schedule_runs")
    .insert(input)
    .select()
    .single();

  if (error) {
    throwSupabaseError("Failed to record Oxylabs schedule run", error);
  }

  return data;
}

export async function markOxylabsScheduleRunProcessed(
  id: string,
): Promise<OxylabsScheduleRunRow> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("oxylabs_schedule_runs")
    .update({ processed_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throwSupabaseError("Failed to mark Oxylabs schedule run processed", error);
  }

  return data;
}
