import Link from "next/link";
import type { Product } from "@/lib/store";
import { formatDate, formatPrice } from "@/lib/formatters";
import { Card } from "@/components/cards";
import { ProductStatusBadge } from "./ProductStatusBadge";
import styles from "@/styles/products/ProductCard.module.css";

interface ProductCardLabels {
  active: string;
  inactive: string;
  id: string;
  price: string;
  quantity: string;
  createdAt: string;
  viewDetails: string;
  removeProduct: string;
}

interface ProductCardProps {
  product: Product;
  locale: string;
  detailHref: string;
  labels: ProductCardLabels;
  isDeleting?: boolean;
  onDelete?: (id: number) => void;
}

export function ProductCard({
  product,
  locale,
  detailHref,
  labels,
  isDeleting = false,
  onDelete,
}: ProductCardProps) {
  const actions = (
    <div className={styles.cardHeaderRight}>
      <ProductStatusBadge
        active={product.active}
        activeLabel={labels.active}
        inactiveLabel={labels.inactive}
      />
      {onDelete ? (
        <button
          type="button"
          className={styles.deleteBtn}
          onClick={() => onDelete(product.id)}
          disabled={isDeleting}
          aria-label={labels.removeProduct}
          title={labels.removeProduct}
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
      ) : null}
    </div>
  );

  const content = (
    <div className={styles.cardMeta}>
      <div className={styles.metaRow}>
        <span className={styles.metaLabel}>{labels.id}</span>
        <span className={styles.metaValue}>#{product.id}</span>
      </div>
      <div className={styles.metaRow}>
        <span className={styles.metaLabel}>{labels.price}</span>
        <span className={styles.metaValue}>
          {formatPrice(product.price, locale)}
        </span>
      </div>
      <div className={styles.metaRow}>
        <span className={styles.metaLabel}>{labels.quantity}</span>
        <span className={styles.metaValue}>{product.quantity}</span>
      </div>
      <div className={styles.metaRow}>
        <span className={styles.metaLabel}>{labels.createdAt}</span>
        <span className={styles.metaValue}>
          {formatDate(product.createdAt, false, locale)}
        </span>
      </div>
    </div>
  );

  const footer = (
    <Link href={detailHref} className={styles.detailLink}>
      {labels.viewDetails}
    </Link>
  );

  return (
    <Card
      title={product.name}
      description={product.description}
      actions={actions}
      footer={footer}
      className={styles.card}
    >
      {content}
    </Card>
  );
}
