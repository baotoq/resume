import { expect, test } from "@playwright/test";

test.describe("resume page smoke", () => {
  test("renders with no console errors and shows all major sections", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => consoleErrors.push(err.message));

    const response = await page.goto("/");
    expect(response?.status()).toBe(200);

    await expect(page.locator("main")).toBeVisible();

    await expect(
      page.getByRole("heading", { name: /work experience/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /education/i }),
    ).toBeVisible();

    expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
  });

  test("email pill copies EMAIL env value to clipboard", async ({
    page,
    context,
  }) => {
    const expected = process.env.EMAIL;
    test.skip(!expected, "EMAIL env not set — skipping clipboard assertion");

    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");

    const copyBtn = page.getByRole("button", { name: /copy email/i });
    await copyBtn.click();

    const clip = await page.evaluate(() => navigator.clipboard.readText());
    expect(clip).toBe(expected);
  });
});
