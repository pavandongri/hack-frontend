/**
 * Backend REST base URL including `/api/v1` (e.g. `http://localhost:3001/api/v1` in dev).
 * In production, set `NEXT_PUBLIC_API_BASE_URL` to your deployed API origin.
 */
export const DEFAULT_DEV_API_BASE_URL = "http://localhost:3001/api/v1";

export function getApiBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (process.env.NODE_ENV === "development") return DEFAULT_DEV_API_BASE_URL;
  throw new Error(
    "NEXT_PUBLIC_API_BASE_URL is required in production. Use the same base as your backend (including /api/v1)."
  );
}

/**
 * Auth0 API identifier — must match `AUTH0_AUDIENCE` on the backend and `authorizationParameters.audience` in `src/lib/auth0.ts`.
 * `next.config.ts` maps `AUTH0_AUDIENCE` → `NEXT_PUBLIC_AUTH0_AUDIENCE` for the browser; you can also set `NEXT_PUBLIC_AUTH0_AUDIENCE` directly.
 */
export function getAuth0ApiAudience(): string {
  const audience =
    process.env.NEXT_PUBLIC_AUTH0_AUDIENCE?.trim() || process.env.AUTH0_AUDIENCE?.trim();
  if (!audience) {
    throw new Error(
      "Set AUTH0_AUDIENCE to your Auth0 API identifier (same value the backend uses). It must match the audience used at login and when sending Bearer tokens."
    );
  }
  return audience;
}
