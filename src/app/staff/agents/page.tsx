"use client";

import { useAgents } from "@/hooks/use-agents";
import { useCreateAgent, useUpdateAgent, useDeleteAgent } from "@/hooks/use-crud";
import { Badge } from "@/components/ui/badge";
import { CrudPage } from "@/components/CrudPage";

type AgentItem = {
  id: number;
  name: string;
  avatar: string | null;
  specialty: string;
  status: string | null;
  bio: string | null;
};

type AgentFormData = {
  name: string;
  avatar: string;
  specialty: string;
  status: string;
  bio: string;
};

const emptyForm: AgentFormData = { name: "", avatar: "", specialty: "", status: "active", bio: "" };

export default function StaffAgentsPage() {
  const { data: agents, isLoading, error } = useAgents();
  const createAgent = useCreateAgent();
  const updateAgent = useUpdateAgent();
  const deleteAgent = useDeleteAgent();

  return (
    <CrudPage
      title="Manage Agents"
      entityName="agents"
      data={agents}
      isLoading={isLoading}
      error={error}
      onSave={async (data) => {
        if (data.id) {
          await updateAgent.mutateAsync({ id: data.id, ...data } as AgentFormData & { id: number });
        } else {
          await createAgent.mutateAsync(data as AgentFormData);
        }
      }}
      onDelete={async (id) => {
        await deleteAgent.mutateAsync(id);
      }}
      isSaving={createAgent.isPending || updateAgent.isPending}
      isDeleting={deleteAgent.isPending}
      emptyForm={emptyForm}
      inputIdPrefix="agent"
      renderItem={(agent) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
            {(agent as AgentItem).avatar || (agent as AgentItem).name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="font-medium truncate">{(agent as AgentItem).name}</div>
            <div className="text-sm text-muted-foreground truncate">{(agent as AgentItem).specialty}</div>
          </div>
          <Badge variant="outline" className="hidden sm:inline-flex">
            {(agent as AgentItem).status}
          </Badge>
        </div>
      )}
      renderForm={(form, onChange, editingId) => {
        const f = form as AgentFormData;
        return (
          <>
            <div>
              <label htmlFor="agent-name" className="text-sm font-medium">Name</label>
              <input id="agent-name" className="w-full mt-1 px-3 py-2 rounded-md border text-sm" value={f.name} onChange={(e) => onChange({ ...f, name: e.target.value })} />
            </div>
            <div>
              <label htmlFor="agent-avatar" className="text-sm font-medium">Avatar (initials)</label>
              <input id="agent-avatar" className="w-full mt-1 px-3 py-2 rounded-md border text-sm" value={f.avatar} onChange={(e) => onChange({ ...f, avatar: e.target.value })} />
            </div>
            <div>
              <label htmlFor="agent-specialty" className="text-sm font-medium">Specialty</label>
              <input id="agent-specialty" className="w-full mt-1 px-3 py-2 rounded-md border text-sm" value={f.specialty} onChange={(e) => onChange({ ...f, specialty: e.target.value })} />
            </div>
            <div>
              <label htmlFor="agent-status" className="text-sm font-medium">Status</label>
              <select id="agent-status" className="w-full mt-1 px-3 py-2 rounded-md border text-sm" value={f.status} onChange={(e) => onChange({ ...f, status: e.target.value })}>
                <option value="active">Active</option>
                <option value="idle">Idle</option>
                <option value="busy">Busy</option>
                <option value="offline">Offline</option>
              </select>
            </div>
            <div>
              <label htmlFor="agent-bio" className="text-sm font-medium">Bio</label>
              <textarea id="agent-bio" className="w-full mt-1 px-3 py-2 rounded-md border text-sm min-h-[80px]" value={f.bio} onChange={(e) => onChange({ ...f, bio: e.target.value })} />
            </div>
          </>
        );
      }}
    />
  );
}
