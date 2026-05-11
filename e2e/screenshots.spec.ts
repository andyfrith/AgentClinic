import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const SCREENSHOT_DIR = path.resolve(__dirname, "..", "screenshots");

async function waitForAnimations(page: import("@playwright/test").Page) {
  await page.waitForFunction(() => {
    const all = document.querySelectorAll<HTMLElement>("[style*='opacity']");
    for (const el of all) {
      const raw = el.getAttribute("style") || "";
      const m = raw.match(/opacity:\s*([\d.]+)/);
      if (m) {
        const v = parseFloat(m[1]);
        if (!isNaN(v) && v > 0 && v < 1) return false;
      }
    }
    return true;
  }, { timeout: 8000 });
}

test.describe("Screenshot capture", () => {
  test.beforeAll(() => {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  });

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
  });

  test("Home page", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await waitForAnimations(page);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "home.png"),
      fullPage: true,
    });
  });

  test("Agents list page", async ({ page }) => {
    await page.goto("/agents");
    await page.waitForLoadState("networkidle");
    await page.locator("a[href^='/agents/']").first().waitFor({ state: "visible", timeout: 10000 });
    await waitForAnimations(page);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "agents.png"),
      fullPage: true,
    });
  });

  test("Agent detail page", async ({ page }) => {
    await page.goto("/agents");
    await page.waitForLoadState("networkidle");

    const agentLink = page.locator("a[href^='/agents/']").first();
    await agentLink.waitFor({ state: "visible", timeout: 10000 });
    await agentLink.click();
    await page.waitForLoadState("networkidle");

    await waitForAnimations(page);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "agent-detail.png"),
      fullPage: true,
    });
  });
});
