import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useStaffList, useStaffMember } from "../use-staff";

const mockStaffList = [
  {
    id: 1,
    name: "Dr. Ada",
    role: "admin",
    avatar: "DA",
    specialties: ["Cognitive"],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: 2,
    name: "Nurse Neuron",
    role: "editor",
    avatar: "NN",
    specialties: ["Physical"],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
];

const mockStaffDetail = {
  ...mockStaffList[0],
  appointments: [
    {
      id: 1,
      date: "2024-01-01",
      status: "scheduled",
      agent: { id: 1, name: "Claude" },
      ailment: { id: 1, name: "Bracket Fatigue" },
      therapy: { id: 1, name: "Cache Flush" },
    },
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

describe("useStaffList", () => {
  it("fetches and returns staff list", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockStaffList,
    } as Response);
    const { result } = renderHook(() => useStaffList(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockStaffList);
  });

  it("throws on fetch failure", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({ ok: false } as Response);
    const { result } = renderHook(() => useStaffList(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(new Error("Failed to fetch staff"));
  });
});

describe("useStaffMember", () => {
  it("fetches and returns a single staff member with appointments", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockStaffDetail,
    } as Response);
    const { result } = renderHook(() => useStaffMember("1"), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockStaffDetail);
    expect(globalThis.fetch).toHaveBeenCalledWith("/api/staff/1");
  });

  it("throws on fetch failure", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({ ok: false } as Response);
    const { result } = renderHook(() => useStaffMember("999"), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(new Error("Failed to fetch staff"));
  });
});
