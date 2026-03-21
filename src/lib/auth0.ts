import { Auth0Client } from "@auth0/nextjs-auth0/server";

const audience = process.env.AUTH0_AUDIENCE;

export const auth0 = new Auth0Client({
  // Discovery + token calls default to 5s; slow networks exceed that and throw TimeoutError.
  httpTimeout: 30_000,
  ...(audience
    ? {
        authorizationParameters: {
          audience
        }
      }
    : {})
});
