import type { NextApiRequest, NextApiResponse } from "next";
import { MSG } from "./messages";

type ApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
) => void | Promise<void>;

/** HTTP methods that must carry a JSON body. */
const BODY_METHODS = new Set(["POST", "PUT", "PATCH"]);

/**
 * Guards POST/PUT/PATCH requests against missing or non-object bodies
 * before the route handler is invoked, keeping body-guard logic out of
 * each individual route.
 */
export function withJsonBody(handler: ApiHandler): ApiHandler {
  return (req, res) => {
    if (BODY_METHODS.has(req.method ?? "")) {
      const body: unknown = req.body;
      if (
        body === undefined ||
        body === null ||
        typeof body !== "object" ||
        Array.isArray(body)
      ) {
        return res.status(400).json({ error: MSG.BODY_INVALID });
      }
    }
    return handler(req, res);
  };
}
