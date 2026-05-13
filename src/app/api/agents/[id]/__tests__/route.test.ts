import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, PATCH, DELETE } from "../route";

const mockAgent = {
  id: 1,
  name: "Dr. Smith",
  avatar: "",
  specialty: "Cardiology",
  status: "active",
  bio: "A cardiologist.",
};

vi.mock("@/db", () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve([mockAgent])),
        })),
        innerJoin: vi.fn(() => ({
          where: vi.fn(() => Promise.resolve([])),
        })),
      })),
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(() => ({
          returning: vi.fn(() => Promise.resolve([mockAgent])),
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

describe("GET /api/agents/[id]", () => {
  it("returns an agent by id", async () => {
    const response = await GET(new Request("http://localhost/api/agents/1"), {
      params: Promise.resolve({ id: "1" }),
    });
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(1);
    expect(body.name).toBe("Dr. Smith");
    expect(body.ailments).toEqual([]);
  });

  it("returns 400 for invalid id", async () => {
    const response = await GET(new Request("http://localhost/api/agents/abc"), {
      params: Promise.resolve({ id: "abc" }),
    });
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Invalid agent ID");
  });

  it("returns 400 for negative id", async () => {
    const response = await GET(new Request("http://localhost/api/agents/-1"), {
      params: Promise.resolve({ id: "-1" }),
    });
    expect(response.status).toBe(400);
  });
});

describe("PATCH /api/agents/[id]", () => {
  it("updates an agent with valid data", async () => {
    const request = new Request("http://localhost/api/agents/1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Dr. Updated" }),
    });
    const response = await PATCH(request, { params: Promise.resolve({ id: "1" }) });
    expect(response.status).toBe(200);
  });

  it("returns 400 for invalid id", async () => {
    const request = new Request("http://localhost/api/agents/abc", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Dr. X" }),
    });
    const response = await PATCH(request, { params: Promise.resolve({ id: "abc" }) });
    expect(response.status).toBe(400);
  });

  it("returns 400 for invalid JSON body", async () => {
    const request = new Request("http://localhost/api/agents/1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: "{not json}",
    });
    const response = await PATCH(request, { params: Promise.resolve({ id: "1" }) });
    expect(response.status).toBe(500);
  });

  it("returns 400 for bio exceeding max length", async () => {
    const request = new Request("http://localhost/api/agents/1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bio: "x".repeat(5001) }),
    });
    const response = await PATCH(request, { params: Promise.resolve({ id: "1" }) });
    expect(response.status).toBe(400);
  });
});

describe("DELETE /api/agents/[id]", () => {
  it("deletes an existing agent", async () => {
    const request = new Request("http://localhost/api/agents/1", { method: "DELETE" });
    const response = await DELETE(request, { params: Promise.resolve({ id: "1" }) });
    expect(response.status).toBe(200);
  });

  it("returns 400 for invalid id", async () => {
    const request = new Request("http://localhost/api/agents/abc", { method: "DELETE" });
    const response = await DELETE(request, { params: Promise.resolve({ id: "abc" }) });
    expect(response.status).toBe(400);
  });

  it("returns 400 for negative id", async () => {
    const request = new Request("http://localhost/api/agents/-1", { method: "DELETE" });
    const response = await DELETE(request, { params: Promise.resolve({ id: "-1" }) });
    expect(response.status).toBe(400);
  });
});
