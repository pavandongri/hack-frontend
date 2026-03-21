"use client";

import { getApiBaseUrl, getAuth0ApiAudience } from "@/config/api";
import { API_ENDPOINTS } from "@/constants/api.constants";
import { getAccessToken } from "@auth0/nextjs-auth0/client";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  params?: Record<string, string | number>;
};

function joinApiUrl(path: string): string {
  const base = getApiBaseUrl();
  const p = path.replace(/^\//, "");
  return `${base}/${p}`;
}

const buildUrl = (endpoint: string, params?: RequestOptions["params"]) => {
  const url = new URL(joinApiUrl(endpoint));

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  return url.toString();
};

function withoutQueryParams(options?: RequestOptions): Omit<RequestOptions, "params"> {
  if (!options) return {};
  const { params, ...rest } = options;
  void params;
  return rest;
}

function mergeHeaders(base: Headers, extra?: HeadersInit): Headers {
  const out = new Headers(base);
  if (extra) {
    new Headers(extra).forEach((value, key) => {
      out.set(key, value);
    });
  }
  return out;
}

function normalizeAccessToken(token: string): string {
  const trimmed = token.trim();
  if (trimmed.startsWith("Bearer ")) {
    return trimmed.slice(7).trim();
  }
  return trimmed;
}

async function getAccessTokenForApi(): Promise<string> {
  const audience = getAuth0ApiAudience();
  const raw = await getAccessToken({ audience });
  if (!raw || typeof raw !== "string") {
    throw new Error("Missing access token. Sign in again.");
  }
  return normalizeAccessToken(raw);
}

async function parseBody(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function assertOk(res: Response): Promise<void> {
  if (res.ok) return;
  const body = await parseBody(res);
  const message =
    typeof body === "object" &&
    body !== null &&
    "message" in body &&
    typeof (body as { message: unknown }).message === "string"
      ? (body as { message: string }).message
      : typeof body === "object" &&
          body !== null &&
          "error" in body &&
          typeof (body as { error: unknown }).error === "string"
        ? (body as { error: string }).error
        : `API Error: ${res.status}`;
  throw new ApiError(message, res.status, body);
}

/**
 * GET `/api/v1/health` — no `Authorization` header (liveness only).
 */
export async function checkApiHealth(): Promise<{ ok: boolean; status: number }> {
  const url = buildUrl(API_ENDPOINTS.HEALTH);
  const res = await fetch(url, { method: "GET" });
  return { ok: res.ok, status: res.status };
}

async function fetchWithAuth(url: string, init: RequestInit): Promise<Response> {
  const run = async () => {
    const token = await getAccessTokenForApi();
    const headers = mergeHeaders(new Headers(init.headers), {
      Authorization: `Bearer ${token}`
    });
    return fetch(url, { ...init, headers });
  };

  let res = await run();
  if (res.status === 401) {
    await getAccessToken({ audience: getAuth0ApiAudience() });
    res = await run();
  }
  return res;
}

export const apiClient = {
  get: async <T>(endpoint: string, options?: RequestOptions): Promise<T> => {
    const url = buildUrl(endpoint, options?.params);
    const fetchInit = withoutQueryParams(options);
    const res = await fetchWithAuth(url, {
      method: "GET",
      ...fetchInit,
      headers: mergeHeaders(new Headers({ "Content-Type": "application/json" }), fetchInit.headers)
    });
    await assertOk(res);
    return res.json() as Promise<T>;
  },

  post: async <T>(endpoint: string, body: unknown, options?: RequestOptions): Promise<T> => {
    const url = buildUrl(endpoint, options?.params);
    const fetchInit = withoutQueryParams(options);
    const res = await fetchWithAuth(url, {
      method: "POST",
      ...fetchInit,
      headers: mergeHeaders(new Headers({ "Content-Type": "application/json" }), fetchInit.headers),
      body: JSON.stringify(body)
    });
    await assertOk(res);
    return res.json() as Promise<T>;
  },

  put: async <T>(endpoint: string, body: unknown, options?: RequestOptions): Promise<T> => {
    const url = buildUrl(endpoint, options?.params);
    const fetchInit = withoutQueryParams(options);
    const res = await fetchWithAuth(url, {
      method: "PUT",
      ...fetchInit,
      headers: mergeHeaders(new Headers({ "Content-Type": "application/json" }), fetchInit.headers),
      body: JSON.stringify(body)
    });
    await assertOk(res);
    return res.json() as Promise<T>;
  },

  postForm: async <T>(
    endpoint: string,
    formData: FormData,
    options?: RequestOptions
  ): Promise<T> => {
    const url = buildUrl(endpoint, options?.params);
    const fetchInit = withoutQueryParams(options);
    const res = await fetchWithAuth(url, {
      method: "POST",
      ...fetchInit,
      body: formData
    });
    await assertOk(res);

    const contentType = res.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      return res.json() as Promise<T>;
    }

    return {} as T;
  }
};
