import type { NextApiRequest, NextApiResponse } from "next";
import { store } from "../_store";
import type { Item } from "../_store";

type ErrorResponse = { error: string };

const ALLOWED_METHODS = "GET, POST";

/**
 * GET  /api/items  → lista todos os items
 * POST /api/items  → cria um novo item
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Item[] | Item | ErrorResponse>,
) {
  if (req.method === "GET") {
    res.setHeader("X-Total-Count", store.items.length);
    return res.status(200).json(store.items);
  }

  if (req.method === "POST") {
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

    const newItem: Item = {
      id: store.nextId++,
      name,
      description: description ?? "",
      price: price ?? 0,
      quantity: quantity ?? 0,
      active: active ?? true,
      createdAt: createdAt ?? new Date().toISOString(),
    };
    store.items.push(newItem);
    return res.status(201).json(newItem);
  }

  res.setHeader("Allow", ALLOWED_METHODS);
  return res.status(405).json({ error: `Método ${req.method} não permitido` });
}
