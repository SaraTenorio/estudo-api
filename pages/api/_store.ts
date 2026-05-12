export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  active: boolean;
  createdAt: string;
}

// In-memory store shared across API routes (persists during dev server lifetime)
declare global {
  // eslint-disable-next-line no-var
  var __store: { products: Product[]; nextId: number } | undefined;
}

if (!global.__store) {
  global.__store = {
    products: [
      {
        id: 1,
        name: "Produto A",
        description: "Primeiro produto de exemplo",
        price: 9.99,
        quantity: 10,
        active: true,
        createdAt: "2026-01-15T09:00:00.000Z",
      },
      {
        id: 2,
        name: "Produto B",
        description: "Segundo produto de exemplo",
        price: 24.5,
        quantity: 3,
        active: false,
        createdAt: "2026-03-22T14:30:00.000Z",
      },
    ],
    nextId: 3,
  };
}

export const store = global.__store;
