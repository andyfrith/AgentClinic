import { test, expect } from "@playwright/test";

test.describe("Appointments E2E", () => {
  test("appointments page loads and displays appointment cards", async ({ page }) => {
    await page.goto("/appointments");

    await expect(page.getByRole("heading", { name: "Appointments" })).toBeVisible();
    await expect(page.getByRole("link", { name: "New Appointment" })).toBeVisible({
      timeout: 10000,
    });

    const appointmentLinks = page
      .locator("a[href^='/appointments/']")
      .filter({ has: page.locator("[data-slot='card']") });
    const count = await appointmentLinks.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("clicking an appointment navigates to detail page", async ({ page }) => {
    await page.goto("/appointments");

    const appointmentLink = page
      .locator("a[href^='/appointments/']")
      .filter({ has: page.locator("[data-slot='card']") })
      .first();
    await appointmentLink.waitFor({ state: "visible", timeout: 10000 });
    await appointmentLink.click();

    await expect(page).toHaveURL(/\/appointments\/\d+/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("new appointment page has a form", async ({ page }) => {
    await page.goto("/appointments/new");

    await expect(page.getByRole("heading", { name: "New Appointment" })).toBeVisible();
    await expect(page.getByLabel("Agent")).toBeVisible();
    await expect(page.getByLabel("Ailment")).toBeVisible();
    await expect(page.getByLabel("Therapy")).toBeVisible();
    await expect(page.getByLabel(/Date & Time/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Book Appointment" })).toBeVisible();
  });

  test("appointment detail shows status badge", async ({ page }) => {
    await page.goto("/appointments");

    const appointmentLink = page
      .locator("a[href^='/appointments/']")
      .filter({ has: page.locator("[data-slot='card']") })
      .first();
    await appointmentLink.waitFor({ state: "visible", timeout: 10000 });
    await appointmentLink.click();

    await expect(page).toHaveURL(/\/appointments\/\d+/);
    await expect(page.getByText("scheduled")).toBeVisible();
  });
});
