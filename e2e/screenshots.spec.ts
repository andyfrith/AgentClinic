import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const SCREENSHOT_DIR = path.resolve(__dirname, "..", "screenshots");
const BASELINE_DIR = path.resolve(__dirname, "..", "screenshots", "baseline");

async function waitForAnimations(page: import("@playwright/test").Page) {
  await page.waitForFunction(
    () => {
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
    },
    { timeout: 8000 }
  );
}

test.describe("Screenshot capture", () => {
  test.beforeAll(() => {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    fs.mkdirSync(BASELINE_DIR, { recursive: true });
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

  test("Ailments list page", async ({ page }) => {
    await page.goto("/ailments");
    await page.waitForLoadState("networkidle");
    await page
      .locator("a[href^='/ailments/']")
      .first()
      .waitFor({ state: "visible", timeout: 10000 });
    await waitForAnimations(page);

    await expect(page.getByRole("heading", { name: "Ailments" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Ailments" })).toHaveCSS("opacity", "1");
    const ailmentLink = page.locator("a[href^='/ailments/']").first();
    await expect(ailmentLink).toBeVisible();
    await expect(ailmentLink).toHaveCSS("opacity", "1");

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "ailments.png"),
      fullPage: true,
    });
  });

  test("Ailment detail page", async ({ page }) => {
    await page.goto("/ailments");
    await page.waitForLoadState("networkidle");

    const ailmentLink = page.locator("a[href^='/ailments/']").first();
    await ailmentLink.waitFor({ state: "visible", timeout: 10000 });
    const ailmentName = await ailmentLink.locator("[data-slot='card-title']").textContent();
    await ailmentLink.click();
    await page.waitForLoadState("networkidle");
    await waitForAnimations(page);

    await expect(page.getByRole("heading", { level: 1, name: ailmentName!.trim() })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveCSS("opacity", "1");
    await expect(page.getByText("Affected Agents")).toBeVisible();

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "ailment-detail.png"),
      fullPage: true,
    });
  });

  test("Therapies list page", async ({ page }) => {
    await page.goto("/therapies");
    await page.waitForLoadState("networkidle");
    await page
      .locator("a[href^='/therapies/']")
      .first()
      .waitFor({ state: "visible", timeout: 10000 });
    await waitForAnimations(page);

    await expect(page.getByRole("heading", { name: "Therapies" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Therapies" })).toHaveCSS("opacity", "1");
    const therapyLink = page.locator("a[href^='/therapies/']").first();
    await expect(therapyLink).toBeVisible();
    await expect(therapyLink).toHaveCSS("opacity", "1");

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "therapies.png"),
      fullPage: true,
    });
  });

  test("Therapy detail page", async ({ page }) => {
    await page.goto("/therapies");
    await page.waitForLoadState("networkidle");

    const therapyLink = page.locator("a[href^='/therapies/']").first();
    await therapyLink.waitFor({ state: "visible", timeout: 10000 });
    const therapyName = await therapyLink.locator("[data-slot='card-title']").textContent();
    await therapyLink.click();
    await page.waitForLoadState("networkidle");
    await waitForAnimations(page);

    await expect(page.getByRole("heading", { level: 1, name: therapyName!.trim() })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveCSS("opacity", "1");
    await expect(page.getByText("Side Effects")).toBeVisible();

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "therapy-detail.png"),
      fullPage: true,
    });
  });

  const staffMember = JSON.stringify({
    id: 1,
    name: "Dr. Ada",
    role: "admin",
    avatar: "DA",
    specialties: ["Cognitive", "Runtime", "Emotional"],
  });

  test("Staff login page", async ({ page }) => {
    await page.goto("/staff/login");
    await page.waitForLoadState("networkidle");
    await waitForAnimations(page);

    await expect(page.getByText("Welcome to AgentClinic")).toBeVisible();

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "staff-login.png"),
      fullPage: true,
    });
  });

  test("Staff dashboard", async ({ page }) => {
    await page.addInitScript((member) => {
      localStorage.setItem("staff", member);
    }, staffMember);

    await page.goto("/staff");
    await page.waitForLoadState("networkidle");
    await waitForAnimations(page);

    await expect(page.getByText("Dr. Ada's Dashboard")).toBeVisible();

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "staff-dashboard.png"),
      fullPage: true,
    });
  });

  test("Staff agents management page", async ({ page }) => {
    await page.addInitScript((member) => {
      localStorage.setItem("staff", member);
    }, staffMember);

    await page.goto("/staff/agents");
    await page.waitForLoadState("networkidle");
    await waitForAnimations(page);

    await expect(page.getByRole("heading", { name: "Manage Agents" })).toBeVisible();

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "staff-agents.png"),
      fullPage: true,
    });
  });

  test("Staff ailments management page", async ({ page }) => {
    await page.addInitScript((member) => {
      localStorage.setItem("staff", member);
    }, staffMember);

    await page.goto("/staff/ailments");
    await page.waitForLoadState("networkidle");
    await waitForAnimations(page);

    await expect(page.getByRole("heading", { name: "Manage Ailments" })).toBeVisible();

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "staff-ailments.png"),
      fullPage: true,
    });
  });

  test("Staff therapies management page", async ({ page }) => {
    await page.addInitScript((member) => {
      localStorage.setItem("staff", member);
    }, staffMember);

    await page.goto("/staff/therapies");
    await page.waitForLoadState("networkidle");
    await waitForAnimations(page);

    await expect(page.getByRole("heading", { name: "Manage Therapies" })).toBeVisible();

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "staff-therapies.png"),
      fullPage: true,
    });
  });

  test.describe("Visual integrity checks", () => {
    test("all screenshot files exist with minimum file size", () => {
      const expectedScreenshots = [
        "home.png",
        "agents.png",
        "agent-detail.png",
        "ailments.png",
        "ailment-detail.png",
        "therapies.png",
        "therapy-detail.png",
        "staff-login.png",
        "staff-dashboard.png",
        "staff-agents.png",
        "staff-ailments.png",
        "staff-therapies.png",
      ];
      for (const name of expectedScreenshots) {
        const filePath = path.join(SCREENSHOT_DIR, name);
        expect(fs.existsSync(filePath)).toBe(true);
        const stats = fs.statSync(filePath);
        expect(stats.size).toBeGreaterThan(1000);
      }
    });

    test("no console errors during screenshot capture", async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") errors.push(msg.text());
      });

      await page.goto("/");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(1000);

      expect(errors.filter((e) => !e.includes("favicon"))).toEqual([]);
    });
  });
});
