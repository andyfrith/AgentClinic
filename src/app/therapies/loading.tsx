import { Skeleton } from "@/components/ui/skeleton";

export default function TherapiesLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-4">
      <Skeleton className="h-9 w-32 mb-8" />
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-32 w-full rounded-lg" />
      ))}
    </div>
  );
}
