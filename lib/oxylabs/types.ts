import "server-only";

export type OxylabsRealtimeRequest = {
  source: "universal";
  url: string;
  render: "html";
  user_agent_type: "desktop_chrome";
};

export type OxylabsRealtimeResult = {
  content: string;
  status_code: number;
  url?: string;
  job_id?: string;
};

export type OxylabsRealtimeResponse = {
  results?: OxylabsRealtimeResult[];
  error?: {
    code?: string;
    message?: string;
  };
};
