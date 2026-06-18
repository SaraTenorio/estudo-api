import { test, expect } from "@playwright/test";
import { getAuthHeaders } from "../helpers/auth";

const BASE = "/api/products";

const EXPECTED_KEYS = [
  "active",
  "createdAt",
  "description",
  "id",
  "name",
  "price",
  "quantity",
].sort();

// ---------------------------------------------------------------------------
// GET /api/products — response contract
// ---------------------------------------------------------------------------
test.describe("GET /api/products — schema validation", () => {
  test("response is a JSON array", async ({ request }) => {
    const res = await request.get(BASE);

    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("application/json");
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test("every product has the correct field names — no extra, no missing", async ({
    request,
  }) => {
    const body = await (await request.get(BASE)).json();

    for (const product of body) {
      expect(Object.keys(product).sort()).toEqual(EXPECTED_KEYS);
    }
  });

  test("every product has the correct field types", async ({ request }) => {
    const body = await (await request.get(BASE)).json();

    for (const product of body) {
      expect(typeof product.id).toBe("number");
      expect(typeof product.name).toBe("string");
      expect(typeof product.description).toBe("string");
      expect(typeof product.price).toBe("number");
      expect(typeof product.quantity).toBe("number");
      expect(typeof product.active).toBe("boolean");
      expect(typeof product.createdAt).toBe("string");
    }
  });

  test("createdAt is a valid ISO 8601 date string", async ({ request }) => {
    const body = await (await request.get(BASE)).json();

    for (const product of body) {
      const date = new Date(product.createdAt);
      expect(date.toString()).not.toBe("Invalid Date");
      // Must be a UTC ISO string ending with Z
      expect(product.createdAt).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      );
    }
  });

  test("id values are unique across all products", async ({ request }) => {
    const body = await (await request.get(BASE)).json();
    const ids = body.map((p: { id: number }) => p.id);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(ids.length);
  });

  test("price is non-negative for all products", async ({ request }) => {
    const body = await (await request.get(BASE)).json();

    for (const product of body) {
      expect(product.price).toBeGreaterThanOrEqual(0);
    }
  });

  test("quantity is a non-negative integer for all products", async ({
    request,
  }) => {
    const body = await (await request.get(BASE)).json();

    for (const product of body) {
      expect(product.quantity).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(product.quantity)).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// GET /api/products/:id — single product contract
// ---------------------------------------------------------------------------
test.describe("GET /api/products/:id — schema validation", () => {
  test("single product response has the same schema as collection items", async ({
    request,
  }) => {
    const list = await (await request.get(BASE)).json();
    const { id } = list[0];

    const res = await request.get(`${BASE}/${id}`);
    const product = await res.json();

    expect(Object.keys(product).sort()).toEqual(EXPECTED_KEYS);
  });
});

// ---------------------------------------------------------------------------
// POST /api/products — created product contract
// ---------------------------------------------------------------------------
test.describe("POST /api/products — created product schema", () => {
  test("created product contains all expected fields with correct types", async ({
    request,
  }) => {
    const authHeaders = await getAuthHeaders(request);

    const res = await request.post(BASE, {
      headers: authHeaders,
      data: { name: "Schema Test Product", price: 5.5, quantity: 2 },
    });

    expect(res.status()).toBe(201);
    const product = await res.json();

    expect(Object.keys(product).sort()).toEqual(EXPECTED_KEYS);
    expect(typeof product.id).toBe("number");
    expect(product.name).toBe("Schema Test Product");
    expect(product.active).toBe(true); // default
    expect(product.description).toBe(""); // default
  });
});
