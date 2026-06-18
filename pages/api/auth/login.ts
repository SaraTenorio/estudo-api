import { timingSafeEqual } from "crypto";
import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";

type SuccessResponse = { token: string };
type ErrorResponse = { error: string };

function timingSafeStringEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bInput = Buffer.alloc(aBuf.length);
  bInput.write(b);

  return a.length === b.length && timingSafeEqual(aBuf, bInput);
}

/**
 * POST /api/auth/login
 *
 * Body: { "username": "...", "password": "..." }
 * Response 200: { "token": "<JWT valid for 1h>" }
 *
 * Credentials are configured via environment variables.
 * Supported pairs:
 *   1) AUTH_USERNAME + AUTH_PASSWORD
 *   2) NEXT_PUBLIC_AUTH_USERNAME + NEXT_PUBLIC_AUTH_PASSWORD (optional)
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
  const backendUsername = process.env.AUTH_USERNAME;
  const backendPassword = process.env.AUTH_PASSWORD;
  const frontendUsername = process.env.NEXT_PUBLIC_AUTH_USERNAME;
  const frontendPassword = process.env.NEXT_PUBLIC_AUTH_PASSWORD;

  if (!jwtSecret) {
    console.error("[login] JWT_SECRET is not set.");
    return res.status(500).json({ error: "Invalid server configuration." });
  }

  const validCredentialPairs = [
    {
      username: backendUsername,
      password: backendPassword,
    },
    {
      username: frontendUsername,
      password: frontendPassword,
    },
  ].filter(
    (
      pair,
    ): pair is {
      username: string;
      password: string;
    } => Boolean(pair.username && pair.password),
  );

  if (validCredentialPairs.length === 0) {
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

  const isValidCredentialPair = validCredentialPairs.some(
    ({ username: u, password: p }) => {
      const userMatch = timingSafeStringEqual(u, username);
      const passMatch = timingSafeStringEqual(p, password);
      return userMatch && passMatch;
    },
  );

  if (!isValidCredentialPair) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  const token = jwt.sign({ sub: username }, jwtSecret, { expiresIn: "1h" });

  return res.status(200).json({ token });
}
