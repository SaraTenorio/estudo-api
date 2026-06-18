import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("estudo-api-lang", "pt");
  });
  await page.goto("/maintenance");
});

// ---------------------------------------------------------------------------
// Page content
// ---------------------------------------------------------------------------
test.describe("Maintenance page — content", () => {
  test("shows a maintenance heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /manutenção|maintenance/i }),
    ).toBeVisible();
  });

  test("shows the maintenance message body", async ({ page }) => {
    // Both PT and EN messages are acceptable
    await expect(
      page.getByText(/temporariamente indisponível|temporarily unavailable/i),
    ).toBeVisible();
  });

  test("has noindex in the robots meta tag", async ({ page }) => {
    const robots = await page
      .locator('meta[name="robots"]')
      .getAttribute("content");

    expect(robots).toBe("noindex");
  });
});

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------
test.describe("Maintenance page — navigation", () => {
  test("back-to-home link is visible", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: /início|home/i }),
    ).toBeVisible();
  });

  test("back-to-home link navigates to /", async ({ page }) => {
    await page.getByRole("link", { name: /início|home/i }).click();

    await expect(page).toHaveURL("/");
  });
});

// ---------------------------------------------------------------------------
// Language selector
// ---------------------------------------------------------------------------
test.describe("Maintenance page — language selector", () => {
  test("language selector is visible", async ({ page }) => {
    // The LangSelector renders EN and PT buttons
    await expect(page.getByTitle("English")).toBeVisible();
  });

  test("switching to EN changes the heading language", async ({ page }) => {
    // Start in PT (default)
    await expect(
      page.getByRole("heading", { name: /Manutenção/i }),
    ).toBeVisible();

    await page.getByTitle("English").click();

    await expect(
      page.getByRole("heading", { name: /Maintenance/i }),
    ).toBeVisible();
  });
});
