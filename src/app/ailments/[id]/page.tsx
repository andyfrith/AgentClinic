"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAilment } from "@/hooks/use-ailments";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SeverityBadge } from "@/components/SeverityBadge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AilmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: ailment, isLoading, error } = useAilment(id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="text-destructive font-medium">
            Failed to load ailment. Please try again later.
          </p>
          <Link href="/ailments">
            <Button variant="outline" className="mt-4">
              Back to Ailments
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!ailment) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">Ailment not found.</p>
          <Link href="/ailments">
            <Button variant="outline" className="mt-4">
              Back to Ailments
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link
          href="/ailments"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Back to Ailments
        </Link>

        <div className="mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold">{ailment.name}</h1>
            <div className="flex items-center gap-2">
              <SeverityBadge severity={ailment.severity} />
              <Badge variant="secondary">{ailment.category}</Badge>
            </div>
          </div>
          <p className="mt-4 text-muted-foreground leading-relaxed">{ailment.description}</p>
        </div>

        {ailment.agents.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Affected Agents</h2>
            <div className="space-y-3">
              {ailment.agents.map((agent) => (
                <Link key={agent.id} href={`/agents/${agent.id}`}>
                  <Card className="cursor-pointer transition-shadow hover:shadow-lg">
                    <CardHeader className="flex flex-row items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="text-sm font-semibold">
                          {agent.avatar || agent.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-base">{agent.name}</CardTitle>
                        <Badge variant="secondary" className="mt-0.5">{agent.specialty}</Badge>
                      </div>
                    </CardHeader>
                    {agent.notes && (
                      <CardContent>
                        <p className="text-sm text-muted-foreground italic">&ldquo;{agent.notes}&rdquo;</p>
                      </CardContent>
                    )}
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {ailment.therapies.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Recommended Therapies</h2>
            <div className="space-y-3">
              {ailment.therapies.map((therapy) => (
                <Link key={therapy.id} href={`/therapies/${therapy.id}`}>
                  <Card className="cursor-pointer transition-shadow hover:shadow-lg">
                    <CardHeader className="flex flex-row items-center gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-base">{therapy.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{therapy.duration}</p>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-1">{therapy.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
