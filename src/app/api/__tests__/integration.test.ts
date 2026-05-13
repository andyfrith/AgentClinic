import { describe, it, expect, vi, beforeEach } from "vitest";

let mockDbResult: unknown[] = [];

vi.mock("@/db", () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => {
        const result = mockDbResult;
        const queryPromise = Promise.resolve(result);
        Object.assign(queryPromise, {
          where: vi.fn(() => ({
            limit: vi.fn(() => Promise.resolve(result)),
            orderBy: vi.fn(() => Promise.resolve(result)),
            innerJoin: vi.fn(() => ({
              where: vi.fn(() => ({
                limit: vi.fn(() => Promise.resolve(result)),
              })),
              orderBy: vi.fn(() => ({
                limit: vi.fn(() => Promise.resolve(result)),
              })),
            })),
          })),
          innerJoin: vi.fn(() => ({
            where: vi.fn(() => Promise.resolve([])),
            orderBy: vi.fn(() => Promise.resolve([])),
          })),
        });
        return queryPromise;
      }),
    })),
  },
}));

vi.mock("@/app/api/_helpers/staff-auth", () => ({
  requireRole: vi.fn(() => Promise.resolve(null)),
  getStaffMember: vi.fn(() =>
    Promise.resolve({ id: 1, name: "Admin", role: "admin", avatar: "AD", specialties: [] })
  ),
}));

beforeEach(() => {
  vi.restoreAllMocks();
  mockDbResult = [];
});

describe("Integration: API route error handling", () => {
  it("handles empty database results gracefully", async () => {
    mockDbResult = [];
    const { GET } = await import("@/app/api/agents/route");
    const response = await GET(new Request("http://localhost/api/agents"));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual([]);
  });

  it("handles missing entity returning empty list", async () => {
    mockDbResult = [];
    const { GET: getAilments } = await import("@/app/api/ailments/route");
    const response = await getAilments();
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual([]);
  });
});
