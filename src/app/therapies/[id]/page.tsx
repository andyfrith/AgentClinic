"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useTherapy } from "@/hooks/use-therapies";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SeverityBadge } from "@/components/SeverityBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedPage } from "@/components/AnimatedPage";

export default function TherapyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: therapy, isLoading, error } = useTherapy(id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="text-destructive font-medium">
            Failed to load therapy. Please try again later.
          </p>
          <Link href="/therapies">
            <Button variant="outline" className="mt-4">
              Back to Therapies
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!therapy) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">Therapy not found.</p>
          <Link href="/therapies">
            <Button variant="outline" className="mt-4">
              Back to Therapies
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <AnimatedPage className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/therapies"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        &larr; Back to Therapies
      </Link>

      <div className="mt-6">
        <h1 className="text-2xl sm:text-3xl font-bold">{therapy.name}</h1>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm text-muted-foreground">Duration:</span>
          <span className="text-sm font-medium">{therapy.duration}</span>
        </div>
        <p className="mt-4 text-muted-foreground leading-relaxed">{therapy.description}</p>
      </div>

      {therapy.sideEffects.length > 0 && (
        <div className="mt-8 rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-3">Side Effects</h2>
          <ul className="space-y-2">
            {therapy.sideEffects.map((effect, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
                {effect}
              </li>
            ))}
          </ul>
        </div>
      )}

      {therapy.ailments.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Treats Ailments</h2>
          <div className="space-y-3">
            {therapy.ailments.map((ailment) => (
              <Link key={ailment.id} href={`/ailments/${ailment.id}`}>
                <Card className="cursor-pointer transition-shadow hover:shadow-lg">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-base">{ailment.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <SeverityBadge severity={ailment.severity} />
                        <Badge variant="secondary">{ailment.category}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {ailment.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </AnimatedPage>
  );
}
