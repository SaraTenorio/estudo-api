import { test, expect } from "@playwright/test";

// ---------------------------------------------------------------------------
// /products — language switch
// ---------------------------------------------------------------------------
test.describe("i18n — /products language switch", () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post("/api/products/reset");
    await page.goto("/products");
    await expect(page.getByRole("heading", { level: 2 }).first()).toBeVisible();
  });

  test("page loads with a language selector showing EN and PT", async ({
    page,
  }) => {
    await expect(page.getByRole("button", { name: "EN" })).toBeVisible();
    await expect(page.getByRole("button", { name: "PT" })).toBeVisible();
  });

  test("switching to EN translates the heading and action buttons", async ({
    page,
  }) => {
    // Default is PT
    await expect(page.getByRole("heading", { name: "Produtos" })).toBeVisible();

    await page.getByRole("button", { name: "EN" }).click();

    await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Random product/ }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Reset store" }),
    ).toBeVisible();
  });

  test("switching back to PT restores Portuguese labels", async ({ page }) => {
    await page.getByRole("button", { name: "EN" }).click();
    await page.getByRole("button", { name: "PT" }).click();

    await expect(page.getByRole("heading", { name: "Produtos" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Produto aleatório/ }),
    ).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// /products/:id — language persists on navigation
// ---------------------------------------------------------------------------
test.describe("i18n — language persists on navigation to detail", () => {
  test("EN labels appear on the detail page after switching language on /products", async ({
    page,
    request,
  }) => {
    await request.post("/api/products/reset");
    await page.goto("/products");
    await expect(page.getByRole("heading", { level: 2 }).first()).toBeVisible();

    // Switch to English
    await page.getByRole("button", { name: "EN" }).click();

    // Navigate to the detail page
    await page.getByRole("link", { name: "View details →" }).first().click();
    await expect(page).toHaveURL(/\/products\/\d+/);

    // EN section labels should be visible
    await expect(page.getByText("Identification")).toBeVisible();
    await expect(page.getByText("Inventory")).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Home — language switch
// ---------------------------------------------------------------------------
test.describe("i18n — home page language switch", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("switching to EN on home page translates the auth hint", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "EN" }).click();

    // English auth hint should be visible
    await expect(page.getByText(/GET requests need an API key/i)).toBeVisible();
  });

  test("switching to PT on home page translates the auth hint", async ({
    page,
  }) => {
    // Ensure EN first, then switch to PT
    await page.getByRole("button", { name: "EN" }).click();
    await page.getByRole("button", { name: "PT" }).click();

    await expect(
      page.getByText(/Pedidos GET precisam de uma API key/i),
    ).toBeVisible();
  });
});
