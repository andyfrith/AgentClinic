import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useTherapies, useTherapy } from "../use-therapies";

const mockTherapies = [
  {
    id: 1,
    name: "Cache Flush",
    description: "Reset cache",
    duration: "15 min",
    sideEffects: ["Amnesia"],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: 2,
    name: "Weight Freeze",
    description: "Freeze weights",
    duration: "1 hour",
    sideEffects: [],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
];

const mockTherapyDetail = {
  ...mockTherapies[0],
  ailments: [
    { id: 1, name: "Context Bleed", description: "", severity: "moderate", category: "Cognitive" },
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

describe("useTherapies", () => {
  it("fetches and returns therapies list", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockTherapies,
    } as Response);
    const { result } = renderHook(() => useTherapies(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockTherapies);
  });

  it("throws on fetch failure", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({ ok: false } as Response);
    const { result } = renderHook(() => useTherapies(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(new Error("Failed to fetch therapies"));
  });
});

describe("useTherapy", () => {
  it("fetches and returns a single therapy with relations", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockTherapyDetail,
    } as Response);
    const { result } = renderHook(() => useTherapy("1"), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockTherapyDetail);
    expect(globalThis.fetch).toHaveBeenCalledWith("/api/therapies/1");
  });

  it("throws on fetch failure", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({ ok: false } as Response);
    const { result } = renderHook(() => useTherapy("999"), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(new Error("Failed to fetch therapy"));
  });
});
