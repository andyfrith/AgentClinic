import { useMutation, useQueryClient } from "@tanstack/react-query";

type EntityType = "agents" | "ailments" | "therapies";

function createEntity(type: EntityType) {
  return async (data: Record<string, unknown>) => {
    const res = await fetch(`/api/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
      headers: { "Content-Type": "application/json" },
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
    const res = await fetch(`/api/${type}/${id}`, { method: "DELETE" });
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
    },
  });
}

export function useUpdateAgent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEntity("agents"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
    },
  });
}

export function useDeleteAgent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEntity("agents"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
    },
  });
}

export function useCreateAilment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEntity("ailments"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ailments"] });
    },
  });
}

export function useUpdateAilment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEntity("ailments"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ailments"] });
    },
  });
}

export function useDeleteAilment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEntity("ailments"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ailments"] });
    },
  });
}

export function useCreateTherapy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEntity("therapies"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["therapies"] });
    },
  });
}

export function useUpdateTherapy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEntity("therapies"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["therapies"] });
    },
  });
}

export function useDeleteTherapy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEntity("therapies"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["therapies"] });
    },
  });
}
