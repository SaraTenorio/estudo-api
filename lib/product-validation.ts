import type { Product } from "./store";

/**
 * Validates product fields from a request body.
 * @param body - Partial product data from the request body.
 * @param requireName - Whether the "name" field is mandatory (true for POST/PUT, false for PATCH).
 * @returns An error message string if validation fails, or null if valid.
 */
export function validateProductBody(
  body: Partial<Omit<Product, "id">>,
  requireName = true,
): string | null {
  const { name, price, quantity, createdAt } = body;

  if (requireName && (!name || typeof name !== "string")) {
    return 'O campo "name" é obrigatório';
  }

  if (!requireName && name !== undefined && typeof name !== "string") {
    return '"name" deve ser uma string';
  }

  if (price !== undefined && typeof price !== "number") {
    return '"price" deve ser um número decimal';
  }

  if (quantity !== undefined && (!Number.isInteger(quantity) || quantity < 0)) {
    return '"quantity" deve ser um inteiro não negativo';
  }

  if (createdAt !== undefined && isNaN(Date.parse(createdAt))) {
    return '"createdAt" deve ser uma data ISO 8601 válida';
  }

  return null;
}
