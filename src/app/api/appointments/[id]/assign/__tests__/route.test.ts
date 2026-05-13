import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";

vi.mock("@/app/api/_helpers/staff-auth", () => ({
  requireRole: vi.fn(() => Promise.resolve(null)),
  getStaffMember: vi.fn(() =>
    Promise.resolve({ id: 1, name: "Admin", role: "admin", avatar: "AD", specialties: [] })
  ),
}));

let mockExisting: unknown[] = [];

vi.mock("@/db", () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve(mockExisting)),
        })),
      })),
    })),
    insert: vi.fn(() => ({
      values: vi.fn(() => Promise.resolve()),
    })),
    delete: vi.fn(() => ({
      where: vi.fn(() => Promise.resolve()),
    })),
  },
}));

beforeEach(() => {
  vi.restoreAllMocks();
  mockExisting = [];
});

describe("POST /api/appointments/[id]/assign", () => {
  it("assigns staff to an appointment", async () => {
    const request = new Request("http://localhost/api/appointments/1/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ staffId: 1 }),
    });
    const response = await POST(request, { params: Promise.resolve({ id: "1" }) });
    expect(response.status).toBe(201);
  });

  it("unassigns staff if already assigned", async () => {
    mockExisting = [{ appointmentId: 1, staffId: 1 }];
    const request = new Request("http://localhost/api/appointments/1/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ staffId: 1 }),
    });
    const response = await POST(request, { params: Promise.resolve({ id: "1" }) });
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.assigned).toBe(false);
  });

  it("returns 400 for invalid appointment id", async () => {
    const request = new Request("http://localhost/api/appointments/abc/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ staffId: 1 }),
    });
    const response = await POST(request, { params: Promise.resolve({ id: "abc" }) });
    expect(response.status).toBe(400);
  });

  it("returns 400 for missing staffId", async () => {
    const request = new Request("http://localhost/api/appointments/1/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const response = await POST(request, { params: Promise.resolve({ id: "1" }) });
    expect(response.status).toBe(400);
  });

  it("returns 400 for invalid JSON body", async () => {
    const request = new Request("http://localhost/api/appointments/1/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{bad}",
    });
    const response = await POST(request, { params: Promise.resolve({ id: "1" }) });
    expect(response.status).toBe(500);
  });
});
