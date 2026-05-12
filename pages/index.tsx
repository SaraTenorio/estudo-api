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

const BASE = "http://localhost:3000";

const endpointGroups = [
  {
    title: "Coleção",
    resource: "/api/items",
    endpoints: [
      {
        method: "GET",
        description: "Lista todos os items",
        body: null,
      },
      {
        method: "POST",
        description: "Cria um novo item",
        body: JSON.stringify(
          {
            name: "Novo item",
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
      {
        method: "HEAD",
        description: "Verifica total de items (header X-Total-Count)",
        body: null,
      },
      {
        method: "OPTIONS",
        description: "Retorna os métodos suportados (header Allow)",
        body: null,
      },
    ],
  },
  {
    title: "Item individual",
    resource: "/api/items/:id",
    endpoints: [
      {
        method: "GET",
        description: "Retorna um item pelo ID",
        body: null,
      },
      {
        method: "PUT",
        description: "Substitui o item completo",
        body: JSON.stringify(
          {
            name: "Nome actualizado",
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
        description: "Remove um item pelo ID",
        body: null,
      },
      {
        method: "HEAD",
        description: "Verifica se o item existe (200 / 404 sem body)",
        body: null,
      },
      {
        method: "OPTIONS",
        description: "Retorna os métodos suportados (header Allow)",
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
  HEAD: "#9b59b6",
  OPTIONS: "#95a5a6",
};

export default function Home() {
  return (
    <>
      <Head>
        <title>Estudo API</title>
        <meta name="description" content="Documentação da API de estudo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}
      >
        <main className={styles.main}>
          <div className={styles.intro}>
            <h1>Estudo API</h1>
            <p>
              API REST de teste com operações CRUD sobre <code>/api/items</code>
              .<br />
              Base URL: <code>{BASE}</code>
            </p>
            <Link
              href="/items"
              style={{ fontSize: 14, color: "#58a6ff", textDecoration: "none" }}
            >
              Ver items em cards →
            </Link>
          </div>

          <div className={styles.groups}>
            {endpointGroups.map((group) => (
              <div key={group.resource} className={styles.group}>
                <div className={styles.groupHeader}>
                  <span className={styles.groupTitle}>{group.title}</span>
                  <code className={styles.groupResource}>{group.resource}</code>
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
                          <span className={styles.bodyLabel}>Body (JSON)</span>
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
