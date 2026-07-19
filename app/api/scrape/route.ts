import { NextResponse } from "next/server";
import { z } from "zod";

import { isValidAdminSecret } from "@/lib/security/admin-secret";
import { runManualScrapePipeline } from "@/lib/scraping/pipeline";
import { DEFAULT_LIMIT_PER_SOURCE, MAX_LIMIT_PER_SOURCE } from "@/lib/scraping/types";
import { getActiveSources, getSourcesByIds, getSourcesByNames } from "@/lib/supabase/queries/sources";
import type { SourceRow } from "@/lib/supabase/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const scrapeRequestSchema = z
  .object({
    sourceIds: z.array(z.string().min(1)).optional(),
    sourceNames: z.array(z.string().min(1)).optional(),
    limitPerSource: z
      .number()
      .int()
      .positive()
      .max(MAX_LIMIT_PER_SOURCE)
      .default(DEFAULT_LIMIT_PER_SOURCE),
  })
  .strict();

export async function POST(request: Request) {
  if (!isValidAdminSecret(request.headers)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsedBody = await parseRequestBody(request);

  if (!parsedBody.ok) {
    return NextResponse.json({ error: parsedBody.error }, { status: 400 });
  }

  try {
    const sources = await resolveSelectedSources(parsedBody.options);

    if (sources.length === 0) {
      return NextResponse.json({ error: "No active matching sources found" }, { status: 400 });
    }

    const summary = await runManualScrapePipeline(sources, parsedBody.options.limitPerSource);

    return NextResponse.json(summary, { status: summary.status === "failed" ? 500 : 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Scrape failed";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function parseRequestBody(
  request: Request,
): Promise<
  | {
      ok: true;
      options: z.infer<typeof scrapeRequestSchema>;
    }
  | {
      ok: false;
      error: string;
    }
> {
  const text = await request.text();
  let json: unknown = {};

  if (text.trim()) {
    try {
      json = JSON.parse(text) as unknown;
    } catch {
      return { ok: false, error: "Malformed JSON body" };
    }
  }

  const parsed = scrapeRequestSchema.safeParse(json);

  if (!parsed.success) {
    return { ok: false, error: z.prettifyError(parsed.error) };
  }

  return { ok: true, options: parsed.data };
}

async function resolveSelectedSources(options: z.infer<typeof scrapeRequestSchema>) {
  const selectedSources = new Map<string, SourceRow>();

  if (!options.sourceIds?.length && !options.sourceNames?.length) {
    return getActiveSources();
  }

  if (options.sourceIds?.length) {
    const sources = await getSourcesByIds(options.sourceIds);

    for (const source of sources) {
      selectedSources.set(source.id, source);
    }
  }

  if (options.sourceNames?.length) {
    const sources = await getSourcesByNames(options.sourceNames);

    for (const source of sources) {
      selectedSources.set(source.id, source);
    }
  }

  return Array.from(selectedSources.values()).sort((left, right) =>
    left.name.localeCompare(right.name),
  );
}
