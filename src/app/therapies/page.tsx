"use client";

import { useTherapies } from "@/hooks/use-therapies";
import { TherapyCard } from "@/components/TherapyCard";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatedPage } from "@/components/AnimatedPage";
import { StaggerList } from "@/components/StaggerList";

export default function TherapiesPage() {
  const { data: therapies, isLoading, error } = useTherapies();

  return (
    <AnimatedPage className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Therapies</h1>

      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="text-destructive font-medium">
            Failed to load therapies. Please try again later.
          </p>
        </div>
      )}

      {therapies && therapies.length === 0 && (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">No therapies found.</p>
        </div>
      )}

      {therapies && therapies.length > 0 && (
        <StaggerList className="space-y-4">
          {therapies.map((therapy) => (
            <TherapyCard key={therapy.id} therapy={therapy} />
          ))}
        </StaggerList>
      )}
    </AnimatedPage>
  );
}
