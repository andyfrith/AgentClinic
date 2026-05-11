import { test, expect } from "@playwright/test";

test.describe("AgentClinic E2E", () => {
  test("homepage displays title and navigates to agents", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "AgentClinic" })).toBeVisible();
    await expect(page.getByText(/overworked AI agents come to recharge/)).toBeVisible();

    await page.getByRole("link", { name: "View Agents" }).click();
    await expect(page).toHaveURL("/agents");
    await expect(page.getByRole("heading", { name: "Agents" })).toBeVisible();
  });

  test("header navigation links work", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "Agents", exact: true }).click();
    await expect(page).toHaveURL("/agents");

    await page.getByRole("link", { name: "AgentClinic" }).first().click();
    await expect(page).toHaveURL("/");

    await page.getByRole("link", { name: "Ailments", exact: true }).click();
    await expect(page).toHaveURL("/ailments");

    await page.getByRole("link", { name: "AgentClinic" }).first().click();
    await expect(page).toHaveURL("/");

    await page.getByRole("link", { name: "Therapies", exact: true }).click();
    await expect(page).toHaveURL("/therapies");
  });

  test("agents page loads and displays agent cards", async ({ page }) => {
    await page.goto("/agents");

    await expect(page.getByRole("heading", { name: "Agents" })).toBeVisible();

    await page.waitForSelector("a[href^='/agents/']", { timeout: 10000 });

    const agentLinks = page.getByRole("link").filter({ has: page.locator("[data-slot='card']") });
    const count = await agentLinks.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("clicking an agent card navigates to detail page", async ({ page }) => {
    await page.goto("/agents");

    const agentLink = page.locator("a[href^='/agents/']").first();
    await agentLink.waitFor({ state: "visible", timeout: 10000 });
    await agentLink.click();

    await expect(page).toHaveURL(/\/agents\/\d+/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("agent detail page shows agent info", async ({ page }) => {
    await page.goto("/agents");

    const agentLink = page.locator("a[href^='/agents/']").first();
    await agentLink.waitFor({ state: "visible", timeout: 10000 });

    const agentName = await agentLink.locator("[data-slot='card-title']").textContent();
    await agentLink.click();

    await expect(page.getByRole("heading", { level: 1, name: agentName!.trim() })).toBeVisible();
    await expect(page.getByText("Bio")).toBeVisible();
    await expect(page.getByText("Status:")).toBeVisible();
  });

  test("agent detail has back link to agents list", async ({ page }) => {
    await page.goto("/agents");

    const agentLink = page.locator("a[href^='/agents/']").first();
    await agentLink.waitFor({ state: "visible", timeout: 10000 });
    await agentLink.click();

    await page.getByText("Back to Agents").click();
    await expect(page).toHaveURL("/agents");
  });
});

test.describe("Responsive Design", () => {
  const viewports = [
    { width: 375, height: 667, name: "mobile" },
    { width: 768, height: 1024, name: "tablet" },
    { width: 1280, height: 800, name: "desktop" },
  ];

  for (const vp of viewports) {
    test(`homepage renders without horizontal overflow at ${vp.name} (${vp.width}px)`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/");
      await expect(page.getByRole("heading", { name: "AgentClinic" })).toBeVisible();
      const overflowW = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(overflowW).toBe(false);
    });

    test(`agents page renders without horizontal overflow at ${vp.name} (${vp.width}px)`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/agents");
      await page.waitForSelector("a[href^='/agents/']", { timeout: 10000 });
      const overflowW = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(overflowW).toBe(false);
    });

    test(`agent detail page renders without horizontal overflow at ${vp.name} (${vp.width}px)`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/agents");
      const agentLink = page.locator("a[href^='/agents/']").first();
      await agentLink.waitFor({ state: "visible", timeout: 10000 });
      await agentLink.click();
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      const overflowW = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(overflowW).toBe(false);
    });

    test(`ailments page renders without horizontal overflow at ${vp.name} (${vp.width}px)`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/ailments");
      await page.waitForSelector("a[href^='/ailments/']", { timeout: 10000 });
      const overflowW = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(overflowW).toBe(false);
    });

    test(`therapies page renders without horizontal overflow at ${vp.name} (${vp.width}px)`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/therapies");
      await page.waitForSelector("a[href^='/therapies/']", { timeout: 10000 });
      const overflowW = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(overflowW).toBe(false);
    });
  }
});
