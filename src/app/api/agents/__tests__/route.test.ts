import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../route";

vi.mock("@/db", () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => Promise.resolve(mockAgentsResult)),
    })),
  },
}));

let mockAgentsResult: unknown[] = [];

const mockAgents = [
  {
    id: 1,
    name: "Dr. Smith",
    specialty: "Cardiology",
    status: "active",
    avatar: "",
    bio: "A cardiologist.",
  },
  {
    id: 2,
    name: "Dr. Jones",
    specialty: "Neurology",
    status: "idle",
    avatar: "",
    bio: "A neurologist.",
  },
];

beforeEach(() => {
  vi.restoreAllMocks();
  mockAgentsResult = mockAgents;
});

describe("GET /api/agents", () => {
  it("returns all agents", async () => {
    const response = await GET(new Request("http://localhost/api/agents"));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual(mockAgents);
  });

  it("accepts optional status query param", async () => {
    const response = await GET(new Request("http://localhost/api/agents?status=active"));
    expect(response.status).toBe(200);
  });

  it("returns 500 on database error", async () => {
    mockAgentsResult = Promise.reject(new Error("DB error")) as unknown as never[];
    const response = await GET(new Request("http://localhost/api/agents"));
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body).toEqual({ error: "Failed to fetch agents" });
  });
});
