import type { NextApiRequest, NextApiResponse } from "next";
import { store } from "../_store";

type SuccessResponse = { message: string };
type ErrorResponse = { error: string };

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Produto A",
    description: "Primeiro produto de exemplo",
    price: 9.99,
    quantity: 10,
    active: true,
    createdAt: "2026-01-15T09:00:00.000Z",
  },
  {
    id: 2,
    name: "Produto B",
    description: "Segundo produto de exemplo",
    price: 24.5,
    quantity: 3,
    active: false,
    createdAt: "2026-03-22T14:30:00.000Z",
  },
];

/**
 * POST /api/products/reset → restaura o store ao estado inicial
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método não permitido" });
  }

  store.products = INITIAL_PRODUCTS.map((product) => ({ ...product }));
  store.nextId = 3;

  return res.status(200).json({ message: "Store resetado com sucesso" });
}
