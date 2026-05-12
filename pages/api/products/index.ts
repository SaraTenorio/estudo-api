import type { NextApiRequest, NextApiResponse } from "next";
import { store } from "../_store";
import type { Product } from "../_store";

type ErrorResponse = { error: string };

const ALLOWED_METHODS = "GET, POST";

/**
 * GET  /api/products  → lista todos os produtos
 * POST /api/products  → cria um novo produto
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Product[] | Product | ErrorResponse>,
) {
  if (req.method === "GET") {
    res.setHeader("X-Total-Count", store.products.length);
    return res.status(200).json(store.products);
  }

  if (req.method === "POST") {
    const { name, description, price, quantity, active, createdAt } =
      req.body as Partial<Product>;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: 'O campo "name" é obrigatório' });
    }

    if (price !== undefined && typeof price !== "number") {
      return res
        .status(400)
        .json({ error: '"price" deve ser um número decimal' });
    }

    if (
      quantity !== undefined &&
      (!Number.isInteger(quantity) || quantity < 0)
    ) {
      return res
        .status(400)
        .json({ error: '"quantity" deve ser um inteiro não negativo' });
    }

    if (createdAt !== undefined && isNaN(Date.parse(createdAt))) {
      return res
        .status(400)
        .json({ error: '"createdAt" deve ser uma data ISO 8601 válida' });
    }

    const newProduct: Product = {
      id: store.nextId++,
      name,
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
