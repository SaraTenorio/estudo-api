const API_KEY_ENV = process.env.NEXT_PUBLIC_API_KEY;
const AUTH_USER_ENV = process.env.NEXT_PUBLIC_AUTH_USERNAME;
const AUTH_PASS_ENV = process.env.NEXT_PUBLIC_AUTH_PASSWORD;

const TOKEN_STORAGE_KEY = "estudo-api.jwt";
const CREDENTIALS_STORAGE_KEY = "estudo-api.credentials";

type LoginResponse = { token?: string; error?: string };

interface Credentials {
  username: string;
  password: string;
}

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

function readStoredCredentials(): Credentials | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(CREDENTIALS_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<Credentials>;
    if (
      typeof parsed.username === "string" &&
      typeof parsed.password === "string" &&
      parsed.username.trim() &&
      parsed.password
    ) {
      return {
        username: parsed.username.trim(),
        password: parsed.password,
      };
    }
  } catch {
    // Ignore malformed values and force a fresh login prompt.
  }

  window.localStorage.removeItem(CREDENTIALS_STORAGE_KEY);
  return null;
}

function saveStoredCredentials(credentials: Credentials): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    CREDENTIALS_STORAGE_KEY,
    JSON.stringify(credentials),
  );
}

function clearStoredCredentials(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CREDENTIALS_STORAGE_KEY);
}

function promptCredentials(): Credentials | null {
  if (typeof window === "undefined") return null;

  const usernameInput = window.prompt(
    "Enter the API username used by /api/auth/login:",
  );
  if (usernameInput === null) return null;

  const username = usernameInput.trim();
  if (!username) {
    throw new Error("Username is required to perform write operations.");
  }

  const password = window.prompt("Enter the API password:");
  if (password === null) return null;
  if (!password) {
    throw new Error("Password is required to perform write operations.");
  }

  return { username, password };
}

async function authenticate(credentials: Credentials): Promise<string> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = (await res.json().catch(() => ({}))) as LoginResponse;

  if (!res.ok) {
    throw new Error(data.error || "Unable to authenticate write requests.");
  }

  if (!data.token) {
    throw new Error("Authentication response did not include a token.");
  }

  return data.token;
}

async function getWriteToken(): Promise<string> {
  const existing = readStoredToken();
  if (existing) return existing;

  const candidates: Credentials[] = [];
  if (AUTH_USER_ENV && AUTH_PASS_ENV) {
    candidates.push({ username: AUTH_USER_ENV, password: AUTH_PASS_ENV });
  }

  const stored = readStoredCredentials();
  if (stored) {
    const exists = candidates.some(
      (candidate) =>
        candidate.username === stored.username &&
        candidate.password === stored.password,
    );
    if (!exists) {
      candidates.push(stored);
    }
  }

  let lastError: Error | null = null;
  for (const candidate of candidates) {
    try {
      const token = await authenticate(candidate);
      saveToken(token);
      if (!AUTH_USER_ENV || !AUTH_PASS_ENV) {
        saveStoredCredentials(candidate);
      }
      return token;
    } catch (error) {
      lastError =
        error instanceof Error
          ? error
          : new Error("Unable to authenticate write requests.");
      clearStoredCredentials();
      clearStoredToken();
    }
  }

  const prompted = promptCredentials();
  if (!prompted) {
    throw new Error("Write operation cancelled by user.");
  }

  try {
    const token = await authenticate(prompted);
    saveStoredCredentials(prompted);
    saveToken(token);
    return token;
  } catch (error) {
    clearStoredCredentials();
    const fallbackMessage =
      lastError?.message || "Unable to authenticate write requests.";
    throw error instanceof Error ? error : new Error(fallbackMessage);
  }
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
      // Token may have expired; fetch a new one and retry once.
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
