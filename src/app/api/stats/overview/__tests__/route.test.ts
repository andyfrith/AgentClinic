import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../route";

const mockSelect = vi.fn();
let callCount = 0;

vi.mock("@/db", () => ({
  db: {
    select: (...args: unknown[]) => {
      callCount++;
      return mockSelect(args, callCount);
    },
  },
}));

beforeEach(() => {
  vi.restoreAllMocks();
  mockSelect.mockReset();
  callCount = 0;
});

describe("GET /api/stats/overview", () => {
  it("returns overview stats", async () => {
    mockSelect.mockImplementation((_args: unknown[], count: number) => {
      if (count <= 5) {
        return { from: vi.fn(() => Promise.resolve([{ count: "10" }])) };
      }
      if (count === 6) {
        return {
          from: vi.fn(() => ({
            innerJoin: vi.fn(() => ({
              innerJoin: vi.fn(() => ({
                where: vi.fn(() => ({
                  orderBy: vi.fn(() => Promise.resolve([])),
                })),
              })),
            })),
          })),
        };
      }
      return {
        from: vi.fn(() => ({
          groupBy: vi.fn(() => Promise.resolve([])),
        })),
      };
    });
    const response = await GET();
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty("agents");
    expect(body).toHaveProperty("ailments");
    expect(body).toHaveProperty("therapies");
    expect(body).toHaveProperty("appointments");
    expect(body).toHaveProperty("staff");
    expect(body).toHaveProperty("todayAppointments");
    expect(body).toHaveProperty("statusBreakdown");
    expect(body.agents).toBe(10);
  });

  it("returns 500 on database error", async () => {
    mockSelect.mockImplementation(() => {
      throw new Error("DB error");
    });
    const response = await GET();
    expect(response.status).toBe(500);
  });
});
