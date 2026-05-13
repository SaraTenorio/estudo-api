import type { GetServerSideProps } from "next";
import { store } from "../lib/store";

const STATIC_PAGES = ["/", "/products"];

function buildSitemap(base: string): string {
  const now = new Date().toISOString();

  const staticEntries = STATIC_PAGES.map(
    (path) => `
  <url>
    <loc>${base}${path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${path === "/" ? "1.0" : "0.8"}</priority>
  </url>`,
  ).join("");

  const productEntries = store.products
    .map(
      (p) => `
  <url>
    <loc>${base}/products/${p.id}</loc>
    <lastmod>${p.createdAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`,
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${productEntries}
</urlset>`;
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const proto = req.headers["x-forwarded-proto"] ?? "http";
  const host =
    req.headers["x-forwarded-host"] ?? req.headers.host ?? "localhost:3000";
  const base = `${proto}://${host}`;

  const xml = buildSitemap(base);

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.write(xml);
  res.end();

  return { props: {} };
};

export default function Sitemap() {
  return null;
}
