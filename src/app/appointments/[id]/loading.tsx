import { Skeleton } from "@/components/ui/skeleton";

export default function AppointmentDetailLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 space-y-4">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}
