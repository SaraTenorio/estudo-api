import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import type { Product } from "../lib/store";
import { formatPrice, formatDate } from "../lib/formatters";
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

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error(`Erro ao carregar produtos (${res.status})`);
      const data: Product[] = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, []);

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
      setToastMsg("Store resetado com sucesso ✓");
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
      setToastMsg(`Produto #${id} removido ✓`);
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
      setToastMsg(`"${created.name}" adicionado ✓`);
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
        <title>Produtos | Estudo API</title>
        <meta name="description" content="Lista de produtos em cards" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/api.png" />
      </Head>

      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.header}>
            <Link href="/" className={styles.backLink}>
              ← Voltar à API
            </Link>
            <h1 className={styles.title}>Produtos</h1>
            <button
              className={styles.refreshBtn}
              onClick={handleRefresh}
              disabled={refreshing || loading}
              title="Atualizar dados"
            >
              {refreshing ? "↻" : "↻"}
            </button>
            <button
              className={styles.addRandomBtn}
              onClick={handleAddRandom}
              disabled={adding || loading}
            >
              {adding ? "Adicionando…" : "+ Produto aleatório"}
            </button>
            <button
              className={styles.resetBtn}
              onClick={handleReset}
              disabled={resetting || loading}
            >
              {resetting ? "Resetando…" : "Resetar store"}
            </button>
          </div>

          <p className={styles.hint}>
            Esta página consome <code>/api/products</code> diretamente. Use os
            botões acima ou faça chamadas à API (listadas na página inicial) e
            carregue <strong>↻</strong> para ver as alterações aqui.
          </p>

          {loading ? (
            <p className={styles.empty}>Carregando produtos…</p>
          ) : error ? (
            <p className={styles.empty}>{error}</p>
          ) : products.length === 0 ? (
            <p className={styles.empty}>Nenhum produto encontrado.</p>
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
                        {product.active ? "Ativo" : "Inativo"}
                      </span>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(product.id)}
                        disabled={deletingId === product.id}
                        title="Remover produto"
                      >
                        🗑
                      </button>
                    </div>
                  </div>

                  {product.description && (
                    <p className={styles.cardDesc}>{product.description}</p>
                  )}

                  <div className={styles.cardMeta}>
                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>ID</span>
                      <span className={styles.metaValue}>#{product.id}</span>
                    </div>
                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>Preço</span>
                      <span className={styles.metaValue}>
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>Quantidade</span>
                      <span className={styles.metaValue}>
                        {product.quantity}
                      </span>
                    </div>
                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>Criado em</span>
                      <span className={styles.metaValue}>
                        {formatDate(product.createdAt)}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/products/${product.id}`}
                    className={styles.detailLink}
                  >
                    Ver detalhes →
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
