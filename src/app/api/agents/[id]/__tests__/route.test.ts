import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../route";

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
  },
}));

vi.mock("drizzle-orm", () => ({ eq: vi.fn(() => "eq-clause") }));

beforeEach(() => { vi.restoreAllMocks(); });

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
