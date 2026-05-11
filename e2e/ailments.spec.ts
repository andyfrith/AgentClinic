import { test, expect } from "@playwright/test";

test.describe("Ailments E2E", () => {
  test("ailments page loads and displays ailment cards", async ({ page }) => {
    await page.goto("/ailments");

    await expect(page.getByRole("heading", { name: "Ailments" })).toBeVisible();

    await page.waitForSelector("a[href^='/ailments/']", { timeout: 10000 });

    const ailmentLinks = page.getByRole("link").filter({ has: page.locator("[data-slot='card']") });
    const count = await ailmentLinks.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("clicking an ailment card navigates to detail page", async ({ page }) => {
    await page.goto("/ailments");

    const ailmentLink = page.locator("a[href^='/ailments/']").first();
    await ailmentLink.waitFor({ state: "visible", timeout: 10000 });
    await ailmentLink.click();

    await expect(page).toHaveURL(/\/ailments\/\d+/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("ailment detail page shows info and relations", async ({ page }) => {
    await page.goto("/ailments");

    const ailmentLink = page.locator("a[href^='/ailments/']").first();
    await ailmentLink.waitFor({ state: "visible", timeout: 10000 });

    const ailmentName = await ailmentLink.locator("[data-slot='card-title']").textContent();
    await ailmentLink.click();

    await expect(page.getByRole("heading", { level: 1, name: ailmentName!.trim() })).toBeVisible();
    await expect(page.getByText("Affected Agents")).toBeVisible();
  });

  test("ailment detail has back link to ailments list", async ({ page }) => {
    await page.goto("/ailments");

    const ailmentLink = page.locator("a[href^='/ailments/']").first();
    await ailmentLink.waitFor({ state: "visible", timeout: 10000 });
    await ailmentLink.click();

    await page.getByText("Back to Ailments").click();
    await expect(page).toHaveURL("/ailments");
  });
});
