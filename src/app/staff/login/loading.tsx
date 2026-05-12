import { Skeleton } from "@/components/ui/skeleton";

export default function StaffLoginLoading() {
  return (
    <div className="mx-auto max-w-md mt-20 px-4 space-y-4">
      <div className="text-center mb-8">
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-4 w-64 mx-auto mt-2" />
      </div>
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-16 rounded-lg" />
      ))}
    </div>
  );
}
