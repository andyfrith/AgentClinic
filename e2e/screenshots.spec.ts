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

    await expect(page.getByRole("heading", { name: "AgentClinic" })).toBeVisible();
    const h1 = page.getByRole("heading", { name: "AgentClinic" });
    await expect(h1).toHaveCSS("opacity", "1");

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

    await expect(page.getByRole("heading", { name: "Agents" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Agents" })).toHaveCSS("opacity", "1");
    const agentLink = page.locator("a[href^='/agents/']").first();
    await expect(agentLink).toBeVisible();
    await expect(agentLink).toHaveCSS("opacity", "1");

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
    const agentName = await agentLink.locator("[data-slot='card-title']").textContent();
    await agentLink.click();
    await page.waitForLoadState("networkidle");
    await waitForAnimations(page);

    await expect(page.getByRole("heading", { level: 1, name: agentName!.trim() })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveCSS("opacity", "1");
    await expect(page.getByText("Bio")).toBeVisible();
    await expect(page.getByText("Status:")).toBeVisible();

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "agent-detail.png"),
      fullPage: true,
    });
  });
});
