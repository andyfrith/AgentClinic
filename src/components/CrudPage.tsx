"use client";

import { useState, type ReactNode } from "react";
import { useStaff } from "@/contexts/StaffContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AnimatedPage } from "@/components/AnimatedPage";

type CrudItem = { id: number };

export type CrudPageProps<T extends CrudItem> = {
  title: string;
  entityName: string;
  data: T[] | undefined;
  isLoading: boolean;
  error: Error | null;
  onSave: (data: Record<string, unknown> & { id?: number }) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  isSaving: boolean;
  isDeleting: boolean;
  renderItem: (item: T, canEdit: boolean) => ReactNode;
  renderForm: (
    form: Record<string, unknown>,
    onChange: (form: Record<string, unknown>) => void,
    editingId: number | null
  ) => ReactNode;
  emptyForm: Record<string, unknown>;
};

export function CrudPage<T extends CrudItem>({
  title,
  entityName,
  data,
  isLoading,
  error,
  onSave,
  onDelete,
  isSaving,
  isDeleting,
  renderItem,
  renderForm,
  emptyForm,
}: CrudPageProps<T>) {
  const { canEdit } = useStaff();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (item: T) => {
    setEditingId(item.id);
    setForm(item as unknown as Record<string, unknown>);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await onSave({ ...form, id: editingId });
      } else {
        await onSave(form);
      }
      setDialogOpen(false);
    } catch {
      // Toast is handled by onError in the mutation hook
    }
  };

  const handleDelete = async (id: number) => {
    await onDelete(id);
    setConfirmDelete(null);
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-muted rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <AnimatedPage className="mx-auto max-w-3xl px-4 py-8">
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
          Failed to load {entityName}
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        {canEdit && <Button onClick={openCreate}>Add {entityName.slice(0, -1)}</Button>}
      </div>

      {(!data || data.length === 0) && (
        <div className="p-8 rounded-lg border-2 border-dashed text-center text-muted-foreground">
          No {entityName} found
        </div>
      )}

      <div className="space-y-3">
        {data?.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex-1 min-w-0">{renderItem(item, canEdit)}</div>
            {canEdit && (
              <div className="flex gap-2 shrink-0 ml-3">
                <Button variant="outline" size="sm" onClick={() => openEdit(item)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => setConfirmDelete(item.id)}>
                  Delete
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen && !confirmDelete} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? `Edit ${entityName.slice(0, -1)}` : `Add ${entityName.slice(0, -1)}`}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {renderForm(form, setForm, editingId)}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
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
            Are you sure you want to delete this {entityName.slice(0, -1)}? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => confirmDelete && handleDelete(confirmDelete)}
              disabled={isDeleting}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AnimatedPage>
  );
}
