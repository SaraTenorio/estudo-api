import type { APIRequestContext } from "@playwright/test";

/**
 * Obtains a fresh JWT token from /api/auth/login.
 * Uses AUTH_USERNAME / AUTH_PASSWORD from the environment
 * (falls back to the dev defaults defined in .env.local.example).
 */
export async function getJwtToken(request: APIRequestContext): Promise<string> {
  const credentialCandidates: Array<{ username: string; password: string }> =
    [];

  const publicUsername = process.env.NEXT_PUBLIC_AUTH_USERNAME;
  const publicPassword = process.env.NEXT_PUBLIC_AUTH_PASSWORD;
  if (publicUsername && publicPassword) {
    credentialCandidates.push({
      username: publicUsername,
      password: publicPassword,
    });
  }

  const backendUsername = process.env.AUTH_USERNAME ?? "admin";
  const backendPassword = process.env.AUTH_PASSWORD ?? "password";
  credentialCandidates.push({
    username: backendUsername,
    password: backendPassword,
  });

  let lastStatus = 0;

  for (const credentials of credentialCandidates) {
    const res = await request.post("/api/auth/login", {
      data: credentials,
    });

    lastStatus = res.status();
    if (res.ok()) {
      const { token } = await res.json();
      return token as string;
    }
  }

  throw new Error(
    `getJwtToken: login failed with status ${lastStatus}. ` +
      `Check NEXT_PUBLIC_AUTH_* and AUTH_* values in .env.local.`,
  );
}

export async function getAuthHeaders(
  request: APIRequestContext,
): Promise<Record<string, string>> {
  const token = await getJwtToken(request);
  return { Authorization: `Bearer ${token}` };
}

export async function resetProductsStore(
  request: APIRequestContext,
): Promise<void> {
  const headers = await getAuthHeaders(request);
  const res = await request.post("/api/products/reset", { headers });

  if (!res.ok()) {
    throw new Error(
      `resetProductsStore: reset failed with status ${res.status()}.`,
    );
  }
}
