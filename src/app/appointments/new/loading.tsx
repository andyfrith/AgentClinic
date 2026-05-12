import { Skeleton } from "@/components/ui/skeleton";

export default function NewAppointmentLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-48" />
      </div>
      <Skeleton className="h-[500px] w-full rounded-lg" />
    </div>
  );
}
