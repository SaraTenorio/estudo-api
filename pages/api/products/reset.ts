import type { NextApiRequest, NextApiResponse } from "next";
import { store, makeRandomProduct } from "../../../lib/store";
import { withSecurity } from "../../../lib/with-security";
import { MSG } from "../../../lib/messages";

type SuccessResponse = { message: string };
type ErrorResponse = { error: string };

/**
 * POST /api/products/reset → restaura o store com 2 produtos aleatórios
 */
function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: MSG.METHOD_NOT_ALLOWED(req.method) });
  }

  store.products = [makeRandomProduct(1), makeRandomProduct(2)];
  store.nextId = 3;

  return res.status(200).json({ message: MSG.STORE_RESET });
}

export default withSecurity(handler);
