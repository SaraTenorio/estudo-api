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
  "Mechanical Keyboard",
  "Ultrawide Monitor",
  "RGB Headset",
  "Gaming Mouse",
  "4K Webcam",
  "NVMe SSD",
  "USB-C Hub",
  "Ergonomic Chair",
  "Condenser Microphone",
  "Graphics Card",
];

const DESCRIPTIONS = [
  "Limited edition with premium finish.",
  "High performance for everyday use.",
  "Compact and portable design.",
  "Comes with a 2-year warranty.",
  "",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Generates random product data for the given id. */
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
