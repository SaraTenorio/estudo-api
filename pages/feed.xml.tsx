import type { GetServerSideProps } from "next";
import { store } from "../lib/store";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatPrice(value: number): string {
  return value.toLocaleString("pt-PT", { style: "currency", currency: "EUR" });
}

function buildFeed(base: string): string {
  const now = new Date().toUTCString();

  const items = store.products
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .map((p) => {
      const title = escapeXml(p.name);
      const desc = escapeXml(
        [
          p.description,
          `Preço: ${formatPrice(p.price)}`,
          `Quantidade: ${p.quantity}`,
          `Estado: ${p.active ? "Ativo" : "Inativo"}`,
        ]
          .filter(Boolean)
          .join(" · "),
      );
      const link = `${base}/api/products/${p.id}`;
      const pubDate = new Date(p.createdAt).toUTCString();

      return `
    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${desc}</description>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Estudo API — Produtos</title>
    <link>${base}/products</link>
    <description>Feed RSS dos produtos disponíveis na Estudo API.</description>
    <language>pt-PT</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const proto = req.headers["x-forwarded-proto"] ?? "http";
  const host =
    req.headers["x-forwarded-host"] ?? req.headers.host ?? "localhost:3000";
  const base = `${proto}://${host}`;

  const xml = buildFeed(base);

  res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
  res.write(xml);
  res.end();

  return { props: {} };
};

export default function Feed() {
  return null;
}
