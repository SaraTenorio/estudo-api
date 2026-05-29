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
// Conteúdo da página
// ---------------------------------------------------------------------------
test("exibe o nome do produto no título e no h1", async ({ page }) => {
  await expect(page).toHaveTitle(
    new RegExp(product.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    product.name,
  );
});

test("exibe o badge de estado (Ativo ou Inativo)", async ({ page }) => {
  const expectedBadge = product.active ? "Ativo" : "Inativo";

  await expect(page.getByText(expectedBadge).first()).toBeVisible();
});

test("exibe as secções Identificação e Inventário", async ({ page }) => {
  await expect(page.getByText("Identificação")).toBeVisible();
  await expect(page.getByText("Inventário")).toBeVisible();
});

// ---------------------------------------------------------------------------
// Ação: toggle de estado ativo
// ---------------------------------------------------------------------------
test("toggle de estado ativo inverte o badge", async ({ page }) => {
  const initialState = product.active;
  const expectedBadgeAfter = initialState ? "Inativo" : "Ativo";

  // O input[checkbox] está visualmente oculto pelo toggle custom — clicar no label wrapper
  await page.getByTitle(/Clique para/).click();

  await expect(page.getByText(expectedBadgeAfter).first()).toBeVisible();
});

// ---------------------------------------------------------------------------
// Ação: eliminar produto
// ---------------------------------------------------------------------------
test("botão 🗑 Remover elimina o produto e redireciona para /products", async ({
  page,
}) => {
  await page.getByRole("button", { name: /Remover/ }).click();

  await expect(page).toHaveURL("/products");
});

// ---------------------------------------------------------------------------
// Estado 404
// ---------------------------------------------------------------------------
test("exibe mensagem 404 para produto inexistente", async ({ page }) => {
  await page.goto("/products/99999");

  await expect(page.getByText("404")).toBeVisible();
  await expect(page.getByText(/não encontrado/)).toBeVisible();
});
