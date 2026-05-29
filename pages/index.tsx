import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import styles from "@/styles/Home.module.css";
import { useLang, LangSelector } from "../lib/LangContext";
import type { TranslationKey } from "../lib/i18n";

const methodColor: Record<string, string> = {
  GET: "#61affe",
  POST: "#49cc90",
  PUT: "#fca130",
  PATCH: "#50e3c2",
  DELETE: "#f93e3e",
};

function CopyButton({
  text,
  titleKey,
}: {
  text: string;
  titleKey: TranslationKey;
}) {
  const [copied, setCopied] = useState(false);
  const { t } = useLang();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button className={styles.copyBtn} onClick={handleCopy} title={t(titleKey)}>
      {copied ? "✓" : "⎘"}
    </button>
  );
}

export default function Home() {
  const [base, setBase] = useState("");
  const { t } = useLang();

  useEffect(() => {
    setBase(window.location.origin);
  }, []);

  const endpointGroups = [
    {
      title: t("groupAuth"),
      resource: "/api/auth/login",
      endpoints: [
        {
          method: "POST",
          description: t("descLogin"),
          body: JSON.stringify(
            { username: "admin", password: "your-password" },
            null,
            2,
          ),
        },
      ],
    },
    {
      title: t("groupCollection"),
      resource: "/api/products",
      endpoints: [
        { method: "GET", description: t("descListAll"), body: null },
        {
          method: "POST",
          description: t("descCreate"),
          body: JSON.stringify(
            {
              name: "New product",
              description: "Description",
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
      title: t("groupSingle"),
      resource: "/api/products/id",
      endpoints: [
        { method: "GET", description: t("descGetById"), body: null },
        {
          method: "PUT",
          description: t("descReplace"),
          body: JSON.stringify(
            {
              name: "Updated product",
              description: "New description",
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
          description: t("descPatch"),
          body: JSON.stringify(
            { active: false, price: 5.5, quantity: 2 },
            null,
            2,
          ),
        },
        { method: "DELETE", description: t("descDelete"), body: null },
      ],
    },
    {
      title: t("groupRandom"),
      resource: "/api/products/random",
      endpoints: [{ method: "POST", description: t("descRandom"), body: null }],
    },
    {
      title: t("groupReset"),
      resource: "/api/products/reset",
      endpoints: [
        { method: "POST", description: t("descResetStore"), body: null },
      ],
    },
    {
      title: t("groupSitemap"),
      resource: "/sitemap.xml",
      endpoints: [{ method: "GET", description: t("descSitemap"), body: null }],
    },
    {
      title: t("groupFeed"),
      resource: "/feed.xml",
      endpoints: [{ method: "GET", description: t("descFeed"), body: null }],
    },
  ];

  return (
    <>
      <Head>
        <title>Estudo API</title>
        <meta name="description" content={t("metaDescription")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/api.png" />
      </Head>
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.intro}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <h1>Estudo API</h1>
              <LangSelector />
            </div>
            <p>
              {t("intro")} <code>/api/products</code>.<br />
              {t("baseUrl")} <code>{base}</code>
            </p>
            <p style={{ fontSize: 13, color: "#8b949e", margin: "8px 0 4px" }}>
              {t("callsHint")}
            </p>
            <p style={{ fontSize: 13, color: "#d29922", margin: "4px 0" }}>
              🔒 {t("authHint")}
            </p>
            <div className={styles.navRow}>
              <Link
                href="/products"
                style={{
                  fontSize: 14,
                  color: "#58a6ff",
                  textDecoration: "none",
                }}
              >
                {t("viewCards")}
              </Link>
              <div className={styles.metaLinks}>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.metaLink}
                  title="Sitemap XML"
                >
                  <svg
                    width="14"
                    height="14"
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
                    width="14"
                    height="14"
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
            </div>
          </div>

          <div className={styles.groups}>
            {endpointGroups.map((group) => (
              <div key={group.resource} className={styles.group}>
                <div className={styles.groupHeader}>
                  <span className={styles.groupTitle}>{group.title}</span>
                  <code className={styles.groupResource}>{group.resource}</code>
                  <CopyButton text={group.resource} titleKey="copyPath" />
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
                            <CopyButton text={ep.body} titleKey="copyBody" />
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
