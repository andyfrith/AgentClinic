import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authHeaders } from "@/lib/auth";

type AgentInfo = {
  id: number;
  name: string;
  avatar: string;
  specialty: string;
  status: string;
};

type AilmentInfo = {
  id: number;
  name: string;
  severity: string;
  category: string;
  description?: string;
};

type TherapyInfo = {
  id: number;
  name: string;
  duration: string;
  description?: string;
  sideEffects?: string[];
};

export type Appointment = {
  id: number;
  date: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  agent: AgentInfo;
  ailment: AilmentInfo;
  therapy: TherapyInfo;
};

type CreateAppointmentInput = {
  agentId: number;
  ailmentId: number;
  therapyId: number;
  date: string;
  notes?: string;
};

type UpdateAppointmentInput = {
  status?: "scheduled" | "in-progress" | "completed" | "cancelled";
  notes?: string;
  date?: string;
};

async function fetchAppointments(): Promise<Appointment[]> {
  const res = await fetch("/api/appointments");
  if (!res.ok) throw new Error("Failed to fetch appointments");
  return res.json();
}

async function fetchAppointment(id: string): Promise<Appointment> {
  const res = await fetch(`/api/appointments/${id}`);
  if (!res.ok) throw new Error("Failed to fetch appointment");
  return res.json();
}

async function createAppointment(data: CreateAppointmentInput) {
  const res = await fetch("/api/appointments", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to create appointment");
  }
  return res.json();
}

async function updateAppointment(id: number, data: UpdateAppointmentInput) {
  const res = await fetch(`/api/appointments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to update appointment");
  }
  return res.json();
}

export function useAppointments() {
  return useQuery<Appointment[]>({
    queryKey: ["appointments"],
    queryFn: fetchAppointments,
  });
}

export function useAppointment(id: string) {
  return useQuery<Appointment>({
    queryKey: ["appointments", id],
    queryFn: () => fetchAppointment(id),
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Appointment created");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to create appointment");
    },
  });
}

async function assignStaff(appointmentId: number, staffId: number) {
  const res = await fetch(`/api/appointments/${appointmentId}/assign`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ staffId }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to assign staff");
  }
  return res.json();
}

export function useAssignStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ appointmentId, staffId }: { appointmentId: number; staffId: number }) =>
      assignStaff(appointmentId, staffId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number } & UpdateAppointmentInput) =>
      updateAppointment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}
