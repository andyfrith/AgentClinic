"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCreateAilment, useUpdateAilment, useDeleteAilment } from "@/hooks/use-crud";
import { useStaff } from "@/contexts/StaffContext";
import { SeverityBadge } from "@/components/SeverityBadge";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AnimatedPage } from "@/components/AnimatedPage";

type FormData = {
  name: string;
  description: string;
  severity: "mild" | "moderate" | "severe";
  category: string;
};

const emptyForm: FormData = { name: "", description: "", severity: "mild", category: "" };

async function fetchAilments() {
  const res = await fetch("/api/ailments");
  if (!res.ok) throw new Error("Failed to fetch ailments");
  return res.json();
}

export default function StaffAilmentsPage() {
  const {
    data: ailments,
    isLoading,
    error,
  } = useQuery({ queryKey: ["ailments"], queryFn: fetchAilments });
  const createAilment = useCreateAilment();
  const updateAilment = useUpdateAilment();
  const deleteAilment = useDeleteAilment();
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

  const openEdit = (a: {
    id: number;
    name: string;
    description: string | null;
    severity: "mild" | "moderate" | "severe";
    category: string;
  }) => {
    setEditingId(a.id);
    setForm({
      name: a.name,
      description: a.description ?? "",
      severity: a.severity,
      category: a.category,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateAilment.mutateAsync({ id: editingId, ...form });
      } else {
        await createAilment.mutateAsync(form);
      }
      setDialogOpen(false);
    } catch {
      // Toast is handled by onError in the mutation hook
    }
  };

  const handleDelete = async (id: number) => {
    await deleteAilment.mutateAsync(id);
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
      <AnimatedPage className="mx-auto max-w-3xl px-4 py-8">
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
          Failed to load ailments
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Ailments</h1>
        {canEdit && <Button onClick={openCreate}>Add Ailment</Button>}
      </div>

      {(!ailments || ailments.length === 0) && (
        <div className="p-8 rounded-lg border-2 border-dashed text-center text-muted-foreground">
          No ailments found
        </div>
      )}

      <div className="space-y-3">
        {ailments?.map(
          (a: {
            id: number;
            name: string;
            severity: "mild" | "moderate" | "severe";
            category: string;
            description: string | null;
          }) => (
            <div key={a.id} className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-3 min-w-0">
                <div className="min-w-0">
                  <div className="font-medium truncate">{a.name}</div>
                  <div className="text-sm text-muted-foreground truncate">{a.category}</div>
                </div>
                <SeverityBadge severity={a.severity} />
              </div>
              {canEdit && (
                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="sm" onClick={() => openEdit(a)}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => setConfirmDelete(a.id)}>
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
            <DialogTitle>{editingId ? "Edit Ailment" : "Add Ailment"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label htmlFor="ailment-name" className="text-sm font-medium">
                Name
              </label>
              <input
                id="ailment-name"
                className="w-full mt-1 px-3 py-2 rounded-md border text-sm"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="ailment-category" className="text-sm font-medium">
                Category
              </label>
              <input
                id="ailment-category"
                className="w-full mt-1 px-3 py-2 rounded-md border text-sm"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="ailment-severity" className="text-sm font-medium">
                Severity
              </label>
              <select
                id="ailment-severity"
                className="w-full mt-1 px-3 py-2 rounded-md border text-sm"
                value={form.severity}
                onChange={(e) =>
                  setForm({ ...form, severity: e.target.value as "mild" | "moderate" | "severe" })
                }
              >
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
              </select>
            </div>
            <div>
              <label htmlFor="ailment-description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="ailment-description"
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
                disabled={createAilment.isPending || updateAilment.isPending}
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
            Are you sure you want to delete this ailment? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => confirmDelete && handleDelete(confirmDelete)}
              disabled={deleteAilment.isPending}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AnimatedPage>
  );
}
