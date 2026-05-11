import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../route";

vi.mock("@/db", () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => Promise.resolve(mockTherapiesResult)),
    })),
  },
}));

let mockTherapiesResult: unknown[] = [];

const mockTherapies = [
  { id: 1, name: "Cache Flush", description: "Reset", duration: "15 min", sideEffects: ["Amnesia"], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 2, name: "Weight Freeze", description: "Freeze", duration: "1 hr", sideEffects: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

beforeEach(() => { vi.restoreAllMocks(); mockTherapiesResult = mockTherapies; });

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
