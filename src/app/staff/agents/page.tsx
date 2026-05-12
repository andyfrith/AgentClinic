"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAgents } from "@/hooks/use-agents";
import { useCreateAgent, useUpdateAgent, useDeleteAgent } from "@/hooks/use-crud";
import { useStaff } from "@/contexts/StaffContext";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type FormData = {
  name: string;
  avatar: string;
  specialty: string;
  status: string;
  bio: string;
};

const emptyForm: FormData = { name: "", avatar: "", specialty: "", status: "active", bio: "" };

export default function StaffAgentsPage() {
  const { data: agents, isLoading, error } = useAgents();
  const createAgent = useCreateAgent();
  const updateAgent = useUpdateAgent();
  const deleteAgent = useDeleteAgent();
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

  const openEdit = (agent: {
    id: number;
    name: string;
    avatar: string | null;
    specialty: string;
    status: string | null;
    bio: string | null;
  }) => {
    setEditingId(agent.id);
    setForm({
      name: agent.name,
      avatar: agent.avatar ?? "",
      specialty: agent.specialty,
      status: agent.status ?? "active",
      bio: agent.bio ?? "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateAgent.mutateAsync({ id: editingId, ...form });
      } else {
        await createAgent.mutateAsync(form);
      }
      setDialogOpen(false);
    } catch {
      // Toast is handled by onError in the mutation hook
    }
  };

  const handleDelete = async (id: number) => {
    await deleteAgent.mutateAsync(id);
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
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
          Failed to load agents
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Manage Agents</h1>
          {canEdit && <Button onClick={openCreate}>Add Agent</Button>}
        </div>

        {(!agents || agents.length === 0) && (
          <div className="p-8 rounded-lg border-2 border-dashed text-center text-muted-foreground">
            No agents found
          </div>
        )}

        <div className="space-y-3">
          {agents?.map((agent) => (
            <div key={agent.id} className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                  {agent.avatar || agent.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="font-medium truncate">{agent.name}</div>
                  <div className="text-sm text-muted-foreground truncate">{agent.specialty}</div>
                </div>
                <Badge variant="outline" className="hidden sm:inline-flex">
                  {agent.status}
                </Badge>
              </div>
              {canEdit && (
                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="sm" onClick={() => openEdit(agent)}>
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setConfirmDelete(agent.id)}
                  >
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
              <DialogTitle>{editingId ? "Edit Agent" : "Add Agent"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label htmlFor="agent-name" className="text-sm font-medium">
                  Name
                </label>
                <input
                  id="agent-name"
                  className="w-full mt-1 px-3 py-2 rounded-md border text-sm"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="agent-avatar" className="text-sm font-medium">
                  Avatar (initials)
                </label>
                <input
                  id="agent-avatar"
                  className="w-full mt-1 px-3 py-2 rounded-md border text-sm"
                  value={form.avatar}
                  onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="agent-specialty" className="text-sm font-medium">
                  Specialty
                </label>
                <input
                  id="agent-specialty"
                  className="w-full mt-1 px-3 py-2 rounded-md border text-sm"
                  value={form.specialty}
                  onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="agent-status" className="text-sm font-medium">
                  Status
                </label>
                <select
                  id="agent-status"
                  className="w-full mt-1 px-3 py-2 rounded-md border text-sm"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="idle">Idle</option>
                  <option value="busy">Busy</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
              <div>
                <label htmlFor="agent-bio" className="text-sm font-medium">
                  Bio
                </label>
                <textarea
                  id="agent-bio"
                  className="w-full mt-1 px-3 py-2 rounded-md border text-sm min-h-[80px]"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={createAgent.isPending || updateAgent.isPending}
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
              Are you sure you want to delete this agent? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setConfirmDelete(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => confirmDelete && handleDelete(confirmDelete)}
                disabled={deleteAgent.isPending}
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
