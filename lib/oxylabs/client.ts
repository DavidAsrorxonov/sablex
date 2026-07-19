import "server-only";

import type { OxylabsRealtimeRequest, OxylabsRealtimeResponse } from "@/lib/oxylabs/types";

const OXYLABS_REALTIME_URL = "https://realtime.oxylabs.io/v1/queries";
const DEFAULT_TIMEOUT_MS = 60_000;

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required Oxylabs environment variable: ${name}`);
  }

  return value;
}

function getBasicAuthHeader() {
  const username = getRequiredEnv("OXY_WSA_USERNAME");
  const password = getRequiredEnv("OXY_WSA_PASSWORD");
  const token = Buffer.from(`${username}:${password}`, "utf8").toString("base64");

  return `Basic ${token}`;
}

export async function scrapeUrlWithOxylabs(
  url: string,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  const payload: OxylabsRealtimeRequest = {
    source: "universal",
    url,
    render: "html",
    user_agent_type: "desktop_chrome",
  };

  try {
    const response = await fetch(OXYLABS_REALTIME_URL, {
      method: "POST",
      headers: {
        Authorization: getBasicAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const body = (await response.json().catch(() => null)) as OxylabsRealtimeResponse | null;

    if (!response.ok) {
      const message = body?.error?.message ?? `HTTP ${response.status}`;
      throw new Error(`Oxylabs request failed: ${message}`);
    }

    const result = body?.results?.[0];

    if (!result) {
      throw new Error("Oxylabs response did not include a result");
    }

    if (result.status_code < 200 || result.status_code >= 300) {
      throw new Error(`Oxylabs target returned status ${result.status_code}`);
    }

    if (typeof result.content !== "string" || result.content.trim().length === 0) {
      throw new Error("Oxylabs response content was empty");
    }

    return result.content;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Oxylabs request timed out for ${url}`);
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
