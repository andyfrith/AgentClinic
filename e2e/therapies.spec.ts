import { test, expect } from "@playwright/test";

test.describe("Therapies E2E", () => {
  test("therapies page loads and displays therapy cards", async ({ page }) => {
    await page.goto("/therapies");

    await expect(page.getByRole("heading", { name: "Therapies" })).toBeVisible();

    await page.waitForSelector("a[href^='/therapies/']", { timeout: 10000 });

    const therapyLinks = page.getByRole("link").filter({ has: page.locator("[data-slot='card']") });
    const count = await therapyLinks.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("clicking a therapy card navigates to detail page", async ({ page }) => {
    await page.goto("/therapies");

    const therapyLink = page.locator("a[href^='/therapies/']").first();
    await therapyLink.waitFor({ state: "visible", timeout: 10000 });
    await therapyLink.click();

    await expect(page).toHaveURL(/\/therapies\/\d+/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("therapy detail page shows info and side effects", async ({ page }) => {
    await page.goto("/therapies");

    const therapyLink = page.locator("a[href^='/therapies/']").first();
    await therapyLink.waitFor({ state: "visible", timeout: 10000 });

    const therapyName = await therapyLink.locator("[data-slot='card-title']").textContent();
    await therapyLink.click();

    await expect(page.getByRole("heading", { level: 1, name: therapyName!.trim() })).toBeVisible();
    await expect(page.getByText("Side Effects")).toBeVisible();
  });

  test("therapy detail has back link to therapies list", async ({ page }) => {
    await page.goto("/therapies");

    const therapyLink = page.locator("a[href^='/therapies/']").first();
    await therapyLink.waitFor({ state: "visible", timeout: 10000 });
    await therapyLink.click();

    await page.getByText("Back to Therapies").click();
    await expect(page).toHaveURL("/therapies");
  });
});
