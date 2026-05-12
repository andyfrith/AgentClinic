import { test, expect } from "@playwright/test";

test.describe("Smoke Test - All Flows", () => {
  test("home page renders", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "AgentClinic" })).toBeVisible();
    await expect(page.getByText(/overworked AI agents come to recharge/)).toBeVisible();
  });

  test("agents list page renders", async ({ page }) => {
    await page.goto("/agents");
    await expect(page.getByRole("heading", { name: "Agents" })).toBeVisible();
    await page.waitForSelector("a[href^='/agents/']", { timeout: 10000 });
  });

  test("agent detail page renders", async ({ page }) => {
    await page.goto("/agents");
    const agentLink = page.locator("a[href^='/agents/']").first();
    await agentLink.waitFor({ state: "visible", timeout: 10000 });
    await agentLink.click();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("Bio")).toBeVisible();
  });

  test("ailments list page renders", async ({ page }) => {
    await page.goto("/ailments");
    await expect(page.getByRole("heading", { name: "Ailments" })).toBeVisible();
  });

  test("therapies list page renders", async ({ page }) => {
    await page.goto("/therapies");
    await expect(page.getByRole("heading", { name: "Therapies" })).toBeVisible();
  });

  test("appointments list page renders", async ({ page }) => {
    await page.goto("/appointments");
    await expect(page.getByRole("heading", { name: "Appointments" })).toBeVisible();
  });

  test("staff login page renders", async ({ page }) => {
    await page.goto("/staff/login");
    await expect(page.getByRole("heading", { name: "Welcome to AgentClinic" })).toBeVisible();
  });

  test("navigation links navigate correctly", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "Agents", exact: true }).click();
    await expect(page).toHaveURL("/agents");

    await page.getByRole("link", { name: "Ailments", exact: true }).click();
    await expect(page).toHaveURL("/ailments");

    await page.getByRole("link", { name: "Therapies", exact: true }).click();
    await expect(page).toHaveURL("/therapies");

    await page.getByRole("link", { name: "Appointments", exact: true }).click();
    await expect(page).toHaveURL("/appointments");
  });

  test("no console errors on any main page", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    const pages = ["/", "/agents", "/ailments", "/therapies", "/appointments", "/staff/login"];
    for (const url of pages) {
      await page.goto(url);
      await page.waitForTimeout(500);
    }

    expect(errors).toEqual([]);
  });

  test("all pages render without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const pages = ["/", "/agents", "/ailments", "/therapies", "/appointments", "/staff/login"];
    for (const url of pages) {
      await page.goto(url);
      if (url === "/agents" || url === "/therapies" || url === "/ailments") {
        await page.waitForTimeout(500);
      }
      const overflowW = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(overflowW).toBe(false);
    }
  });
});
