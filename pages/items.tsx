import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import type { Item } from "./api/_store";
import styles from "@/styles/Items.module.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function formatPrice(value: number): string {
  return value.toLocaleString("pt-PT", { style: "currency", currency: "EUR" });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/items");
      const data: Item[] = await res.json();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleReset = async () => {
    setResetting(true);
    try {
      await fetch("/api/items/reset", { method: "POST" });
      await fetchItems();
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } finally {
      setResetting(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <>
      <Head>
        <title>Items | Estudo API</title>
        <meta name="description" content="Lista de items em cards" />
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
            <h1 className={styles.title}>Items</h1>
            <button
              className={styles.resetBtn}
              onClick={handleReset}
              disabled={resetting || loading}
            >
              {resetting ? "A resetar…" : "Resetar store"}
            </button>
          </div>

          {loading ? (
            <p className={styles.empty}>A carregar items…</p>
          ) : items.length === 0 ? (
            <p className={styles.empty}>Nenhum item encontrado.</p>
          ) : (
            <div className={styles.grid}>
              {items.map((item) => (
                <div key={item.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h2 className={styles.cardName}>{item.name}</h2>
                    <span
                      className={`${styles.badge} ${item.active ? styles.badgeActive : styles.badgeInactive}`}
                    >
                      {item.active ? "Activo" : "Inactivo"}
                    </span>
                  </div>

                  {item.description && (
                    <p className={styles.cardDesc}>{item.description}</p>
                  )}

                  <div className={styles.cardMeta}>
                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>ID</span>
                      <span className={styles.metaValue}>#{item.id}</span>
                    </div>
                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>Preço</span>
                      <span className={styles.metaValue}>
                        {formatPrice(item.price)}
                      </span>
                    </div>
                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>Quantidade</span>
                      <span className={styles.metaValue}>{item.quantity}</span>
                    </div>
                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>Criado em</span>
                      <span className={styles.metaValue}>
                        {formatDate(item.createdAt)}
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
