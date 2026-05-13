import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const endpointGroups = [
  {
    title: "Coleção",
    resource: "/api/products",
    endpoints: [
      {
        method: "GET",
        description: "Lista todos os produtos",
        body: null,
      },
      {
        method: "POST",
        description: "Cria um novo produto",
        body: JSON.stringify(
          {
            name: "Novo produto",
            description: "Descrição",
            price: 9.99,
            quantity: 5,
            active: true,
            createdAt: "2026-05-12T10:00:00.000Z",
          },
          null,
          2,
        ),
      },
    ],
  },
  {
    title: "Produto individual",
    resource: "/api/products/id",
    endpoints: [
      {
        method: "GET",
        description: "Retorna um produto pelo ID",
        body: null,
      },
      {
        method: "PUT",
        description: "Substitui o produto completo",
        body: JSON.stringify(
          {
            name: "Nome atualizado",
            description: "Nova descrição",
            price: 19.99,
            quantity: 8,
            active: true,
            createdAt: "2026-05-12T10:00:00.000Z",
          },
          null,
          2,
        ),
      },
      {
        method: "PATCH",
        description: "Atualiza campos parcialmente",
        body: JSON.stringify(
          { active: false, price: 5.5, quantity: 2 },
          null,
          2,
        ),
      },
      {
        method: "DELETE",
        description: "Remove um produto pelo ID",
        body: null,
      },
    ],
  },
  {
    title: "Produto aleatório",
    resource: "/api/products/random",
    endpoints: [
      {
        method: "POST",
        description:
          "Cria um produto com dados aleatórios — sem body necessário",
        body: null,
      },
    ],
  },
  {
    title: "Reset",
    resource: "/api/products/reset",
    endpoints: [
      {
        method: "POST",
        description:
          "Restaura o store com 2 produtos aleatórios — sem body necessário",
        body: null,
      },
    ],
  },
];

const methodColor: Record<string, string> = {
  GET: "#61affe",
  POST: "#49cc90",
  PUT: "#fca130",
  PATCH: "#50e3c2",
  DELETE: "#f93e3e",
};

function CopyButton({ text, title }: { text: string; title?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      className={styles.copyBtn}
      onClick={handleCopy}
      title={title ?? "Copiar"}
    >
      {copied ? "✓" : "⎘"}
    </button>
  );
}

export default function Home() {
  const [base, setBase] = useState("");

  useEffect(() => {
    setBase(window.location.origin);
  }, []);

  return (
    <>
      <Head>
        <title>Estudo API</title>
        <meta name="description" content="Documentação da API de estudo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/api.png" />
      </Head>
      <div
        className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}
      >
        <main className={styles.main}>
          <div className={styles.intro}>
            <h1>Estudo API</h1>
            <p>
              API REST de teste com operações CRUD sobre{" "}
              <code>/api/products</code>
              .<br />
              Base URL: <code>{base}</code>
            </p>
            <p style={{ fontSize: 13, color: "#8b949e", margin: "8px 0 4px" }}>
              Cada chamada à API modifica o <em>store</em> em memória — crie,
              edite ou apague produtos aqui e veja o resultado reflectido em{" "}
              <strong>tempo real</strong> na página de cards.
            </p>
            <Link
              href="/products"
              style={{ fontSize: 14, color: "#58a6ff", textDecoration: "none" }}
            >
              Ver produtos em cards →
            </Link>
          </div>

          <div className={styles.groups}>
            {endpointGroups.map((group) => (
              <div key={group.resource} className={styles.group}>
                <div className={styles.groupHeader}>
                  <span className={styles.groupTitle}>{group.title}</span>
                  <code className={styles.groupResource}>{group.resource}</code>
                  <CopyButton text={group.resource} title="Copiar path" />
                </div>
                <div className={styles.endpoints}>
                  {group.endpoints.map((ep) => (
                    <div key={ep.method} className={styles.endpoint}>
                      <div className={styles.endpointHeader}>
                        <span
                          className={styles.method}
                          style={{ backgroundColor: methodColor[ep.method] }}
                        >
                          {ep.method}
                        </span>
                        <span className={styles.desc}>{ep.description}</span>
                      </div>
                      {ep.body && (
                        <div className={styles.body}>
                          <div className={styles.bodyHeader}>
                            <span className={styles.bodyLabel}>
                              Body (JSON)
                            </span>
                            <CopyButton text={ep.body} title="Copiar body" />
                          </div>
                          <pre className={styles.pre}>{ep.body}</pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
