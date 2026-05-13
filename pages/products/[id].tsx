import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import type { Product } from "../../lib/store";
import { formatPrice, formatDate } from "../../lib/formatters";
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

  const fetchProduct = useCallback(
    async (showRefreshing = false) => {
      if (!id) return;
      if (showRefreshing) setRefreshing(true);
      else setLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.status === 404) {
          setNotFound(true);
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
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      router.push("/products");
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleActive = async () => {
    if (!product) return;
    setToggling(true);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !product.active }),
      });
      if (res.ok) {
        const updated: Product = await res.json();
        setProduct(updated);
      }
    } finally {
      setToggling(false);
    }
  };

  const title = product ? product.name : `Produto #${id}`;

  return (
    <>
      <Head>
        <title>{title} | Estudo API</title>
        <meta name="description" content={`Detalhes do produto #${id}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/api.png" />
      </Head>

      <div className={styles.page}>
        <main className={styles.main}>
          {/* Header */}
          <div className={styles.header}>
            <Link href="/products" className={styles.backLink}>
              ← Voltar aos produtos
            </Link>
            <div className={styles.headerActions}>
              <button
                className={styles.deleteBtn}
                onClick={handleDelete}
                disabled={deleting || loading || notFound}
                title="Remover produto"
              >
                {deleting ? "Removendo…" : "🗑 Remover"}
              </button>
              <button
                className={styles.refreshBtn}
                onClick={() => fetchProduct(true)}
                disabled={refreshing || loading}
                title="Atualizar dados"
              >
                ↻
              </button>
            </div>
          </div>

          {loading ? (
            <p className={styles.empty}>A carregar produto…</p>
          ) : notFound ? (
            <div className={styles.notFound}>
              <span className={styles.notFoundCode}>404</span>
              <p>
                Produto <strong>#{id}</strong> não encontrado.
              </p>
              <Link href="/products" className={styles.backLink}>
                ← Voltar aos produtos
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
                  {product.active ? "Ativo" : "Inativo"}
                </span>
              </div>

              {product.description && (
                <p className={styles.description}>{product.description}</p>
              )}

              {/* Detail card */}
              <div className={styles.card}>
                <div className={styles.section}>
                  <span className={styles.sectionTitle}>Identificação</span>
                  <div className={styles.row}>
                    <span className={styles.label}>ID</span>
                    <span className={styles.value}>#{product.id}</span>
                  </div>
                  <div className={styles.row}>
                    <span className={styles.label}>Nome</span>
                    <span className={styles.value}>{product.name}</span>
                  </div>
                </div>

                <div className={styles.divider} />

                <div className={styles.section}>
                  <span className={styles.sectionTitle}>Inventário</span>
                  <div className={styles.row}>
                    <span className={styles.label}>Preço</span>
                    <span className={`${styles.value} ${styles.price}`}>
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <div className={styles.row}>
                    <span className={styles.label}>Quantidade</span>
                    <span className={styles.value}>{product.quantity}</span>
                  </div>
                  <div className={styles.row}>
                    <span className={styles.label}>Estado</span>
                    <label
                      className={styles.toggle}
                      title={`Clique para ${product.active ? "desativar" : "ativar"}`}
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
                        {toggling ? "…" : product.active ? "Ativo" : "Inativo"}
                      </span>
                    </label>
                  </div>
                </div>

                <div className={styles.divider} />

                <div className={styles.section}>
                  <span className={styles.sectionTitle}>Metadados</span>
                  <div className={styles.row}>
                    <span className={styles.label}>Criado em</span>
                    <span className={styles.value}>
                      {formatDate(product.createdAt, true)}
                    </span>
                  </div>
                  <div className={styles.row}>
                    <span className={styles.label}>createdAt (ISO)</span>
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
