import { useQuery } from "@tanstack/react-query";
import type { Agent } from "@/db/schema";

async function fetchAgents(): Promise<Agent[]> {
  const res = await fetch("/api/agents");
  if (!res.ok) throw new Error("Failed to fetch agents");
  return res.json();
}

async function fetchAgent(id: string): Promise<Agent> {
  const res = await fetch(`/api/agents/${id}`);
  if (!res.ok) throw new Error("Failed to fetch agent");
  return res.json();
}

export function useAgents() {
  return useQuery<Agent[]>({
    queryKey: ["agents"],
    queryFn: fetchAgents,
  });
}

export function useAgent(id: string) {
  return useQuery<Agent>({
    queryKey: ["agents", id],
    queryFn: () => fetchAgent(id),
  });
}
