import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useOverviewStats } from "../use-stats";

const mockStats = {
  agents: 5,
  ailments: 8,
  therapies: 8,
  appointments: 5,
  staff: 3,
  todayAppointments: [
    {
      id: 1,
      date: "2026-05-12T10:00:00.000Z",
      status: "scheduled",
      notes: null,
      agentName: "Claude",
      therapyName: "Prompt Therapy",
      assignedStaffId: null,
    },
  ],
  statusBreakdown: [
    { status: "scheduled", count: 3 },
    { status: "in-progress", count: 1 },
    { status: "completed", count: 1 },
  ],
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

describe("useOverviewStats", () => {
  it("fetches and returns overview stats", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockStats,
    } as Response);
    const { result } = renderHook(() => useOverviewStats(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockStats);
    expect(globalThis.fetch).toHaveBeenCalledWith("/api/stats/overview");
  });

  it("throws on fetch failure", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({ ok: false } as Response);
    const { result } = renderHook(() => useOverviewStats(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(new Error("Failed to fetch overview stats"));
  });

  it("handles empty todayAppointments", async () => {
    const emptyStats = { ...mockStats, todayAppointments: [], appointments: 0 };
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => emptyStats,
    } as Response);
    const { result } = renderHook(() => useOverviewStats(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data!.todayAppointments).toEqual([]);
    expect(result.current.data!.appointments).toBe(0);
  });

  it("handles zero counts in status breakdown", async () => {
    const zeroStats = {
      ...mockStats,
      statusBreakdown: [
        { status: "scheduled", count: 0 },
        { status: "in-progress", count: 0 },
        { status: "completed", count: 0 },
        { status: "cancelled", count: 0 },
      ],
    };
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => zeroStats,
    } as Response);
    const { result } = renderHook(() => useOverviewStats(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data!.statusBreakdown).toHaveLength(4);
  });
});
