"use client";

import { useRouter } from "next/navigation";
import { useStaffList } from "@/hooks/use-staff";
import { useStaff } from "@/contexts/StaffContext";

export default function StaffLoginPage() {
  const router = useRouter();
  const { data: staffList, isLoading } = useStaffList();
  const { setStaff } = useStaff();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-md mt-20 px-4">
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md mt-20 px-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Welcome to AgentClinic</h1>
        <p className="text-muted-foreground mt-2">Select your staff profile to continue</p>
      </div>
      <div className="space-y-3">
        {staffList?.map((member) => (
          <button
            key={member.id}
            onClick={() => {
              setStaff(member);
              router.push("/staff");
            }}
            className="w-full flex items-center gap-4 p-4 rounded-lg border hover:border-primary hover:bg-accent transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
              {member.avatar || member.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium">{member.name}</div>
              <div className="text-xs text-muted-foreground capitalize">{member.role}</div>
            </div>
            {member.specialties.length > 0 && (
              <div className="hidden sm:flex gap-1">
                {member.specialties.slice(0, 2).map((s) => (
                  <span
                    key={s}
                    className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
