import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import type { Product } from "../../lib/store";
import { formatPrice, formatDate } from "../../lib/formatters";
import { useLang, LangSelector } from "../../lib/LangContext";
import { fetchWithSecurity, clearCachedJwtToken } from "../../lib/client-auth";
import { localizeProductText } from "../../lib/product-text-localization";
import styles from "@/styles/ProductDetail.module.css";

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);

  const { t, locale, lang } = useLang();

  const localizedProduct = product ? localizeProductText(product, lang) : null;

  const fetchProduct = useCallback(
    async (showRefreshing = false) => {
      if (!id) return;
      if (showRefreshing) setRefreshing(true);
      else setLoading(true);
      try {
        const res = await fetchWithSecurity(`/api/products/${id}`);
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
      } catch {
        clearCachedJwtToken();
        setNotFound(false);
        setProduct(null);
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
      const res = await fetchWithSecurity(`/api/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error(`Delete failed (${res.status})`);
      }
      router.push("/products");
    } catch {
      clearCachedJwtToken();
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleActive = async () => {
    if (!product) return;
    setToggling(true);
    try {
      const res = await fetchWithSecurity(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !product.active }),
      });
      if (res.ok) {
        const updated: Product = await res.json();
        setProduct(updated);
      } else {
        clearCachedJwtToken();
      }
    } catch {
      clearCachedJwtToken();
    } finally {
      setToggling(false);
    }
  };

  const title = notFound
    ? t("notFoundTitle")
    : localizedProduct
      ? localizedProduct.name
      : "Estudo API";

  return (
    <>
      <Head>
        <title>{`${title} | Estudo API`}</title>
        <meta
          name="description"
          content={
            notFound
              ? t("notFoundMetaDesc")
              : t("productDetailMetaDesc", { id: String(id) })
          }
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
              {!notFound && (
                <>
                  <button
                    className={styles.deleteBtn}
                    onClick={handleDelete}
                    disabled={deleting || loading}
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
                </>
              )}
            </div>
          </div>

          {loading ? (
            <p className={styles.empty}>{t("loadingProduct")}</p>
          ) : notFound ? (
            <div className={styles.notFound}>
              <span className={styles.notFoundCode}>404</span>
              <h1 className={styles.notFoundTitle}>{t("notFoundHeading")}</h1>
              <p>{t("notFoundMessage")}</p>
            </div>
          ) : localizedProduct ? (
            <>
              {/* Title row */}
              <div className={styles.titleRow}>
                <h1 className={styles.title}>{localizedProduct.name}</h1>
                <span
                  className={`${styles.badge} ${localizedProduct.active ? styles.badgeActive : styles.badgeInactive}`}
                >
                  {localizedProduct.active ? t("active") : t("inactive")}
                </span>
              </div>

              {localizedProduct.description && (
                <p className={styles.description}>
                  {localizedProduct.description}
                </p>
              )}

              {/* Detail card */}
              <div className={styles.card}>
                <div className={styles.section}>
                  <span className={styles.sectionTitle}>
                    {t("identification")}
                  </span>
                  <div className={styles.row}>
                    <span className={styles.label}>{t("labelId")}</span>
                    <span className={styles.value}>#{localizedProduct.id}</span>
                  </div>
                  <div className={styles.row}>
                    <span className={styles.label}>{t("labelName")}</span>
                    <span className={styles.value}>
                      {localizedProduct.name}
                    </span>
                  </div>
                </div>

                <div className={styles.divider} />

                <div className={styles.section}>
                  <span className={styles.sectionTitle}>{t("inventory")}</span>
                  <div className={styles.row}>
                    <span className={styles.label}>{t("labelPrice")}</span>
                    <span className={`${styles.value} ${styles.price}`}>
                      {formatPrice(localizedProduct.price, locale)}
                    </span>
                  </div>
                  <div className={styles.row}>
                    <span className={styles.label}>{t("labelQuantity")}</span>
                    <span className={styles.value}>
                      {localizedProduct.quantity}
                    </span>
                  </div>
                  <div className={styles.row}>
                    <span className={styles.label}>{t("labelStatus")}</span>
                    <label
                      className={styles.toggle}
                      title={t("toggleTitle", {
                        action: localizedProduct.active
                          ? t("deactivate")
                          : t("activate"),
                      })}
                    >
                      <input
                        type="checkbox"
                        checked={localizedProduct.active}
                        disabled={toggling}
                        onChange={handleToggleActive}
                      />
                      <span className={styles.toggleTrack}>
                        <span className={styles.toggleThumb} />
                      </span>
                      <span
                        className={`${styles.toggleLabel} ${localizedProduct.active ? styles.toggleLabelOn : styles.toggleLabelOff}`}
                      >
                        {toggling
                          ? "…"
                          : localizedProduct.active
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
                      {formatDate(localizedProduct.createdAt, true, locale)}
                    </span>
                  </div>
                  <div className={styles.row}>
                    <span className={styles.label}>
                      {t("labelCreatedAtIso")}
                    </span>
                    <span className={`${styles.value} ${styles.mono}`}>
                      {localizedProduct.createdAt}
                    </span>
                  </div>
                </div>
              </div>

              {/* Raw JSON */}
              <div className={styles.jsonBlock}>
                <span className={styles.jsonLabel}>
                  GET /api/products/{localizedProduct.id}
                </span>
                <pre className={styles.pre}>
                  {JSON.stringify(localizedProduct, null, 2)}
                </pre>
              </div>
            </>
          ) : null}
        </main>
      </div>
    </>
  );
}
