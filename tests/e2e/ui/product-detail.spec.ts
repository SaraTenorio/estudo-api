import { test, expect } from "@playwright/test";
import type { Product } from "../../../lib/store";
import { resetProductsStore } from "../helpers/auth";

let product: Product;

test.beforeEach(async ({ request, page }) => {
  await resetProductsStore(request);
  const res = await request.get("/api/products");
  const products: Product[] = await res.json();
  product = products[0];

  await page.addInitScript(() => {
    localStorage.setItem("estudo-api-lang", "en");
  });

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

test("shows the status badge (Active or Inactive)", async ({ page }) => {
  const expectedBadge = product.active ? "Active" : "Inactive";

  await expect(page.getByText(expectedBadge).first()).toBeVisible();
});

test("shows the Identification and Inventory sections", async ({ page }) => {
  await expect(page.getByText("Identification")).toBeVisible();
  await expect(page.getByText("Inventory")).toBeVisible();
});

// ---------------------------------------------------------------------------
// Action: toggle active state
// ---------------------------------------------------------------------------
test("active state toggle inverts the badge", async ({ page }) => {
  const initialState = product.active;
  const expectedBadgeAfter = initialState ? "Inactive" : "Active";

  // The input[checkbox] is visually hidden by the custom toggle — click the label wrapper
  await page.getByTitle(/Click to/).click();

  await expect(page.getByText(expectedBadgeAfter).first()).toBeVisible();
});

// ---------------------------------------------------------------------------
// Action: delete product
// ---------------------------------------------------------------------------
test("Remove button deletes the product and redirects to /products", async ({
  page,
}) => {
  await page.getByRole("button", { name: /Remove/ }).click();

  await expect(page).toHaveURL("/products");
});

// ---------------------------------------------------------------------------
// 404 state
// ---------------------------------------------------------------------------
test("shows a 404 message for a non-existent product", async ({ page }) => {
  await page.goto("/products/99999");

  await expect(page.getByText("404")).toBeVisible();
  await expect(page.getByText(/Page Not Found/)).toBeVisible();
  await expect(
    page.getByText(/does not exist or has been moved/),
  ).toBeVisible();
});
