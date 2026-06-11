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

// Captured verbatim from streamText(...).toUIMessageStreamResponse() with the
// AI SDK's MockLanguageModelV3 — the real UI message stream wire format.
const STREAM_BODY = [
  '{"type":"start"}',
  '{"type":"start-step"}',
  '{"type":"text-start","id":"t1"}',
  '{"type":"text-delta","id":"t1","delta":"I have run Kubernetes in production."}',
  '{"type":"text-end","id":"t1"}',
  '{"type":"finish-step"}',
  '{"type":"finish","finishReason":"stop","messageMetadata":{"remaining":9}}',
  "[DONE]",
]
  .map((chunk) => `data: ${chunk}\n\n`)
  .join("");

const STREAM_HEADERS = {
  "content-type": "text/event-stream",
  "cache-control": "no-cache",
  connection: "keep-alive",
  "x-vercel-ai-ui-message-stream": "v1",
  "x-accel-buffering": "no",
};

async function mockChatApi(page: import("@playwright/test").Page) {
  await page.route("**/api/chat", (route) =>
    route.fulfill({ status: 200, headers: STREAM_HEADERS, body: STREAM_BODY }),
  );
}

const chatEnvSet = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
);

test.describe("ask my resume chat", () => {
  test("self-disables without chat env", async ({ page }) => {
    const consoleErrors = captureErrors(page);

    await page.goto("/");

    // The page must render fine whether or not the chat build env was set.
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const chatButton = page.getByRole("button", { name: /ask my resume/i });
    if (process.env.CI) {
      // CI launches the webServer itself, so its env matches the test process —
      // assert the feature flag deterministically.
      await expect(chatButton).toHaveCount(chatEnvSet ? 1 : 0);
    } else {
      // A reused local dev server may have different env than the test process,
      // so only check the page tolerates whichever state it's in.
      const present = (await chatButton.count()) > 0;
      if (!present) {
        await expect(chatButton).toHaveCount(0);
      }
    }

    expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
  });

  test("ask a question, stream the answer, thread persists across reopen", async ({
    page,
  }) => {
    const consoleErrors = captureErrors(page);

    await mockChatApi(page);
    await page.goto("/");

    const chatButton = page.getByRole("button", { name: /ask my resume/i });
    const present = (await chatButton.count()) > 0;
    test.skip(!present, "chat disabled in this environment");

    await chatButton.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    // Empty state shows suggested-question chips.
    await expect(
      dialog.getByRole("button", { name: /kubernetes|k8s/i }),
    ).toBeVisible();

    const input = dialog.getByRole("textbox");
    await input.fill("Have you used Kubernetes?");
    await input.press("Enter");

    await expect(
      dialog.getByText("I have run Kubernetes in production."),
    ).toBeVisible();
    await expect(dialog.getByText(/9 questions left today/i)).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();

    await chatButton.click();
    await expect(
      page
        .getByRole("dialog")
        .getByText("I have run Kubernetes in production."),
    ).toBeVisible();

    expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
  });

  test("suggestion chip sends a question", async ({ page }) => {
    const consoleErrors = captureErrors(page);

    await mockChatApi(page);
    await page.goto("/");

    const chatButton = page.getByRole("button", { name: /ask my resume/i });
    const present = (await chatButton.count()) > 0;
    test.skip(!present, "chat disabled in this environment");

    await chatButton.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await dialog.getByRole("button", { name: /kubernetes|k8s/i }).click();

    await expect(
      dialog.getByText("I have run Kubernetes in production."),
    ).toBeVisible();
    await expect(dialog.getByText(/9 questions left today/i)).toBeVisible();

    expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
  });

  test("ask-my-resume button is hidden in print mode", async ({ page }) => {
    const consoleErrors = captureErrors(page);

    await page.emulateMedia({ media: "screen", reducedMotion: "reduce" });
    await page.goto("/");

    const chatButton = page.getByRole("button", { name: /ask my resume/i });
    const present = (await chatButton.count()) > 0;
    test.skip(!present, "chat disabled in this environment");

    await expect(chatButton).toBeVisible();

    // Browser print path: the print:hidden Tailwind variant must hide the button.
    await page.emulateMedia({ media: "print" });
    await expect(chatButton).toBeHidden();
    await page.emulateMedia({ media: "screen" });
    await expect(chatButton).toBeVisible();

    // PDF generation path: the [data-print] mechanism must also hide it.
    await page.evaluate(() => {
      document.documentElement.setAttribute("data-print", "");
    });

    await expect(chatButton).toBeHidden();

    expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
  });
});
