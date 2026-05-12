import { describe, it, expect, vi } from "vitest";

let currentStaffRole = "admin";

vi.mock("@/db", () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(() => {
            const member = {
              id: 1,
              name: "Test",
              role: currentStaffRole,
              avatar: "TT",
              specialties: [],
            };
            return Promise.resolve(currentStaffRole === "none" ? [] : [member]);
          }),
        })),
      })),
    })),
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(() => Promise.resolve([{ id: 1 }])),
      })),
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(() => ({
          returning: vi.fn(() => Promise.resolve([{ id: 1 }])),
        })),
      })),
    })),
    delete: vi.fn(() => ({
      where: vi.fn(() => Promise.resolve()),
    })),
  },
}));

describe("role enforcement", () => {
  describe("staff auth helper", () => {
    it("getStaffMember returns null without x-staff-id header", async () => {
      const { getStaffMember } = await import("@/app/api/_helpers/staff-auth");
      const result = await getStaffMember(new Request("http://localhost"));
      expect(result).toBeNull();
    });

    it("getStaffMember returns null for invalid staff id", async () => {
      const { getStaffMember } = await import("@/app/api/_helpers/staff-auth");
      const request = new Request("http://localhost", {
        headers: { "x-staff-id": "abc" },
      });
      const result = await getStaffMember(request);
      expect(result).toBeNull();
    });
  });

  describe("requireRole", () => {
    it("returns 403 without x-staff-id header", async () => {
      currentStaffRole = "none";
      const { requireRole } = await import("@/app/api/_helpers/staff-auth");
      const result = await requireRole(new Request("http://localhost"), ["admin"]);
      expect(result).toBeInstanceOf(Response);
      expect(result!.status).toBe(403);
    });

    it("returns 403 for viewer role on editor endpoints", async () => {
      currentStaffRole = "viewer";
      const { requireRole } = await import("@/app/api/_helpers/staff-auth");
      const request = new Request("http://localhost", {
        headers: { "x-staff-id": "1" },
      });
      const result = await requireRole(request, ["editor", "admin"]);
      expect(result).toBeInstanceOf(Response);
      expect(result!.status).toBe(403);
    });

    it("returns null for admin role on admin endpoints", async () => {
      currentStaffRole = "admin";
      const { requireRole } = await import("@/app/api/_helpers/staff-auth");
      const request = new Request("http://localhost", {
        headers: { "x-staff-id": "1" },
      });
      const result = await requireRole(request, ["admin"]);
      expect(result).toBeNull();
    });

    it("returns null for editor role on editor endpoints", async () => {
      currentStaffRole = "editor";
      const { requireRole } = await import("@/app/api/_helpers/staff-auth");
      const request = new Request("http://localhost", {
        headers: { "x-staff-id": "1" },
      });
      const result = await requireRole(request, ["editor", "admin"]);
      expect(result).toBeNull();
    });
  });

  describe("staff CRUD endpoints", () => {
    it("POST /api/staff returns 403 for viewer", async () => {
      currentStaffRole = "viewer";
      const { POST } = await import("@/app/api/staff/route");
      const request = new Request("http://localhost/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-staff-id": "1" },
        body: JSON.stringify({ name: "Test", role: "viewer" }),
      });
      const response = await POST(request);
      expect(response.status).toBe(403);
    });

    it("PATCH /api/staff/[id] returns 403 for editor", async () => {
      currentStaffRole = "editor";
      const { PATCH } = await import("@/app/api/staff/[id]/route");
      const request = new Request("http://localhost/api/staff/1", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-staff-id": "1" },
        body: JSON.stringify({ name: "Test" }),
      });
      const response = await PATCH(request, { params: Promise.resolve({ id: "1" }) });
      expect(response.status).toBe(403);
    });
  });

  describe("agent CRUD endpoints", () => {
    it("POST /api/agents returns 403 for viewer", async () => {
      currentStaffRole = "viewer";
      const { POST } = await import("@/app/api/agents/route");
      const request = new Request("http://localhost/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-staff-id": "1" },
        body: JSON.stringify({ name: "Test", specialty: "Test" }),
      });
      const response = await POST(request);
      expect(response.status).toBe(403);
    });

    it("PATCH /api/agents/[id] returns 403 for viewer", async () => {
      currentStaffRole = "viewer";
      const { PATCH } = await import("@/app/api/agents/[id]/route");
      const request = new Request("http://localhost/api/agents/1", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-staff-id": "1" },
        body: JSON.stringify({ name: "Test" }),
      });
      const response = await PATCH(request, { params: Promise.resolve({ id: "1" }) });
      expect(response.status).toBe(403);
    });

    it("DELETE /api/agents/[id] returns 403 for viewer", async () => {
      currentStaffRole = "viewer";
      const { DELETE } = await import("@/app/api/agents/[id]/route");
      const request = new Request("http://localhost/api/agents/1", {
        method: "DELETE",
        headers: { "x-staff-id": "1" },
      });
      const response = await DELETE(request, { params: Promise.resolve({ id: "1" }) });
      expect(response.status).toBe(403);
    });
  });

  describe("ailment CRUD endpoints", () => {
    it("POST /api/ailments returns 403 for viewer", async () => {
      currentStaffRole = "viewer";
      const { POST } = await import("@/app/api/ailments/route");
      const request = new Request("http://localhost/api/ailments", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-staff-id": "1" },
        body: JSON.stringify({ name: "Test", severity: "mild", category: "Test" }),
      });
      const response = await POST(request);
      expect(response.status).toBe(403);
    });
  });

  describe("therapy CRUD endpoints", () => {
    it("POST /api/therapies returns 403 for viewer", async () => {
      currentStaffRole = "viewer";
      const { POST } = await import("@/app/api/therapies/route");
      const request = new Request("http://localhost/api/therapies", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-staff-id": "1" },
        body: JSON.stringify({ name: "Test", duration: "30m" }),
      });
      const response = await POST(request);
      expect(response.status).toBe(403);
    });
  });

  describe("appointment CRUD endpoints", () => {
    it("POST /api/appointments returns 403 for viewer", async () => {
      currentStaffRole = "viewer";
      const { POST } = await import("@/app/api/appointments/route");
      const request = new Request("http://localhost/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-staff-id": "1" },
        body: JSON.stringify({
          agentId: 1,
          ailmentId: 1,
          therapyId: 1,
          date: "2026-05-12T10:00:00Z",
        }),
      });
      const response = await POST(request);
      expect(response.status).toBe(403);
    });

    it("PATCH /api/appointments/[id] returns 403 for viewer", async () => {
      currentStaffRole = "viewer";
      const { PATCH } = await import("@/app/api/appointments/[id]/route");
      const request = new Request("http://localhost/api/appointments/1", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-staff-id": "1" },
        body: JSON.stringify({ status: "in-progress" }),
      });
      const response = await PATCH(request, { params: Promise.resolve({ id: "1" }) });
      expect(response.status).toBe(403);
    });
  });
});
