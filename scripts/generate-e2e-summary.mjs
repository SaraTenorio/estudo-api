import fs from "fs";
import path from "path";

const inputFile =
  process.env.E2E_REPORT_JSON ?? path.join("test-results", "report.json");
const outputFile =
  process.env.E2E_SUMMARY_JSON ?? path.join("test-results", "summary.json");

function safeNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function computeCounts(report) {
  const stats = report?.stats ?? {};

  const passed = safeNumber(stats.expected);
  const failed = safeNumber(stats.unexpected);
  const flaky = safeNumber(stats.flaky);
  const skipped = safeNumber(stats.skipped);

  const total = passed + failed + flaky + skipped;

  return {
    total,
    passed,
    failed,
    flaky,
    skipped,
    durationMs: safeNumber(stats.duration),
  };
}

function main() {
  if (!fs.existsSync(inputFile)) {
    throw new Error(`Playwright JSON report not found: ${inputFile}`);
  }

  const report = JSON.parse(fs.readFileSync(inputFile, "utf8"));
  const counts = computeCounts(report);

  const summary = {
    status: counts.failed > 0 ? "failed" : "passed",
    ...counts,
    generatedAt: new Date().toISOString(),
    branch: process.env.GITHUB_REF_NAME ?? null,
    commit: process.env.GITHUB_SHA ?? null,
    runId: process.env.GITHUB_RUN_ID ?? null,
    runNumber: process.env.GITHUB_RUN_NUMBER ?? null,
    runUrl:
      process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
        ? `https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
        : null,
    htmlReportUrl: null,
  };

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, JSON.stringify(summary, null, 2));

  console.log(`E2E summary written to ${outputFile}`);
}

main();
