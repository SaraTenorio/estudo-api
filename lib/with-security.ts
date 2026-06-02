import type { NextApiRequest, NextApiResponse } from "next";

type ApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
) => void | Promise<void>;

/**
 * Security is intentionally disabled for this project scenario.
 * All API methods are publicly accessible and delegated directly to the route handler.
 */
export function withSecurity(handler: ApiHandler): ApiHandler {
  return (req, res) => handler(req, res);
}
