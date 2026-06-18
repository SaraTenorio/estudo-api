import type { Product } from "./store";
import type { Lang } from "./i18n";

const NAME_PAIRS: Array<[string, string]> = [
  ["Mechanical Keyboard", "Teclado Mecânico"],
  ["Ultrawide Monitor", "Monitor Ultrawide"],
  ["RGB Headset", "Headset RGB"],
  ["Gaming Mouse", "Mouse Gamer"],
  ["4K Webcam", "Webcam 4K"],
  ["NVMe SSD", "SSD NVMe"],
  ["USB-C Hub", "Hub USB-C"],
  ["Ergonomic Chair", "Cadeira Ergonômica"],
  ["Condenser Microphone", "Microfone Condensador"],
  ["Graphics Card", "Placa de Vídeo"],
];

const DESCRIPTION_PAIRS: Array<[string, string]> = [
  [
    "Limited edition with premium finish.",
    "Edição limitada com acabamento premium.",
  ],
  ["High performance for everyday use.", "Alto desempenho para uso diário."],
  ["Compact and portable design.", "Design compacto e portátil."],
  ["Comes with a 2-year warranty.", "Inclui garantia de 2 anos."],
  ["", ""],
];

function buildLookup(pairs: Array<[string, string]>): Map<string, string> {
  const map = new Map<string, string>();
  for (const [en, pt] of pairs) {
    map.set(en, pt);
    map.set(pt, en);
  }
  return map;
}

const NAME_LOOKUP = buildLookup(NAME_PAIRS);
const DESCRIPTION_LOOKUP = buildLookup(DESCRIPTION_PAIRS);

export function localizeProductName(name: string, lang: Lang): string {
  const match = name.match(/^(.*?)(\s#\d+)?$/);
  if (!match) return name;

  const baseName = match[1]?.trim() ?? name;
  const suffix = match[2] ?? "";

  const pair = NAME_PAIRS.find(
    ([en, pt]) => en === baseName || pt === baseName,
  );
  if (!pair) return name;

  const localizedBase = lang === "pt" ? pair[1] : pair[0];
  return `${localizedBase}${suffix}`;
}

export function localizeProductDescription(
  description: string,
  lang: Lang,
): string {
  const pair = DESCRIPTION_PAIRS.find(
    ([en, pt]) => en === description || pt === description,
  );

  if (!pair) return description;
  return lang === "pt" ? pair[1] : pair[0];
}

export function localizeProductText(product: Product, lang: Lang): Product {
  return {
    ...product,
    name: localizeProductName(product.name, lang),
    description: localizeProductDescription(product.description, lang),
  };
}

export function hasKnownProductTranslation(name: string): boolean {
  const base = name.replace(/\s#\d+$/, "").trim();
  return NAME_LOOKUP.has(base);
}

export function hasKnownDescriptionTranslation(description: string): boolean {
  return DESCRIPTION_LOOKUP.has(description);
}
