import type { NextApiRequest, NextApiResponse } from "next";
import { store } from "../../../lib/store";
import type { Product } from "../../../lib/store";
import { validateProductBody } from "../../../lib/product-validation";
import { withJsonBody } from "../../../lib/with-json-body";

type ErrorResponse = { error: string };

const ALLOWED_METHODS = "GET, POST";

/**
 * GET  /api/products  → lista todos os produtos
 * POST /api/products  → cria um novo produto
 */
function handler(
  req: NextApiRequest,
  res: NextApiResponse<Product[] | Product | ErrorResponse>,
) {
  if (req.method === "GET") {
    res.setHeader("X-Total-Count", store.products.length);
    return res.status(200).json(store.products);
  }

  if (req.method === "POST") {
    const body = req.body as Partial<Product>;

    const validationError = validateProductBody(body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const { name, description, price, quantity, active, createdAt } = body;

    const newProduct: Product = {
      id: store.nextId++,
      name: name!,
      description: description ?? "",
      price: price ?? 0,
      quantity: quantity ?? 0,
      active: active ?? true,
      createdAt: createdAt ?? new Date().toISOString(),
    };
    store.products.push(newProduct);
    return res.status(201).json(newProduct);
  }

  res.setHeader("Allow", ALLOWED_METHODS);
  return res.status(405).json({ error: `Método ${req.method} não permitido` });
}

export default withJsonBody(handler);
