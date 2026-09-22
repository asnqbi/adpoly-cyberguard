import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/integration",
  workers: 1,
  fullyParallel: false,
  timeout: 60000,
  use: {
    baseURL: "http://127.0.0.1:3100",
    channel: "msedge",
    headless: true,
    reducedMotion: "reduce",
  },
  webServer: [
    {
      command: "node tests/fixtures/supabase.mjs",
      url: "http://127.0.0.1:54329/health",
      reuseExistingServer: false,
    },
    {
      command:
        "node node_modules/next/dist/bin/next dev --hostname 127.0.0.1 --port 3100",
      url: "http://127.0.0.1:3100",
      reuseExistingServer: false,
      timeout: 120000,
      env: {
        NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54329",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "local-test-anon-key",
        SUPABASE_SERVICE_ROLE_KEY: "",
        NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3100",
      },
    },
  ],
});
