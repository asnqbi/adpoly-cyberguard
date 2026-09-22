import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  testIgnore: "**/integration/**",
  fullyParallel: false,
  workers: 1,
  timeout: 60000,
  use: {
    baseURL: process.env.TEST_BASE_URL || "http://localhost:3000",
    headless: true,
    channel: "msedge",
    reducedMotion: "reduce",
  },
  webServer: {
    command: "npm run dev",
    url: process.env.TEST_BASE_URL || "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120000,
  },
});
