import { expect, test } from "@playwright/test";

const IGNORED_ERRORS = [
  // React dev mode warning — not a real error
  "eval() is not supported in this environment",
];

function captureErrors(page: import("@playwright/test").Page): string[] {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (
      msg.type() === "error" &&
      !IGNORED_ERRORS.some((s) => msg.text().includes(s))
    ) {
      errors.push(msg.text());
    }
  });
  page.on("pageerror", (err) => {
    if (!IGNORED_ERRORS.some((s) => err.message.includes(s))) {
      errors.push(err.message);
    }
  });
  return errors;
}

test.describe("sections rendering and accessibility", () => {
  test("page has skip-to-main link targeting #main", async ({ page }) => {
    const consoleErrors = captureErrors(page);

    await page.goto("/");

    const skipLink = page.locator('a[href="#main"]');
    await expect(skipLink).toBeAttached();

    expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
  });

  test("JSON-LD script contains correct person schema", async ({ page }) => {
    const consoleErrors = captureErrors(page);

    await page.goto("/");

    const scriptEl = page.locator('script[type="application/ld+json"]');
    await expect(scriptEl).toBeAttached();

    const raw = await scriptEl.textContent();
    const schema = JSON.parse(raw ?? "{}");

    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("Person");
    expect(schema.name).toBe("To Quoc Bao");
    expect(schema.jobTitle).toBe("Senior Software Engineer");

    expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
  });

  test("Work Experience section renders 4 entries", async ({ page }) => {
    const consoleErrors = captureErrors(page);

    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /work experience/i }),
    ).toBeVisible();

    const workSection = page.locator("section").filter({
      has: page.getByRole("heading", { name: /work experience/i }),
    });
    const articles = workSection.locator("article");
    await expect(articles).toHaveCount(4);

    expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
  });

  test("CoverGo entry shows Current badge", async ({ page }) => {
    const consoleErrors = captureErrors(page);

    await page.goto("/");

    const currentBadge = page.getByText("Current");
    await expect(currentBadge).toBeVisible();
    await expect(currentBadge).toHaveCount(1);

    expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
  });

  test("Certifications section renders KCNA entry with credly link", async ({
    page,
  }) => {
    const consoleErrors = captureErrors(page);

    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /certifications/i }),
    ).toBeVisible();

    const kcnaHeading = page.getByRole("heading", {
      name: /KCNA/i,
    });
    await expect(kcnaHeading).toBeVisible();

    const credlyLink = page.getByRole("link", {
      name: /KCNA.*opens in new tab/i,
    });
    await expect(credlyLink).toBeVisible();
    await expect(credlyLink).toHaveAttribute(
      "href",
      "https://www.credly.com/badges/78ac6d26-cc9c-4c33-a44f-eb17f044ae7f",
    );

    expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
  });

  test("Education section heading is visible", async ({ page }) => {
    const consoleErrors = captureErrors(page);

    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /education/i }),
    ).toBeVisible();

    expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
  });
});
