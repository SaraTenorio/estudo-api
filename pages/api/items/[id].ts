import type { NextApiRequest, NextApiResponse } from "next";
import { store } from "../_store";
import type { Item } from "../_store";

type ErrorResponse = { error: string };

/**
 * GET    /api/items/:id  → retorna um item pelo id
 * PUT    /api/items/:id  → atualiza um item pelo id
 * DELETE /api/items/:id  → remove um item pelo id
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
    const { name, description } = req.body as Partial<Item>;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: 'O campo "name" é obrigatório' });
    }

    store.items[index] = { id, name, description: description ?? "" };
    return res.status(200).json(store.items[index]);
  }

  if (req.method === "DELETE") {
    const [deleted] = store.items.splice(index, 1);
    return res.status(200).json(deleted);
  }

  return res.status(405).json({ error: `Método ${req.method} não permitido` });
}
