import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useAilments, useAilment } from "../use-ailments";

const mockAilments = [
  { id: 1, name: "Context Bleed", description: "Test", severity: "moderate", category: "Cognitive", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 2, name: "Bracket Fatigue", description: "Test", severity: "mild", category: "Physical", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
];

const mockAilmentDetail = {
  ...mockAilments[0],
  agents: [{ id: 1, name: "Claude", avatar: "CL", specialty: "Code Analysis", status: "active", bio: "", diagnosedAt: "2024-01-01", notes: "Acute case" }],
  therapies: [{ id: 1, name: "Cache Flush", description: "", duration: "15 min", sideEffects: [] }],
};

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

beforeEach(() => { vi.restoreAllMocks(); });

describe("useAilments", () => {
  it("fetches and returns ailments list", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({ ok: true, json: async () => mockAilments } as Response);
    const { result } = renderHook(() => useAilments(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockAilments);
  });

  it("throws on fetch failure", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({ ok: false } as Response);
    const { result } = renderHook(() => useAilments(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(new Error("Failed to fetch ailments"));
  });
});

describe("useAilment", () => {
  it("fetches and returns a single ailment with relations", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({ ok: true, json: async () => mockAilmentDetail } as Response);
    const { result } = renderHook(() => useAilment("1"), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockAilmentDetail);
    expect(globalThis.fetch).toHaveBeenCalledWith("/api/ailments/1");
  });

  it("throws on fetch failure", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({ ok: false } as Response);
    const { result } = renderHook(() => useAilment("999"), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(new Error("Failed to fetch ailment"));
  });
});
