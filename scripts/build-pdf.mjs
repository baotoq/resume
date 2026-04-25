// scripts/build-pdf.mjs
//
// Build-time PDF capture. Assumes `next build` has already produced .next/.
// Boots `next start` on port 4321, opens it in headless Chromium with
// data-print + reducedMotion emulation, writes A4 and Letter PDFs to public/,
// validates each output (magic-byte + min size), and tears the server down.

import { spawn } from "node:child_process";
import { readFileSync, statSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";
import { chromium } from "@playwright/test";

const PORT = 4321;
const BASE = `http://localhost:${PORT}`;
const BOOT_TRIES = 60;
const BOOT_DELAY_MS = 500;

const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
  stdio: ["ignore", "inherit", "inherit"],
  env: process.env,
});

let serverExited = false;
let serverExitCode = null;
server.on("exit", (code) => {
  serverExited = true;
  serverExitCode = code;
});

try {
  let ready = false;
  for (let i = 0; i < BOOT_TRIES; i++) {
    if (serverExited) {
      throw new Error(
        `next start exited prematurely with code ${serverExitCode} (port ${PORT} already in use?)`,
      );
    }
    try {
      const r = await fetch(BASE);
      if (r.ok) {
        ready = true;
        break;
      }
    } catch {
      /* not up yet */
    }
    await sleep(BOOT_DELAY_MS);
  }
  if (!ready) {
    throw new Error(
      `next start did not become ready at ${BASE} within ${(BOOT_TRIES * BOOT_DELAY_MS) / 1000}s`,
    );
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 900, height: 1200 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();

  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    document.documentElement.setAttribute("data-print", "");
  });
  await page.evaluate(() => document.fonts.ready);

  const common = {
    printBackground: true,
    preferCSSPageSize: false,
    margin: { top: "12mm", right: "12mm", bottom: "12mm", left: "12mm" },
  };
  const targets = [
    { format: "A4", path: "public/to-quoc-bao-resume-a4.pdf" },
    { format: "Letter", path: "public/to-quoc-bao-resume-letter.pdf" },
  ];

  for (const t of targets) {
    await page.pdf({ ...common, ...t });
    const buf = readFileSync(t.path);
    const head = buf.subarray(0, 4).toString("ascii");
    if (head !== "%PDF" || statSync(t.path).size < 1024) {
      throw new Error(
        `Invalid PDF written: ${t.path} (head=${head}, size=${statSync(t.path).size})`,
      );
    }
    console.log(`✓ ${t.path} (${statSync(t.path).size} bytes)`);
  }

  await browser.close();
} finally {
  server.kill("SIGTERM");
}
