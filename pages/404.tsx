import Head from "next/head";
import Link from "next/link";
import { useLang, LangSelector } from "../lib/LangContext";
import styles from "@/styles/Maintenance.module.css";

export default function Custom404Page() {
  const { t } = useLang();

  return (
    <>
      <Head>
        <title>{`404 | ${t("notFoundTitle")}`}</title>
        <meta name="description" content={t("notFoundMetaDesc")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <link rel="icon" href="/api.png" />
      </Head>
      <div className={styles.page}>
        <main className={styles.main}>
          <header className={styles.header}>
            <Link href="/" className={styles.backLink}>
              {t("notFoundBackHome")}
            </Link>
            <LangSelector />
          </header>

          <div className={styles.body}>
            <p className={styles.notFoundCode}>404</p>
            <h1 className={styles.notFoundTitle}>{t("notFoundHeading")}</h1>
            <p className={styles.notFoundMessage}>{t("notFoundMessage")}</p>
          </div>
        </main>
      </div>
    </>
  );
}
