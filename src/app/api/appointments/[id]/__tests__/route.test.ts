import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, PATCH } from "../route";

type MockAppointment = {
  id: number;
  date: Date;
  status: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  agent: { id: number; name: string; avatar: string; specialty: string; status: string };
  ailment: { id: number; name: string; severity: string; category: string; description: string };
  therapy: {
    id: number;
    name: string;
    duration: string;
    description: string;
    sideEffects: string[];
  };
};

const mockAppointmentRow: MockAppointment[] = [
  {
    id: 1,
    date: new Date("2026-05-12T10:00:00Z"),
    status: "scheduled",
    notes: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    agent: { id: 1, name: "Claude", avatar: "CL", specialty: "Code Analysis", status: "active" },
    ailment: {
      id: 1,
      name: "Bracket Fatigue",
      severity: "mild",
      category: "Physical",
      description: "",
    },
    therapy: {
      id: 1,
      name: "Prompt Therapy",
      duration: "45 minutes",
      description: "",
      sideEffects: [],
    },
  },
];

let shouldReject = false;

vi.mock("@/db", () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        innerJoin: vi.fn(() => ({
          innerJoin: vi.fn(() => ({
            innerJoin: vi.fn(() => ({
              where: vi.fn(() => ({
                limit: vi.fn(() => {
                  if (shouldReject) return Promise.reject(new Error("DB error"));
                  return Promise.resolve(mockAppointmentRow);
                }),
              })),
            })),
          })),
        })),
      })),
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(() => ({
          returning: vi.fn(() => Promise.resolve([mockAppointmentRow[0]])),
        })),
      })),
    })),
  },
}));

beforeEach(() => {
  vi.restoreAllMocks();
  shouldReject = false;
});

describe("GET /api/appointments/[id]", () => {
  it("returns 400 for invalid id", async () => {
    const request = new Request("http://localhost/api/appointments/abc");
    const response = await GET(request, { params: Promise.resolve({ id: "abc" }) });
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Invalid appointment ID");
  });

  it("returns 500 on database error", async () => {
    shouldReject = true;
    const request = new Request("http://localhost/api/appointments/1");
    const response = await GET(request, { params: Promise.resolve({ id: "1" }) });
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBe("Failed to fetch appointment");
  });
});

describe("PATCH /api/appointments/[id]", () => {
  it("returns 400 for invalid id", async () => {
    const request = new Request("http://localhost/api/appointments/abc", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "in-progress" }),
    });
    const response = await PATCH(request, { params: Promise.resolve({ id: "abc" }) });
    expect(response.status).toBe(400);
  });
});
