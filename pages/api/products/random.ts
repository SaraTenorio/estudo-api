import type { NextApiRequest, NextApiResponse } from "next";
import { store, makeRandomProduct } from "../../../lib/store";
import type { Product } from "../../../lib/store";
import { MSG } from "../../../lib/messages";

type ErrorResponse = { error: string };

/**
 * POST /api/products/random
 * Cria um produto com dados aleatórios — nenhum body necessário.
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Product | ErrorResponse>,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: MSG.METHOD_NOT_ALLOWED(req.method) });
  }

  const newProduct = makeRandomProduct(store.nextId++);
  store.products.push(newProduct);
  return res.status(201).json(newProduct);
}
