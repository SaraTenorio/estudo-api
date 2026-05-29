import { test, expect } from "@playwright/test";

test.beforeEach(async ({ request, page }) => {
  await request.post("/api/products/reset");
  await page.goto("/products");
  // Aguardar que os cartões carreguem
  await expect(page.getByRole("heading", { level: 2 }).first()).toBeVisible();
});

// ---------------------------------------------------------------------------
// Conteúdo da página
// ---------------------------------------------------------------------------
test("tem o título correto e o heading Produtos", async ({ page }) => {
  await expect(page).toHaveTitle(/Produtos/);
  await expect(page.getByRole("heading", { name: "Produtos" })).toBeVisible();
});

test("exibe 2 cartões de produto após reset", async ({ page }) => {
  const cards = page.getByRole("heading", { level: 2 });

  await expect(cards).toHaveCount(2);
});

test("cada cartão tem o link Ver detalhes →", async ({ page }) => {
  const links = page.getByRole("link", { name: "Ver detalhes →" });

  await expect(links).toHaveCount(2);
});

// ---------------------------------------------------------------------------
// Ação: adicionar produto aleatório
// ---------------------------------------------------------------------------
test("botão '+ Produto aleatório' adiciona um cartão e mostra toast", async ({
  page,
}) => {
  await page.getByRole("button", { name: /Produto aleatório/ }).click();

  await expect(page.getByText(/adicionado/)).toBeVisible();
  await expect(page.getByRole("heading", { level: 2 })).toHaveCount(3);
});

// ---------------------------------------------------------------------------
// Ação: resetar store
// ---------------------------------------------------------------------------
test("botão 'Resetar store' repõe 2 produtos e mostra toast", async ({
  page,
}) => {
  // Adicionar um extra para o reset ser visível
  await page.getByRole("button", { name: /Produto aleatório/ }).click();
  await expect(page.getByRole("heading", { level: 2 })).toHaveCount(3);

  await page.getByRole("button", { name: "Resetar store" }).click();

  await expect(page.getByText(/Store resetado/)).toBeVisible();
  await expect(page.getByRole("heading", { level: 2 })).toHaveCount(2);
});

// ---------------------------------------------------------------------------
// Ação: eliminar produto
// ---------------------------------------------------------------------------
test("botão 🗑 elimina o produto e mostra toast", async ({ page }) => {
  const deleteButtons = page.getByTitle("Remover produto");

  await deleteButtons.first().click();

  await expect(page.getByText(/removido/)).toBeVisible();
  await expect(page.getByRole("heading", { level: 2 })).toHaveCount(1);
});

// ---------------------------------------------------------------------------
// Navegação para detalhes
// ---------------------------------------------------------------------------
test("link 'Ver detalhes →' navega para a página de detalhe", async ({
  page,
}) => {
  await page.getByRole("link", { name: "Ver detalhes →" }).first().click();

  await expect(page).toHaveURL(/\/products\/\d+/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
