import { useQuery } from "@tanstack/react-query";

export type OverviewStats = {
  agents: number;
  ailments: number;
  therapies: number;
  appointments: number;
  staff: number;
  todayAppointments: Array<{
    id: number;
    date: string;
    status: string;
    notes: string | null;
    agentName: string;
    therapyName: string;
    assignedStaffId: number | null;
  }>;
  statusBreakdown: Array<{
    status: string;
    count: number;
  }>;
};

async function fetchOverviewStats(): Promise<OverviewStats> {
  const res = await fetch("/api/stats/overview");
  if (!res.ok) throw new Error("Failed to fetch overview stats");
  return res.json();
}

export function useOverviewStats() {
  return useQuery<OverviewStats>({
    queryKey: ["stats", "overview"],
    queryFn: fetchOverviewStats,
  });
}
