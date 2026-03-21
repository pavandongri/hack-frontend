import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    /** Same value as `AUTH0_AUDIENCE` so the browser can request tokens with the same `aud` the backend validates. */
    NEXT_PUBLIC_AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE ?? ""
  }
};

export default nextConfig;
