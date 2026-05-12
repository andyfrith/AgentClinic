"use client";

import { useAgents } from "@/hooks/use-agents";
import { AgentCard } from "@/components/AgentCard";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatedPage } from "@/components/AnimatedPage";
import { StaggerList } from "@/components/StaggerList";

export default function AgentsPage() {
  const { data: agents, isLoading, error } = useAgents();

  return (
    <AnimatedPage className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Agents</h1>

      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="text-destructive font-medium">
            Failed to load agents. Please try again later.
          </p>
        </div>
      )}

      {agents && agents.length === 0 && (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">No agents found.</p>
        </div>
      )}

      {agents && agents.length > 0 && (
        <StaggerList className="space-y-4">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </StaggerList>
      )}
    </AnimatedPage>
  );
}
