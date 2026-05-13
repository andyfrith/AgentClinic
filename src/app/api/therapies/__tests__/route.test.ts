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
      from: vi.fn(() => Promise.resolve(mockTherapiesResult)),
    })),
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(() =>
          Promise.resolve([
            { id: 3, name: "New", description: "", duration: "30 min", sideEffects: [] },
          ])
        ),
      })),
    })),
  },
}));

let mockTherapiesResult: unknown[] = [];

const mockTherapies = [
  {
    id: 1,
    name: "Cache Flush",
    description: "Test",
    duration: "30 minutes",
    sideEffects: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Prompt Therapy",
    description: "Test",
    duration: "45 minutes",
    sideEffects: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

beforeEach(() => {
  vi.restoreAllMocks();
  mockTherapiesResult = mockTherapies;
});

describe("GET /api/therapies", () => {
  it("returns all therapies", async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual(mockTherapies);
  });

  it("returns 500 on database error", async () => {
    mockTherapiesResult = Promise.reject(new Error("DB error")) as unknown as never[];
    const response = await GET();
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body).toEqual({ error: "Failed to fetch therapies" });
  });
});

describe("POST /api/therapies", () => {
  const validTherapy = { name: "New Therapy", duration: "30 minutes" };

  it("creates a therapy with valid data", async () => {
    const request = new Request("http://localhost/api/therapies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validTherapy),
    });
    const response = await POST(request);
    expect(response.status).toBe(201);
  });

  it("returns 400 for missing required fields", async () => {
    const request = new Request("http://localhost/api/therapies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("returns 400 for invalid JSON body", async () => {
    const request = new Request("http://localhost/api/therapies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{bad}",
    });
    const response = await POST(request);
    expect(response.status).toBe(500);
  });
});

describe("GET /api/therapies", () => {
  it("returns all therapies", async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual(mockTherapies);
  });

  it("returns 500 on database error", async () => {
    mockTherapiesResult = Promise.reject(new Error("DB error")) as unknown as never[];
    const response = await GET();
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body).toEqual({ error: "Failed to fetch therapies" });
  });
});
