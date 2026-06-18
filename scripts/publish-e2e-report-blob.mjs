import fs from "fs";
import path from "path";

const token = process.env.BLOB_READ_WRITE_TOKEN;
const reportDir = process.env.E2E_REPORT_DIR ?? "playwright-report";
const summaryPath =
  process.env.E2E_SUMMARY_JSON ?? path.join("test-results", "summary.json");
const blobPrefix = (process.env.E2E_BLOB_PREFIX ?? "qa-reports/latest").replace(
  /^\/+|\/+$/g,
  "",
);

function guessContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".html":
      return "text/html; charset=utf-8";
    case ".css":
      return "text/css; charset=utf-8";
    case ".js":
      return "application/javascript; charset=utf-8";
    case ".json":
      return "application/json; charset=utf-8";
    case ".svg":
      return "image/svg+xml";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".txt":
      return "text/plain; charset=utf-8";
    default:
      return "application/octet-stream";
  }
}

function walkFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(absolutePath));
    } else {
      files.push(absolutePath);
    }
  }

  return files;
}

async function putBlob(pathname, bytes, contentType) {
  const url = `https://blob.vercel-storage.com/${pathname}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "x-content-type": contentType,
      "x-add-random-suffix": "0",
      "x-cache-control-max-age": "60",
    },
    body: bytes,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Blob upload failed (${response.status}) for ${pathname}: ${text}`,
    );
  }

  return response.json();
}

async function main() {
  if (!token) {
    console.log("BLOB_READ_WRITE_TOKEN not found. Skipping publish.");
    return;
  }

  if (!fs.existsSync(reportDir)) {
    throw new Error(`Playwright report directory not found: ${reportDir}`);
  }

  if (!fs.existsSync(summaryPath)) {
    throw new Error(`Summary JSON not found: ${summaryPath}`);
  }

  const reportFiles = walkFiles(reportDir);
  let htmlReportUrl = null;

  for (const filePath of reportFiles) {
    const relative = path.relative(reportDir, filePath).replace(/\\/g, "/");
    const blobPath = `${blobPrefix}/playwright-report/${relative}`;
    const bytes = fs.readFileSync(filePath);

    const result = await putBlob(blobPath, bytes, guessContentType(filePath));

    if (relative === "index.html") {
      htmlReportUrl = result.url ?? null;
    }
  }

  const summary = JSON.parse(fs.readFileSync(summaryPath, "utf8"));
  const updatedSummary = {
    ...summary,
    htmlReportUrl,
    publishedAt: new Date().toISOString(),
  };

  const summaryBytes = Buffer.from(
    JSON.stringify(updatedSummary, null, 2),
    "utf8",
  );
  const summaryBlobPath = `${blobPrefix}/summary.json`;
  const summaryResult = await putBlob(
    summaryBlobPath,
    summaryBytes,
    "application/json; charset=utf-8",
  );

  fs.writeFileSync(summaryPath, JSON.stringify(updatedSummary, null, 2));

  console.log(`Published summary URL: ${summaryResult.url}`);
  if (htmlReportUrl) {
    console.log(`Published HTML report URL: ${htmlReportUrl}`);
  }
}

main();
