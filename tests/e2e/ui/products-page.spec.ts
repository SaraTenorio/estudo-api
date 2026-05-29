import { test, expect } from "@playwright/test";

test.beforeEach(async ({ request, page }) => {
  await request.post("/api/products/reset");
  await page.goto("/products");
  // Wait for product cards to load
  await expect(page.getByRole("heading", { level: 2 }).first()).toBeVisible();
});

// ---------------------------------------------------------------------------
// Page content
// ---------------------------------------------------------------------------
test("has the correct title and Produtos heading", async ({ page }) => {
  await expect(page).toHaveTitle(/Produtos/);
  await expect(page.getByRole("heading", { name: "Produtos" })).toBeVisible();
});

test("shows 2 product cards after reset", async ({ page }) => {
  const cards = page.getByRole("heading", { level: 2 });

  await expect(cards).toHaveCount(2);
});

test("each card has the Ver detalhes → link", async ({ page }) => {
  const links = page.getByRole("link", { name: "Ver detalhes →" });

  await expect(links).toHaveCount(2);
});

// ---------------------------------------------------------------------------
// Action: add random product
// ---------------------------------------------------------------------------
test("'+ Produto aleatório' button adds a card and shows a toast", async ({
  page,
}) => {
  await page.getByRole("button", { name: /Produto aleatório/ }).click();

  await expect(page.getByText(/adicionado/)).toBeVisible();
  await expect(page.getByRole("heading", { level: 2 })).toHaveCount(3);
});

// ---------------------------------------------------------------------------
// Action: reset store
// ---------------------------------------------------------------------------
test("'Resetar store' button resets to 2 products and shows a toast", async ({
  page,
}) => {
  // Add an extra product to make the reset visible
  await page.getByRole("button", { name: /Produto aleatório/ }).click();
  await expect(page.getByRole("heading", { level: 2 })).toHaveCount(3);

  await page.getByRole("button", { name: "Resetar store" }).click();

  await expect(page.getByText(/Store resetado/)).toBeVisible();
  await expect(page.getByRole("heading", { level: 2 })).toHaveCount(2);
});

// ---------------------------------------------------------------------------
// Action: delete product
// ---------------------------------------------------------------------------
test("delete button removes the product and shows a toast", async ({
  page,
}) => {
  const deleteButtons = page.getByTitle("Remover produto");

  await deleteButtons.first().click();

  await expect(page.getByText(/removido/)).toBeVisible();
  await expect(page.getByRole("heading", { level: 2 })).toHaveCount(1);
});

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------
test("'Ver detalhes →' link navigates to the product detail page", async ({
  page,
}) => {
  await page.getByRole("link", { name: "Ver detalhes →" }).first().click();

  await expect(page).toHaveURL(/\/products\/\d+/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
