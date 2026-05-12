import type { NextApiRequest, NextApiResponse } from "next";
import { store } from "../_store";
import type { Item } from "../_store";

type ErrorResponse = { error: string };

const ALLOWED_METHODS = "GET, PUT, PATCH, DELETE";

/**
 * GET    /api/items/:id  → retorna um item pelo id
 * PUT    /api/items/:id  → substitui o item completo
 * PATCH  /api/items/:id  → atualiza campos parcialmente
 * DELETE /api/items/:id  → remove o item
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Item | ErrorResponse>,
) {
  const id = Number(req.query.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  const index = store.items.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Item com id ${id} não encontrado` });
  }

  if (req.method === "GET") {
    return res.status(200).json(store.items[index]);
  }

  if (req.method === "PUT") {
    const { name, description, price, quantity, active, createdAt } =
      req.body as Partial<Item>;

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

    store.items[index] = {
      id,
      name,
      description: description ?? "",
      price: price ?? 0,
      quantity: quantity ?? 0,
      active: active ?? true,
      createdAt: createdAt ?? store.items[index].createdAt,
    };
    return res.status(200).json(store.items[index]);
  }

  if (req.method === "PATCH") {
    const partial = req.body as Partial<Omit<Item, "id">>;

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

    store.items[index] = { ...store.items[index], ...partial, id };
    return res.status(200).json(store.items[index]);
  }

  if (req.method === "DELETE") {
    const [deleted] = store.items.splice(index, 1);
    return res.status(200).json(deleted);
  }

  res.setHeader("Allow", ALLOWED_METHODS);
  return res.status(405).json({ error: `Método ${req.method} não permitido` });
}
