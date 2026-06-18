import type { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useLang, LangSelector } from "../lib/LangContext";
import styles from "@/styles/QaReport.module.css";

type QaSummary = {
  status: "passed" | "failed";
  total: number;
  passed: number;
  failed: number;
  flaky: number;
  skipped: number;
  durationMs: number;
  generatedAt: string;
  branch: string | null;
  commit: string | null;
  runId: string | null;
  runNumber: string | null;
  runUrl: string | null;
  htmlReportUrl: string | null;
  publishedAt?: string;
};

type QaReportPageProps = {
  summary: QaSummary | null;
  error: string | null;
};

function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms <= 0) return "0s";

  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

export default function QaReportPage({ summary, error }: QaReportPageProps) {
  const { t, locale } = useLang();

  const updatedAt = summary?.publishedAt ?? summary?.generatedAt ?? null;

  return (
    <>
      <Head>
        <title>{t("qaReportPageTitle")}</title>
        <meta name="description" content={t("qaReportMetaDesc")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/api.png" />
      </Head>

      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.header}>
            <Link href="/" className={styles.backLink}>
              {t("backToApi")}
            </Link>
            <h1 className={styles.title}>{t("qaReportHeading")}</h1>
            <LangSelector />
          </div>

          {!summary ? (
            <section className={styles.card}>
              <p className={styles.errorText}>{t("qaReportUnavailable")}</p>
              <p className={styles.hintText}>{t("qaReportConfigHint")}</p>
              {error && <p className={styles.detailText}>{error}</p>}
            </section>
          ) : (
            <section className={styles.card}>
              <div className={styles.statusRow}>
                <span className={styles.label}>{t("qaReportStatus")}</span>
                <span
                  className={
                    summary.status === "passed"
                      ? styles.statusPass
                      : styles.statusFail
                  }
                >
                  {summary.status === "passed" ? "PASS" : "FAIL"}
                </span>
              </div>

              <div className={styles.metricsGrid}>
                <div className={styles.metricBox}>
                  <span className={styles.metricLabel}>
                    {t("qaReportPassed")}
                  </span>
                  <strong className={styles.metricValue}>
                    {summary.passed}
                  </strong>
                </div>
                <div className={styles.metricBox}>
                  <span className={styles.metricLabel}>
                    {t("qaReportFailed")}
                  </span>
                  <strong className={styles.metricValue}>
                    {summary.failed}
                  </strong>
                </div>
                <div className={styles.metricBox}>
                  <span className={styles.metricLabel}>
                    {t("qaReportFlaky")}
                  </span>
                  <strong className={styles.metricValue}>
                    {summary.flaky}
                  </strong>
                </div>
                <div className={styles.metricBox}>
                  <span className={styles.metricLabel}>
                    {t("qaReportSkipped")}
                  </span>
                  <strong className={styles.metricValue}>
                    {summary.skipped}
                  </strong>
                </div>
              </div>

              <div className={styles.metaGrid}>
                <div className={styles.metaRow}>
                  <span className={styles.label}>Total</span>
                  <span>{summary.total}</span>
                </div>
                <div className={styles.metaRow}>
                  <span className={styles.label}>{t("qaReportDuration")}</span>
                  <span>{formatDuration(summary.durationMs)}</span>
                </div>
                {updatedAt && (
                  <div className={styles.metaRow}>
                    <span className={styles.label}>
                      {t("qaReportLastUpdated")}
                    </span>
                    <span>{new Date(updatedAt).toLocaleString(locale)}</span>
                  </div>
                )}
                {summary.branch && (
                  <div className={styles.metaRow}>
                    <span className={styles.label}>Branch</span>
                    <span>{summary.branch}</span>
                  </div>
                )}
                {summary.commit && (
                  <div className={styles.metaRow}>
                    <span className={styles.label}>Commit</span>
                    <span className={styles.commitText}>
                      {summary.commit.slice(0, 8)}
                    </span>
                  </div>
                )}
              </div>

              <div className={styles.actions}>
                {summary.htmlReportUrl && (
                  <a
                    href={summary.htmlReportUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.actionLink}
                  >
                    {t("qaReportOpenHtml")}
                  </a>
                )}
                {summary.runUrl && (
                  <a
                    href={summary.runUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.actionLink}
                  >
                    {t("qaReportOpenRun")}
                  </a>
                )}
              </div>
            </section>
          )}
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<
  QaReportPageProps
> = async () => {
  const summaryUrl = process.env.QA_REPORT_SUMMARY_URL;

  if (!summaryUrl) {
    return {
      props: {
        summary: null,
        error: "QA_REPORT_SUMMARY_URL is not defined.",
      },
    };
  }

  try {
    const response = await fetch(summaryUrl, { cache: "no-store" });

    if (!response.ok) {
      return {
        props: {
          summary: null,
          error: `Summary fetch failed with status ${response.status}.`,
        },
      };
    }

    const summary = (await response.json()) as QaSummary;

    return {
      props: {
        summary,
        error: null,
      },
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown summary fetch error.";

    return {
      props: {
        summary: null,
        error: message,
      },
    };
  }
};
