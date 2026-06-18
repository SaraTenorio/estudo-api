import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

// ---------------------------------------------------------------------------
// Page metadata
// ---------------------------------------------------------------------------
test.describe("Home — metadata", () => {
  test("has 'Estudo API' in the page title", async ({ page }) => {
    await expect(page).toHaveTitle(/Estudo API/i);
  });

  test("shows the main heading 'Estudo API'", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Estudo API" }),
    ).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Endpoint documentation
// ---------------------------------------------------------------------------
test.describe("Home — endpoint documentation", () => {
  test("shows all HTTP method badges", async ({ page }) => {
    for (const method of ["GET", "POST", "PUT", "PATCH", "DELETE"]) {
      await expect(page.getByText(method).first()).toBeVisible();
    }
  });

  test("shows the authentication hint", async ({ page }) => {
    // Both PT and EN versions are acceptable
    const hint = page.getByText(/X-API-Key|Bearer JWT/i);

    await expect(hint.first()).toBeVisible();
  });

  test("shows the base URL code block", async ({ page }) => {
    await expect(page.getByText(/localhost:3000/)).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------
test.describe("Home — navigation links", () => {
  test("'Ver produtos' link navigates to /products", async ({ page }) => {
    // Works for both PT ("Ver produtos em cards →") and EN ("View products as cards →")
    await page
      .getByRole("link", { name: /Ver produtos|View products/i })
      .click();

    await expect(page).toHaveURL("/products");
  });

  test("sitemap.xml link is present and points to /sitemap.xml", async ({
    page,
  }) => {
    const link = page.getByRole("link", { name: /sitemap/i });

    await expect(link).toHaveAttribute("href", "/sitemap.xml");
  });

  test("feed.xml link is present and points to /feed.xml", async ({ page }) => {
    const link = page.getByRole("link", { name: /feed/i });

    await expect(link).toHaveAttribute("href", "/feed.xml");
  });
});

// ---------------------------------------------------------------------------
// Copy path button
// ---------------------------------------------------------------------------
test.describe("Home — copy button", () => {
  test("copy path button copies a /api/ path to clipboard", async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);

    await page
      .getByTitle(/Copiar path|Copy path/i)
      .first()
      .click();

    const clipboard = await page.evaluate(() => navigator.clipboard.readText());

    expect(clipboard).toMatch(/^\/api\//);
  });
});
