import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import type { Product } from "../../lib/store";
import { useLang, LangSelector } from "../../lib/context";
import { fetchWithSecurity, clearCachedJwtToken } from "../../lib/client-auth";
import { localizeProductText } from "../../lib/product-text-localization";
import { ProductDetailView } from "@/components/products";
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
          <ProductDetailView
            product={localizedProduct}
            locale={locale}
            labels={{
              backToProducts: t("backToProducts"),
              removeBtn: deleting ? t("deleting") : t("removeBtn"),
              removeProductTitle: t("removeProductTitle"),
              refreshTitle: t("refreshTitle"),
              loadingProduct: t("loadingProduct"),
              notFoundHeading: t("notFoundHeading"),
              notFoundMessage: t("notFoundMessage"),
              active: t("active"),
              inactive: t("inactive"),
              identification: t("identification"),
              inventory: t("inventory"),
              metadata: t("metadata"),
              labelId: t("labelId"),
              labelName: t("labelName"),
              labelPrice: t("labelPrice"),
              labelQuantity: t("labelQuantity"),
              labelStatus: t("labelStatus"),
              labelCreatedAt: t("labelCreatedAt"),
              labelCreatedAtIso: t("labelCreatedAtIso"),
              toggleTitle: t("toggleTitle", {
                action: localizedProduct?.active
                  ? t("deactivate")
                  : t("activate"),
              }),
            }}
            isLoading={loading}
            isNotFound={notFound}
            isRefreshing={refreshing}
            isDeleting={deleting}
            isToggling={toggling}
            onDelete={handleDelete}
            onRefresh={() => fetchProduct(true)}
            onToggleActive={handleToggleActive}
            toolbarSlot={<LangSelector />}
          />
        </main>
      </div>
    </>
  );
}
