# SurakshaPath AI (hack-frontend)

Frontend for **SurakshaPath AI** — a Next.js app that surfaces route hazards, maps, and issue reporting, with Auth0 authentication and a REST backend.

## Stack

- **Next.js 16** (App Router), **React 19**, **TypeScript**
- **MUI** (`@mui/material`) for UI
- **Auth0** (`@auth0/nextjs-auth0`) for login and API access tokens
- **Leaflet** / **react-leaflet** for maps

## Prerequisites

- Node.js 20+ (LTS recommended)
- npm (or compatible package manager)
- A running backend API (see environment variables) and Auth0 tenant configured for this app

## Setup

```bash
npm install
```

Configure environment variables locally (do not commit secrets). The app expects values such as:

| Variable | Purpose |
| -------- | ------- |
| `NEXT_PUBLIC_API_BASE_URL` | Backend REST base URL including `/api/v1`. In development, defaults to `http://localhost:3001/api/v1` if unset. **Required in production.** |
| `AUTH0_AUDIENCE` | Auth0 API identifier; must match the backend and `authorizationParameters` in `src/lib/auth0.ts`. Exposed to the client as `NEXT_PUBLIC_AUTH0_AUDIENCE` via `next.config.ts`. |
| Auth0 app / secret vars | As required by `@auth0/nextjs-auth0` (see [Auth0 Next.js SDK](https://auth0.com/docs/quickstart/webapp/nextjs)). |

See `src/config/api.ts` and `src/lib/auth0.ts` for details.

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start Next.js dev server (default: http://localhost:3000) |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | ESLint |
| `npm run lint:fix` | ESLint with `--fix` |
| `npm run format` | Prettier check |
| `npm run format:fix` | Prettier write |

Git hooks (Husky + lint-staged) run ESLint and Prettier on staged `*.ts` / `*.tsx` files.

## Project layout

- `src/app/` — routes, layouts, and `provider` wiring
- `src/components/` — UI (layout, map, upload, search, dashboard, …)
- `src/services/` — API-facing modules
- `src/utils/` — shared helpers (e.g. `api-client.util.ts`)
- `src/config/` — API base URL, Auth0 audience helpers, branding
- `src/constants/` — API paths and shared constants

## Learn more

- [Next.js documentation](https://nextjs.org/docs)
