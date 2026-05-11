import { useQuery } from "@tanstack/react-query";
import type { Agent } from "@/db/schema";

type AgentDetail = Agent & {
  ailments: Array<{
    id: number;
    name: string;
    severity: string;
    category: string;
    diagnosedAt: string | null;
    notes: string | null;
  }>;
};

async function fetchAgents(): Promise<Agent[]> {
  const res = await fetch("/api/agents");
  if (!res.ok) throw new Error("Failed to fetch agents");
  return res.json();
}

async function fetchAgent(id: string): Promise<AgentDetail> {
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
  return useQuery<AgentDetail>({
    queryKey: ["agents", id],
    queryFn: () => fetchAgent(id),
  });
}
