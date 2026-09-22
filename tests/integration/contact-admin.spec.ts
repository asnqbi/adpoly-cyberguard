import { test, expect } from "@playwright/test";
import { createServerClient } from "@supabase/ssr";
const fixture = "http://127.0.0.1:54329";
const origin = "http://127.0.0.1:3100";
const contact = {
  name: "Website Visitor",
  organization: "Example Organization",
  email: "visitor@example.com",
  subject: "Project Inquiry",
  message:
    "Please tell us more about your AI security project.\nSecond line of the message.",
};

test.beforeEach(async ({ request }) => {
  await request.post(`${fixture}/__test/reset`);
});

test("contact is submitted, then reviewed and managed in the authenticated dashboard", async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.getByLabel("Your name").fill(contact.name);
  await page
    .getByLabel("Organization", { exact: true })
    .fill(contact.organization);
  await page.getByLabel("Email address").fill(contact.email);
  await page
    .getByRole("combobox", { name: "Subject", exact: true })
    .selectOption(contact.subject);
  await page.getByLabel("Your message").fill(contact.message);
  await page.getByRole("button", { name: "Send Message", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText(
    "Message sent successfully. Our team will review it soon.",
  );
  await expect(page.getByLabel("Your name")).toHaveValue("");
  const stored = await (await request.get(`${fixture}/__test/messages`)).json();
  expect(stored[1]).toMatchObject({ ...contact, status: "new" });
  expect(stored[1].id).toBeTruthy();
  await page.goto("/admin/messages");
  await expect(page).toHaveURL(/\/admin\/login$/);
  await page.getByLabel("Admin email").fill("admin@example.com");
  await page
    .getByLabel("Password", { exact: true })
    .fill("local-test-password");
  await page.getByRole("button", { name: "Sign In", exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/messages$/);
  await expect(
    page.getByRole("row", { name: /Website Visitor/ }),
  ).toBeVisible();
  await expect(
    page
      .locator(".admin-stats > div")
      .filter({ hasText: "Total Messages" })
      .locator("strong"),
  ).toHaveText("2");
  await expect(
    page
      .locator(".admin-stats > div")
      .filter({ hasText: "New Messages" })
      .locator("strong"),
  ).toHaveText("1");
  await expect(
    page
      .locator(".admin-stats > div")
      .filter({ hasText: "Messages Today" })
      .locator("strong"),
  ).toHaveText("1");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({
    path: "test-results/admin-desktop.png",
    fullPage: true,
  });

  await page.getByLabel("Sort by", { exact: true }).selectOption("oldest");
  await expect(page.locator("tbody tr").first()).toContainText(
    "Earlier Contact",
  );
  await page.getByLabel("Filter by subject").selectOption("Project Inquiry");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page.getByLabel("Filter by subject").selectOption("");
  await page
    .getByLabel("Search messages", { exact: true })
    .fill("Website Visitor");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page.getByRole("button", { name: "View message", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator(".full-message")).toHaveText(contact.message);
  await page.getByRole("button", { name: "Mark as read", exact: true }).click();
  await expect(page.getByRole("dialog").locator(".message-status")).toHaveText(
    "read",
  );
  await page
    .getByRole("button", { name: "Mark as contacted", exact: true })
    .click();
  await expect(page.getByRole("dialog").locator(".message-status")).toHaveText(
    "contacted",
  );
  await page
    .getByRole("button", { name: "Close message", exact: true })
    .click();
  await page.reload();
  await expect(
    page.getByRole("row", { name: /Website Visitor/ }),
  ).toContainText("contacted");

  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
  await page.screenshot({
    path: "test-results/admin-mobile.png",
    fullPage: true,
  });
  await page
    .getByRole("row", { name: /Website Visitor/ })
    .getByRole("button", { name: "View message", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.screenshot({ path: "test-results/admin-message-mobile.png" });
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(page.getByText(/This cannot be undone/)).toBeVisible();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page.locator(".full-message")).toHaveText(contact.message);
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await page
    .getByRole("button", { name: "Delete permanently", exact: true })
    .click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.getByRole("row", { name: /Website Visitor/ })).toHaveCount(
    0,
  );
  await expect(
    page
      .locator(".admin-stats > div")
      .filter({ hasText: "Total Messages" })
      .locator("strong"),
  ).toHaveText("1");
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/login$/);
  await page.goto("/admin/messages");
  await expect(page).toHaveURL(/\/admin\/login$/);
  expect(errors).toEqual([]);
});

test("validation, failed persistence, and public endpoints never expose messages", async ({
  page,
  request,
}) => {
  expect((await request.get("/api/admin/messages")).status()).toBe(401);
  expect((await request.get("/api/contact")).status()).toBe(405);
  expect(
    (
      await request.post("/api/contact", {
        data: { ...contact, email: "invalid" },
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.post("/api/contact", { data: { ...contact, name: "  " } })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.post("/api/contact", {
        data: { ...contact, status: "contacted" },
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.post("/api/contact", {
        data: { ...contact, message: "x".repeat(33000) },
      })
    ).status(),
  ).toBe(413);
  expect(
    (
      await request.post("/api/admin/login", {
        headers: { Origin: "https://untrusted.example" },
        data: { email: "admin@example.com", password: "local-test-password" },
      })
    ).status(),
  ).toBe(403);
  await request.post(`${fixture}/__test/control`, {
    data: { failInsert: true },
  });
  await page.goto("/");
  await page.getByLabel("Your name").fill(contact.name);
  await page.getByLabel("Email address").fill(contact.email);
  await page
    .getByRole("combobox", { name: "Subject", exact: true })
    .selectOption(contact.subject);
  await page.getByLabel("Your message").fill(contact.message);
  await page.getByRole("button", { name: "Send Message", exact: true }).click();
  await expect(page.getByRole("alert")).toHaveText(
    "Something went wrong. Please try again.",
  );
  await expect(page.getByLabel("Your message")).toHaveValue(contact.message);
  expect(
    (await (await request.get(`${fixture}/__test/messages`)).json()).length,
  ).toBe(1);
});

test("authenticated non-admins and revoked admins are denied, even with admin user metadata", async ({
  page,
  request,
  context,
}) => {
  const cookies: { name: string; value: string }[] = [];
  const supabase = createServerClient(fixture, "local-test-anon-key", {
    cookies: {
      getAll: () => cookies,
      setAll(values) {
        cookies.splice(0, cookies.length, ...values);
      },
    },
  });
  await supabase.auth.signInWithPassword({
    email: "member@example.com",
    password: "local-test-password",
  });
  await context.addCookies(
    cookies.map((cookie) => ({
      name: cookie.name,
      value: cookie.value,
      domain: "127.0.0.1",
      path: "/",
      httpOnly: true,
    })),
  );
  expect((await page.request.get("/api/admin/messages")).status()).toBe(403);
  const id = "33333333-3333-4333-8333-333333333333";
  expect(
    (
      await page.request.patch(`/api/admin/messages/${id}`, {
        headers: { Origin: origin },
        data: { status: "read" },
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await page.request.delete(`/api/admin/messages/${id}`, {
        headers: { Origin: origin },
      })
    ).status(),
  ).toBe(403);
  await page.goto("/admin/messages");
  await expect(page).toHaveURL(/\/admin\/login$/);
  expect(
    (
      await page.request.post("/api/admin/login", {
        headers: { Origin: origin },
        data: { email: "member@example.com", password: "local-test-password" },
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await page.request.post("/api/admin/login", {
        headers: { Origin: origin },
        data: { email: "admin@example.com", password: "local-test-password" },
      })
    ).status(),
  ).toBe(200);
  const response = await page.request.get("/api/admin/messages");
  expect(response.status()).toBe(200);
  expect(response.headers()["cache-control"]).toContain("no-store");
  expect(
    (
      await page.request.patch(`/api/admin/messages/${id}`, {
        headers: { Origin: "https://untrusted.example" },
        data: { status: "read" },
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await page.request.patch(`/api/admin/messages/${id}`, {
        headers: { Origin: origin },
        data: { status: "bad" },
      })
    ).status(),
  ).toBe(400);
  await request.post(`${fixture}/__test/control`, {
    data: { adminEnabled: false },
  });
  expect((await page.request.get("/api/admin/messages")).status()).toBe(403);
});

test("pagination and search operate across the whole inbox", async ({
  page,
  request,
}) => {
  await request.post(`${fixture}/__test/seed`, { data: { count: 23 } });
  await page.request.post("/api/admin/login", {
    headers: { Origin: origin },
    data: { email: "admin@example.com", password: "local-test-password" },
  });
  await page.goto("/admin/messages");
  await expect(page.locator("tbody tr")).toHaveCount(20);
  await expect(page.getByText("24 messages · Page 1 of 2")).toBeVisible();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.locator("tbody tr")).toHaveCount(4);
  await page
    .getByLabel("Search messages", { exact: true })
    .fill("Earlier Contact");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await expect(page.getByText("1 message · Page 1 of 1")).toBeVisible();
  await page.getByLabel("Search messages", { exact: true }).fill("not-present");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "No matching messages" }),
  ).toBeVisible();
});
