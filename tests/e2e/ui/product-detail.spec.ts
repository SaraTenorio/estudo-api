import { test, expect } from "@playwright/test";
import type { Product } from "../../../lib/store";

let product: Product;

test.beforeEach(async ({ request, page }) => {
  await request.post("/api/products/reset");
  const res = await request.get("/api/products");
  const products: Product[] = await res.json();
  product = products[0];

  await page.goto(`/products/${product.id}`);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

// ---------------------------------------------------------------------------
// Page content
// ---------------------------------------------------------------------------
test("shows the product name in the title and h1", async ({ page }) => {
  await expect(page).toHaveTitle(
    new RegExp(product.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    product.name,
  );
});

test("shows the status badge (Ativo or Inativo)", async ({ page }) => {
  const expectedBadge = product.active ? "Ativo" : "Inativo";

  await expect(page.getByText(expectedBadge).first()).toBeVisible();
});

test("shows the Identificação and Inventário sections", async ({ page }) => {
  await expect(page.getByText("Identificação")).toBeVisible();
  await expect(page.getByText("Inventário")).toBeVisible();
});

// ---------------------------------------------------------------------------
// Action: toggle active state
// ---------------------------------------------------------------------------
test("active state toggle inverts the badge", async ({ page }) => {
  const initialState = product.active;
  const expectedBadgeAfter = initialState ? "Inativo" : "Ativo";

  // The input[checkbox] is visually hidden by the custom toggle — click the label wrapper
  await page.getByTitle(/Clique para/).click();

  await expect(page.getByText(expectedBadgeAfter).first()).toBeVisible();
});

// ---------------------------------------------------------------------------
// Action: delete product
// ---------------------------------------------------------------------------
test("Remover button deletes the product and redirects to /products", async ({
  page,
}) => {
  await page.getByRole("button", { name: /Remover/ }).click();

  await expect(page).toHaveURL("/products");
});

// ---------------------------------------------------------------------------
// 404 state
// ---------------------------------------------------------------------------
test("shows a 404 message for a non-existent product", async ({ page }) => {
  await page.goto("/products/99999");

  await expect(page.getByText("404")).toBeVisible();
  await expect(page.getByText(/não encontrado/)).toBeVisible();
});
