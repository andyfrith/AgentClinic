import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../route";

const mockAilment = { id: 1, name: "Context Bleed", description: "Test", severity: "moderate", category: "Cognitive", createdAt: new Date(), updatedAt: new Date() };

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
  },
}));

vi.mock("drizzle-orm", () => ({ eq: vi.fn(() => "eq-clause") }));

beforeEach(() => { vi.restoreAllMocks(); });

describe("GET /api/ailments/[id]", () => {
  it("returns an ailment by id", async () => {
    const response = await GET(new Request("http://localhost/api/ailments/1"), { params: Promise.resolve({ id: "1" }) });
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.name).toBe("Context Bleed");
  });

  it("returns 400 for invalid id", async () => {
    const response = await GET(new Request("http://localhost/api/ailments/abc"), { params: Promise.resolve({ id: "abc" }) });
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Invalid ailment ID");
  });

  it("returns 400 for negative id", async () => {
    const response = await GET(new Request("http://localhost/api/ailments/-1"), { params: Promise.resolve({ id: "-1" }) });
    expect(response.status).toBe(400);
  });
});
