import { test, expect } from "@playwright/test";

const BASE = "/api/auth/login";
const LOGIN_USERNAME =
  process.env.NEXT_PUBLIC_AUTH_USERNAME ?? process.env.AUTH_USERNAME ?? "admin";
const LOGIN_PASSWORD =
  process.env.NEXT_PUBLIC_AUTH_PASSWORD ??
  process.env.AUTH_PASSWORD ??
  "password";

// ---------------------------------------------------------------------------
// POST /api/auth/login — success
// ---------------------------------------------------------------------------
test.describe("POST /api/auth/login — success", () => {
  test("returns 200 with a JWT token for valid credentials", async ({
    request,
  }) => {
    const res = await request.post(BASE, {
      data: {
        username: LOGIN_USERNAME,
        password: LOGIN_PASSWORD,
      },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(typeof body.token).toBe("string");
  });

  test("JWT token has three dot-separated parts (header.payload.signature)", async ({
    request,
  }) => {
    const res = await request.post(BASE, {
      data: {
        username: LOGIN_USERNAME,
        password: LOGIN_PASSWORD,
      },
    });

    const { token } = await res.json();
    const parts = token.split(".");

    expect(parts).toHaveLength(3);
    // Each part is non-empty base64url
    for (const part of parts) {
      expect(part.length).toBeGreaterThan(0);
    }
  });
});

// ---------------------------------------------------------------------------
// POST /api/auth/login — invalid credentials
// ---------------------------------------------------------------------------
test.describe("POST /api/auth/login — invalid credentials", () => {
  test("returns 401 with wrong password", async ({ request }) => {
    const res = await request.post(BASE, {
      data: {
        username: LOGIN_USERNAME,
        password: "senha-errada",
      },
    });

    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(typeof body.error).toBe("string");
  });

  test("returns 401 with wrong username", async ({ request }) => {
    const res = await request.post(BASE, {
      data: { username: "utilizador-inexistente", password: "qualquer" },
    });

    expect(res.status()).toBe(401);
  });

  test("returns 401 with empty password", async ({ request }) => {
    const res = await request.post(BASE, {
      data: { username: LOGIN_USERNAME, password: "" },
    });

    expect(res.status()).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// POST /api/auth/login — malformed body
// ---------------------------------------------------------------------------
test.describe("POST /api/auth/login — malformed body", () => {
  test("returns 400 when username is missing", async ({ request }) => {
    const res = await request.post(BASE, {
      data: { password: LOGIN_PASSWORD },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(typeof body.error).toBe("string");
  });

  test("returns 400 when password is missing", async ({ request }) => {
    const res = await request.post(BASE, {
      data: { username: LOGIN_USERNAME },
    });

    expect(res.status()).toBe(400);
  });

  test("returns 400 when both fields are missing", async ({ request }) => {
    const res = await request.post(BASE, { data: {} });

    expect(res.status()).toBe(400);
  });
});

// ---------------------------------------------------------------------------
// Wrong HTTP method
// ---------------------------------------------------------------------------
test.describe("POST /api/auth/login — wrong method", () => {
  test("returns 405 for GET method", async ({ request }) => {
    const res = await request.get(BASE);

    expect(res.status()).toBe(405);
    expect(res.headers()["allow"]).toBe("POST");
  });

  test("returns 405 for DELETE method", async ({ request }) => {
    const res = await request.delete(BASE);

    expect(res.status()).toBe(405);
  });
});
