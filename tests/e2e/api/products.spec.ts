import { test, expect } from "@playwright/test";
import { MSG } from "../../../lib/messages";

const BASE = "/api/products";

test.beforeEach(async ({ request }) => {
  await request.post(`${BASE}/reset`);
});

// ---------------------------------------------------------------------------
// GET /api/products
// ---------------------------------------------------------------------------
test.describe("GET /api/products", () => {
  test("retorna 200 com um array de produtos", async ({ request }) => {
    const res = await request.get(BASE);

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test("inclui o header X-Total-Count", async ({ request }) => {
    const res = await request.get(BASE);

    expect(res.headers()["x-total-count"]).toBeDefined();
  });

  test("X-Total-Count corresponde ao número de produtos", async ({
    request,
  }) => {
    const res = await request.get(BASE);
    const body = await res.json();

    expect(Number(res.headers()["x-total-count"])).toBe(body.length);
  });
});

// ---------------------------------------------------------------------------
// POST /api/products
// ---------------------------------------------------------------------------
test.describe("POST /api/products", () => {
  test("cria um produto e retorna 201 com o produto criado", async ({
    request,
  }) => {
    const res = await request.post(BASE, {
      data: { name: "Produto de Teste", price: 9.99, quantity: 3 },
    });

    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.id).toBeDefined();
    expect(body.name).toBe("Produto de Teste");
    expect(body.price).toBe(9.99);
    expect(body.quantity).toBe(3);
    expect(body.active).toBe(true);
  });

  test("aplica defaults para campos omitidos", async ({ request }) => {
    const res = await request.post(BASE, {
      data: { name: "Só Nome" },
    });

    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.description).toBe("");
    expect(body.price).toBe(0);
    expect(body.quantity).toBe(0);
    expect(body.active).toBe(true);
    expect(body.createdAt).toBeDefined();
  });

  test("retorna 400 quando name está ausente", async ({ request }) => {
    const res = await request.post(BASE, {
      data: { price: 10 },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toBe(MSG.NAME_REQUIRED);
  });

  test("retorna 400 quando name é só espaços em branco", async ({
    request,
  }) => {
    const res = await request.post(BASE, {
      data: { name: "   " },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toBe(MSG.NAME_BLANK);
  });

  test("retorna 400 para campo desconhecido", async ({ request }) => {
    const res = await request.post(BASE, {
      data: { name: "X", campoInvalido: true },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toBe(MSG.UNKNOWN_FIELD("campoInvalido"));
  });

  // NOTA: No Next.js 16 (Pages Router) o body parser inicializa req.body a {}
  // antes do withJsonBody ser invocado. Arrays e null são normalizados para {},
  // tornando os guards Array.isArray e body===null inalcançáveis via HTTP.
  // O caminho com BODY_INVALID só é exercitável em testes unitários ao middleware.
  test.skip("retorna 400 quando o body é um array JSON (não objeto) [Next.js 16 normaliza para {}]", async ({
    request,
  }) => {
    const res = await request.post(BASE, {
      headers: { "Content-Type": "application/json" },
      body: "[1, 2, 3]",
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toBe(MSG.BODY_INVALID);
  });

  test("POST sem Content-Type retorna 400 (body fica {} e falha na validação)", async ({
    request,
  }) => {
    // Sem Content-Type o body parser não processa o body → req.body = {}
    // withJsonBody deixa passar (é objeto não-nulo) → validação falha com NAME_REQUIRED
    const res = await request.post(BASE, {
      headers: { "Content-Type": "text/plain" },
      body: "dado inválido",
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(typeof body.error).toBe("string");
  });

  test("retorna 405 para método DELETE na coleção", async ({ request }) => {
    const res = await request.delete(BASE);

    expect(res.status()).toBe(405);
    const body = await res.json();
    expect(body.error).toBe(MSG.METHOD_NOT_ALLOWED("DELETE"));
  });
});

// ---------------------------------------------------------------------------
// GET /api/products/:id
// ---------------------------------------------------------------------------
test.describe("GET /api/products/:id", () => {
  test("retorna o produto pelo id", async ({ request }) => {
    const list = await (await request.get(BASE)).json();
    const first = list[0];

    const res = await request.get(`${BASE}/${first.id}`);

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.id).toBe(first.id);
    expect(body.name).toBe(first.name);
  });

  test("retorna 404 para id inexistente", async ({ request }) => {
    const res = await request.get(`${BASE}/99999`);

    expect(res.status()).toBe(404);
    const body = await res.json();
    expect(body.error).toBe(MSG.PRODUCT_NOT_FOUND(99999));
  });

  test("retorna 400 para id inválido (não numérico)", async ({ request }) => {
    const res = await request.get(`${BASE}/abc`);

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toBe(MSG.ID_INVALID);
  });
});

// ---------------------------------------------------------------------------
// PUT /api/products/:id
// ---------------------------------------------------------------------------
test.describe("PUT /api/products/:id", () => {
  test("substitui o produto completo e retorna 200", async ({ request }) => {
    const list = await (await request.get(BASE)).json();
    const { id } = list[0];

    const res = await request.put(`${BASE}/${id}`, {
      data: { name: "Produto Substituído", price: 1.5 },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.name).toBe("Produto Substituído");
    expect(body.price).toBe(1.5);
    expect(body.description).toBe(""); // campo omitido volta ao default
    expect(body.id).toBe(id);
  });

  test("retorna 400 quando name está ausente no PUT", async ({ request }) => {
    const list = await (await request.get(BASE)).json();
    const { id } = list[0];

    const res = await request.put(`${BASE}/${id}`, {
      data: { price: 5 },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toBe(MSG.NAME_REQUIRED);
  });

  test("retorna 404 para id inexistente", async ({ request }) => {
    const res = await request.put(`${BASE}/99999`, {
      data: { name: "X" },
    });

    expect(res.status()).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// PATCH /api/products/:id
// ---------------------------------------------------------------------------
test.describe("PATCH /api/products/:id", () => {
  test("atualiza parcialmente o produto e mantém os restantes campos", async ({
    request,
  }) => {
    const list = await (await request.get(BASE)).json();
    const first = list[0];

    const res = await request.patch(`${BASE}/${first.id}`, {
      data: { price: 42.5 },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.price).toBe(42.5);
    expect(body.name).toBe(first.name); // campo não enviado mantém-se
  });

  test("inverte o campo active", async ({ request }) => {
    const list = await (await request.get(BASE)).json();
    const first = list[0];

    const res = await request.patch(`${BASE}/${first.id}`, {
      data: { active: !first.active },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.active).toBe(!first.active);
  });

  test("retorna 400 para campo desconhecido", async ({ request }) => {
    const list = await (await request.get(BASE)).json();
    const { id } = list[0];

    const res = await request.patch(`${BASE}/${id}`, {
      data: { campoInvalido: "x" },
    });

    expect(res.status()).toBe(400);
  });
});

// ---------------------------------------------------------------------------
// DELETE /api/products/:id
// ---------------------------------------------------------------------------
test.describe("DELETE /api/products/:id", () => {
  test("remove o produto e retorna o produto eliminado", async ({
    request,
  }) => {
    const list = await (await request.get(BASE)).json();
    const { id } = list[0];

    const res = await request.delete(`${BASE}/${id}`);

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.id).toBe(id);
  });

  test("o produto já não existe após DELETE", async ({ request }) => {
    const list = await (await request.get(BASE)).json();
    const { id } = list[0];

    await request.delete(`${BASE}/${id}`);
    const check = await request.get(`${BASE}/${id}`);

    expect(check.status()).toBe(404);
  });

  test("retorna 404 para id inexistente", async ({ request }) => {
    const res = await request.delete(`${BASE}/99999`);

    expect(res.status()).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// POST /api/products/random
// ---------------------------------------------------------------------------
test.describe("POST /api/products/random", () => {
  test("cria um produto aleatório e retorna 201", async ({ request }) => {
    const res = await request.post(`${BASE}/random`);

    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.id).toBeDefined();
    expect(typeof body.name).toBe("string");
    expect(body.name.length).toBeGreaterThan(0);
    expect(typeof body.price).toBe("number");
    expect(typeof body.active).toBe("boolean");
  });

  test("retorna 405 para GET em /random", async ({ request }) => {
    const res = await request.get(`${BASE}/random`);

    // random é um ficheiro de rota mas o método não é permitido
    expect(res.status()).toBe(405);
  });
});

// ---------------------------------------------------------------------------
// POST /api/products/reset
// ---------------------------------------------------------------------------
test.describe("POST /api/products/reset", () => {
  test("repõe o store com exatamente 2 produtos", async ({ request }) => {
    // Adicionar um extra para garantir que o reset limpa o estado
    await request.post(`${BASE}/random`);
    await request.post(`${BASE}/random`);

    const res = await request.post(`${BASE}/reset`);

    expect(res.status()).toBe(200);
    const after = await (await request.get(BASE)).json();
    expect(after).toHaveLength(2);
  });

  test("retorna 405 para GET em /reset", async ({ request }) => {
    const res = await request.get(`${BASE}/reset`);

    expect(res.status()).toBe(405);
  });
});
