import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, PATCH, DELETE } from "../route";

const mockSelect = vi.fn();
const mockUpdate = vi.fn();
const mockDeleteFn = vi.fn();

vi.mock("@/db", () => ({
  db: {
    select: (...args: unknown[]) => mockSelect(args),
    update: (...args: unknown[]) => mockUpdate(args),
    delete: (...args: unknown[]) => mockDeleteFn(args),
  },
}));

beforeEach(() => {
  vi.restoreAllMocks();
  mockSelect.mockReset();
  mockUpdate.mockReset();
  mockDeleteFn.mockReset();
});

describe("GET /api/staff/[id]", () => {
  it("returns 400 for invalid id", async () => {
    const response = await GET(new Request("http://localhost/api/staff/abc"), {
      params: Promise.resolve({ id: "abc" }),
    });
    expect(response.status).toBe(400);
  });

  it("returns 404 when staff not found", async () => {
    mockSelect.mockReturnValue({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve([])),
        })),
      })),
    });
    const response = await GET(new Request("http://localhost/api/staff/999"), {
      params: Promise.resolve({ id: "999" }),
    });
    expect(response.status).toBe(404);
  });

  it("returns staff member with appointments", async () => {
    const mockStaff = {
      id: 1,
      name: "Dr. Ada",
      role: "admin",
      avatar: "DA",
      specialties: ["Cognitive"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockSelect
      .mockReturnValueOnce({
        from: vi.fn(() => ({
          where: vi.fn(() => ({
            limit: vi.fn(() => Promise.resolve([mockStaff])),
          })),
        })),
      })
      .mockReturnValueOnce({
        from: vi.fn(() => ({
          innerJoin: vi.fn(() => ({
            innerJoin: vi.fn(() => ({
              innerJoin: vi.fn(() => ({
                innerJoin: vi.fn(() => ({
                  where: vi.fn(() => Promise.resolve([])),
                })),
              })),
            })),
          })),
        })),
      });
    const response = await GET(new Request("http://localhost/api/staff/1"), {
      params: Promise.resolve({ id: "1" }),
    });
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.name).toBe("Dr. Ada");
    expect(body).toHaveProperty("appointments");
  });
});

describe("PATCH /api/staff/[id]", () => {
  it("returns 400 for invalid id", async () => {
    const request = new Request("http://localhost/api/staff/abc", {
      method: "PATCH",
      body: JSON.stringify({ name: "Updated" }),
    });
    const response = await PATCH(request, { params: Promise.resolve({ id: "abc" }) });
    expect(response.status).toBe(400);
  });

  it("returns 404 when staff not found", async () => {
    mockSelect.mockReturnValue({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve([])),
        })),
      })),
    });
    const request = new Request("http://localhost/api/staff/999", {
      method: "PATCH",
      body: JSON.stringify({ name: "Updated" }),
    });
    const response = await PATCH(request, { params: Promise.resolve({ id: "999" }) });
    expect(response.status).toBe(404);
  });

  it("updates staff member", async () => {
    const mockStaff = {
      id: 1,
      name: "Dr. Ada",
      role: "admin",
      avatar: "DA",
      specialties: ["Cognitive"],
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };
    mockSelect.mockReturnValue({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve([mockStaff])),
        })),
      })),
    });
    mockUpdate.mockReturnValue({
      set: vi.fn(() => ({
        where: vi.fn(() => ({
          returning: vi.fn(() => Promise.resolve([{ ...mockStaff, name: "Updated" }])),
        })),
      })),
    });
    const request = new Request("http://localhost/api/staff/1", {
      method: "PATCH",
      body: JSON.stringify({ name: "Updated" }),
    });
    const response = await PATCH(request, { params: Promise.resolve({ id: "1" }) });
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.name).toBe("Updated");
  });
});

describe("DELETE /api/staff/[id]", () => {
  it("returns 400 for invalid id", async () => {
    const response = await DELETE(new Request("http://localhost/api/staff/abc"), {
      params: Promise.resolve({ id: "abc" }),
    });
    expect(response.status).toBe(400);
  });

  it("returns 404 when staff not found", async () => {
    mockSelect.mockReturnValue({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve([])),
        })),
      })),
    });
    const response = await DELETE(new Request("http://localhost/api/staff/999"), {
      params: Promise.resolve({ id: "999" }),
    });
    expect(response.status).toBe(404);
  });

  it("deletes staff member", async () => {
    const mockStaff = { id: 1, name: "Dr. Ada", role: "admin" };
    mockSelect.mockReturnValue({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve([mockStaff])),
        })),
      })),
    });
    mockDeleteFn.mockReturnValue({
      where: vi.fn(() => Promise.resolve()),
    });
    const response = await DELETE(new Request("http://localhost/api/staff/1"), {
      params: Promise.resolve({ id: "1" }),
    });
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
  });
});
