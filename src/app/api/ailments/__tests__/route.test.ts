import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../route";

vi.mock("@/db", () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => Promise.resolve(mockAilmentsResult)),
    })),
  },
}));

let mockAilmentsResult: unknown[] = [];

const mockAilments = [
  { id: 1, name: "Context Bleed", description: "Test", severity: "moderate", category: "Cognitive", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 2, name: "Bracket Fatigue", description: "Test", severity: "mild", category: "Physical", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

beforeEach(() => { vi.restoreAllMocks(); mockAilmentsResult = mockAilments; });

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
