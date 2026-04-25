import { expect, test } from "@playwright/test";

test.describe("print mode visual state", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ media: "screen", reducedMotion: "reduce" });
    await page.goto("/");
    await page.evaluate(() => {
      document.documentElement.setAttribute("data-print", "");
    });
  });

  test("html has data-print attribute", async ({ page }) => {
    await expect(page.locator("html")).toHaveAttribute("data-print", "");
  });

  test("download pill is hidden", async ({ page }) => {
    await expect(page.locator("[data-pdf-trigger]")).toBeHidden();
  });

  test("page grain pseudo-element is hidden", async ({ page }) => {
    const display = await page.evaluate(() => {
      const main = document.querySelector("main");
      if (!main) return null;
      return window.getComputedStyle(main, "::before").display;
    });
    expect(display).toBe("none");
  });

  test("pulse ring animation is suppressed under reducedMotion", async ({
    page,
  }) => {
    const animationName = await page.evaluate(() => {
      const el = document.querySelector('[class*="animatePulseRing"]');
      if (!el) return null;
      return window.getComputedStyle(el).animationName;
    });
    if (animationName !== null) {
      expect(animationName).toBe("none");
    }
  });

  test("AnimateIn wrappers are not stuck at opacity 0", async ({ page }) => {
    const wrappers = page.locator("main div").filter({
      has: page.locator("section"),
    });
    const count = await wrappers.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(wrappers.nth(i)).toHaveCSS("opacity", "1");
    }
  });
});
