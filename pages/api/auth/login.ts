import { timingSafeEqual } from "crypto";
import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";

type SuccessResponse = { token: string };
type ErrorResponse = { error: string };

/**
 * POST /api/auth/login
 *
 * Body: { "username": "...", "password": "..." }
 * Response 200: { "token": "<JWT valid for 1h>" }
 *
 * Credentials are configured via environment variables:
 *   AUTH_USERNAME and AUTH_PASSWORD
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const jwtSecret = process.env.JWT_SECRET;
  const validUsername = process.env.AUTH_USERNAME;
  const validPassword = process.env.AUTH_PASSWORD;

  if (!jwtSecret || !validUsername || !validPassword) {
    console.error("[login] Authentication environment variables are not set.");
    return res.status(500).json({ error: "Invalid server configuration." });
  }

  const { username, password } = req.body as {
    username?: unknown;
    password?: unknown;
  };

  if (typeof username !== "string" || typeof password !== "string") {
    return res
      .status(400)
      .json({ error: "username and password are required." });
  }

  // Constant-time comparison to prevent timing attacks
  const userBuf = Buffer.from(validUsername);
  const passBuf = Buffer.from(validPassword);
  const userInput = Buffer.alloc(userBuf.length);
  const passInput = Buffer.alloc(passBuf.length);
  userInput.write(username);
  passInput.write(password);

  const userMatch =
    username.length === validUsername.length &&
    timingSafeEqual(userBuf, userInput);
  const passMatch =
    password.length === validPassword.length &&
    timingSafeEqual(passBuf, passInput);

  if (!userMatch || !passMatch) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  const token = jwt.sign({ sub: username }, jwtSecret, { expiresIn: "1h" });

  return res.status(200).json({ token });
}
