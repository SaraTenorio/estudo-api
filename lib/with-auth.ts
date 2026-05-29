import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";

type ApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
) => void | Promise<void>;

/**
 * Protects a handler with JWT Bearer Token authentication.
 * The client must send the header: Authorization: Bearer <token>
 *
 * The token is verified against the JWT_SECRET environment variable.
 * Obtain a token via POST /api/auth/login.
 */
export function withAuth(handler: ApiHandler): ApiHandler {
  return (req, res) => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error("[withAuth] JWT_SECRET environment variable is not set.");
      return res.status(500).json({ error: "Invalid server configuration." });
    }

    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing authorization token." });
    }

    const token = authHeader.slice(7); // strip "Bearer " prefix

    try {
      jwt.verify(token, secret);
    } catch {
      return res.status(401).json({ error: "Invalid or expired token." });
    }

    return handler(req, res);
  };
}
