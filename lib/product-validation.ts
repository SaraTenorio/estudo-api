import type { Product } from "./store";
import { MSG } from "./messages";

const ALLOWED_KEYS = new Set<string>([
  "name",
  "description",
  "price",
  "quantity",
  "active",
  "createdAt",
]);

const ISO_8601_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

/**
 * Validates product fields from a request body.
 * Body null/object-type guard is handled upstream by the withJsonBody middleware.
 * @param body - Partial product data from the request body.
 * @param requireName - Whether the "name" field is mandatory (true for POST/PUT, false for PATCH).
 * @returns An error message string if validation fails, or null if valid.
 */
export function validateProductBody(
  body: Partial<Omit<Product, "id">>,
  requireName = true,
): string | null {
  for (const key of Object.keys(body)) {
    if (!ALLOWED_KEYS.has(key)) {
      return MSG.UNKNOWN_FIELD(key);
    }
  }

  const { name, description, price, quantity, active, createdAt } = body;

  if (requireName) {
    if (!name || typeof name !== "string") {
      return MSG.NAME_REQUIRED;
    }
    if (!name.trim()) {
      return MSG.NAME_BLANK;
    }
  } else if (name !== undefined) {
    if (typeof name !== "string") return MSG.NAME_MUST_BE_STRING;
    if (!name.trim()) return MSG.NAME_BLANK;
  }

  if (description !== undefined && typeof description !== "string") {
    return MSG.DESCRIPTION_MUST_BE_STRING;
  }

  if (price !== undefined) {
    if (typeof price !== "number") return MSG.PRICE_MUST_BE_NUMBER;
    if (price < 0) return MSG.PRICE_NEGATIVE;
  }

  if (quantity !== undefined && (!Number.isInteger(quantity) || quantity < 0)) {
    return MSG.QUANTITY_INVALID;
  }

  if (active !== undefined && typeof active !== "boolean") {
    return MSG.ACTIVE_MUST_BE_BOOLEAN;
  }

  if (createdAt !== undefined && !ISO_8601_UTC.test(createdAt)) {
    return MSG.CREATED_AT_INVALID;
  }

  return null;
}
