import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "../route";

let mockAppointmentsResult: unknown[] = [];
let mockInsertResult: unknown[] = [];

vi.mock("@/db", () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        innerJoin: vi.fn(() => ({
          innerJoin: vi.fn(() => ({
            innerJoin: vi.fn(() => ({
              orderBy: vi.fn(() => Promise.resolve(mockAppointmentsResult)),
            })),
          })),
        })),
      })),
    })),
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(() => Promise.resolve(mockInsertResult)),
      })),
    })),
  },
}));

const mockAppointments = [
  {
    id: 1,
    date: "2026-05-12T10:00:00.000Z",
    status: "scheduled",
    notes: "",
    createdAt: "2026-05-11T00:00:00.000Z",
    updatedAt: "2026-05-11T00:00:00.000Z",
    agent: { id: 1, name: "Claude", avatar: "CL", specialty: "Code Analysis", status: "active" },
    ailment: { id: 1, name: "Bracket Fatigue", severity: "mild", category: "Physical" },
    therapy: { id: 1, name: "Prompt Therapy", duration: "45 minutes" },
  },
];

beforeEach(() => {
  vi.restoreAllMocks();
  mockAppointmentsResult = mockAppointments;
  mockInsertResult = [];
});

describe("GET /api/appointments", () => {
  it("returns all appointments", async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual(mockAppointments);
  });

  it("returns 500 on database error", async () => {
    mockAppointmentsResult = Promise.reject(new Error("DB error")) as unknown as never[];
    const response = await GET();
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body).toEqual({ error: "Failed to fetch appointments" });
  });
});

describe("POST /api/appointments", () => {
  it("returns 400 for invalid body", async () => {
    const request = new Request("http://localhost/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Invalid input");
  });
});
