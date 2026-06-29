import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import type { Product } from "../lib/store";
import { useLang, LangSelector } from "../lib/context";
import { fetchWithSecurity, clearCachedJwtToken } from "../lib/client-auth";
import {
  localizeProductName,
  localizeProductText,
} from "../lib/product-text-localization";
import { ProductsPageView } from "@/components/products";
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

  const { t, locale, lang } = useLang();

  const localizedProducts = products.map((product) =>
    localizeProductText(product, lang),
  );

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithSecurity("/api/products");
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
      const res = await fetchWithSecurity("/api/products/reset", {
        method: "POST",
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(body?.error ?? `${t("unknownError")} (${res.status})`);
      }
      await fetchProducts();
      setToastMsg(t("storeReset"));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } catch (err) {
      const message = err instanceof Error ? err.message : t("unknownError");
      setToastMsg(message);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
      clearCachedJwtToken();
    } finally {
      setResetting(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const res = await fetchWithSecurity(`/api/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(body?.error ?? `${t("unknownError")} (${res.status})`);
      }
      await fetchProducts();
      setToastMsg(t("productRemoved", { id }));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } catch (err) {
      const message = err instanceof Error ? err.message : t("unknownError");
      setToastMsg(message);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
      clearCachedJwtToken();
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddRandom = async () => {
    setAdding(true);
    try {
      const res = await fetchWithSecurity("/api/products/random", {
        method: "POST",
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
      }
      const created: Product = await res.json();
      await fetchProducts();
      setToastMsg(
        t("productAdded", { name: localizeProductName(created.name, lang) }),
      );
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } catch (err) {
      const message = err instanceof Error ? err.message : t("unknownError");
      setToastMsg(message);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
      clearCachedJwtToken();
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
          <ProductsPageView
            products={localizedProducts}
            locale={locale}
            labels={{
              backToApi: t("backToApi"),
              productsHeading: t("productsHeading"),
              hint: t("hint"),
              refreshTitle: t("refreshTitle"),
              addRandom: t("addRandom"),
              addingRandom: t("addingRandom"),
              resetStore: t("resetStore"),
              resetting: t("resetting"),
              loadingProducts: t("loadingProducts"),
              noProducts: t("noProducts"),
              active: t("active"),
              inactive: t("inactive"),
              labelId: t("labelId"),
              labelPrice: t("labelPrice"),
              labelQuantity: t("labelQuantity"),
              labelCreatedAt: t("labelCreatedAt"),
              viewDetails: t("viewDetails"),
              removeProductTitle: t("removeProductTitle"),
            }}
            isLoading={loading}
            errorMessage={error}
            isRefreshing={refreshing}
            isAdding={adding}
            isResetting={resetting}
            deletingId={deletingId}
            onRefresh={handleRefresh}
            onAddRandom={handleAddRandom}
            onReset={handleReset}
            onDelete={handleDelete}
            toolbarSlot={<LangSelector />}
          />
        </main>
      </div>

      {showToast && <div className={styles.toast}>{toastMsg}</div>}
    </>
  );
}
