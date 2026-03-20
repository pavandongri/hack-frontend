const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type RequestOptions = RequestInit & {
  params?: Record<string, string | number>;
};

const buildUrl = (endpoint: string, params?: RequestOptions["params"]) => {
  const url = new URL(endpoint, BASE_URL);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  return url.toString();
};

export const apiClient = {
  get: async <T>(endpoint: string, options?: RequestOptions): Promise<T> => {
    const url = buildUrl(endpoint, options?.params);

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      ...options
    });

    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }

    return res.json();
  },

  post: async <T>(endpoint: string, body: any): Promise<T> => {
    const url = buildUrl(endpoint);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }

    return res.json();
  },

  postForm: async <T>(endpoint: string, formData: FormData): Promise<T> => {
    const url = buildUrl(endpoint);

    const res = await fetch(url, {
      method: "POST",
      body: formData
    });

    if (!res.ok) {
      let message = `API Error: ${res.status}`;
      try {
        const err = await res.json();
        if (typeof err?.message === "string") message = err.message;
        else if (typeof err?.error === "string") message = err.error;
      } catch {
        /* ignore */
      }
      throw new Error(message);
    }

    const contentType = res.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      return res.json();
    }

    return {} as T;
  }
};
