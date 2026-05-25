import { expect, test } from "@playwright/test";

const IGNORED_ERRORS = [
  // React dev-mode CSP noise — not an app error
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
  page.on("pageerror", (err) => {
    if (!IGNORED_ERRORS.some((r) => r.test(err.message))) {
      errors.push(err.message);
    }
  });
  return errors;
}

test.describe("image lightbox", () => {
  test("opens lightbox when gallery thumbnail is clicked", async ({ page }) => {
    const consoleErrors = captureErrors(page);

    await page.goto("/");

    await page
      .getByRole("button", { name: /project screenshot 1/i })
      .first()
      .click();

    await expect(page.getByRole("dialog")).toBeVisible();

    expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
  });

  test("shows counter with correct initial index", async ({ page }) => {
    const consoleErrors = captureErrors(page);

    await page.goto("/");

    await page
      .getByRole("button", { name: /project screenshot 1/i })
      .first()
      .click();

    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText("1 / 3")).toBeVisible();

    expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
  });

  test("navigates to next image with next button", async ({ page }) => {
    const consoleErrors = captureErrors(page);

    await page.goto("/");

    await page
      .getByRole("button", { name: /project screenshot 1/i })
      .first()
      .click();

    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText("1 / 3")).toBeVisible();

    await page.getByRole("button", { name: /next image/i }).click();
    await expect(page.getByText("2 / 3")).toBeVisible();

    expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
  });

  test("navigates to previous image with previous button", async ({ page }) => {
    const consoleErrors = captureErrors(page);

    await page.goto("/");

    await page
      .getByRole("button", { name: /project screenshot 1/i })
      .first()
      .click();

    await expect(page.getByRole("dialog")).toBeVisible();

    await page.getByRole("button", { name: /next image/i }).click();
    await expect(page.getByText("2 / 3")).toBeVisible();

    await page.getByRole("button", { name: /previous image/i }).click();
    await expect(page.getByText("1 / 3")).toBeVisible();

    expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
  });

  test("wraps from last to first image", async ({ page }) => {
    const consoleErrors = captureErrors(page);

    await page.goto("/");

    await page
      .getByRole("button", { name: /project screenshot 3/i })
      .first()
      .click();

    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText("3 / 3")).toBeVisible();

    await page.getByRole("button", { name: /next image/i }).click();
    await expect(page.getByText("1 / 3")).toBeVisible();

    expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
  });

  test("closes lightbox with close button", async ({ page }) => {
    const consoleErrors = captureErrors(page);

    await page.goto("/");

    await page
      .getByRole("button", { name: /project screenshot 1/i })
      .first()
      .click();

    await expect(page.getByRole("dialog")).toBeVisible();

    await page.getByRole("button", { name: /close lightbox/i }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();

    expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
  });

  test("closes lightbox with Escape key", async ({ page }) => {
    const consoleErrors = captureErrors(page);

    await page.goto("/");

    await page
      .getByRole("button", { name: /project screenshot 1/i })
      .first()
      .click();

    await expect(page.getByRole("dialog")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();

    expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
  });

  test("navigates with keyboard arrow keys", async ({ page }) => {
    const consoleErrors = captureErrors(page);

    await page.goto("/");

    await page
      .getByRole("button", { name: /project screenshot 1/i })
      .first()
      .click();

    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText("1 / 3")).toBeVisible();

    await page.keyboard.press("ArrowRight");
    await expect(page.getByText("2 / 3")).toBeVisible();

    await page.keyboard.press("ArrowLeft");
    await expect(page.getByText("1 / 3")).toBeVisible();

    expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
  });

  test("opens at correct index when second thumbnail clicked", async ({
    page,
  }) => {
    const consoleErrors = captureErrors(page);

    await page.goto("/");

    await page
      .getByRole("button", { name: /project screenshot 2/i })
      .first()
      .click();

    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText("2 / 3")).toBeVisible();

    expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
  });
});
