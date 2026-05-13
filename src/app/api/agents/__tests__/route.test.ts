import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "../route";

vi.mock("@/app/api/_helpers/staff-auth", () => ({
  requireRole: vi.fn(() => Promise.resolve(null)),
  getStaffMember: vi.fn(() =>
    Promise.resolve({ id: 1, name: "Admin", role: "admin", avatar: "AD", specialties: [] })
  ),
}));

let mockInsertResult: unknown[] = [];
let mockAgentsResult: unknown[] = [];

vi.mock("@/db", () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => Promise.resolve(mockAgentsResult)),
    })),
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(() => Promise.resolve(mockInsertResult)),
      })),
    })),
  },
}));

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
  mockInsertResult = [];
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

describe("POST /api/agents", () => {
  const validAgent = {
    name: "Dr. New",
    specialty: "Radiology",
    status: "active",
    bio: "A new doctor.",
  };

  it("creates an agent with valid data", async () => {
    mockInsertResult = [mockAgents[0]];
    const request = new Request("http://localhost/api/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validAgent),
    });
    const response = await POST(request);
    expect(response.status).toBe(201);
  });

  it("returns 400 for missing required fields", async () => {
    const request = new Request("http://localhost/api/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Invalid input");
  });

  it("returns 400 for invalid JSON body", async () => {
    const request = new Request("http://localhost/api/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{invalid json",
    });
    const response = await POST(request);
    expect(response.status).toBe(500);
  });

  it("returns 400 for name exceeding max length", async () => {
    const request = new Request("http://localhost/api/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...validAgent, name: "x".repeat(256) }),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("returns 400 for bio exceeding max length", async () => {
    const request = new Request("http://localhost/api/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...validAgent, bio: "x".repeat(5001) }),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
