import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, PATCH, DELETE } from "../route";

const mockTherapy = {
  id: 1,
  name: "Cache Flush",
  description: "Reset",
  duration: "15 min",
  sideEffects: ["Amnesia"],
  createdAt: new Date(),
  updatedAt: new Date(),
};

vi.mock("@/db", () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve([mockTherapy])),
        })),
        innerJoin: vi.fn(() => ({
          where: vi.fn(() => Promise.resolve([])),
        })),
      })),
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(() => ({
          returning: vi.fn(() => Promise.resolve([mockTherapy])),
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

describe("GET /api/therapies/[id]", () => {
  it("returns a therapy by id", async () => {
    const response = await GET(new Request("http://localhost/api/therapies/1"), {
      params: Promise.resolve({ id: "1" }),
    });
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.name).toBe("Cache Flush");
  });

  it("returns 400 for invalid id", async () => {
    const response = await GET(new Request("http://localhost/api/therapies/abc"), {
      params: Promise.resolve({ id: "abc" }),
    });
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Invalid therapy ID");
  });

  it("returns 400 for negative id", async () => {
    const response = await GET(new Request("http://localhost/api/therapies/-1"), {
      params: Promise.resolve({ id: "-1" }),
    });
    expect(response.status).toBe(400);
  });
});

describe("PATCH /api/therapies/[id]", () => {
  it("updates a therapy with valid data", async () => {
    const request = new Request("http://localhost/api/therapies/1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Updated Therapy" }),
    });
    const response = await PATCH(request, { params: Promise.resolve({ id: "1" }) });
    expect(response.status).toBe(200);
  });

  it("returns 400 for invalid id", async () => {
    const request = new Request("http://localhost/api/therapies/abc", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Test" }),
    });
    const response = await PATCH(request, { params: Promise.resolve({ id: "abc" }) });
    expect(response.status).toBe(400);
  });
});

describe("DELETE /api/therapies/[id]", () => {
  it("deletes an existing therapy", async () => {
    const request = new Request("http://localhost/api/therapies/1", { method: "DELETE" });
    const response = await DELETE(request, { params: Promise.resolve({ id: "1" }) });
    expect(response.status).toBe(200);
  });

  it("returns 400 for invalid id", async () => {
    const request = new Request("http://localhost/api/therapies/abc", { method: "DELETE" });
    const response = await DELETE(request, { params: Promise.resolve({ id: "abc" }) });
    expect(response.status).toBe(400);
  });
});
