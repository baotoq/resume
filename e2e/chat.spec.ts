import { expect, test } from "@playwright/test";

// The "Ask my resume" chat self-disables unless ANTHROPIC_API_KEY + the two
// UPSTASH_REDIS_REST_* vars are present AT BUILD TIME (chatEnabled is read in a
// force-static page). CI builds without them, so the trigger button is absent
// there and the interactive specs skip. When the build IS configured, the
// dialog is exercised against a MOCKED /api/chat so no real Anthropic/Upstash
// is ever contacted.
const ASK_BUTTON = /ask my resume/i;
const MOCK_ANSWER =
  "Yes — I ran Kubernetes in production with FluxCD and GitOps at Upmesh.";

async function mockChat(page: import("@playwright/test").Page) {
  await page.route("**/api/chat", async (route) => {
    await route.fulfill({
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-RateLimit-Remaining": "9",
      },
      body: MOCK_ANSWER,
    });
  });
}

test("self-disables: chat button is absent (and no console errors) when unconfigured", async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => consoleErrors.push(err.message));

  await page.goto("/");
  await expect(page.locator("main")).toBeVisible();

  const button = page.getByRole("button", { name: ASK_BUTTON });
  // A configured build renders the button — the interactive specs cover it.
  test.skip(
    (await button.count()) > 0,
    "chat configured in this build — covered by the dialog specs",
  );

  await expect(button).toHaveCount(0);
  expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
});

test("configured build: opening the dialog streams a mocked answer", async ({
  page,
}) => {
  await mockChat(page);
  await page.goto("/");

  const button = page.getByRole("button", { name: ASK_BUTTON });
  test.skip(
    (await button.count()) === 0,
    "chat not configured in this build — button self-disabled",
  );

  await button.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  // Click a suggested-question chip to send.
  await dialog
    .getByRole("button", { name: /kubernetes/i })
    .first()
    .click();

  await expect(page.getByText(MOCK_ANSWER)).toBeVisible();
  // "N questions left today" appears only after the first response.
  await expect(page.getByText(/9 questions left today/i)).toBeVisible();

  // Thread persists across close/reopen within the session.
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await button.click();
  await expect(page.getByText(MOCK_ANSWER)).toBeVisible();
});

test("configured build: chat trigger is hidden in print", async ({ page }) => {
  await page.goto("/");
  const button = page.getByRole("button", { name: ASK_BUTTON });
  test.skip(
    (await button.count()) === 0,
    "chat not configured in this build — button self-disabled",
  );

  await expect(button).toBeVisible();
  await page.emulateMedia({ media: "print" });
  await expect(button).toBeHidden();
});
