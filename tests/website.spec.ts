import { test, expect } from "@playwright/test";

test("homepage, responsive layout, filters, gallery, and contact success UI", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveTitle("ADPoly CyberGuard | Cybersecurity & AI Team");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "ADPolyCyberGuard.",
  );
  await expect(page.locator(".member-card")).toHaveCount(3);
  await page.locator("img").evaluateAll((images) =>
    images.forEach((img) => {
      if (img instanceof HTMLImageElement) img.loading = "eager";
    }),
  );
  await expect
    .poll(() =>
      page
        .locator("img")
        .evaluateAll((images) =>
          images.every(
            (img) =>
              img instanceof HTMLImageElement &&
              img.complete &&
              img.naturalWidth > 0,
          ),
        ),
    )
    .toBeTruthy();
  await page.screenshot({ path: "test-results/desktop-hero.png" });
  await page.screenshot({
    path: "test-results/desktop-home.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: "CTF", exact: true }).click();
  await expect(
    page.getByText("No CTF competitions have been added yet.", {
      exact: false,
    }),
  ).toBeVisible();
  await expect(page.locator(".competition-card")).toHaveCount(0);
  await page.getByRole("button", { name: "AI", exact: true }).click();
  await expect(page.locator(".competition-card")).toHaveCount(1);
  await page.getByRole("button", { name: "All 01", exact: true }).click();

  const photo = page.getByRole("button", {
    name: "Open photo of Abdulrahman Saeed Alnaqbi",
  });
  await photo.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("dialog figcaption")).toContainText(
    "Ahmed Alhosani",
  );
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator("dialog figcaption")).toContainText(
    "Abdulrahman Saeed Alnaqbi",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(photo).toBeFocused();

  await page.route("**/api/contact", async (route) => {
    expect(route.request().postDataJSON()).toMatchObject({
      name: "Website Test",
      email: "test@example.com",
      subject: "Project Inquiry",
    });
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({ success: true }),
    });
  });
  await page.getByRole("button", { name: "Send Message", exact: true }).click();
  await expect(page.getByRole("status")).toHaveCount(0);
  await page.getByLabel("Your name").fill("Website Test");
  await page
    .getByLabel("Organization", { exact: true })
    .fill("Test organization");
  await page.getByLabel("Email address").fill("test@example.com");
  await page.getByLabel("Subject").selectOption("Project Inquiry");
  await page.getByLabel("Your message").fill("Contact form interface test.");
  await page.getByRole("button", { name: "Send Message", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText(
    "Message sent successfully. Our team will review it soon.",
  );
  await expect(page.getByLabel("Your name")).toHaveValue("");

  for (const width of [1440, 1024, 768, 600, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    const size = await page.evaluate(() => ({
      viewport: innerWidth,
      document: document.documentElement.scrollWidth,
    }));
    expect(
      size.document,
      `Horizontal overflow at ${width}px`,
    ).toBeLessThanOrEqual(size.viewport);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(
    page
      .getByRole("navigation")
      .getByRole("link", { name: "Team", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Team", exact: true })
    .click();
  await expect(page).toHaveURL(/#team$/);
  await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.locator("img").evaluateAll((images) =>
    images.forEach((img) => {
      if (img instanceof HTMLImageElement) img.loading = "eager";
    }),
  );
  await expect
    .poll(() =>
      page
        .locator("img")
        .evaluateAll((images) =>
          images.every(
            (img) =>
              img instanceof HTMLImageElement &&
              img.complete &&
              img.naturalWidth > 0,
          ),
        ),
    )
    .toBeTruthy();
  await page.screenshot({ path: "test-results/mobile-hero.png" });
  await page.screenshot({
    path: "test-results/mobile-home.png",
    fullPage: true,
  });
  expect(errors).toEqual([]);
});

test("project and member pages, original images, sharing image, and missing routes", async ({
  page,
  request,
}) => {
  await page.goto("/projects/ai-inference-defense");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "DoS Stress-Testing",
  );
  for (const name of [
    "Problem",
    "Solution",
    "Architecture",
    "Technologies",
    "Results",
  ]) {
    await expect(
      page.getByRole("heading", { name, exact: true }),
    ).toBeVisible();
  }
  await page.screenshot({ path: "test-results/project.png", fullPage: true });
  for (const [slug, name] of [
    ["abdulrahman", "Abdulrahman Saeed Alnaqbi"],
    ["ahmed", "Ahmed Alhosani"],
    ["saif", "Saif Alazazi"],
  ]) {
    await page.goto(`/team/${slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(name);
    expect(
      await page
        .locator(".profile-portrait img")
        .evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0),
    ).toBeTruthy();
    await page.setViewportSize({ width: 320, height: 850 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(320);
  }
  const og = await request.get("/opengraph-image");
  expect(og.status()).toBe(200);
  expect(og.headers()["content-type"]).toContain("image/png");
  expect((await request.get("/team/unknown")).status()).toBe(404);
  expect((await request.get("/projects/unknown")).status()).toBe(404);
});
