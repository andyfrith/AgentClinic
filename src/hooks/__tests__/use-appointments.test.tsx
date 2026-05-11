import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import {
  useAppointments,
  useAppointment,
  useCreateAppointment,
  useUpdateAppointment,
} from "../use-appointments";

const mockAppointments = [
  {
    id: 1,
    date: "2026-05-12T10:00:00Z",
    status: "scheduled",
    notes: "Follow-up",
    createdAt: "2026-05-10T00:00:00Z",
    updatedAt: "2026-05-10T00:00:00Z",
    agent: { id: 1, name: "Claude", avatar: "CL", specialty: "Code Analysis", status: "active" },
    ailment: { id: 1, name: "Bracket Fatigue", severity: "mild", category: "Physical" },
    therapy: { id: 1, name: "Prompt Therapy", duration: "45 minutes" },
  },
];

const mockAppointmentDetail = {
  ...mockAppointments[0],
  ailment: { ...mockAppointments[0].ailment, description: "Test" },
  therapy: { ...mockAppointments[0].therapy, description: "Test", sideEffects: [] },
};

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("useAppointments", () => {
  it("fetches and returns appointments list", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockAppointments,
    } as Response);
    const { result } = renderHook(() => useAppointments(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockAppointments);
  });

  it("throws on fetch failure", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({ ok: false } as Response);
    const { result } = renderHook(() => useAppointments(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(new Error("Failed to fetch appointments"));
  });
});

describe("useAppointment", () => {
  it("fetches and returns a single appointment", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockAppointmentDetail,
    } as Response);
    const { result } = renderHook(() => useAppointment("1"), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockAppointmentDetail);
    expect(globalThis.fetch).toHaveBeenCalledWith("/api/appointments/1");
  });

  it("throws on fetch failure", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({ ok: false } as Response);
    const { result } = renderHook(() => useAppointment("999"), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(new Error("Failed to fetch appointment"));
  });
});

describe("useCreateAppointment", () => {
  it("calls POST /api/appointments with correct body", async () => {
    const mockFetch = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 1 }) } as Response);
    const { result } = renderHook(() => useCreateAppointment(), { wrapper: createWrapper() });
    result.current.mutate({ agentId: 1, ailmentId: 2, therapyId: 3, date: "2026-05-13T10:00:00Z" });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/appointments",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: 1,
          ailmentId: 2,
          therapyId: 3,
          date: "2026-05-13T10:00:00Z",
        }),
      })
    );
  });
});

describe("useUpdateAppointment", () => {
  it("calls PATCH /api/appointments/:id with correct body", async () => {
    const mockFetch = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, status: "completed" }),
    } as Response);
    const { result } = renderHook(() => useUpdateAppointment(), { wrapper: createWrapper() });
    result.current.mutate({ id: 1, status: "completed" });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/appointments/1",
      expect.objectContaining({
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      })
    );
  });
});
