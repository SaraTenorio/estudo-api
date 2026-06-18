import { defineConfig, devices } from "@playwright/test";
import fs from "fs";
import path from "path";

function loadEnvFile(filePath: string): void {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const equalsIndex = line.indexOf("=");
    if (equalsIndex <= 0) continue;

    const key = line.slice(0, equalsIndex).trim();
    const value = line.slice(equalsIndex + 1).trim();

    // Keep already-defined environment values (CI secrets, shell overrides)
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

const workspaceRoot = __dirname;
loadEnvFile(path.join(workspaceRoot, ".env.local"));
loadEnvFile(path.join(workspaceRoot, ".env"));

export default defineConfig({
  testDir: "./tests/e2e",
  /* Executar sequencialmente — o store é partilhado em memória entre testes */
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ["html", { open: "never" }],
    ["json", { outputFile: "test-results/report.json" }],
  ],
  use: {
    baseURL: process.env.CI
      ? "http://localhost:3000"
      : "https://localhost:3000",
    /* Certificado auto-assinado do --experimental-https (local apenas) */
    ignoreHTTPSErrors: true,
    trace: "on-first-retry",
    extraHTTPHeaders: {
      "X-API-Key": process.env.API_KEY ?? "dev-api-key",
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: process.env.CI ? "npm run start:e2e" : "npm run dev",
    url: process.env.CI ? "http://localhost:3000" : "https://localhost:3000",
    reuseExistingServer: !process.env.CI,
    ignoreHTTPSErrors: true,
    timeout: 300_000,
  },
});
