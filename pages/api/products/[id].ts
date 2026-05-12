import type { NextApiRequest, NextApiResponse } from "next";
import { store } from "../../../lib/store";
import type { Product } from "../../../lib/store";

type ErrorResponse = { error: string };

const ALLOWED_METHODS = "GET, PUT, PATCH, DELETE";

/**
 * GET    /api/products/:id  → retorna um produto pelo id
 * PUT    /api/products/:id  → substitui o produto completo
 * PATCH  /api/products/:id  → atualiza campos parcialmente
 * DELETE /api/products/:id  → remove o produto
 */
export default function handler(
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

    store.products[index] = {
      id,
      name,
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

    if (partial.name !== undefined && typeof partial.name !== "string") {
      return res.status(400).json({ error: '"name" deve ser uma string' });
    }

    if (partial.price !== undefined && typeof partial.price !== "number") {
      return res
        .status(400)
        .json({ error: '"price" deve ser um número decimal' });
    }

    if (
      partial.quantity !== undefined &&
      (!Number.isInteger(partial.quantity) || partial.quantity < 0)
    ) {
      return res
        .status(400)
        .json({ error: '"quantity" deve ser um inteiro não negativo' });
    }

    if (
      partial.createdAt !== undefined &&
      isNaN(Date.parse(partial.createdAt))
    ) {
      return res
        .status(400)
        .json({ error: '"createdAt" deve ser uma data ISO 8601 válida' });
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
