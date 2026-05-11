"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAgent } from "@/hooks/use-agents";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusIndicator } from "@/components/StatusIndicator";

export default function AgentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: agent, isLoading, error } = useAgent(id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
        <Skeleton className="h-8 w-24" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="text-destructive font-medium">
            Failed to load agent. Please try again later.
          </p>
          <Link href="/agents">
            <Button variant="outline" className="mt-4">
              Back to Agents
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">Agent not found.</p>
          <Link href="/agents">
            <Button variant="outline" className="mt-4">
              Back to Agents
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link
          href="/agents"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Back to Agents
        </Link>

        <div className="mt-6 flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-4 sm:gap-6">
          <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
            <AvatarFallback className="text-2xl font-semibold">
              {agent.avatar || agent.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold">{agent.name}</h1>
              <StatusIndicator status={agent.status} />
            </div>
            <Badge variant="secondary" className="mt-1">
              {agent.specialty}
            </Badge>
          </div>
        </div>

        <div className="mt-8 rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-2">Bio</h2>
          <p className="text-muted-foreground leading-relaxed">{agent.bio}</p>
        </div>

        {agent.ailments.length > 0 && (
          <div className="mt-8 rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-3">Diagnoses</h2>
            <div className="flex flex-wrap gap-2">
              {agent.ailments.map((a) => (
                <Link key={a.id} href={`/ailments/${a.id}`}>
                  <Badge
                    variant="secondary"
                    className="hover:bg-secondary/80 transition-colors cursor-pointer"
                  >
                    {a.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <span>Status:</span>
          <span className="capitalize font-medium text-foreground">{agent.status}</span>
        </div>
      </motion.div>
    </div>
  );
}
