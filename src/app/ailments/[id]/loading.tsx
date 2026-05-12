import { Skeleton } from "@/components/ui/skeleton";

export default function AilmentDetailLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}
