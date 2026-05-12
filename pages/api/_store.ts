export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  active: boolean;
  createdAt: string;
}

const NAMES = [
  "Teclado Mecânico",
  "Monitor Ultrawide",
  "Headset RGB",
  "Mouse Gamer",
  "Webcam 4K",
  "SSD NVMe",
  "Hub USB-C",
  "Cadeira Ergonômica",
  "Microfone Condensador",
  "Placa de Vídeo",
];

const DESCRIPTIONS = [
  "Edição limitada com acabamento premium.",
  "Alta performance para uso diário.",
  "Design compacto e portátil.",
  "Com garantia de 2 anos.",
  "",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Gera os dados de um produto aleatório dado um id. */
export function makeRandomProduct(id: number): Product {
  const suffix = Math.floor(Math.random() * 900 + 100);
  return {
    id,
    name: `${pick(NAMES)} #${suffix}`,
    description: pick(DESCRIPTIONS),
    price: Math.round((Math.random() * 499 + 1) * 100) / 100,
    quantity: Math.floor(Math.random() * 100),
    active: Math.random() > 0.2,
    createdAt: new Date().toISOString(),
  };
}

// In-memory store shared across API routes (persists during dev server lifetime)
declare global {
  // eslint-disable-next-line no-var
  var __store: { products: Product[]; nextId: number } | undefined;
}

if (!global.__store) {
  global.__store = {
    products: [makeRandomProduct(1), makeRandomProduct(2)],
    nextId: 3,
  };
}

export const store = global.__store;
