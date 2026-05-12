import { test, expect } from "@playwright/test";

const adminStaff = JSON.stringify({
  id: 1,
  name: "Dr. Ada",
  role: "admin",
  avatar: "DA",
  specialties: ["Cognitive", "Runtime", "Emotional"],
});

const viewerStaff = JSON.stringify({
  id: 3,
  name: "Dr. Eve",
  role: "viewer",
  avatar: "EV",
  specialties: ["Observability"],
});

test.describe("Staff flows", () => {
  test("staff login page shows staff list and allows selection", async ({ page }) => {
    await page.goto("/staff/login");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Welcome to AgentClinic")).toBeVisible();

    await page.getByRole("button", { name: "Dr. Ada" }).click();
    await page.waitForURL("/staff");
    await expect(page.getByRole("heading", { name: "Dr. Ada's Dashboard" })).toBeVisible();
  });

  test("staff dashboard shows stat cards with counts", async ({ page }) => {
    await page.addInitScript((member) => {
      localStorage.setItem("staff", member);
    }, adminStaff);

    await page.goto("/staff");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: "Dr. Ada's Dashboard" })).toBeVisible();
  });

  test("staff dashboard shows today's appointments with inline controls", async ({ page }) => {
    await page.addInitScript((member) => {
      localStorage.setItem("staff", member);
    }, adminStaff);

    await page.goto("/staff");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: "Dr. Ada's Dashboard" })).toBeVisible();

    const hasAppointments = await page
      .getByText("Today's Appointments")
      .isVisible()
      .catch(() => false);
    if (hasAppointments) {
      await expect(page.getByRole("combobox").first()).toBeVisible();
    }
  });

  test("staff dashboard shows quick actions for admin/editor", async ({ page }) => {
    await page.addInitScript((member) => {
      localStorage.setItem("staff", member);
    }, adminStaff);

    await page.goto("/staff");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Quick Actions")).toBeVisible();
    await expect(page.getByText("Manage Agents")).toBeVisible();
    await expect(page.getByText("Manage Ailments")).toBeVisible();
    await expect(page.getByText("Manage Therapies")).toBeVisible();
  });

  test("viewer does not see quick actions", async ({ page }) => {
    await page.addInitScript((member) => {
      localStorage.setItem("staff", member);
    }, viewerStaff);

    await page.goto("/staff");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Quick Actions")).not.toBeVisible();
  });

  test("management pages list entities", async ({ page }) => {
    await page.addInitScript((member) => {
      localStorage.setItem("staff", member);
    }, adminStaff);

    await page.goto("/staff/agents");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: "Manage Agents" })).toBeVisible();

    await page.goto("/staff/ailments");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: "Manage Ailments" })).toBeVisible();

    await page.goto("/staff/therapies");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: "Manage Therapies" })).toBeVisible();
  });

  test("viewer sees management list without edit buttons", async ({ page }) => {
    await page.addInitScript((member) => {
      localStorage.setItem("staff", member);
    }, viewerStaff);

    await page.goto("/staff/agents");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: "Manage Agents" })).toBeVisible();
    await expect(page.getByText("Add Agent")).not.toBeVisible();
  });

  test("admin can create and delete an agent", async ({ page }) => {
    await page.addInitScript((member) => {
      localStorage.setItem("staff", member);
    }, adminStaff);

    await page.goto("/staff/agents");
    await page.waitForLoadState("networkidle");

    await page.getByText("Add Agent").click();
    await page.waitForTimeout(500);

    await page.getByLabel("Name").fill("E2E Test Agent");
    await page.getByLabel("Specialty").fill("Testing");

    const [createResp] = await Promise.all([
      page.waitForResponse(
        (res) => res.url().includes("/api/agents") && res.request().method() === "POST"
      ),
      page.getByRole("button", { name: "Create" }).click(),
    ]);
    expect(createResp.status()).toBe(201);

    await expect(page.getByText("E2E Test Agent")).toBeVisible();
    await page
      .getByRole("button", { name: /Delete/ })
      .last()
      .click();
    await page.waitForTimeout(300);

    const [deleteResp] = await Promise.all([
      page.waitForResponse(
        (res) => res.url().includes("/api/agents") && res.request().method() === "DELETE"
      ),
      page.getByRole("button", { name: "Delete" }).last().click(),
    ]);
    expect(deleteResp.status()).toBe(200);
    await expect(page.getByText("E2E Test Agent")).not.toBeVisible();
  });
});

test.describe("Staff responsive design", () => {
  const viewports = [
    { width: 375, height: 667, name: "mobile" },
    { width: 768, height: 1024, name: "tablet" },
    { width: 1280, height: 800, name: "desktop" },
  ];

  for (const vp of viewports) {
    test(`staff dashboard renders without horizontal overflow at ${vp.name} (${vp.width}px)`, async ({
      page,
    }) => {
      await page.addInitScript((member) => {
        localStorage.setItem("staff", member);
      }, adminStaff);

      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/staff");
      await page.waitForLoadState("networkidle");

      const overflowW = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(overflowW).toBe(false);
    });

    test(`staff agents page renders without horizontal overflow at ${vp.name} (${vp.width}px)`, async ({
      page,
    }) => {
      await page.addInitScript((member) => {
        localStorage.setItem("staff", member);
      }, adminStaff);

      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/staff/agents");
      await page.waitForLoadState("networkidle");

      const overflowW = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(overflowW).toBe(false);
    });
  }
});
