import type { NextApiRequest, NextApiResponse } from "next";
import { store } from "../_store";
import type { Item } from "../_store";

type ErrorResponse = { error: string };

/**
 * GET  /api/items        → lista todos os items
 * POST /api/items        → cria um novo item
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Item[] | Item | ErrorResponse>,
) {
  if (req.method === "GET") {
    return res.status(200).json(store.items);
  }

  if (req.method === "POST") {
    const { name, description } = req.body as Partial<Item>;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: 'O campo "name" é obrigatório' });
    }

    const newItem: Item = {
      id: store.nextId++,
      name,
      description: description ?? "",
    };
    store.items.push(newItem);
    return res.status(201).json(newItem);
  }

  return res.status(405).json({ error: `Método ${req.method} não permitido` });
}
