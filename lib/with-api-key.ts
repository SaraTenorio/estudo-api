import { timingSafeEqual } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";

type ApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
) => void | Promise<void>;

/**
 * Protects a handler with API Key authentication.
 * The client must send the header: X-API-Key: <key>
 *
 * The key is read from the API_KEY environment variable.
 * Comparison uses timingSafeEqual to prevent timing attacks.
 */
export function withApiKey(handler: ApiHandler): ApiHandler {
  return (req, res) => {
    const secret = process.env.API_KEY;

    if (!secret) {
      console.error("[withApiKey] API_KEY environment variable is not set.");
      return res.status(500).json({ error: "Invalid server configuration." });
    }

    const provided = req.headers["x-api-key"];

    if (!provided || typeof provided !== "string") {
      return res.status(401).json({ error: "Missing API key." });
    }

    // Constant-time comparison to prevent timing attacks
    const secretBuf = Buffer.from(secret);
    const providedBuf = Buffer.alloc(secretBuf.length);
    providedBuf.write(provided);

    const match =
      provided.length === secret.length &&
      timingSafeEqual(secretBuf, providedBuf);

    if (!match) {
      return res.status(401).json({ error: "Invalid API key." });
    }

    return handler(req, res);
  };
}
