/**
 * Centralised API message dictionary.
 * All user-facing strings (errors, success responses) are defined here.
 * Dynamic messages are functions; static messages are plain strings.
 */
export const MSG = {
  // --- Body guard (withJsonBody middleware) ---
  BODY_INVALID: "Request body must be a valid JSON object",

  // --- Field validation (validateProductBody) ---
  UNKNOWN_FIELD: (key: string) => `Unknown field: "${key}"`,

  NAME_REQUIRED: '"name" is required',
  NAME_MUST_BE_STRING: '"name" must be a string',
  NAME_BLANK: '"name" must not be blank or whitespace-only',

  DESCRIPTION_MUST_BE_STRING: '"description" must be a string',

  PRICE_MUST_BE_NUMBER: '"price" must be a decimal number',
  PRICE_NEGATIVE: '"price" must be non-negative',

  QUANTITY_INVALID: '"quantity" must be a non-negative integer',

  ACTIVE_MUST_BE_BOOLEAN: '"active" must be a boolean (true or false)',

  CREATED_AT_INVALID:
    '"createdAt" must be a valid ISO 8601 UTC date (e.g. "2026-05-12T10:00:00.000Z")',

  // --- Route-level ---
  ID_INVALID: "Invalid ID",
  PRODUCT_NOT_FOUND: (id: number) => `Product with id ${id} not found`,
  METHOD_NOT_ALLOWED: (method: string | undefined) =>
    `Method ${method} not allowed`,

  // --- Success responses ---
  STORE_RESET: "Store reset successfully",
};
