export interface Item {
  id: number;
  name: string;
  description: string;
}

// In-memory store shared across API routes (persists during dev server lifetime)
declare global {
  // eslint-disable-next-line no-var
  var __store: { items: Item[]; nextId: number } | undefined;
}

if (!global.__store) {
  global.__store = {
    items: [
      { id: 1, name: "Item A", description: "Primeiro item de exemplo" },
      { id: 2, name: "Item B", description: "Segundo item de exemplo" },
    ],
    nextId: 3,
  };
}

export const store = global.__store;
