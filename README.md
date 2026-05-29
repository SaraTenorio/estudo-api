# Estudo API

API REST de teste construída com **Next.js** (Pages Router) e **TypeScript**, com dados em memória. Ideal para testar requisições HTTP no Postman ou qualquer cliente REST.

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) LTS (v18+)
- npm (incluído com o Node.js)

---

## Instalação e arranque

```bash
# 1. Entrar na pasta do projeto
cd estudo

# 2. Instalar dependências (apenas na primeira vez)
npm install

# 3. Arrancar o servidor de desenvolvimento
npm run dev
```

O servidor fica disponível em **https://localhost:3000**.

Abre o browser nas seguintes páginas:

| URL                                  | Descrição                                         |
| ------------------------------------ | ------------------------------------------------- |
| `https://localhost:3000`             | Documentação dos endpoints da API                 |
| `https://localhost:3000/products`    | Visualização dos produtos em cards (interface UI) |
| `https://localhost:3000/products/id` | Página de detalhes de um produto                  |
| `https://localhost:3000/sitemap.xml` | Sitemap XML com páginas estáticas e produtos      |
| `https://localhost:3000/feed.xml`    | RSS Feed com todos os produtos                    |

> **HTTPS local:** O servidor de desenvolvimento arranca com HTTPS usando a flag `--experimental-https`. O Next.js gera automaticamente um certificado auto-assinado localmente através do [`mkcert`](https://github.com/FiloSottile/mkcert). Na primeira execução pode ser necessário aceitar o certificado no browser.

> **Nota:** os dados vivem em memória e são reiniciados sempre que o servidor é reiniciado. Os dados iniciais são carregados automaticamente.

---

## Estrutura do projeto

```
lib/
  store.ts               ← Store em memória + makeRandomProduct (partilhado)
  product-validation.ts  ← Validação de campos do produto
  with-json-body.ts      ← Middleware: guarda body nulo/não-objeto
pages/
  index.tsx              ← Página de documentação da API
  products.tsx           ← Página de visualização em cards
  products/
    [id].tsx             ← Página de detalhes do produto (toggle ativo, remover)
  sitemap.xml.tsx        ← GET /sitemap.xml — Sitemap XML dinâmico
  feed.xml.tsx           ← GET /feed.xml — RSS Feed dos produtos
  api/
    hello.ts             ← Rota de exemplo do Next.js
    products/
      index.ts           ← GET /api/products · POST /api/products
      [id].ts            ← GET · PUT · PATCH · DELETE /api/products/id
      random.ts          ← POST /api/products/random
      reset.ts           ← POST /api/products/reset
```

---

## Modelo de dados — `Product`

| Campo         | Tipo      | Obrigatório | Default                    | Descrição                         |
| ------------- | --------- | ----------- | -------------------------- | --------------------------------- |
| `id`          | `number`  | automático  | —                          | Identificador único (inteiro)     |
| `name`        | `string`  | ✅          | —                          | Nome do produto                   |
| `description` | `string`  | ❌          | `""`                       | Descrição livre                   |
| `price`       | `number`  | ❌          | `0`                        | Preço decimal                     |
| `quantity`    | `number`  | ❌          | `0`                        | Quantidade em stock (inteiro ≥ 0) |
| `active`      | `boolean` | ❌          | `true`                     | Estado ativo/inativo              |
| `createdAt`   | `string`  | ❌          | `new Date().toISOString()` | Data de criação (ISO 8601)        |

---

## Endpoints

### Coleção — `/api/products`

| Método | Descrição               |
| ------ | ----------------------- |
| `GET`  | Lista todos os produtos |
| `POST` | Cria um novo produto    |

### Produto individual — `/api/products/id`

| Método   | Descrição                    |
| -------- | ---------------------------- |
| `GET`    | Retorna um produto pelo ID   |
| `PUT`    | Substitui o produto completo |
| `PATCH`  | Atualiza campos parcialmente |
| `DELETE` | Remove o produto             |

### Produto aleatório — `/api/products/random`

| Método | Descrição                                       |
| ------ | ----------------------------------------------- |
| `POST` | Cria um produto com dados aleatórios (sem body) |

### Reset — `/api/products/reset`

| Método | Descrição                                             |
| ------ | ----------------------------------------------------- |
| `POST` | Restaura o store com 2 produtos aleatórios (sem body) |

### Sitemap — `/sitemap.xml`

| Método | Descrição                                                                         |
| ------ | --------------------------------------------------------------------------------- |
| `GET`  | Sitemap XML com páginas estáticas (`/`, `/products`) e todos os produtos do store |

### RSS Feed — `/feed.xml`

| Método | Descrição                                                                  |
| ------ | -------------------------------------------------------------------------- |
| `GET`  | RSS 2.0 com todos os produtos ordenados do mais recente para o mais antigo |

> Ambas as rotas são geradas dinamicamente (`getServerSideProps`) sem cache, pelo que reflectem sempre o estado atual do store.

---

## Exemplos de body (JSON)

### POST `/api/products`

```json
{
  "name": "Novo produto",
  "description": "Descrição do produto",
  "price": 9.99,
  "quantity": 5,
  "active": true,
  "createdAt": "2026-05-12T10:00:00.000Z"
}
```

### PUT `/api/products/id`

```json
{
  "name": "Produto atualizado",
  "description": "Nova descrição",
  "price": 19.99,
  "quantity": 8,
  "active": true,
  "createdAt": "2026-05-12T10:00:00.000Z"
}
```

### PATCH `/api/products/id` — apenas os campos a alterar

```json
{
  "active": false,
  "price": 5.5,
  "quantity": 2
}
```

---

## Validações

A validação é aplicada em 4 camadas, implementadas em `lib/product-validation.ts` e `lib/with-json-body.ts`.

### Middleware — body guard (`lib/with-json-body.ts`)

Aplicado automaticamente em todas as rotas com body (POST, PUT, PATCH). Rejeita requests cujo body seja nulo, não-objeto ou array antes de chegar ao handler.

### Regras de campo (`lib/product-validation.ts`)

| Campo         | POST / PUT  | PATCH    | Regras                                                  |
| ------------- | ----------- | -------- | ------------------------------------------------------- |
| `name`        | obrigatório | opcional | `string` não vazio (só espaços rejeitado)               |
| `description` | opcional    | opcional | `string`                                                |
| `price`       | opcional    | opcional | `number` decimal, não negativo (≥ 0)                    |
| `quantity`    | opcional    | opcional | inteiro não negativo                                    |
| `active`      | opcional    | opcional | `boolean` estrito (`"true"` como string é rejeitado)    |
| `createdAt`   | opcional    | opcional | ISO 8601 UTC estrito — ex: `"2026-05-12T10:00:00.000Z"` |

> Campos desconhecidos (não listados acima) são rejeitados com `400 Bad Request`, protegendo contra prototype pollution.

### Respostas de erro

| Situação                   | Status                                        |
| -------------------------- | --------------------------------------------- |
| Campo inválido ou em falta | `400 Bad Request`                             |
| Produto não encontrado     | `404 Not Found`                               |
| Método não suportado       | `405 Method Not Allowed` (com header `Allow`) |

---

## Dados iniciais

O store arranca com **2 produtos aleatórios** gerados automaticamente (nomes, preços e quantidades variam a cada arranque do servidor). O endpoint de reset também regenera esses 2 produtos com dados aleatórios novos.

---

## Interface UI — funcionalidades

### Página de lista (`/products`)

- Visualização em cards de todos os produtos do store
- Botão **↻** para refrescar a lista
- Botão **+ Produto aleatório** para criar um produto via `POST /api/products/random`
- Botão **Resetar store** para repor o estado inicial via `POST /api/products/reset`
- Botão **🗑** em cada card para remover o produto via `DELETE /api/products/id`
- Link **Ver detalhes →** em cada card para navegar para a página de detalhes
- Links para `/sitemap.xml` e `/feed.xml` no rodapé

### Página de detalhes (`/products/id`)

- Dados organizados em secções: **Identificação**, **Inventário**, **Metadados**
- **Toggle switch** para ativar/desativar o produto via `PATCH /api/products/id`
- Botão **🗑 Remover** para apagar o produto e regressar à lista
- Botão **↻** para refrescar os dados
- Bloco JSON com a resposta raw de `GET /api/products/id`
- Página 404 estilizada se o produto não existir

---

## Scripts disponíveis

| Comando                   | Descrição                                          |
| ------------------------- | -------------------------------------------------- |
| `npm run dev`             | Inicia o servidor de desenvolvimento (HTTPS local) |
| `npm run build`           | Compila o projeto para produção                    |
| `npm run start`           | Inicia o servidor em modo produção                 |
| `npm run lint`            | Corre o linter                                     |
| `npm run test:e2e`        | Corre todos os testes E2E com Playwright           |
| `npm run test:e2e:ui`     | Abre a interface visual do Playwright              |
| `npm run test:e2e:report` | Abre o relatório HTML do último run                |

---

## Testes E2E com Playwright

Os testes estão em `tests/e2e/` e cobrem as camadas de API e UI.

### Estrutura dos testes

```
tests/e2e/
  api/
    products.spec.ts   ← Testes de API (request context — sem browser)
  ui/
    products-page.spec.ts    ← Testes da página /products
    product-detail.spec.ts   ← Testes da página /products/[id]
```

### Correr os testes

```bash
# Correr todos os testes (inicia o servidor automaticamente se necessário)
npm run test:e2e

# Interface visual — selecionar e depurar testes individualmente
npm run test:e2e:ui

# Ver o relatório HTML do último run
npm run test:e2e:report
```

> O Playwright inicia o servidor `npm run dev` automaticamente antes dos testes e reutiliza-o se já estiver a correr (`reuseExistingServer: true` em dev). Os testes correm sequencialmente (`workers: 1`) porque o store é partilhado em memória.

### Como os testes funcionam

Cada ficheiro de testes usa `test.beforeEach` para **resetar o store** antes de cada teste, garantindo isolamento:

```typescript
test.beforeEach(async ({ request }) => {
  await request.post("/api/products/reset");
});
```

**Testes de API** usam o `request` context do Playwright (sem browser) — ideais para validar status codes, headers e corpo da resposta:

```typescript
test("returns 200 with an array of products", async ({ request }) => {
  const res = await request.get("/api/products");

  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(Array.isArray(body)).toBe(true);
});
```

**Testes de UI** usam `page` para navegar e interagir com o browser:

```typescript
test("shows 2 product cards after reset", async ({ page }) => {
  await page.goto("/products");
  const cards = page.getByRole("heading", { level: 2 });

  await expect(cards).toHaveCount(2);
});
```

### Criar novos testes

#### 1. Teste de API

Cria (ou edita) um ficheiro em `tests/e2e/api/`. Importa `test` e `expect` do Playwright e usa o fixture `request`:

```typescript
import { test, expect } from "@playwright/test";

const BASE = "/api/products";

test.beforeEach(async ({ request }) => {
  await request.post(`${BASE}/reset`);
});

test.describe("PATCH /api/products/:id", () => {
  test("returns 200 and updates the field", async ({ request }) => {
    // 1. Obter um produto existente
    const list = await request.get(BASE);
    const products = await list.json();
    const id = products[0].id;

    // 2. Executar a ação
    const res = await request.patch(`${BASE}/${id}`, {
      data: { price: 99.99 },
    });

    // 3. Validar
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

#### 2. Teste de UI

Cria (ou edita) um ficheiro em `tests/e2e/ui/`. Usa os fixtures `page` e `request` em conjunto:

```typescript
import { test, expect } from "@playwright/test";

test.beforeEach(async ({ request, page }) => {
  await request.post("/api/products/reset");
  await page.goto("/products");
  // Aguardar que os cards carreguem
  await expect(page.getByRole("heading", { level: 2 }).first()).toBeVisible();
});

test("mostra o nome do produto no card", async ({ page }) => {
  // Obter o nome via API para comparar
  const res = await page.request.get("/api/products");
  const products = await res.json();

  await expect(
    page.getByRole("heading", { name: products[0].name }),
  ).toBeVisible();
});
```

#### Boas práticas

- **Usar locators semânticos** (`getByRole`, `getByText`, `getByTitle`) em vez de seletores CSS/XPath — são mais resilientes a mudanças de markup.
- **Sempre resetar o store** no `beforeEach` para garantir isolamento entre testes.
- **Não depender da ordem dos testes** — cada teste deve ser autossuficiente.
- **Preferir `toBeVisible()`** em vez de verificar só a existência no DOM.
- **Agrupar com `test.describe`** quando há vários cenários para o mesmo endpoint ou funcionalidade.

### Configuração

A configuração está em `playwright.config.ts`:

| Opção               | Valor                    |
| ------------------- | ------------------------ |
| `testDir`           | `./tests/e2e`            |
| `baseURL`           | `https://localhost:3000` |
| Browser             | Chromium                 |
| `workers`           | `1` (sequencial)         |
| `retries` em CI     | `2`                      |
| HTTPS auto-assinado | ignorado automaticamente |
