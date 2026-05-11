import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../route";

const mockTherapy = { id: 1, name: "Cache Flush", description: "Reset", duration: "15 min", sideEffects: ["Amnesia"], createdAt: new Date(), updatedAt: new Date() };

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
  },
}));

vi.mock("drizzle-orm", () => ({ eq: vi.fn(() => "eq-clause") }));

beforeEach(() => { vi.restoreAllMocks(); });

describe("GET /api/therapies/[id]", () => {
  it("returns a therapy by id", async () => {
    const response = await GET(new Request("http://localhost/api/therapies/1"), { params: Promise.resolve({ id: "1" }) });
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.name).toBe("Cache Flush");
  });

  it("returns 400 for invalid id", async () => {
    const response = await GET(new Request("http://localhost/api/therapies/abc"), { params: Promise.resolve({ id: "abc" }) });
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Invalid therapy ID");
  });

  it("returns 400 for negative id", async () => {
    const response = await GET(new Request("http://localhost/api/therapies/-1"), { params: Promise.resolve({ id: "-1" }) });
    expect(response.status).toBe(400);
  });
});
