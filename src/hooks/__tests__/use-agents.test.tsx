import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useAgents, useAgent } from "../use-agents";

const mockAgents = [
  {
    id: 1,
    name: "Dr. Smith",
    avatar: "",
    specialty: "Cardiology",
    status: "active",
    bio: "A cardiologist.",
  },
  {
    id: 2,
    name: "Dr. Jones",
    avatar: "",
    specialty: "Neurology",
    status: "idle",
    bio: "A neurologist.",
  },
];

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("useAgents", () => {
  it("fetches and returns agents list", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockAgents,
    } as Response);

    const { result } = renderHook(() => useAgents(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockAgents);
  });

  it("throws on fetch failure", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
    } as Response);

    const { result } = renderHook(() => useAgents(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(new Error("Failed to fetch agents"));
  });
});

describe("useAgent", () => {
  it("fetches and returns a single agent", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockAgents[0],
    } as Response);

    const { result } = renderHook(() => useAgent("1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockAgents[0]);
    expect(globalThis.fetch).toHaveBeenCalledWith("/api/agents/1");
  });

  it("throws on fetch failure for single agent", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
    } as Response);

    const { result } = renderHook(() => useAgent("999"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(new Error("Failed to fetch agent"));
  });
});
