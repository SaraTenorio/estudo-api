import Link from "next/link";
import type { ReactNode } from "react";
import type { Product } from "@/lib/store";
import { formatDate, formatPrice } from "@/lib/formatters";
import { ProductStatusBadge } from "./ProductStatusBadge";
import styles from "@/styles/products/ProductDetailView.module.css";

interface ProductDetailViewLabels {
  backToProducts: string;
  removeBtn: string;
  removeProductTitle: string;
  refreshTitle: string;
  loadingProduct: string;
  notFoundHeading: string;
  notFoundMessage: string;
  active: string;
  inactive: string;
  identification: string;
  inventory: string;
  metadata: string;
  labelId: string;
  labelName: string;
  labelPrice: string;
  labelQuantity: string;
  labelStatus: string;
  labelCreatedAt: string;
  labelCreatedAtIso: string;
  toggleTitle: string;
}

interface ProductDetailViewProps {
  product: Product | null;
  locale: string;
  labels: ProductDetailViewLabels;
  isLoading: boolean;
  isNotFound: boolean;
  isRefreshing: boolean;
  isDeleting: boolean;
  isToggling: boolean;
  onDelete: () => void;
  onRefresh: () => void;
  onToggleActive: () => void;
  toolbarSlot?: ReactNode;
}

export function ProductDetailView({
  product,
  locale,
  labels,
  isLoading,
  isNotFound,
  isRefreshing,
  isDeleting,
  isToggling,
  onDelete,
  onRefresh,
  onToggleActive,
  toolbarSlot,
}: ProductDetailViewProps) {
  return (
    <>
      <div className={styles.header}>
        <Link href="/products" className={styles.backLink}>
          {labels.backToProducts}
        </Link>
        <div className={styles.headerActions}>
          {toolbarSlot}
          {!isNotFound ? (
            <>
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={onDelete}
                disabled={isDeleting || isLoading}
                aria-label={labels.removeProductTitle}
                title={labels.removeProductTitle}
              >
                {labels.removeBtn}
              </button>
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
            </>
          ) : null}
        </div>
      </div>

      {isLoading ? (
        <p className={styles.empty}>{labels.loadingProduct}</p>
      ) : isNotFound ? (
        <div className={styles.notFound}>
          <span className={styles.notFoundCode}>404</span>
          <h1 className={styles.notFoundTitle}>{labels.notFoundHeading}</h1>
          <p className={styles.notFoundMessage}>{labels.notFoundMessage}</p>
        </div>
      ) : product ? (
        <>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{product.name}</h1>
            <ProductStatusBadge
              active={product.active}
              activeLabel={labels.active}
              inactiveLabel={labels.inactive}
            />
          </div>

          {product.description ? (
            <p className={styles.description}>{product.description}</p>
          ) : null}

          <div className={styles.card}>
            <div className={styles.section}>
              <span className={styles.sectionTitle}>
                {labels.identification}
              </span>
              <div className={styles.row}>
                <span className={styles.label}>{labels.labelId}</span>
                <span className={styles.value}>#{product.id}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>{labels.labelName}</span>
                <span className={styles.value}>{product.name}</span>
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.section}>
              <span className={styles.sectionTitle}>{labels.inventory}</span>
              <div className={styles.row}>
                <span className={styles.label}>{labels.labelPrice}</span>
                <span className={`${styles.value} ${styles.price}`}>
                  {formatPrice(product.price, locale)}
                </span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>{labels.labelQuantity}</span>
                <span className={styles.value}>{product.quantity}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>{labels.labelStatus}</span>
                <label className={styles.toggle} title={labels.toggleTitle}>
                  <input
                    type="checkbox"
                    checked={product.active}
                    disabled={isToggling}
                    aria-label={labels.toggleTitle}
                    onChange={onToggleActive}
                  />
                  <span className={styles.toggleTrack}>
                    <span className={styles.toggleThumb} />
                  </span>
                  <span
                    className={`${styles.toggleLabel} ${product.active ? styles.toggleLabelOn : styles.toggleLabelOff}`}
                  >
                    {isToggling
                      ? "…"
                      : product.active
                        ? labels.active
                        : labels.inactive}
                  </span>
                </label>
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.section}>
              <span className={styles.sectionTitle}>{labels.metadata}</span>
              <div className={styles.row}>
                <span className={styles.label}>{labels.labelCreatedAt}</span>
                <span className={styles.value}>
                  {formatDate(product.createdAt, true, locale)}
                </span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>{labels.labelCreatedAtIso}</span>
                <span className={`${styles.value} ${styles.mono}`}>
                  {product.createdAt}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.jsonBlock}>
            <span className={styles.jsonLabel}>
              GET /api/products/{product.id}
            </span>
            <pre className={styles.pre}>{JSON.stringify(product, null, 2)}</pre>
          </div>
        </>
      ) : null}
    </>
  );
}
