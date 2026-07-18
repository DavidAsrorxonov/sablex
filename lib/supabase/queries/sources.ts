import "server-only";

import { throwSupabaseError } from "@/lib/supabase/errors";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { SourceRow } from "@/lib/supabase/types";

export async function getActiveSources(): Promise<SourceRow[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("sources")
    .select("*")
    .eq("active", true)
    .order("name", { ascending: true });

  if (error) {
    throwSupabaseError("Failed to fetch active sources", error);
  }

  return data ?? [];
}

export async function getSourcesByNames(names: string[]): Promise<SourceRow[]> {
  const uniqueNames = Array.from(new Set(names.filter(Boolean)));

  if (uniqueNames.length === 0) {
    return [];
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("sources")
    .select("*")
    .in("name", uniqueNames)
    .eq("active", true)
    .order("name", { ascending: true });

  if (error) {
    throwSupabaseError("Failed to fetch sources by name", error);
  }

  return data ?? [];
}

export async function getSourcesByIds(ids: string[]): Promise<SourceRow[]> {
  const uniqueIds = Array.from(new Set(ids.filter(Boolean)));

  if (uniqueIds.length === 0) {
    return [];
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("sources")
    .select("*")
    .in("id", uniqueIds)
    .eq("active", true)
    .order("name", { ascending: true });

  if (error) {
    throwSupabaseError("Failed to fetch sources by id", error);
  }

  return data ?? [];
}
