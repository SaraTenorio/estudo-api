import type { APIRequestContext } from "@playwright/test";

/**
 * Obtains a fresh JWT token from /api/auth/login.
 * Uses AUTH_USERNAME / AUTH_PASSWORD from the environment
 * (falls back to the dev defaults defined in .env.local.example).
 */
export async function getJwtToken(request: APIRequestContext): Promise<string> {
  const username = process.env.AUTH_USERNAME ?? "admin";
  const password = process.env.AUTH_PASSWORD ?? "password";

  const res = await request.post("/api/auth/login", {
    data: { username, password },
  });

  if (!res.ok()) {
    throw new Error(
      `getJwtToken: login failed with status ${res.status()}. ` +
        `Check AUTH_USERNAME and AUTH_PASSWORD in .env.local.`,
    );
  }

  const { token } = await res.json();
  return token as string;
}
