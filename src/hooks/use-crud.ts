import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type EntityType = "agents" | "ailments" | "therapies";

function getStaffId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("staff");
    if (stored) {
      const parsed = JSON.parse(stored);
      return String(parsed.id);
    }
  } catch {}
  return null;
}

function authHeaders(): Record<string, string> {
  const id = getStaffId();
  return id ? { "x-staff-id": id } : {};
}

function createEntity(type: EntityType) {
  return async (data: Record<string, unknown>) => {
    const res = await fetch(`/api/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || `Failed to create ${type}`);
    }
    return res.json();
  };
}

function updateEntity(type: EntityType) {
  return async ({ id, ...data }: { id: number } & Record<string, unknown>) => {
    const res = await fetch(`/api/${type}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || `Failed to update ${type}`);
    }
    return res.json();
  };
}

function deleteEntity(type: EntityType) {
  return async (id: number) => {
    const res = await fetch(`/api/${type}/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || `Failed to delete ${type}`);
    }
    return res.json();
  };
}

export function useCreateAgent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEntity("agents"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      toast.success("Agent created");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to create agent");
    },
  });
}

export function useUpdateAgent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEntity("agents"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      toast.success("Agent updated");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to update agent");
    },
  });
}

export function useDeleteAgent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEntity("agents"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      toast.success("Agent deleted");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to delete agent");
    },
  });
}

export function useCreateAilment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEntity("ailments"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ailments"] });
      toast.success("Ailment created");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to create ailment");
    },
  });
}

export function useUpdateAilment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEntity("ailments"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ailments"] });
      toast.success("Ailment updated");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to update ailment");
    },
  });
}

export function useDeleteAilment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEntity("ailments"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ailments"] });
      toast.success("Ailment deleted");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to delete ailment");
    },
  });
}

export function useCreateTherapy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEntity("therapies"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["therapies"] });
      toast.success("Therapy created");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to create therapy");
    },
  });
}

export function useUpdateTherapy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEntity("therapies"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["therapies"] });
      toast.success("Therapy updated");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to update therapy");
    },
  });
}

export function useDeleteTherapy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEntity("therapies"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["therapies"] });
      toast.success("Therapy deleted");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to delete therapy");
    },
  });
}
