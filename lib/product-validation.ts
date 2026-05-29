import type { Product } from "./store";

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
      return `Campo desconhecido: "${key}"`;
    }
  }

  const { name, description, price, quantity, active, createdAt } = body;

  if (requireName) {
    if (!name || typeof name !== "string") {
      return 'O campo "name" é obrigatório';
    }
    if (!name.trim()) {
      return '"name" não pode estar vazio ou só conter espaços';
    }
  } else if (name !== undefined) {
    if (typeof name !== "string") return '"name" deve ser uma string';
    if (!name.trim()) return '"name" não pode estar vazio ou só conter espaços';
  }

  if (description !== undefined && typeof description !== "string") {
    return '"description" deve ser uma string';
  }

  if (price !== undefined) {
    if (typeof price !== "number") return '"price" deve ser um número decimal';
    if (price < 0) return '"price" não pode ser negativo';
  }

  if (quantity !== undefined && (!Number.isInteger(quantity) || quantity < 0)) {
    return '"quantity" deve ser um inteiro não negativo';
  }

  if (active !== undefined && typeof active !== "boolean") {
    return '"active" deve ser um booleano (true ou false)';
  }

  if (createdAt !== undefined && !ISO_8601_UTC.test(createdAt)) {
    return '"createdAt" deve ser uma data ISO 8601 UTC (ex: 2026-05-12T10:00:00.000Z)';
  }

  return null;
}
