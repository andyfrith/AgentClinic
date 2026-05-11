import { useQuery } from "@tanstack/react-query";
import type { Ailment } from "@/db/schema";

type AilmentDetail = Ailment & {
  agents: Array<{
    id: number;
    name: string;
    avatar: string;
    specialty: string;
    status: string;
    bio: string;
    diagnosedAt: string | null;
    notes: string | null;
  }>;
  therapies: Array<{
    id: number;
    name: string;
    description: string;
    duration: string;
    sideEffects: string[];
  }>;
};

async function fetchAilments(): Promise<Ailment[]> {
  const res = await fetch("/api/ailments");
  if (!res.ok) throw new Error("Failed to fetch ailments");
  return res.json();
}

async function fetchAilment(id: string): Promise<AilmentDetail> {
  const res = await fetch(`/api/ailments/${id}`);
  if (!res.ok) throw new Error("Failed to fetch ailment");
  return res.json();
}

export function useAilments() {
  return useQuery<Ailment[]>({
    queryKey: ["ailments"],
    queryFn: fetchAilments,
  });
}

export function useAilment(id: string) {
  return useQuery<AilmentDetail>({
    queryKey: ["ailments", id],
    queryFn: () => fetchAilment(id),
  });
}
