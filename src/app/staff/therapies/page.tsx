"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useCreateTherapy, useUpdateTherapy, useDeleteTherapy } from "@/hooks/use-crud";
import { useStaff } from "@/contexts/StaffContext";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type FormData = {
  name: string;
  description: string;
  duration: string;
  sideEffects: string;
};

const emptyForm: FormData = { name: "", description: "", duration: "", sideEffects: "" };

async function fetchTherapies() {
  const res = await fetch("/api/therapies");
  if (!res.ok) throw new Error("Failed to fetch therapies");
  return res.json();
}

export default function StaffTherapiesPage() {
  const {
    data: therapies,
    isLoading,
    error,
  } = useQuery({ queryKey: ["therapies"], queryFn: fetchTherapies });
  const createTherapy = useCreateTherapy();
  const updateTherapy = useUpdateTherapy();
  const deleteTherapy = useDeleteTherapy();
  const { canEdit } = useStaff();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (t: {
    id: number;
    name: string;
    description: string | null;
    duration: string;
    sideEffects: string[] | null;
  }) => {
    setEditingId(t.id);
    setForm({
      name: t.name,
      description: t.description ?? "",
      duration: t.duration,
      sideEffects: (t.sideEffects ?? []).join(", "),
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const data = {
        ...form,
        sideEffects: form.sideEffects
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      if (editingId) {
        await updateTherapy.mutateAsync({ id: editingId, ...data });
      } else {
        await createTherapy.mutateAsync(data);
      }
      setDialogOpen(false);
    } catch {
      // Toast is handled by onError in the mutation hook
    }
  };

  const handleDelete = async (id: number) => {
    await deleteTherapy.mutateAsync(id);
    setConfirmDelete(null);
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-muted rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
          Failed to load therapies
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Manage Therapies</h1>
          {canEdit && <Button onClick={openCreate}>Add Therapy</Button>}
        </div>

        {(!therapies || therapies.length === 0) && (
          <div className="p-8 rounded-lg border-2 border-dashed text-center text-muted-foreground">
            No therapies found
          </div>
        )}

        <div className="space-y-3">
          {therapies?.map(
            (t: {
              id: number;
              name: string;
              duration: string;
              description: string | null;
              sideEffects: string[] | null;
            }) => (
              <div key={t.id} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="min-w-0">
                  <div className="font-medium truncate">{t.name}</div>
                  <div className="text-sm text-muted-foreground">{t.duration}</div>
                </div>
                {canEdit && (
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => openEdit(t)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => setConfirmDelete(t.id)}>
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            )
          )}
        </div>

        <Dialog open={dialogOpen && !confirmDelete} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Therapy" : "Add Therapy"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label htmlFor="therapy-name" className="text-sm font-medium">
                  Name
                </label>
                <input
                  id="therapy-name"
                  className="w-full mt-1 px-3 py-2 rounded-md border text-sm"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="therapy-duration" className="text-sm font-medium">
                  Duration
                </label>
                <input
                  id="therapy-duration"
                  className="w-full mt-1 px-3 py-2 rounded-md border text-sm"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="therapy-side-effects" className="text-sm font-medium">
                  Side Effects
                </label>
                <input
                  id="therapy-side-effects"
                  className="w-full mt-1 px-3 py-2 rounded-md border text-sm"
                  value={form.sideEffects}
                  onChange={(e) => setForm({ ...form, sideEffects: e.target.value })}
                  placeholder="Comma-separated list"
                />
              </div>
              <div>
                <label htmlFor="therapy-description" className="text-sm font-medium">
                  Description
                </label>
                <textarea
                  id="therapy-description"
                  className="w-full mt-1 px-3 py-2 rounded-md border text-sm min-h-[80px]"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={createTherapy.isPending || updateTherapy.isPending}
                >
                  {editingId ? "Save Changes" : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this therapy? This action cannot be removed.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setConfirmDelete(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => confirmDelete && handleDelete(confirmDelete)}
                disabled={deleteTherapy.isPending}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}
