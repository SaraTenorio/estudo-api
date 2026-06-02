const API_KEY_ENV = process.env.NEXT_PUBLIC_API_KEY;
const AUTH_USER_ENV = process.env.NEXT_PUBLIC_AUTH_USERNAME;
const AUTH_PASS_ENV = process.env.NEXT_PUBLIC_AUTH_PASSWORD;

const TOKEN_STORAGE_KEY = "estudo-api.jwt";

function isWriteMethod(method: string): boolean {
  return ["POST", "PUT", "PATCH", "DELETE"].includes(method);
}

function readStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

function saveToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

function clearStoredToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
}

async function getWriteToken(): Promise<string> {
  const existing = readStoredToken();
  if (existing) return existing;

  if (!AUTH_USER_ENV || !AUTH_PASS_ENV) {
    throw new Error(
      "Missing write credentials. Configure NEXT_PUBLIC_AUTH_USERNAME and NEXT_PUBLIC_AUTH_PASSWORD.",
    );
  }

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: AUTH_USER_ENV,
      password: AUTH_PASS_ENV,
    }),
  });

  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error || "Unable to authenticate write requests.");
  }

  const data = (await res.json()) as { token?: string };
  if (!data.token) {
    throw new Error("Authentication response did not include a token.");
  }

  saveToken(data.token);
  return data.token;
}

function createHeaders(base?: HeadersInit): Headers {
  return new Headers(base);
}

export async function secureFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const method = (init?.method ?? "GET").toUpperCase();
  const headers = createHeaders(init?.headers);

  if (isWriteMethod(method)) {
    const token = await getWriteToken();
    headers.set("Authorization", `Bearer ${token}`);

    if (init?.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    let res = await fetch(input, { ...init, method, headers });

    if (res.status === 401) {
      clearStoredToken();
      const freshToken = await getWriteToken();
      headers.set("Authorization", `Bearer ${freshToken}`);
      res = await fetch(input, { ...init, method, headers });
    }

    return res;
  }

  if (!API_KEY_ENV) {
    throw new Error(
      "Missing read API key. Configure NEXT_PUBLIC_API_KEY to load product listings.",
    );
  }

  headers.set("X-API-Key", API_KEY_ENV);
  return fetch(input, { ...init, method, headers });
}
