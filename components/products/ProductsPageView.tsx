import Link from "next/link";
import type { ReactNode } from "react";
import type { Product } from "@/lib/store";
import { ProductCard } from "./ProductCard";
import styles from "@/styles/products/ProductsPageView.module.css";

interface ProductsPageViewLabels {
  backToApi: string;
  productsHeading: string;
  hint: string;
  refreshTitle: string;
  addRandom: string;
  addingRandom: string;
  resetStore: string;
  resetting: string;
  loadingProducts: string;
  noProducts: string;
  active: string;
  inactive: string;
  labelId: string;
  labelPrice: string;
  labelQuantity: string;
  labelCreatedAt: string;
  viewDetails: string;
  removeProductTitle: string;
}

interface ProductsPageViewProps {
  products: Product[];
  locale: string;
  labels: ProductsPageViewLabels;
  isLoading: boolean;
  errorMessage: string | null;
  isRefreshing: boolean;
  isAdding: boolean;
  isResetting: boolean;
  deletingId: number | null;
  onRefresh: () => void;
  onAddRandom: () => void;
  onReset: () => void;
  onDelete: (id: number) => void;
  toolbarSlot?: ReactNode;
}

export function ProductsPageView({
  products,
  locale,
  labels,
  isLoading,
  errorMessage,
  isRefreshing,
  isAdding,
  isResetting,
  deletingId,
  onRefresh,
  onAddRandom,
  onReset,
  onDelete,
  toolbarSlot,
}: ProductsPageViewProps) {
  const productCardLabels = {
    active: labels.active,
    inactive: labels.inactive,
    id: labels.labelId,
    price: labels.labelPrice,
    quantity: labels.labelQuantity,
    createdAt: labels.labelCreatedAt,
    viewDetails: labels.viewDetails,
    removeProduct: labels.removeProductTitle,
  };

  return (
    <>
      <div className={styles.header}>
        <Link href="/" className={styles.backLink}>
          {labels.backToApi}
        </Link>
        <h1 className={styles.title}>{labels.productsHeading}</h1>
        <button
          type="button"
          className={styles.refreshBtn}
          onClick={onRefresh}
          disabled={isRefreshing || isLoading}
          aria-label={labels.refreshTitle}
          title={labels.refreshTitle}
        >
          ↻
        </button>
        <button
          type="button"
          className={styles.addRandomBtn}
          onClick={onAddRandom}
          disabled={isAdding || isLoading}
        >
          {isAdding ? labels.addingRandom : labels.addRandom}
        </button>
        <button
          type="button"
          className={styles.resetBtn}
          onClick={onReset}
          disabled={isResetting || isLoading}
        >
          {isResetting ? labels.resetting : labels.resetStore}
        </button>
        {toolbarSlot}
      </div>

      <p className={styles.hint}>{labels.hint}</p>

      {isLoading ? (
        <p className={styles.empty}>{labels.loadingProducts}</p>
      ) : errorMessage ? (
        <p className={styles.empty}>{errorMessage}</p>
      ) : products.length === 0 ? (
        <p className={styles.empty}>{labels.noProducts}</p>
      ) : (
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              locale={locale}
              detailHref={`/products/${product.id}`}
              labels={productCardLabels}
              isDeleting={deletingId === product.id}
              onDelete={onDelete}
            />
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
    </>
  );
}
