import { cn } from "@/lib/utils";

const severityStyles: Record<string, string> = {
  mild: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  moderate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  severe: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export function SeverityBadge({ severity }: { severity: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        severityStyles[severity] ?? "bg-gray-100 text-gray-800"
      )}
    >
      {severity}
    </span>
  );
}
