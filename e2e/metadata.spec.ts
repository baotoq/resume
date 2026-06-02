import { expect, test } from "@playwright/test";

test.describe("page metadata", () => {
  test("has a non-empty document title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/.+/);
  });

  test("Open Graph title matches the document title", async ({ page }) => {
    await page.goto("/");
    const title = await page.title();
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      title,
    );
  });

  test("has a substantive meta description", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /.{40,}/,
    );
  });

  test("declares the profile Open Graph type", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
      "content",
      "profile",
    );
  });

  test("Open Graph url points at the site origin", async ({ page }) => {
    await page.goto("/");
    // siteUrl falls back to the local origin (NEXT_PUBLIC_SITE_URL unset).
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      /localhost:3000/,
    );
  });

  test("has a Twitter summary card", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
  });

  test("has a canonical link to the site origin", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /localhost:3000/,
    );
  });

  test("allows indexing via robots meta", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /index/,
    );
  });

  test("html lang is en", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });
});
