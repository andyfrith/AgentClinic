import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";
import type { Page } from "@playwright/test";

const SCREENSHOT_DIR = path.resolve(__dirname, "..", "screenshots");

async function waitForAnimation(page: Page, selector: string) {
  await page.waitForFunction(
    (sel: string) => {
      const el = document.querySelector(sel);
      if (!el) return false;
      const style = window.getComputedStyle(el);
      const opacity = parseFloat(style.opacity);
      const transform = style.transform;
      const isIdentity =
        transform === "none" ||
        transform === "matrix(1, 0, 0, 1, 0, 0)" ||
        transform === "translateY(0px)" ||
        transform === "";
      return opacity === 1 && isIdentity;
    },
    selector,
    { timeout: 5000 }
  );
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
    await waitForAnimation(page, "h1");
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "home.png"),
      fullPage: true,
    });
  });

  test("Agents list page", async ({ page }) => {
    await page.goto("/agents");
    await page.waitForLoadState("networkidle");
    await page.locator("a[href^='/agents/']").first().waitFor({ state: "visible", timeout: 10000 });
    await waitForAnimation(page, "h1");
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

    await waitForAnimation(page, "h1");
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "agent-detail.png"),
      fullPage: true,
    });
  });
});
