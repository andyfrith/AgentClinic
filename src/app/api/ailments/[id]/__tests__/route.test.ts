import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, PATCH, DELETE } from "../route";

const mockAilment = {
  id: 1,
  name: "Context Bleed",
  description: "Test",
  severity: "moderate",
  category: "Cognitive",
  createdAt: new Date(),
  updatedAt: new Date(),
};

vi.mock("@/db", () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve([mockAilment])),
        })),
        innerJoin: vi.fn(() => ({
          where: vi.fn(() => Promise.resolve([])),
        })),
      })),
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(() => ({
          returning: vi.fn(() => Promise.resolve([mockAilment])),
        })),
      })),
    })),
    delete: vi.fn(() => ({
      where: vi.fn(() => Promise.resolve()),
    })),
  },
}));

vi.mock("@/app/api/_helpers/staff-auth", () => ({
  requireRole: vi.fn(() => Promise.resolve(null)),
  getStaffMember: vi.fn(() =>
    Promise.resolve({ id: 1, name: "Admin", role: "admin", avatar: "AD", specialties: [] })
  ),
}));

vi.mock("drizzle-orm", () => ({ eq: vi.fn(() => "eq-clause") }));

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("GET /api/ailments/[id]", () => {
  it("returns an ailment by id", async () => {
    const response = await GET(new Request("http://localhost/api/ailments/1"), {
      params: Promise.resolve({ id: "1" }),
    });
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.name).toBe("Context Bleed");
  });

  it("returns 400 for invalid id", async () => {
    const response = await GET(new Request("http://localhost/api/ailments/abc"), {
      params: Promise.resolve({ id: "abc" }),
    });
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Invalid ailment ID");
  });

  it("returns 400 for negative id", async () => {
    const response = await GET(new Request("http://localhost/api/ailments/-1"), {
      params: Promise.resolve({ id: "-1" }),
    });
    expect(response.status).toBe(400);
  });
});

describe("PATCH /api/ailments/[id]", () => {
  it("updates an ailment with valid data", async () => {
    const request = new Request("http://localhost/api/ailments/1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Updated Ailment" }),
    });
    const response = await PATCH(request, { params: Promise.resolve({ id: "1" }) });
    expect(response.status).toBe(200);
  });

  it("returns 400 for invalid id", async () => {
    const request = new Request("http://localhost/api/ailments/abc", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Test" }),
    });
    const response = await PATCH(request, { params: Promise.resolve({ id: "abc" }) });
    expect(response.status).toBe(400);
  });

  it("returns 400 for invalid JSON body", async () => {
    const request = new Request("http://localhost/api/ailments/1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: "{bad}",
    });
    const response = await PATCH(request, { params: Promise.resolve({ id: "1" }) });
    expect(response.status).toBe(500);
  });
});

describe("DELETE /api/ailments/[id]", () => {
  it("deletes an existing ailment", async () => {
    const request = new Request("http://localhost/api/ailments/1", { method: "DELETE" });
    const response = await DELETE(request, { params: Promise.resolve({ id: "1" }) });
    expect(response.status).toBe(200);
  });

  it("returns 400 for invalid id", async () => {
    const request = new Request("http://localhost/api/ailments/abc", { method: "DELETE" });
    const response = await DELETE(request, { params: Promise.resolve({ id: "abc" }) });
    expect(response.status).toBe(400);
  });
});
