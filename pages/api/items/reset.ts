import type { NextApiRequest, NextApiResponse } from "next";
import { store } from "../_store";

type SuccessResponse = { message: string };
type ErrorResponse = { error: string };

const INITIAL_ITEMS = [
  {
    id: 1,
    name: "Item A",
    description: "Primeiro item de exemplo",
    price: 9.99,
    quantity: 10,
    active: true,
    createdAt: "2026-01-15T09:00:00.000Z",
  },
  {
    id: 2,
    name: "Item B",
    description: "Segundo item de exemplo",
    price: 24.5,
    quantity: 3,
    active: false,
    createdAt: "2026-03-22T14:30:00.000Z",
  },
];

/**
 * POST /api/items/reset → restaura o store ao estado inicial
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método não permitido" });
  }

  store.items = INITIAL_ITEMS.map((item) => ({ ...item }));
  store.nextId = 3;

  return res.status(200).json({ message: "Store resetado com sucesso" });
}
