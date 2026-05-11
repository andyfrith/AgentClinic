import { useQuery } from "@tanstack/react-query";
import type { Therapy } from "@/db/schema";

type TherapyDetail = Therapy & {
  ailments: Array<{
    id: number;
    name: string;
    description: string;
    severity: string;
    category: string;
  }>;
};

async function fetchTherapies(): Promise<Therapy[]> {
  const res = await fetch("/api/therapies");
  if (!res.ok) throw new Error("Failed to fetch therapies");
  return res.json();
}

async function fetchTherapy(id: string): Promise<TherapyDetail> {
  const res = await fetch(`/api/therapies/${id}`);
  if (!res.ok) throw new Error("Failed to fetch therapy");
  return res.json();
}

export function useTherapies() {
  return useQuery<Therapy[]>({
    queryKey: ["therapies"],
    queryFn: fetchTherapies,
  });
}

export function useTherapy(id: string) {
  return useQuery<TherapyDetail>({
    queryKey: ["therapies", id],
    queryFn: () => fetchTherapy(id),
  });
}
