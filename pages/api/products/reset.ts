import type { NextApiRequest, NextApiResponse } from "next";
import { store, makeRandomProduct } from "../_store";

type SuccessResponse = { message: string };
type ErrorResponse = { error: string };

/**
 * POST /api/products/reset → restaura o store com 2 produtos aleatórios
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método não permitido" });
  }

  store.products = [makeRandomProduct(1), makeRandomProduct(2)];
  store.nextId = 3;

  return res.status(200).json({ message: "Store resetado com sucesso" });
}
