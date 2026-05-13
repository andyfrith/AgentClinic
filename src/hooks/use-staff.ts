import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Staff } from "@/db/schema";
import { authHeaders } from "@/lib/auth";

type StaffDetail = Staff & {
  appointments: Array<{
    id: number;
    date: string;
    status: string;
    agent: { id: number; name: string };
    ailment: { id: number; name: string };
    therapy: { id: number; name: string };
  }>;
};

type CreateStaffInput = {
  name: string;
  role: "admin" | "editor" | "viewer";
  avatar?: string;
  specialties?: string[];
};

type UpdateStaffInput = Partial<CreateStaffInput>;

async function fetchStaff(): Promise<Staff[]> {
  const res = await fetch("/api/staff");
  if (!res.ok) throw new Error("Failed to fetch staff");
  return res.json();
}

async function fetchStaffMember(id: string): Promise<StaffDetail> {
  const res = await fetch(`/api/staff/${id}`);
  if (!res.ok) throw new Error("Failed to fetch staff");
  return res.json();
}

async function createStaff(data: CreateStaffInput) {
  const res = await fetch("/api/staff", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to create staff");
  }
  return res.json();
}

async function updateStaff(id: number, data: UpdateStaffInput) {
  const res = await fetch(`/api/staff/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to update staff");
  }
  return res.json();
}

async function deleteStaff(id: number) {
  const res = await fetch(`/api/staff/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to delete staff");
  }
  return res.json();
}

export function useStaffList() {
  return useQuery<Staff[]>({
    queryKey: ["staff"],
    queryFn: fetchStaff,
  });
}

export function useStaffMember(id: string) {
  return useQuery<StaffDetail>({
    queryKey: ["staff", id],
    queryFn: () => fetchStaffMember(id),
  });
}

export function useCreateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success("Staff created");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to create staff");
    },
  });
}

export function useUpdateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number } & UpdateStaffInput) => updateStaff(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success("Staff updated");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to update staff");
    },
  });
}

export function useDeleteStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success("Staff deleted");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to delete staff");
    },
  });
}
