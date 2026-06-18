import { test, expect } from "@playwright/test";
import { MSG } from "../../../lib/messages";
import { getAuthHeaders } from "../helpers/auth";

const BASE = "/api/products";
let authHeaders: Record<string, string>;

test.beforeEach(async ({ request }) => {
  authHeaders = await getAuthHeaders(request);
  await request.post(`${BASE}/reset`, { headers: authHeaders });
});

// ---------------------------------------------------------------------------
// GET /api/products
// ---------------------------------------------------------------------------
test.describe("GET /api/products", () => {
  test("returns 200 with an array of products", async ({ request }) => {
    const res = await request.get(BASE);

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test("includes the X-Total-Count header", async ({ request }) => {
    const res = await request.get(BASE);

    expect(res.headers()["x-total-count"]).toBeDefined();
  });

  test("X-Total-Count matches the number of products", async ({ request }) => {
    const res = await request.get(BASE);
    const body = await res.json();

    expect(Number(res.headers()["x-total-count"])).toBe(body.length);
  });
});

// ---------------------------------------------------------------------------
// POST /api/products
// ---------------------------------------------------------------------------
test.describe("POST /api/products", () => {
  test("creates a product and returns 201 with the created product", async ({
    request,
  }) => {
    const res = await request.post(BASE, {
      headers: authHeaders,
      data: { name: "Test Product", price: 9.99, quantity: 3 },
    });

    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.id).toBeDefined();
    expect(body.name).toBe("Test Product");
    expect(body.price).toBe(9.99);
    expect(body.quantity).toBe(3);
    expect(body.active).toBe(true);
  });

  test("applies defaults for omitted fields", async ({ request }) => {
    const res = await request.post(BASE, {
      headers: authHeaders,
      data: { name: "Name Only" },
    });

    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.description).toBe("");
    expect(body.price).toBe(0);
    expect(body.quantity).toBe(0);
    expect(body.active).toBe(true);
    expect(body.createdAt).toBeDefined();
  });

  test("returns 400 when name is missing", async ({ request }) => {
    const res = await request.post(BASE, {
      headers: authHeaders,
      data: { price: 10 },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toBe(MSG.NAME_REQUIRED);
  });

  test("returns 400 when name is whitespace-only", async ({ request }) => {
    const res = await request.post(BASE, {
      headers: authHeaders,
      data: { name: "   " },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toBe(MSG.NAME_BLANK);
  });

  test("returns 400 for unknown field", async ({ request }) => {
    const res = await request.post(BASE, {
      headers: authHeaders,
      data: { name: "X", unknownField: true },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toBe(MSG.UNKNOWN_FIELD("unknownField"));
  });

  // NOTE: In Next.js 16 (Pages Router) the body parser initialises req.body to {}
  // before withJsonBody is invoked. Arrays and null are normalised to {},
  // making the Array.isArray and body===null guards unreachable via HTTP.
  // The BODY_INVALID path can only be exercised in unit tests of the middleware.
  test.skip("returns 400 when body is a JSON array (not an object) [Next.js 16 normalises to {}]", async ({
    request,
  }) => {
    const res = await request.post(BASE, {
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
      },
      data: "[1, 2, 3]",
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toBe(MSG.BODY_INVALID);
  });

  test("POST without Content-Type returns 400 (body becomes {} and fails validation)", async ({
    request,
  }) => {
    // Without Content-Type the body parser does not process the body → req.body = {}
    // withJsonBody lets it through (non-null object) → validation fails with NAME_REQUIRED
    const res = await request.post(BASE, {
      headers: {
        ...authHeaders,
        "Content-Type": "text/plain",
      },
      data: "invalid data",
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(typeof body.error).toBe("string");
  });

  test("returns 405 for DELETE method on collection", async ({ request }) => {
    const res = await request.delete(BASE, { headers: authHeaders });

    expect(res.status()).toBe(405);
    const body = await res.json();
    expect(body.error).toBe(MSG.METHOD_NOT_ALLOWED("DELETE"));
  });
});

// ---------------------------------------------------------------------------
// GET /api/products/:id
// ---------------------------------------------------------------------------
test.describe("GET /api/products/:id", () => {
  test("returns the product by id", async ({ request }) => {
    const list = await (await request.get(BASE)).json();
    const first = list[0];

    const res = await request.get(`${BASE}/${first.id}`);

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.id).toBe(first.id);
    expect(body.name).toBe(first.name);
  });

  test("returns 404 for non-existent id", async ({ request }) => {
    const res = await request.get(`${BASE}/99999`);

    expect(res.status()).toBe(404);
    const body = await res.json();
    expect(body.error).toBe(MSG.PRODUCT_NOT_FOUND(99999));
  });

  test("returns 400 for invalid id (non-numeric)", async ({ request }) => {
    const res = await request.get(`${BASE}/abc`);

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toBe(MSG.ID_INVALID);
  });
});

// ---------------------------------------------------------------------------
// PUT /api/products/:id
// ---------------------------------------------------------------------------
test.describe("PUT /api/products/:id", () => {
  test("replaces the full product and returns 200", async ({ request }) => {
    const list = await (await request.get(BASE)).json();
    const { id } = list[0];

    const res = await request.put(`${BASE}/${id}`, {
      headers: authHeaders,
      data: { name: "Replaced Product", price: 1.5 },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.name).toBe("Replaced Product");
    expect(body.price).toBe(1.5);
    expect(body.description).toBe(""); // omitted field falls back to default
    expect(body.id).toBe(id);
  });

  test("returns 400 when name is missing on PUT", async ({ request }) => {
    const list = await (await request.get(BASE)).json();
    const { id } = list[0];

    const res = await request.put(`${BASE}/${id}`, {
      headers: authHeaders,
      data: { price: 5 },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toBe(MSG.NAME_REQUIRED);
  });

  test("returns 404 for non-existent id", async ({ request }) => {
    const res = await request.put(`${BASE}/99999`, {
      headers: authHeaders,
      data: { name: "X" },
    });

    expect(res.status()).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// PATCH /api/products/:id
// ---------------------------------------------------------------------------
test.describe("PATCH /api/products/:id", () => {
  test("partially updates the product and preserves other fields", async ({
    request,
  }) => {
    const list = await (await request.get(BASE)).json();
    const first = list[0];

    const res = await request.patch(`${BASE}/${first.id}`, {
      headers: authHeaders,
      data: { price: 42.5 },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.price).toBe(42.5);
    expect(body.name).toBe(first.name); // unsent field is preserved
  });

  test("toggles the active field", async ({ request }) => {
    const list = await (await request.get(BASE)).json();
    const first = list[0];

    const res = await request.patch(`${BASE}/${first.id}`, {
      headers: authHeaders,
      data: { active: !first.active },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.active).toBe(!first.active);
  });

  test("returns 400 for unknown field", async ({ request }) => {
    const list = await (await request.get(BASE)).json();
    const { id } = list[0];

    const res = await request.patch(`${BASE}/${id}`, {
      headers: authHeaders,
      data: { unknownField: "x" },
    });

    expect(res.status()).toBe(400);
  });
});

// ---------------------------------------------------------------------------
// DELETE /api/products/:id
// ---------------------------------------------------------------------------
test.describe("DELETE /api/products/:id", () => {
  test("deletes the product and returns the deleted product", async ({
    request,
  }) => {
    const list = await (await request.get(BASE)).json();
    const { id } = list[0];

    const res = await request.delete(`${BASE}/${id}`, { headers: authHeaders });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.id).toBe(id);
  });

  test("product no longer exists after DELETE", async ({ request }) => {
    const list = await (await request.get(BASE)).json();
    const { id } = list[0];

    await request.delete(`${BASE}/${id}`, { headers: authHeaders });
    const check = await request.get(`${BASE}/${id}`);

    expect(check.status()).toBe(404);
  });

  test("returns 404 for non-existent id", async ({ request }) => {
    const res = await request.delete(`${BASE}/99999`, {
      headers: authHeaders,
    });

    expect(res.status()).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// POST /api/products/random
// ---------------------------------------------------------------------------
test.describe("POST /api/products/random", () => {
  test("creates a random product and returns 201", async ({ request }) => {
    const res = await request.post(`${BASE}/random`, {
      headers: authHeaders,
    });

    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.id).toBeDefined();
    expect(typeof body.name).toBe("string");
    expect(body.name.length).toBeGreaterThan(0);
    expect(typeof body.price).toBe("number");
    expect(typeof body.active).toBe("boolean");
  });

  test("returns 405 for GET on /random", async ({ request }) => {
    const res = await request.get(`${BASE}/random`);

    // /random is a route file but the method is not allowed
    expect(res.status()).toBe(405);
  });
});

// ---------------------------------------------------------------------------
// POST /api/products/reset
// ---------------------------------------------------------------------------
test.describe("POST /api/products/reset", () => {
  test("resets the store to exactly 2 products", async ({ request }) => {
    // Add extra products to ensure the reset clears state
    await request.post(`${BASE}/random`, { headers: authHeaders });
    await request.post(`${BASE}/random`, { headers: authHeaders });

    const res = await request.post(`${BASE}/reset`, { headers: authHeaders });

    expect(res.status()).toBe(200);
    const after = await (await request.get(BASE)).json();
    expect(after).toHaveLength(2);
  });

  test("returns 405 for GET on /reset", async ({ request }) => {
    const res = await request.get(`${BASE}/reset`);

    expect(res.status()).toBe(405);
  });
});
