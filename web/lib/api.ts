/**
 * API client for Hopwhistle
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: UserResponse;
}

export interface UserResponse {
  id: string;
  email: string;
  role: string;
  account_id: string;
}

export interface CallResponse {
  id: string;
  account_id: string;
  partner_id: string | null;
  external_call_id: string | null;
  started_at: string;
  ended_at: string | null;
  duration_sec: number | null;
  disposition: string;
  billable: boolean;
  sale_made: boolean;
  sale_amount_cents: number | null;
  ani: string | null;
  dnis: string | null;
  agent_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface CallListResponse {
  items: CallResponse[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface MetricsSummary {
  total_calls: number;
  billable_calls: number;
  sales: number;
  closing_percentage: number;
  answer_rate: number;
  aov_cents: number | null;
}

export interface TimeSeriesPoint {
  timestamp: string;
  total_calls: number;
  billable_calls: number;
  sales: number;
  connected: number;
}

export interface TimeSeriesResponse {
  interval: string;
  points: TimeSeriesPoint[];
}

export interface PartnerResponse {
  id: string;
  account_id: string;
  kind: string;
  name: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      credentials: "include", // Include cookies
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        detail: response.statusText,
      }));
      throw new Error(error.detail || "Request failed");
    }

    return response.json();
  }

  // Auth
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<void> {
    await this.request("/api/auth/logout", {
      method: "POST",
    });
  }

  async getMe(): Promise<UserResponse> {
    return this.request<UserResponse>("/api/auth/me");
  }

  // Calls
  async getCalls(params?: {
    from?: string;
    to?: string;
    partner_id?: string;
    q?: string;
    page?: number;
    page_size?: number;
  }): Promise<CallListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.from) searchParams.append("from", params.from);
    if (params?.to) searchParams.append("to", params.to);
    if (params?.partner_id) searchParams.append("partner_id", params.partner_id);
    if (params?.q) searchParams.append("q", params.q);
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.page_size)
      searchParams.append("page_size", params.page_size.toString());

    return this.request<CallListResponse>(
      `/api/calls?${searchParams.toString()}`
    );
  }

  async getCall(callId: string): Promise<CallResponse> {
    return this.request<CallResponse>(`/api/calls/${callId}`);
  }

  async getCallTranscript(callId: string): Promise<{
    call_id: string;
    language: string;
    text: string;
    words_json: any;
  }> {
    return this.request(`/api/calls/${callId}/transcript`);
  }

  async getCallSummary(callId: string): Promise<{
    call_id: string;
    summary: string;
    key_points: string[] | null;
    sentiment: string | null;
  }> {
    return this.request(`/api/calls/${callId}/summary`);
  }

  // Metrics
  async getMetricsSummary(params?: {
    from?: string;
    to?: string;
    partner_id?: string;
  }): Promise<MetricsSummary> {
    const searchParams = new URLSearchParams();
    if (params?.from) searchParams.append("from", params.from);
    if (params?.to) searchParams.append("to", params.to);
    if (params?.partner_id) searchParams.append("partner_id", params.partner_id);

    return this.request<MetricsSummary>(
      `/api/metrics/summary?${searchParams.toString()}`
    );
  }

  async getTimeSeries(params?: {
    interval?: "hour" | "day";
    from?: string;
    to?: string;
    partner_id?: string;
  }): Promise<TimeSeriesResponse> {
    const searchParams = new URLSearchParams();
    if (params?.interval) searchParams.append("interval", params.interval);
    if (params?.from) searchParams.append("from", params.from);
    if (params?.to) searchParams.append("to", params.to);
    if (params?.partner_id) searchParams.append("partner_id", params.partner_id);

    return this.request<TimeSeriesResponse>(
      `/api/metrics/timeseries?${searchParams.toString()}`
    );
  }

  // Partners
  async getPartners(): Promise<PartnerResponse[]> {
    const response = await this.request<{ items: PartnerResponse[] }>(
      "/api/partners"
    );
    return response.items;
  }
}

export const api = new ApiClient();

