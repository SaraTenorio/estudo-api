[![en](https://img.shields.io/badge/lang-en-blue)](README.md)
[![pt](https://img.shields.io/badge/lang-pt--PT-green)](README.pt.md)

# Estudo API

A REST test API built with **Next.js** (Pages Router) and **TypeScript**, with in-memory data. Ideal for testing HTTP requests in Postman or any REST client.

---

## Prerequisites

- [Node.js](https://nodejs.org/) LTS (v18+)
- npm (included with Node.js)

---

## Installation and start

```bash
# 1. Enter the project folder
cd estudo

# 2. Install dependencies (first time only)
npm install

# 3. Start the development server
npm run dev
```

The server will be available at **https://localhost:3000**.

Open the browser at the following pages:

| URL                                  | Description                                |
| ------------------------------------ | ------------------------------------------ |
| `https://localhost:3000`             | API endpoint documentation                 |
| `https://localhost:3000/products`    | Products displayed as cards (UI interface) |
| `https://localhost:3000/products/id` | Product detail page                        |
| `https://localhost:3000/sitemap.xml` | XML Sitemap with static pages and products |
| `https://localhost:3000/feed.xml`    | RSS Feed with all products                 |

> **Local HTTPS:** The development server starts with HTTPS using the `--experimental-https` flag. Next.js automatically generates a self-signed certificate locally via [`mkcert`](https://github.com/FiloSottile/mkcert). On first run you may need to accept the certificate in the browser.

> **Note:** data lives in memory and is reset whenever the server restarts. Initial data is loaded automatically.

---

## Project structure

```
lib/
  store.ts               ← In-memory store + makeRandomProduct (shared)
  product-validation.ts  ← Product field validation
  with-json-body.ts      ← Middleware: guards null/non-object bodies
  with-api-key.ts        ← Middleware: validates X-API-Key header (GET)
  with-auth.ts           ← Middleware: validates Bearer JWT (writes)
  with-security.ts       ← Middleware: routes GET → API Key, writes → JWT
pages/
  index.tsx              ← API documentation page
  products.tsx           ← Card view page
  products/
    [id].tsx             ← Product detail page (toggle active, remove)
  sitemap.xml.tsx        ← GET /sitemap.xml — Dynamic XML Sitemap
  feed.xml.tsx           ← GET /feed.xml — Products RSS Feed
  api/
    auth/
      login.ts           ← POST /api/auth/login — returns JWT token
    products/
      index.ts           ← GET /api/products · POST /api/products
      [id].ts            ← GET · PUT · PATCH · DELETE /api/products/id
      random.ts          ← POST /api/products/random
      reset.ts           ← POST /api/products/reset
```

---

## Authentication

All API endpoints are protected. The required credential depends on the HTTP method:

| Method                              | Credential | Header                          |
| ----------------------------------- | ---------- | ------------------------------- |
| `GET`                               | API Key    | `X-API-Key: <key>`              |
| `POST` · `PUT` · `PATCH` · `DELETE` | Bearer JWT | `Authorization: Bearer <token>` |

### Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in the values:

```bash
cp .env.local.example .env.local
```

| Variable        | Description                                                      |
| --------------- | ---------------------------------------------------------------- |
| `API_KEY`       | Key for read (GET) requests                                      |
| `JWT_SECRET`    | Secret used to sign and verify tokens (use a long random string) |
| `AUTH_USERNAME` | Login username                                                   |
| `AUTH_PASSWORD` | Login password                                                   |

For browser pages (`/products` and `/products/id`) to call protected endpoints directly, also set:

| Variable                    | Description                                                         |
| --------------------------- | ------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_KEY`       | API key used by browser GET requests                                |
| `NEXT_PUBLIC_AUTH_USERNAME` | Browser login username used to auto-obtain a JWT for write requests |
| `NEXT_PUBLIC_AUTH_PASSWORD` | Browser login password used to auto-obtain a JWT for write requests |

### Obtain a JWT token

Send a `POST` to `/api/auth/login` before any write operation:

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "your-password"
}
```

Response (`200 OK`):

```json
{ "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```

The token is valid for **1 hour**. Include it in all write requests:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Authentication errors

| Status                      | Situation                                           |
| --------------------------- | --------------------------------------------------- |
| `401 Unauthorized`          | Missing or invalid API key / token                  |
| `500 Internal Server Error` | Authentication environment variables not configured |

---

## Data model — `Product`

| Field         | Type      | Required  | Default                    | Description                       |
| ------------- | --------- | --------- | -------------------------- | --------------------------------- |
| `id`          | `number`  | automatic | —                          | Unique integer identifier         |
| `name`        | `string`  | ✅        | —                          | Product name                      |
| `description` | `string`  | ❌        | `""`                       | Free description                  |
| `price`       | `number`  | ❌        | `0`                        | Decimal price                     |
| `quantity`    | `number`  | ❌        | `0`                        | Stock quantity (non-negative int) |
| `active`      | `boolean` | ❌        | `true`                     | Active/inactive status            |
| `createdAt`   | `string`  | ❌        | `new Date().toISOString()` | Creation date (ISO 8601)          |

---

## Endpoints

> **Authentication required on all endpoints.** See the [Authentication](#authentication) section for details.

### Authentication — `/api/auth/login`

| Method | Description                                         |
| ------ | --------------------------------------------------- |
| `POST` | Obtain a JWT token (body: `{ username, password }`) |

### Collection — `/api/products`

| Method | Description          |
| ------ | -------------------- |
| `GET`  | List all products    |
| `POST` | Create a new product |

### Individual product — `/api/products/id`

| Method   | Description              |
| -------- | ------------------------ |
| `GET`    | Return a product by ID   |
| `PUT`    | Replace the full product |
| `PATCH`  | Partially update fields  |
| `DELETE` | Remove the product       |

### Random product — `/api/products/random`

| Method | Description                                 |
| ------ | ------------------------------------------- |
| `POST` | Create a product with random data (no body) |

### Reset — `/api/products/reset`

| Method | Description                                        |
| ------ | -------------------------------------------------- |
| `POST` | Restore the store with 2 random products (no body) |

### Sitemap — `/sitemap.xml`

| Method | Description                                                                      |
| ------ | -------------------------------------------------------------------------------- |
| `GET`  | XML Sitemap with static pages (`/`, `/products`) and all products from the store |

### RSS Feed — `/feed.xml`

| Method | Description                                            |
| ------ | ------------------------------------------------------ |
| `GET`  | RSS 2.0 with all products sorted from newest to oldest |

> Both routes are generated dynamically (`getServerSideProps`) without cache, so they always reflect the current store state.

---

## Body examples (JSON)

### POST `/api/products`

```json
{
  "name": "New product",
  "description": "Product description",
  "price": 9.99,
  "quantity": 5,
  "active": true,
  "createdAt": "2026-05-12T10:00:00.000Z"
}
```

### PUT `/api/products/id`

```json
{
  "name": "Updated product",
  "description": "New description",
  "price": 19.99,
  "quantity": 8,
  "active": true,
  "createdAt": "2026-05-12T10:00:00.000Z"
}
```

### PATCH `/api/products/id` — only the fields to change

```json
{
  "active": false,
  "price": 5.5,
  "quantity": 2
}
```

---

## Validations

Validation is applied in 4 layers, implemented in `lib/product-validation.ts` and `lib/with-json-body.ts`.

### Middleware — body guard (`lib/with-json-body.ts`)

Automatically applied to all routes with a body (POST, PUT, PATCH). Rejects requests whose body is null, a non-object, or an array before reaching the handler.

### Field rules (`lib/product-validation.ts`)

| Field         | POST / PUT | PATCH    | Rules                                                   |
| ------------- | ---------- | -------- | ------------------------------------------------------- |
| `name`        | required   | optional | non-empty `string` (whitespace-only rejected)           |
| `description` | optional   | optional | `string`                                                |
| `price`       | optional   | optional | non-negative decimal `number` (≥ 0)                     |
| `quantity`    | optional   | optional | non-negative integer                                    |
| `active`      | optional   | optional | strict `boolean` (`"true"` as string is rejected)       |
| `createdAt`   | optional   | optional | strict ISO 8601 UTC — e.g. `"2026-05-12T10:00:00.000Z"` |

> Unknown fields (not listed above) are rejected with `400 Bad Request`, protecting against prototype pollution.

### Error responses

| Situation                      | Status                                         |
| ------------------------------ | ---------------------------------------------- |
| Missing or invalid credentials | `401 Unauthorized`                             |
| Invalid or missing field       | `400 Bad Request`                              |
| Product not found              | `404 Not Found`                                |
| Method not supported           | `405 Method Not Allowed` (with `Allow` header) |

---

## Initial data

The store starts with **2 random products** generated automatically (names, prices and quantities vary on each server start). The reset endpoint also regenerates those 2 products with new random data.

---

## UI Interface — features

### List page (`/products`)

- Card view of all products in the store
- **↻** button to refresh the list
- **+ Random product** button to create a product via `POST /api/products/random`
- **Reset store** button to restore the initial state via `POST /api/products/reset`
- **🗑** button on each card to remove the product via `DELETE /api/products/id`
- **View details →** link on each card to navigate to the detail page
- Links to `/sitemap.xml` and `/feed.xml` in the footer

### Detail page (`/products/id`)

- Data organised in sections: **Identification**, **Inventory**, **Metadata**
- **Toggle switch** to activate/deactivate the product via `PATCH /api/products/id`
- **🗑 Remove** button to delete the product and return to the list
- **↻** button to refresh the data
- JSON block with the raw response of `GET /api/products/id`
- Styled 404 page if the product does not exist

---

## Available scripts

| Command                   | Description                                |
| ------------------------- | ------------------------------------------ |
| `npm run dev`             | Start the development server (local HTTPS) |
| `npm run build`           | Compile the project for production         |
| `npm run start`           | Start the server in production mode        |
| `npm run lint`            | Run the linter                             |
| `npm run test:e2e`        | Run all E2E tests with Playwright          |
| `npm run test:e2e:ui`     | Open the Playwright visual interface       |
| `npm run test:e2e:report` | Open the HTML report from the last run     |

---

## E2E tests with Playwright

The tests are in `tests/e2e/` and cover the API and UI layers.

### Test structure

```
tests/e2e/
  api/
    products.spec.ts   ← API tests (request context — no browser)
  ui/
    products-page.spec.ts    ← Tests for the /products page
    product-detail.spec.ts   ← Tests for the /products/[id] page
```

### Running the tests

```bash
# Run all tests (starts the server automatically if needed)
npm run test:e2e

# Visual interface — select and debug tests individually
npm run test:e2e:ui

# View the HTML report from the last run
npm run test:e2e:report
```

> Playwright starts the `npm run dev` server automatically before tests and reuses it if already running (`reuseExistingServer: true` in dev). Tests run sequentially (`workers: 1`) because the store is shared in memory.

### How the tests work

Each test file uses `test.beforeEach` to **reset the store** before each test, ensuring isolation:

```typescript
test.beforeEach(async ({ request }) => {
  await request.post("/api/products/reset");
});
```

**API tests** use the Playwright `request` context (no browser) — ideal for validating status codes, headers and response body:

```typescript
test("returns 200 with an array of products", async ({ request }) => {
  const res = await request.get("/api/products");

  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(Array.isArray(body)).toBe(true);
});
```

**UI tests** use `page` to navigate and interact with the browser:

```typescript
test("shows 2 product cards after reset", async ({ page }) => {
  await page.goto("/products");
  const cards = page.getByRole("heading", { level: 2 });

  await expect(cards).toHaveCount(2);
});
```

### Creating new tests

#### 1. API test

Create (or edit) a file in `tests/e2e/api/`. Import `test` and `expect` from Playwright and use the `request` fixture:

```typescript
import { test, expect } from "@playwright/test";

const BASE = "/api/products";

test.beforeEach(async ({ request }) => {
  await request.post(`${BASE}/reset`);
});

test.describe("PATCH /api/products/:id", () => {
  test("returns 200 and updates the field", async ({ request }) => {
    // 1. Get an existing product
    const list = await request.get(BASE);
    const products = await list.json();
    const id = products[0].id;

    // 2. Execute the action
    const res = await request.patch(`${BASE}/${id}`, {
      data: { price: 99.99 },
    });

    // 3. Validate
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.price).toBe(99.99);
  });

  test("returns 400 when price is negative", async ({ request }) => {
    const list = await request.get(BASE);
    const id = (await list.json())[0].id;

    const res = await request.patch(`${BASE}/${id}`, {
      data: { price: -5 },
    });

    expect(res.status()).toBe(400);
  });
});
```
