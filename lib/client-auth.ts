const WRITE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

let cachedJwtToken: string | null = null;

async function getJwtToken(): Promise<string> {
  if (cachedJwtToken) return cachedJwtToken;

  const username = process.env.NEXT_PUBLIC_AUTH_USERNAME;
  const password = process.env.NEXT_PUBLIC_AUTH_PASSWORD;

  if (!username || !password) {
    throw new Error(
      "Missing NEXT_PUBLIC_AUTH_USERNAME or NEXT_PUBLIC_AUTH_PASSWORD",
    );
  }

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(body?.error ?? `Login failed (${res.status})`);
  }

  const { token } = (await res.json()) as { token: string };
  cachedJwtToken = token;
  return token;
}

export async function fetchWithSecurity(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  const method = (init.method ?? "GET").toUpperCase();
  const headers = new Headers(init.headers ?? {});

  if (method === "GET") {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (!apiKey) {
      throw new Error("Missing NEXT_PUBLIC_API_KEY");
    }
    headers.set("X-API-Key", apiKey);
  }

  if (WRITE_METHODS.has(method)) {
    const token = await getJwtToken();
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(input, { ...init, method, headers });
}

export function clearCachedJwtToken(): void {
  cachedJwtToken = null;
}
