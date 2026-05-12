import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import type { Product } from "./api/_store";
import styles from "@/styles/Products.module.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "EUR" });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data: Product[] = await res.json();
      setProducts(data);
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
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } finally {
      setResetting(false);
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
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}
      >
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
              className={styles.resetBtn}
              onClick={handleReset}
              disabled={resetting || loading}
            >
              {resetting ? "Resetando…" : "Resetar store"}
            </button>
          </div>

          {loading ? (
            <p className={styles.empty}>Carregando produtos…</p>
          ) : products.length === 0 ? (
            <p className={styles.empty}>Nenhum produto encontrado.</p>
          ) : (
            <div className={styles.grid}>
              {products.map((product) => (
                <div key={product.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h2 className={styles.cardName}>{product.name}</h2>
                    <span
                      className={`${styles.badge} ${product.active ? styles.badgeActive : styles.badgeInactive}`}
                    >
                      {product.active ? "Ativo" : "Inativo"}
                    </span>
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
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {showToast && (
        <div className={styles.toast}>Store resetado com sucesso ✓</div>
      )}
    </>
  );
}
