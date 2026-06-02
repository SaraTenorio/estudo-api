import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import type { Product } from "../lib/store";
import { formatPrice, formatDate } from "../lib/formatters";
import { useLang, LangSelector } from "../lib/LangContext";
import styles from "@/styles/Products.module.css";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { t, locale } = useLang();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/products");
      if (!res.ok)
        throw new Error(`${t("errorLoadingProducts")} (${res.status})`);
      const data: Product[] = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("unknownError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchProducts();
    } finally {
      setRefreshing(false);
    }
  };

  const handleReset = async () => {
    setResetting(true);
    try {
      await fetch("/api/products/reset", { method: "POST" });
      await fetchProducts();
      setToastMsg(t("storeReset"));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } finally {
      setResetting(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      await fetchProducts();
      setToastMsg(t("productRemoved", { id }));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddRandom = async () => {
    setAdding(true);
    try {
      const res = await fetch("/api/products/random", { method: "POST" });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
      }
      const created: Product = await res.json();
      await fetchProducts();
      setToastMsg(t("productAdded", { name: created.name }));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } finally {
      setAdding(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <>
      <Head>
        <title>{t("productsPageTitle")}</title>
        <meta name="description" content={t("productsMetaDesc")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/api.png" />
      </Head>

      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.header}>
            <Link href="/" className={styles.backLink}>
              {t("backToApi")}
            </Link>
            <h1 className={styles.title}>{t("productsHeading")}</h1>
            <button
              className={styles.refreshBtn}
              onClick={handleRefresh}
              disabled={refreshing || loading}
              title={t("refreshTitle")}
            >
              ↻
            </button>
            <button
              className={styles.addRandomBtn}
              onClick={handleAddRandom}
              disabled={adding || loading}
            >
              {adding ? t("addingRandom") : t("addRandom")}
            </button>
            <button
              className={styles.resetBtn}
              onClick={handleReset}
              disabled={resetting || loading}
            >
              {resetting ? t("resetting") : t("resetStore")}
            </button>
            <LangSelector />
          </div>

          <p className={styles.hint}>{t("hint")}</p>

          {loading ? (
            <p className={styles.empty}>{t("loadingProducts")}</p>
          ) : error ? (
            <p className={styles.empty}>{error}</p>
          ) : products.length === 0 ? (
            <p className={styles.empty}>{t("noProducts")}</p>
          ) : (
            <div className={styles.grid}>
              {products.map((product) => (
                <div key={product.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h2 className={styles.cardName}>{product.name}</h2>
                    <div className={styles.cardHeaderRight}>
                      <span
                        className={`${styles.badge} ${product.active ? styles.badgeActive : styles.badgeInactive}`}
                      >
                        {product.active ? t("active") : t("inactive")}
                      </span>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(product.id)}
                        disabled={deletingId === product.id}
                        title={t("removeProductTitle")}
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14H6L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4h6v2" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {product.description && (
                    <p className={styles.cardDesc}>{product.description}</p>
                  )}

                  <div className={styles.cardMeta}>
                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>{t("labelId")}</span>
                      <span className={styles.metaValue}>#{product.id}</span>
                    </div>
                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>
                        {t("labelPrice")}
                      </span>
                      <span className={styles.metaValue}>
                        {formatPrice(product.price, locale)}
                      </span>
                    </div>
                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>
                        {t("labelQuantity")}
                      </span>
                      <span className={styles.metaValue}>
                        {product.quantity}
                      </span>
                    </div>
                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>
                        {t("labelCreatedAt")}
                      </span>
                      <span className={styles.metaValue}>
                        {formatDate(product.createdAt, false, locale)}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/products/${product.id}`}
                    className={styles.detailLink}
                  >
                    {t("viewDetails")}
                  </Link>
                </div>
              ))}
            </div>
          )}

          <div className={styles.metaLinks}>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.metaLink}
              title="Sitemap XML"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              sitemap.xml
            </a>
            <a
              href="/feed.xml"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.metaLink} ${styles.metaLinkRss}`}
              title="RSS Feed"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <circle cx="5" cy="19" r="2" />
                <path d="M4 4a16 16 0 0 1 16 16" />
                <path d="M4 11a9 9 0 0 1 9 9" />
              </svg>
              feed.xml
            </a>
          </div>
        </main>
      </div>

      {showToast && <div className={styles.toast}>{toastMsg}</div>}
    </>
  );
}
