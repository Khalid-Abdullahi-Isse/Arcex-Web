import { useAuthStore } from "@/store/auth";
import type { AuthTokens } from "@/types/api";

const BASE_URL = "/api/backend";

export interface ApiError {
  statusCode: number;
  message: string;
  messages: string[];
}

export function isApiError(err: unknown): err is ApiError {
  return (
    typeof err === "object" &&
    err !== null &&
    "statusCode" in err &&
    "message" in err
  );
}

function normalizeError(data: unknown, status: number): ApiError {
  let messages: string[] = [];
  if (data && typeof data === "object" && "message" in data) {
    const msg = (data as Record<string, unknown>).message;
    if (Array.isArray(msg)) messages = msg.map(String);
    else if (typeof msg === "string") messages = [msg];
  }
  if (messages.length === 0) messages = ["Something went wrong. Please try again."];
  return { statusCode: status, message: messages.join(", "), messages };
}

let isRedirecting = false;

function handleUnauthorized(): void {
  if (isRedirecting || typeof window === "undefined") return;
  isRedirecting = true;
  useAuthStore.getState().clearAuth();
  const path = window.location.pathname + window.location.search;
  const redirect =
    path.startsWith("/") && !path.startsWith("//") ? encodeURIComponent(path) : "";
  window.location.assign(redirect ? `/login?redirect=${redirect}` : "/login");
}

// Single-flight refresh: concurrent 401s share one refresh request.
let refreshPromise: Promise<boolean> | null = null;

function refreshOnce(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const { refreshToken, setTokens } = useAuthStore.getState();
      if (!refreshToken) return false;
      try {
        const res = await fetch(`${BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
        if (!res.ok) return false;
        const tokens = (await res.json()) as AuthTokens;
        setTokens(tokens.accessToken, tokens.refreshToken);
        return true;
      } catch {
        return false;
      }
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

async function request<T>(
  path: string,
  method: string,
  body?: unknown,
  retry = true,
): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const token = useAuthStore.getState().accessToken;
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw {
        statusCode: 408,
        message: "Request timed out. Please try again.",
        messages: ["Request timed out. Please try again."],
      } satisfies ApiError;
    }
    throw {
      statusCode: 0,
      message: "Unable to connect. Is the backend running?",
      messages: ["Unable to connect. Is the backend running?"],
    } satisfies ApiError;
  } finally {
    clearTimeout(timeoutId);
  }

  const text = await response.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw normalizeError(null, response.status);
    }
  }

  if (!response.ok) {
    if (response.status === 401 && !path.startsWith("/auth/")) {
      if (retry && (await refreshOnce())) {
        return request<T>(path, method, body, false);
      }
      handleUnauthorized();
    }
    throw normalizeError(data, response.status);
  }

  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path, "GET"),
  post: <T>(path: string, body?: unknown) => request<T>(path, "POST", body),
  patch: <T>(path: string, body?: unknown) => request<T>(path, "PATCH", body),
  delete: <T>(path: string) => request<T>(path, "DELETE"),
};

/** SWR fetcher — same pipeline (Bearer, refresh, error normalization). */
export const fetcher = <T>(path: string): Promise<T> => request<T>(path, "GET");

/**
 * Build a query string, dropping undefined/empty values so the backend's
 * forbidNonWhitelisted validation never sees stray or empty params.
 */
export function buildQuery(
  params: Record<string, string | number | undefined>,
): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}
