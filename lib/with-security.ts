import type { NextApiRequest, NextApiResponse } from "next";
import { withApiKey } from "./with-api-key";
import { withAuth } from "./with-auth";

type ApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
) => void | Promise<void>;

/** Write methods that require a JWT. */
const WRITE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

/**
 * Composed security middleware:
 * - GET  → validates X-API-Key
 * - POST / PUT / PATCH / DELETE → validates Bearer JWT
 */
export function withSecurity(handler: ApiHandler): ApiHandler {
  return (req, res) => {
    if (WRITE_METHODS.has(req.method ?? "")) {
      return withAuth(handler)(req, res);
    }
    return withApiKey(handler)(req, res);
  };
}
