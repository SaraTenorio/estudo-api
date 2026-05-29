import type { NextApiRequest, NextApiResponse } from "next";
import { store } from "../../../lib/store";
import type { Product } from "../../../lib/store";
import { validateProductBody } from "../../../lib/product-validation";
import { withJsonBody } from "../../../lib/with-json-body";

type ErrorResponse = { error: string };

const ALLOWED_METHODS = "GET, PUT, PATCH, DELETE";

/**
 * GET    /api/products/id  → retorna um produto pelo id
 * PUT    /api/products/id  → substitui o produto completo
 * PATCH  /api/products/id  → atualiza campos parcialmente
 * DELETE /api/products/id  → remove o produto
 */
function handler(
  req: NextApiRequest,
  res: NextApiResponse<Product | ErrorResponse>,
) {
  const id = Number(req.query.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  const index = store.products.findIndex((product) => product.id === id);

  if (index === -1) {
    return res
      .status(404)
      .json({ error: `Produto com id ${id} não encontrado` });
  }

  if (req.method === "GET") {
    return res.status(200).json(store.products[index]);
  }

  if (req.method === "PUT") {
    const body = req.body as Partial<Product>;

    const validationError = validateProductBody(body, true);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const { name, description, price, quantity, active, createdAt } = body;

    store.products[index] = {
      id,
      name: name!,
      description: description ?? "",
      price: price ?? 0,
      quantity: quantity ?? 0,
      active: active ?? true,
      createdAt: createdAt ?? store.products[index].createdAt,
    };
    return res.status(200).json(store.products[index]);
  }

  if (req.method === "PATCH") {
    const partial = req.body as Partial<Omit<Product, "id">>;

    const validationError = validateProductBody(partial, false);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    store.products[index] = { ...store.products[index], ...partial, id };
    return res.status(200).json(store.products[index]);
  }

  if (req.method === "DELETE") {
    const [deleted] = store.products.splice(index, 1);
    return res.status(200).json(deleted);
  }

  res.setHeader("Allow", ALLOWED_METHODS);
  return res.status(405).json({ error: `Método ${req.method} não permitido` });
}

export default withJsonBody(handler);
