import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "../route";

const mockSelect = vi.fn();

vi.mock("@/db", () => ({
  db: {
    select: (...args: unknown[]) => mockSelect(...args),
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(() =>
          Promise.resolve([
            {
              id: 1,
              name: "Dr. Ada",
              role: "admin",
              avatar: "DA",
              specialties: ["Cognitive"],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ])
        ),
      })),
    })),
  },
}));

beforeEach(() => {
  vi.restoreAllMocks();
  mockSelect.mockReset();
});

describe("GET /api/staff", () => {
  it("returns all staff members", async () => {
    const mockData = [
      {
        id: 1,
        name: "Dr. Ada",
        role: "admin",
        avatar: "DA",
        specialties: ["Cognitive"],
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      },
    ];
    mockSelect.mockReturnValue({ from: vi.fn(() => Promise.resolve(mockData)) });
    const response = await GET();
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual(mockData);
  });

  it("returns 500 on database error", async () => {
    mockSelect.mockReturnValue({ from: vi.fn(() => Promise.reject(new Error("DB error"))) });
    const response = await GET();
    expect(response.status).toBe(500);
  });
});

describe("POST /api/staff", () => {
  it("creates a new staff member", async () => {
    const request = new Request("http://localhost/api/staff", {
      method: "POST",
      body: JSON.stringify({
        name: "Dr. Ada",
        role: "admin",
        avatar: "DA",
        specialties: ["Cognitive"],
      }),
    });
    const response = await POST(request);
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.name).toBe("Dr. Ada");
  });

  it("returns 400 for invalid input", async () => {
    const request = new Request("http://localhost/api/staff", {
      method: "POST",
      body: JSON.stringify({ name: "" }),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
