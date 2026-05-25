import { expect, test } from "@playwright/test";

const IGNORED_ERRORS = [
  // React dev-mode warning, not a real error
  /eval\(\) is not supported in this environment/,
];

function captureErrors(page: import("@playwright/test").Page): string[] {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (
      msg.type() === "error" &&
      !IGNORED_ERRORS.some((r) => r.test(msg.text()))
    ) {
      errors.push(msg.text());
    }
  });
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
}

test.describe("contact pills row", () => {
  test("renders all contact pills with no console errors", async ({ page }) => {
    const consoleErrors = captureErrors(page);

    await page.goto("/");

    await expect(
      page.getByRole("link", { name: "GitHub profile" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "LinkedIn profile" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Download resume as PDF" }),
    ).toBeVisible();

    expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
  });

  test("email pill is visible when EMAIL env is set", async ({ page }) => {
    test.skip(
      !process.env.EMAIL,
      "EMAIL env not set — skipping email pill assertion",
    );

    const consoleErrors = captureErrors(page);

    await page.goto("/");

    const emailBtn = page.getByRole("button", { name: /copy email/i });
    await expect(emailBtn).toBeVisible();

    expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
  });

  test("email pill copies email to clipboard", async ({ page, context }) => {
    const expected = process.env.EMAIL;
    test.skip(!expected, "EMAIL env not set — skipping clipboard assertion");

    const consoleErrors = captureErrors(page);

    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");

    const emailBtn = page.getByRole("button", { name: /copy email/i });
    await emailBtn.click();

    const clip = await page.evaluate(() => navigator.clipboard.readText());
    expect(clip).toBe(expected);

    expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
  });

  test("email pill shows copied feedback after click", async ({
    page,
    context,
  }) => {
    test.skip(
      !process.env.EMAIL,
      "EMAIL env not set — skipping copied feedback assertion",
    );

    const consoleErrors = captureErrors(page);

    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");

    const emailBtn = page.getByRole("button", { name: /copy email/i });
    await emailBtn.click();

    await expect(
      page.getByRole("button", { name: /email copied/i }),
    ).toBeVisible();

    expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
  });

  test("GitHub link points to correct profile URL", async ({ page }) => {
    const consoleErrors = captureErrors(page);

    await page.goto("/");

    const githubLink = page.getByRole("link", { name: "GitHub profile" });
    await expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/baotoq",
    );
    await expect(githubLink).toHaveAttribute("target", "_blank");
    await expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");

    expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
  });

  test("LinkedIn link points to correct profile URL", async ({ page }) => {
    const consoleErrors = captureErrors(page);

    await page.goto("/");

    const linkedinLink = page.getByRole("link", { name: "LinkedIn profile" });
    await expect(linkedinLink).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/baotoq",
    );
    await expect(linkedinLink).toHaveAttribute("target", "_blank");
    await expect(linkedinLink).toHaveAttribute("rel", "noopener noreferrer");

    expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
  });

  test("download PDF link has correct href and download attribute", async ({
    page,
  }) => {
    const consoleErrors = captureErrors(page);

    await page.goto("/");

    const downloadLink = page.getByRole("link", {
      name: "Download resume as PDF",
    });
    await expect(downloadLink).toHaveAttribute(
      "href",
      "/to-quoc-bao-resume.pdf",
    );
    await expect(downloadLink).toHaveAttribute("download", "");

    expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
  });

  test("phone pill is visible when PHONE env is set", async ({ page }) => {
    test.skip(
      !process.env.PHONE,
      "PHONE env not set — skipping phone pill assertion",
    );

    const consoleErrors = captureErrors(page);

    await page.goto("/");

    const phoneLink = page.getByRole("link", { name: "Phone" });
    await expect(phoneLink).toBeVisible();
    await expect(phoneLink).toHaveAttribute("href", `tel:${process.env.PHONE}`);

    expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
  });
});
