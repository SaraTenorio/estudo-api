import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import type { Product } from "../../lib/store";
import { formatPrice, formatDate } from "../../lib/formatters";
import { useLang, LangSelector } from "../../lib/LangContext";
import { secureFetch } from "../../lib/api-secure-client";
import styles from "@/styles/ProductDetail.module.css";

async function getApiError(res: Response, fallback: string): Promise<string> {
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  return data.error || fallback;
}

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const { t, locale } = useLang();

  const fetchProduct = useCallback(
    async (showRefreshing = false) => {
      if (!id) return;
      if (showRefreshing) setRefreshing(true);
      else setLoading(true);
      try {
        const res = await secureFetch(`/api/products/${id}`);
        if (res.status === 404) {
          setNotFound(true);
          setProduct(null);
        } else if (!res.ok) {
          setNotFound(false);
          setProduct(null);
        } else {
          const data: Product = await res.json();
          setProduct(data);
          setNotFound(false);
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [id],
  );

  useEffect(() => {
    if (id) fetchProduct();
  }, [id, fetchProduct]);

  const handleDelete = async () => {
    if (!id) return;
    setDeleting(true);
    try {
      const res = await secureFetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await router.push("/products");
      } else {
        setActionError(await getApiError(res, t("unknownError")));
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : t("unknownError"));
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleActive = async () => {
    if (!product) return;
    setToggling(true);
    setActionError(null);
    try {
      const res = await secureFetch(`/api/products/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ active: !product.active }),
      });
      if (res.ok) {
        const updated: Product = await res.json();
        setProduct(updated);
      } else {
        setActionError(await getApiError(res, t("unknownError")));
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : t("unknownError"));
    } finally {
      setToggling(false);
    }
  };

  const title = product ? product.name : `Product #${id}`;

  return (
    <>
      <Head>
        <title>{title} | Estudo API</title>
        <meta
          name="description"
          content={t("productDetailMetaDesc", { id: String(id) })}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/api.png" />
      </Head>

      <div className={styles.page}>
        <main className={styles.main}>
          {/* Header */}
          <div className={styles.header}>
            <Link href="/products" className={styles.backLink}>
              {t("backToProducts")}
            </Link>
            <div className={styles.headerActions}>
              <LangSelector />
              <button
                className={styles.deleteBtn}
                onClick={handleDelete}
                disabled={deleting || loading || notFound}
                title={t("removeProductTitle")}
              >
                {deleting ? t("deleting") : t("removeBtn")}
              </button>
              <button
                className={styles.refreshBtn}
                onClick={() => fetchProduct(true)}
                disabled={refreshing || loading}
                title={t("refreshTitle")}
              >
                ↻
              </button>
            </div>
          </div>

          {loading ? (
            <p className={styles.empty}>{t("loadingProduct")}</p>
          ) : notFound ? (
            <div className={styles.notFound}>
              <span className={styles.notFoundCode}>404</span>
              <p>{t("productNotFound", { id: String(id) })}</p>
              <Link href="/products" className={styles.backLink}>
                {t("backToProducts")}
              </Link>
            </div>
          ) : product ? (
            <>
              {/* Title row */}
              <div className={styles.titleRow}>
                <h1 className={styles.title}>{product.name}</h1>
                <span
                  className={`${styles.badge} ${product.active ? styles.badgeActive : styles.badgeInactive}`}
                >
                  {product.active ? t("active") : t("inactive")}
                </span>
              </div>

              {product.description && (
                <p className={styles.description}>{product.description}</p>
              )}

              {/* Detail card */}
              <div className={styles.card}>
                {actionError && <p className={styles.empty}>{actionError}</p>}
                <div className={styles.section}>
                  <span className={styles.sectionTitle}>
                    {t("identification")}
                  </span>
                  <div className={styles.row}>
                    <span className={styles.label}>{t("labelId")}</span>
                    <span className={styles.value}>#{product.id}</span>
                  </div>
                  <div className={styles.row}>
                    <span className={styles.label}>{t("labelName")}</span>
                    <span className={styles.value}>{product.name}</span>
                  </div>
                </div>

                <div className={styles.divider} />

                <div className={styles.section}>
                  <span className={styles.sectionTitle}>{t("inventory")}</span>
                  <div className={styles.row}>
                    <span className={styles.label}>{t("labelPrice")}</span>
                    <span className={`${styles.value} ${styles.price}`}>
                      {formatPrice(product.price, locale)}
                    </span>
                  </div>
                  <div className={styles.row}>
                    <span className={styles.label}>{t("labelQuantity")}</span>
                    <span className={styles.value}>{product.quantity}</span>
                  </div>
                  <div className={styles.row}>
                    <span className={styles.label}>{t("labelStatus")}</span>
                    <label
                      className={styles.toggle}
                      title={t("toggleTitle", {
                        action: product.active
                          ? t("deactivate")
                          : t("activate"),
                      })}
                    >
                      <input
                        type="checkbox"
                        checked={product.active}
                        disabled={toggling}
                        onChange={handleToggleActive}
                      />
                      <span className={styles.toggleTrack}>
                        <span className={styles.toggleThumb} />
                      </span>
                      <span
                        className={`${styles.toggleLabel} ${product.active ? styles.toggleLabelOn : styles.toggleLabelOff}`}
                      >
                        {toggling
                          ? "…"
                          : product.active
                            ? t("active")
                            : t("inactive")}
                      </span>
                    </label>
                  </div>
                </div>

                <div className={styles.divider} />

                <div className={styles.section}>
                  <span className={styles.sectionTitle}>{t("metadata")}</span>
                  <div className={styles.row}>
                    <span className={styles.label}>{t("labelCreatedAt")}</span>
                    <span className={styles.value}>
                      {formatDate(product.createdAt, true, locale)}
                    </span>
                  </div>
                  <div className={styles.row}>
                    <span className={styles.label}>
                      {t("labelCreatedAtIso")}
                    </span>
                    <span className={`${styles.value} ${styles.mono}`}>
                      {product.createdAt}
                    </span>
                  </div>
                </div>
              </div>

              {/* Raw JSON */}
              <div className={styles.jsonBlock}>
                <span className={styles.jsonLabel}>
                  GET /api/products/{product.id}
                </span>
                <pre className={styles.pre}>
                  {JSON.stringify(product, null, 2)}
                </pre>
              </div>
            </>
          ) : null}
        </main>
      </div>
    </>
  );
}
