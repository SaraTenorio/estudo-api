import { test, expect } from "@playwright/test";
import { getJwtToken } from "../helpers/auth";

const PRODUCTS = "/api/products";

// ---------------------------------------------------------------------------
// GET — requires X-API-Key
// ---------------------------------------------------------------------------
test.describe("GET /api/products — API key guard", () => {
  test("returns 401 when X-API-Key header is absent", async ({ request }) => {
    const res = await request.get(PRODUCTS, {
      headers: { "X-API-Key": "" }, // override the extraHTTPHeaders default
    });

    // 401 = missing key  |  403 = wrong key
    expect([401, 403]).toContain(res.status());
  });

  test("returns 401 when X-API-Key value is wrong", async ({ request }) => {
    const res = await request.get(PRODUCTS, {
      headers: { "X-API-Key": "chave-invalida" },
    });

    expect([401, 403]).toContain(res.status());
    const body = await res.json();
    expect(typeof body.error).toBe("string");
  });

  test("returns 200 with a valid X-API-Key", async ({ request }) => {
    const res = await request.get(PRODUCTS, {
      headers: { "X-API-Key": process.env.API_KEY ?? "dev-api-key" },
    });

    expect(res.status()).toBe(200);
  });
});

// ---------------------------------------------------------------------------
// POST — requires Bearer JWT
// ---------------------------------------------------------------------------
test.describe("POST /api/products — JWT guard", () => {
  test("returns 401 when Authorization header is absent", async ({
    request,
  }) => {
    const res = await request.post(PRODUCTS, {
      headers: { Authorization: "" }, // override any default
      data: { name: "Sem JWT" },
    });

    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(typeof body.error).toBe("string");
  });

  test("returns 401 when token is malformed", async ({ request }) => {
    const res = await request.post(PRODUCTS, {
      headers: { Authorization: "Bearer isto.nao.e.um.jwt" },
      data: { name: "JWT inválido" },
    });

    expect(res.status()).toBe(401);
  });

  test("returns 401 when Bearer prefix is missing", async ({ request }) => {
    const token = await getJwtToken(request);

    const res = await request.post(PRODUCTS, {
      headers: { Authorization: token }, // no "Bearer " prefix
      data: { name: "Sem prefixo" },
    });

    expect(res.status()).toBe(401);
  });

  test("returns 201 with a valid JWT token", async ({ request }) => {
    const token = await getJwtToken(request);

    const res = await request.post(PRODUCTS, {
      headers: { Authorization: `Bearer ${token}` },
      data: { name: "Produto com JWT válido" },
    });

    expect(res.status()).toBe(201);
  });
});

// ---------------------------------------------------------------------------
// DELETE — requires Bearer JWT (same guard, different method)
// ---------------------------------------------------------------------------
test.describe("DELETE /api/products/:id — JWT guard", () => {
  test("returns 401 without Authorization header", async ({ request }) => {
    // Get an existing product id first (GET uses API key from extraHTTPHeaders)
    const list = await (await request.get(PRODUCTS)).json();
    const { id } = list[0];

    const res = await request.delete(`${PRODUCTS}/${id}`, {
      headers: { Authorization: "" },
    });

    expect(res.status()).toBe(401);
  });
});
