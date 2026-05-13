import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "../route";

vi.mock("@/app/api/_helpers/staff-auth", () => ({
  requireRole: vi.fn(() => Promise.resolve(null)),
  getStaffMember: vi.fn(() =>
    Promise.resolve({ id: 1, name: "Admin", role: "admin", avatar: "AD", specialties: [] })
  ),
}));

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
  const validAppointment = {
    agentId: 1,
    ailmentId: 1,
    therapyId: 1,
    date: "2026-06-01T10:00:00.000Z",
  };

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

  it("returns 400 for invalid JSON body", async () => {
    const request = new Request("http://localhost/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{not json}",
    });
    const response = await POST(request);
    expect(response.status).toBe(500);
  });

  it("returns 400 for negative agentId", async () => {
    const request = new Request("http://localhost/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...validAppointment, agentId: -1 }),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("returns 400 for non-integer ids", async () => {
    const request = new Request("http://localhost/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...validAppointment, agentId: 1.5 }),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("returns 400 for invalid date format", async () => {
    const request = new Request("http://localhost/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...validAppointment, date: "not-a-date" }),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("returns 400 for empty string notes", async () => {
    const request = new Request("http://localhost/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...validAppointment, notes: "" }),
    });
    const response = await POST(request);
    expect(response.status).toBe(201);
  });
});
