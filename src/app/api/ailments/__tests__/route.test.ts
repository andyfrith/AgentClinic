import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "../route";

vi.mock("@/app/api/_helpers/staff-auth", () => ({
  requireRole: vi.fn(() => Promise.resolve(null)),
  getStaffMember: vi.fn(() =>
    Promise.resolve({ id: 1, name: "Admin", role: "admin", avatar: "AD", specialties: [] })
  ),
}));

vi.mock("@/db", () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => Promise.resolve(mockAilmentsResult)),
    })),
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(() =>
          Promise.resolve([
            { id: 3, name: "New", description: "", severity: "mild", category: "Test" },
          ])
        ),
      })),
    })),
  },
}));

let mockAilmentsResult: unknown[] = [];

const mockAilments = [
  {
    id: 1,
    name: "Context Bleed",
    description: "Test",
    severity: "moderate",
    category: "Cognitive",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Bracket Fatigue",
    description: "Test",
    severity: "mild",
    category: "Physical",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

beforeEach(() => {
  vi.restoreAllMocks();
  mockAilmentsResult = mockAilments;
});

describe("GET /api/ailments", () => {
  it("returns all ailments", async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual(mockAilments);
  });

  it("returns 500 on database error", async () => {
    mockAilmentsResult = Promise.reject(new Error("DB error")) as unknown as never[];
    const response = await GET();
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body).toEqual({ error: "Failed to fetch ailments" });
  });
});

describe("POST /api/ailments", () => {
  const validAilment = { name: "New Ailment", severity: "mild" as const, category: "Test" };

  it("creates an ailment with valid data", async () => {
    const request = new Request("http://localhost/api/ailments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validAilment),
    });
    const response = await POST(request);
    expect(response.status).toBe(201);
  });

  it("returns 400 for missing required fields", async () => {
    const request = new Request("http://localhost/api/ailments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("returns 400 for invalid JSON body", async () => {
    const request = new Request("http://localhost/api/ailments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{bad json",
    });
    const response = await POST(request);
    expect(response.status).toBe(500);
  });
});
